import NavigationBar from "./NavigationBar";
import { useLocation } from "react-router-dom";
//import { useState, useEffect } from "react";

const ResultsPageComponent = () => {
  const location = useLocation();
  const { userResponses } = location.state || {};

  // Access the userResponses array, which contains user answers and correctness
  console.log(userResponses);

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
