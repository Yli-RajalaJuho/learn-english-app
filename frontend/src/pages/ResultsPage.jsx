import NavigationBar from "./NavigationBar";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

const ResultsPageComponent = () => {
  const location = useLocation();
  const { userResponses } = location.state || {};
  const [newScore, setNewScore] = useState({
    score: "",
    correct_words: "",
    incorrect_words: "",
  });

  useEffect(() => {
    // Calculate score, correct words, and incorrect words
    const correctAnswers = userResponses.filter(
      (response) => response.isCorrect
    );
    const incorrectAnswers = userResponses.filter(
      (response) => !response.isCorrect
    );

    const score = `${correctAnswers.length}/${userResponses.length}`;
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
    });
  }, [userResponses]);

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

  return (
    <>
      <NavigationBar />
      <h1>Results Page</h1>
      <ul>
        {userResponses.map((response, index) => (
          <li key={index}>
            <div className="list-item">
              <span className="word-id">{response.question}</span>
              <span className="user-answer">
                {response.userAnswer.length === 0
                  ? "empty"
                  : response.userAnswer}
              </span>
              <span className={response.isCorrect ? "correct" : "incorrect"}>
                {response.isCorrect
                  ? " (Correct)"
                  : ` (Incorrect) ${response.correctAnswer}`}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ResultsPageComponent;
