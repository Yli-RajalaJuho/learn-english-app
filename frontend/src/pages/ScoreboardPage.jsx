import NavigationBar from "./NavigationBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const MainPageComponent = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchInput, setSearchInput] = useState("");

  // Fetch scores from the server when the component mounts
  const fetchScores = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/scores/?searchTerm=${searchInput}&sortOrder=${sortOrder}`
      );
      const result = await response.json();
      setScores(result);
    } catch (error) {
      console.error("Error fetching scores:", error);
    }
  };

  // Transition to different page
  const handleButtonClick = (path) => {
    navigate(path);
  };

  const handleSortOrder = (order) => {
    setSortOrder(order);
  };

  const handleSearch = (search) => {
    setSearchInput(search);
  };

  useEffect(() => {
    fetchScores();
  }, [searchInput, sortOrder]);

  return (
    <>
      <NavigationBar />
      <h1>Scoreboard</h1>
      <button onClick={() => handleButtonClick("/")}>back to Main Page</button>

      <div className="sort-container">
        <div className="selected-buttons">
          <p>Sort order:</p>
          <button
            onClick={() => handleSortOrder("asc")}
            className={sortOrder === "asc" ? "selected-button" : ""}
          >
            asc
          </button>
          <button
            onClick={() => handleSortOrder("desc")}
            className={sortOrder === "desc" ? "selected-button" : ""}
          >
            desc
          </button>
        </div>
      </div>
      <div className="searchbar">
        <label className="label-margin">
          Search{": "}
          <input
            type="number"
            value={searchInput}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search..."
          />
        </label>
      </div>

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
