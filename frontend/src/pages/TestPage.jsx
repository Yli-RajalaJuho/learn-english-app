import NavigationBar from "./NavigationBar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * React component for conducting a language test based on selected words and language.
 *
 * @component
 * @returns {JSX.Element} JSX element representing the TestPageComponent.
 */
const TestPageComponent = () => {
  const navigate = useNavigate();
  const { wordsNum, lang, tags } = useParams();

  // State variables
  const [words, setWords] = useState([]);
  const [randomWords, setRandomWords] = useState([]);
  const [userInputs, setUserInputs] = useState(
    Array.from({ length: wordsNum }, () => "")
  );

  /**
   * Handles the submission of user answers, calculates correctness,
   * and navigates to the results page with the users submissions.
   *
   * @returns {void}
   */
  const handleButtonClick = () => {
    const userResponses = userInputs.map((input, index) => {
      const correctAnswer =
        lang === "fin"
          ? randomWords[index].english_word
          : randomWords[index].finnish_word;
      const question =
        lang === "fin"
          ? randomWords[index].finnish_word
          : randomWords[index].english_word;
      return {
        question: question,
        correctAnswer: correctAnswer,
        userAnswer: input,
        isCorrect:
          input.trim().toLowerCase() === correctAnswer.trim().toLowerCase(),
      };
    });

    // Navigate to the next page with the results
    navigate(`/results-page`, { state: { userResponses } });
  };

  /**
   * Handles transitioning to a different page.
   *
   * @param {string} path - The path to navigate to.
   * @returns {void}
   */
  const handleTransition = (path) => {
    navigate(path);
  };

  /**
   * Handles updating user input on input change.
   *
   * @param {number} index - The index of the input field.
   * @param {React.ChangeEvent<HTMLInputElement>} event - The input change event.
   * @returns {void}
   */
  const handleInputChange = (index, event) => {
    const { value } = event.target;
    setUserInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index] = value;
      return newInputs;
    });
  };

  /**
   * Fetches words based on selected tags from the server.
   *
   * @returns {void}
   */
  const fetchWords = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/words/`
      );
      const result = await response.json();

      // Check if tags include "all" and include all words
      const filteredWords = tags.includes("all")
        ? result
        : result.filter((word) =>
            word.category_tags
              .split(",")
              .some((tag) => tags.includes(tag.trim()))
          );

      setWords(filteredWords);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  /**
   * Effect hook that runs after every render.
   * Fetch all the words whenever the @param tags changes.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    fetchWords();
  }, [tags]);

  /**
   * Effect hook that runs after every render.
   * Generate random words from words whenever the @param words or @param wordsNum changes.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    const getRandomWords = () => {
      const shuffledWords = [...words].sort(() => 0.5 - Math.random());
      const selectedWords = shuffledWords.slice(0, wordsNum);
      setRandomWords(selectedWords);
    };

    getRandomWords();
  }, [words, wordsNum]);

  /**
   * Renders the TestPageComponent.
   *
   * @returns {JSX.Element} JSX element.
   */
  return (
    <>
      <NavigationBar />
      <h1>Test Your Knowledge</h1>
      <ul className="basic-list">
        {randomWords.map((word, index) => (
          <li key={word.id} className="list-item">
            {lang === "fin" ? (
              <div className="data-vertical">
                <div className="data-vertical-left">
                  <span className="question-word">{word.finnish_word}</span>
                </div>

                <div className="data-vertical-right">
                  <span className="question-word">
                    <label className="label-margin">
                      <input
                        className="padding"
                        type="text"
                        value={userInputs[index]}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </label>
                  </span>
                </div>
              </div>
            ) : (
              <div className="data-vertical">
                <div className="data-vertical-left">
                  <span className="question-word">{word.english_word}</span>
                </div>

                <div className="data-vertical-right">
                  <span className="question-word">
                    <label>
                      <input
                        type="text"
                        value={userInputs[index]}
                        onChange={(event) => handleInputChange(index, event)}
                      />
                    </label>
                  </span>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      <div className="center">
        <button className="selected-button" onClick={() => handleButtonClick()}>
          Submit Answers
        </button>
        <button onClick={() => handleTransition("/first-page")}>back</button>
      </div>
    </>
  );
};

export default TestPageComponent;
