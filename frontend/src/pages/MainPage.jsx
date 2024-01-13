import NavigationBar from "./NavigationBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MainPageComponent = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // Fetch scores from the server when the component mounts
    const fetchScores = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/scores/");
        const result = await response.json();
        setScores(result);
      } catch (error) {
        console.error("Error fetching scores:", error);
      }
    };

    fetchScores();
  }, []);

  // Transition to different page
  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <>
      <NavigationBar />
      <h1>Learn English</h1>
      <button onClick={() => handleButtonClick("/inspect-words")}>
        Edit Words
      </button>
      <button
        className="start-test"
        onClick={() => handleButtonClick("/first-page")}
      >
        Start Learning
      </button>

      <h2>Scores</h2>
      <ul className="basic-list">
        {scores.map((score) => (
          <li className="list-item" key={score.id}>
            <div>
              <span className="score-id">Test: {score.id}</span>
              <span className="score">Score: {score.score}</span>
              <span className="correct-words">
                {score.correct_words.split(",").map((word, index) => (
                  <span key={index} className="correct">
                    {word}
                    {index < score.correct_words.split(",").length - 1 && ", "}
                  </span>
                ))}
              </span>
              <span className="incorrect-words">
                {score.incorrect_words.split(",").map((word, index) => (
                  <span key={index} className="incorrect">
                    {word}
                    {index < score.incorrect_words.split(",").length - 1 &&
                      ", "}
                  </span>
                ))}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default MainPageComponent;
