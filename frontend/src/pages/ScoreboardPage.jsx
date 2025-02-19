import NavigationBar from "./NavigationBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DownArrow from ".././assets/downArrow.png";
import upArrow from ".././assets/upArrow.png";

/**
 * React component for displaying the scoreboard and managing scores.
 *
 * @component
 * @returns {JSX.Element} JSX element representing the ScoreBoardPageComponent.
 */
const ScoreBoardPageComponent = () => {
  const navigate = useNavigate();

  // State variables
  const [scores, setScores] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc");
  const [searchInput, setSearchInput] = useState("");
  const [confirm, setConfirm] = useState(false);

  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Fetches scores from the server based on search and sort parameters.
   *
   * @returns {void}
   */
  const fetchScores = async () => {
    // Set a timer to set isLoading to true after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 2000);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/scores/?searchTerm=${searchInput}&sortOrder=${sortOrder}`
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

  /**
   * Handles transition to a different page.
   *
   * @param {string} path - The path to navigate to.
   * @returns {void}
   */
  const handleButtonClick = (path) => {
    navigate(path);
  };

  /**
   * Handles changing the sort order of the scoreboard.
   *
   * @param {string} order - The sort order ("asc" or "desc").
   * @returns {void}
   */
  const handleSortOrder = (order) => {
    setSortOrder(order);
  };

  /**
   * Handles searching for scores based on input.
   *
   * @param {string} search - The search input ("id, score, date").
   * @returns {void}
   */
  const handleSearch = (search) => {
    setSearchInput(search);
  };

  /**
   * Effect hook that runs after every render.
   * Fetch all the scores whenever @param searchInput or @param sortOrder changes.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    fetchScores();
  }, [searchInput, sortOrder]);

  /**
   * Deletes all scores from the server.
   *
   * @returns {void}
   */
  const deleteAllScores = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/scores/`,
        {
          method: "DELETE",
        }
      );

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

  /**
   * Handles initiating the confirmation to delete all scores.
   *
   * @returns {void}
   */
  const handleDelete = () => {
    setConfirm(true);
  };

  /**
   * Handles confirming the deletion of all scores.
   *
   * @returns {void}
   */
  const handleConfirmDelete = () => {
    deleteAllScores();
  };

  /**
   * Handles canceling the deletion of all scores.
   *
   * @returns {void}
   */
  const handleCancelDelete = () => {
    setConfirm(false);
  };

  /**
   * Determines the color class based on the score value.
   *
   * @param {string} score - The score value.
   * @returns {string} - The color class.
   */
  const handleScoreColor = (score) => {
    const [numerator, denominator] = score.split("/");
    const numericScore = parseFloat(numerator) / parseFloat(denominator);

    if (numericScore < 0.25) {
      return "score-color-bad";
    } else if (numericScore >= 0.25 && numericScore < 1) {
      return "score-color-mediocre";
    } else if (numericScore == 1) {
      return "score-color-great";
    }
  };

  /**
   * Renders the MainPageComponent.
   *
   * @returns {JSX.Element} JSX element.
   */
  return (
    <>
      <NavigationBar />
      <h1>Scoreboard</h1>
      <div className="left-center">
        <div className="left-center">
          <button onClick={() => handleButtonClick("/")}>back</button>
        </div>

        {confirm ? (
          <div className="data-vertical">
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
          <div className="data-vertical-right">
            <div className="searchbar">
              <label className="label-margin">
                Search{": "}
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search..."
                />
              </label>
            </div>
          </div>

          <div className="data-vertical-right">
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
                <div className={handleScoreColor(score.score)}>
                  <label className="label-margin">
                    Score:
                    <span className="score">{score.score}</span>
                  </label>
                </div>
                <div className="data-vertical">
                  <div className="data-vertical-left">
                    <label className="label-margin">
                      <span className="score-id">Test: {score.id}</span>
                    </label>
                  </div>
                  <div className="data-vertical-left">
                    <label className="label-margin">
                      <span className="score-date">Date: {score.date}</span>
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

export default ScoreBoardPageComponent;
