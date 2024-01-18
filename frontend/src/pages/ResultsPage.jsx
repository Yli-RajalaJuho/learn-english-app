import NavigationBar from "./NavigationBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * React component for displaying test results.
 *
 * @component
 * @returns {JSX.Element} JSX element representing the ResultsPageComponent.
 */
const ResultsPageComponent = () => {
  const location = useLocation();
  const { userResponses } = location.state || {};

  // State variables
  const [newScore, setNewScore] = useState({
    score: "",
    correct_words: "",
    incorrect_words: "",
    date: "",
  });
  const [grade, setGrade] = useState("");

  /**
   * Effect hook that runs after every render.
   * Fetch all the data of the word when @param userResponses gets to be known.
   * Calculates and updates the score, correct words, incorrect words, and date for @param newScore.
   *
   * @returns {void}
   */
  useEffect(() => {
    // Calculate score, correct words, and incorrect words
    const correctAnswers = userResponses.filter(
      (response) => response.isCorrect
    );
    const incorrectAnswers = userResponses.filter(
      (response) => !response.isCorrect
    );

    const score = `${correctAnswers.length}/${userResponses.length}`;

    const currentDate = new Date();
    const date = currentDate.toLocaleDateString();

    const correctWords = correctAnswers
      .map((response) => response.question)
      .join(",");
    const incorrectWords = incorrectAnswers
      .map((response) => response.question)
      .join(",");

    setNewScore({
      score,
      correct_words: correctWords,
      incorrect_words: incorrectWords,
      date,
    });

    let calculatedGrade = "";
    const avg = userResponses.length * 0.25;
    if (correctAnswers.length < avg) {
      calculatedGrade = "bad";
    } else if (
      correctAnswers.length >= avg &&
      correctAnswers.length < userResponses.length
    ) {
      calculatedGrade = "mediocre";
    } else if (correctAnswers.length == userResponses.length) {
      calculatedGrade = "great";
    }

    setGrade(calculatedGrade);
  }, [userResponses]);

  /**
   * Effect hook that runs after every render.
   * Handles saving the test result to the server instantly after @param newScore is completely ready.
   *
   * @returns {void}
   */
  useEffect(() => {
    const handleSave = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/scores/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newScore),
        });

        if (response.ok) {
          console.log("Test result saved successfully!");
        } else {
          console.error("Failed to save test result:", response.statusText);
        }
      } catch (error) {
        console.error("Error saving test result:", error);
      }
    };

    // Save the result when newScore changes
    handleSave();
  }, [newScore]);

  /**
   * Renders the ResultsPageComponent.
   *
   * @returns {JSX.Element} JSX element.
   */
  return (
    <>
      <NavigationBar />
      <h1>Results</h1>
      <div className={`${grade}`}>
        <h3>Your got {newScore.score} words right!!!</h3>
      </div>

      <ul>
        {userResponses.map((response, index) => (
          <li key={index}>
            <div className="list-item">
              <div className="data-vertical">
                <label className="label-margin">
                  Test Word:{" "}
                  <span className="english-word">{response.question}</span>
                </label>

                <label className="label-margin">
                  Your Answer:{" "}
                  <span className="user-answer">
                    {response.userAnswer.length === 0
                      ? "empty"
                      : response.userAnswer}
                  </span>
                </label>

                <div>
                  <label className="label-margin">
                    <span
                      className={response.isCorrect ? "correct" : "incorrect"}
                    >
                      {response.isCorrect ? " (Correct)" : " (Incorrect)"}
                    </span>
                  </label>

                  <>
                    {response.isCorrect ? null : (
                      <label className="label-margin">
                        <span className="correct">
                          Correct answer{": "}
                          {response.correctAnswer}
                        </span>
                      </label>
                    )}
                  </>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ResultsPageComponent;
