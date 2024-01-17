import NavigationBar from "./NavigationBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DownArrow from ".././assets/downArrow.png";
import upArrow from ".././assets/upArrow.png";

const MainPageComponent = () => {
  const navigate = useNavigate();
  const [scores, setScores] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchInput, setSearchInput] = useState("");
  const [confirm, setConfirm] = useState(false);

  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch scores from the server when the component mounts
  const fetchScores = async () => {
    // Set a timer to set isLoading to true after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 2000);

    try {
      const response = await fetch(
        `http://localhost:8080/api/scores/?searchTerm=${searchInput}&sortOrder=${sortOrder}`
      );
      const result = await response.json();

      if (response.ok) {
        setIsLoading(false);
        setNoData(false);
        setScores(result);
      }
    } catch (error) {
      setScores([]);
      setIsLoading(false);
      setNoData(true);
      console.error("Error fetching scores:", error);
    } finally {
      // Clear the timer when the fetch operation is complete
      clearTimeout(timer);
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

  const deleteAllScores = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/scores/`, {
        method: "DELETE",
      });

      if (response.ok) {
        // If the response is successful, update the list of scores
        setScores([]);
        fetchScores();
        setConfirm(false);
      } else {
        console.error(`Failed to delete scores.`);
      }
    } catch (error) {
      console.error(`Error deleting scores`, error);
    }
  };

  const handleDelete = () => {
    setConfirm(true);
  };

  const handleConfirmDelete = () => {
    deleteAllScores();
  };

  const handleCancelDelete = () => {
    setConfirm(false);
  };

  return (
    <>
      <NavigationBar />
      <h1>Scoreboard</h1>
      <div className="left-center">
        <div className="left-center">
          <button onClick={() => handleButtonClick("/")}>back</button>
        </div>

        {confirm ? (
          <div className="left-center">
            <div>
              <p>Delete all Scores?</p>
            </div>

            <button className="unselect" onClick={handleConfirmDelete}>
              confirm
            </button>
            <button onClick={handleCancelDelete}>cancel</button>
          </div>
        ) : (
          <div className="left-center">
            <button className="unselect" onClick={handleDelete}>
              Delete Scores
            </button>
          </div>
        )}
      </div>

      <div className="sort-container">
        <div className="selected-buttons">
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
          <button
            onClick={() => handleSortOrder("asc")}
            className={
              sortOrder === "asc" ? "selected-img-button" : "img-button"
            }
          >
            <img
              className="button-image"
              src={DownArrow}
              alt="ascending-order"
            ></img>
          </button>
          <button
            onClick={() => handleSortOrder("desc")}
            className={
              sortOrder === "desc" ? "selected-img-button" : "img-button"
            }
          >
            <img
              className="button-image"
              src={upArrow}
              alt="descending-order"
            ></img>
          </button>
        </div>
      </div>

      <>
        {isLoading ? (
          <div className="list-item">
            <p className="center">loading...</p>
          </div>
        ) : null}
        {noData ? (
          <>
            <div className="list-item">
              <p className="center">No Search Results available</p>
            </div>
          </>
        ) : (
          <ul className="basic-list">
            {scores.map((score) => (
              <li className="list-item" key={score.id}>
                <div className="data-vertical">
                  <div className="data-vertical-left">
                    <label className="label-margin">
                      <span className="score-id">Test: {score.id}</span>
                    </label>
                    <label className="label-margin">
                      <span className="score-date">Date: {score.date}</span>
                    </label>
                    <label className="label-margin">
                      <span className="score">Score: {score.score}</span>
                    </label>
                  </div>

                  <div className="data-vertical-left">
                    <div className="data-vertical-right">
                      <label className="label-margin">
                        Correct:
                        <span className="correct-words">
                          {score.correct_words.split(",").map((word, index) => (
                            <span key={index} className="correct">
                              {word}
                              {index <
                                score.correct_words.split(",").length - 1 &&
                                ", "}
                            </span>
                          ))}
                        </span>
                      </label>
                    </div>
                  </div>
                  <div className="data-vertical-left">
                    <div className="data-vertical-right">
                      <label className="label-margin">
                        Incorrect:
                        <span className="incorrect-words">
                          {score.incorrect_words
                            .split(",")
                            .map((word, index) => (
                              <span key={index} className="incorrect">
                                {word}
                                {index <
                                  score.incorrect_words.split(",").length - 1 &&
                                  ", "}
                              </span>
                            ))}
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </>
    </>
  );
};

export default MainPageComponent;
