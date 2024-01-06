import NavigationBar from "./NavigationBar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TestPageComponent = () => {
  const navigate = useNavigate();
  const { wordsNum } = useParams();
  const { lang } = useParams();
  const [words, setWords] = useState([]);
  const [randomWords, setRandomWords] = useState([]);
  const [userInputs, setUserInputs] = useState(
    Array.from({ length: wordsNum }, () => "")
  );

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

  const handleInputChange = (index, event) => {
    const { value } = event.target;
    setUserInputs((prevInputs) => {
      const newInputs = [...prevInputs];
      newInputs[index] = value;
      return newInputs;
    });
  };

  const fetchWords = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/words/");
      const result = await response.json();
      setWords(result);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    const getRandomWords = () => {
      const shuffledWords = [...words].sort(() => 0.5 - Math.random());
      const selectedWords = shuffledWords.slice(0, wordsNum);
      setRandomWords(selectedWords);
    };

    getRandomWords();
  }, [words, wordsNum]);

  return (
    <>
      <NavigationBar />
      <h1>Test Page</h1>
      <ul className="basic-list">
        {randomWords.map((word, index) => (
          <li key={word.id} className="list-item">
            {lang === "fin" ? (
              <div>
                <span className="question-word">{word.finnish_word}</span>
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
            ) : (
              <div>
                <span className="question-word">{word.english_word}</span>
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
            )}
          </li>
        ))}
      </ul>
      <button onClick={() => handleButtonClick("/second-page")}>
        Submit Answers
      </button>
    </>
  );
};

export default TestPageComponent;
