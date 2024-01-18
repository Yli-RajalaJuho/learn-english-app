import NavigationBar from "./NavigationBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DownArrow from ".././assets/downArrow.png";
import upArrow from ".././assets/upArrow.png";

/**
 * React component for inspecting and managing words.
 *
 * @component
 * @returns {JSX.Element} JSX element representing the InspectWordsPageComponent.
 */
const InspectWordsPageComponent = () => {
  const navigate = useNavigate();

  // State variables
  const [words, setWords] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [confirmedItemId, setConfirmedItemId] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [sortable, setSortable] = useState("eng");
  const [searchInput, setSearchInput] = useState("");

  const [noData, setNoData] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Handles selecting sorting order @param sortOrder of the words list.
   *
   * @param {string} order - The sort order ("asc" or "desc").
   * @returns {void}
   */
  const handleSortOrder = (order) => {
    setSortOrder(order);
  };

  /**
   * Handles selecting the @param sortable property for the words list.
   *
   * @param {string} sortBy - The property to sort by ("id", "eng", "fin", "tags").
   * @returns {void}
   */
  const handleSortable = (sortBy) => {
    setSortable(sortBy);
  };

  /**
   * Handles setting up the @param searchInput for the words list.
   *
   * @param {string} search - The search input.
   * @returns {void}
   */
  const handleSearch = (search) => {
    setSearchInput(search);
  };

  /**
   * Fetches words from the server based on @param search, @param sortable, and @param sortOrder.
   *
   * @async
   * @returns {void}
   */
  const fetchWords = async () => {
    // Set a timer to set isLoading to true after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 2000);

    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/api/words/search?searchTerm=${searchInput}&sortable=${sortable}&sortOrder=${sortOrder}`
      );
      const result = await response.json();
      if (response.ok) {
        setIsLoading(false);
        setNoData(false);
        setWords(result);
      }
    } catch (error) {
      setWords([]);
      setIsLoading(false);
      setNoData(true);
      console.error("Error fetching words:", error);
    } finally {
      // Clear the timer when the fetch operation is complete
      clearTimeout(timer);
    }
  };

  /**
   * Effect hook that runs after every render.
   * Fetch all the words whenever @param searchInput or @param sortable or @param sortOrder changes.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    fetchWords();
  }, [searchInput, sortable, sortOrder]);

  /**
   * Handles navigation to a specified path.
   *
   * @param {string} path - The path to navigate to.
   * @returns {void}
   */
  const handleButtonClick = (path) => {
    navigate(path);
  };

  /**
   * Deletes a word with the given id.
   *
   * @async
   * @param {number} id - The id of the word to delete.
   * @returns {void}
   */
  const deleteWord = async (id) => {
    // Set a timer to set isLoading to true after 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(true);
    }, 2000);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/words/${id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        // If the response is successful, update the list of words
        setIsLoading(false);
        fetchWords();
        setConfirm(false);
        setConfirmedItemId(null);
      } else {
        setIsLoading(false);
        console.error(`Failed to delete word with id ${id}.`);
      }
    } catch (error) {
      setIsLoading(false);
      console.error(`Error deleting word with id ${id}`, error);
    } finally {
      // Clear the timer when the fetch operation is complete
      clearTimeout(timer);
    }
  };

  /**
   * Initiates the deletion process for a word with the given id.
   *
   * @param {number} id - The id of the word to delete.
   * @returns {void}
   */
  const handleDelete = (id) => {
    setConfirm(true);
    setConfirmedItemId(id);
  };

  /**
   * Handles confirming the deletion of a word with the given id.
   *
   * @param {number} id - The id of the word to delete.
   * @returns {void}
   */
  const handleConfirmDelete = (id) => {
    deleteWord(id);
  };

  /**
   * Handles canceling the deletion process.
   *
   * @returns {void}
   */
  const handleCancelDelete = () => {
    setConfirm(false);
    setConfirmedItemId(null);
  };

  /**
   * Renders the InspectWordsPageComponent.
   *
   * @returns {JSX.Element} JSX element.
   */
  return (
    <>
      <NavigationBar />
      <div className="inspect-words-page">
        <h1>Words</h1>

        <div className="left-center">
          <div className="left-center">
            <button onClick={() => handleButtonClick("/")}>back</button>
          </div>
          <div className="left-center">
            <button
              className="selected-button"
              onClick={() => handleButtonClick("/add-words")}
            >
              Add new Word
            </button>
          </div>
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
              <div className="label-margin">
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
          <div className="selected-buttons">
            <div className="data-vertical-right">
              <button
                onClick={() => handleSortable("id")}
                className={
                  sortable === "id" ? "selected-button" : "small-button"
                }
              >
                Id
              </button>
              <button
                onClick={() => handleSortable("eng")}
                className={
                  sortable === "eng" ? "selected-button" : "small-button"
                }
              >
                Eng
              </button>
              <button
                onClick={() => handleSortable("fin")}
                className={
                  sortable === "fin" ? "selected-button" : "small-button"
                }
              >
                Fin
              </button>
              <button
                onClick={() => handleSortable("tags")}
                className={
                  sortable === "tags" ? "selected-button" : "small-button"
                }
              >
                Tags
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
            <div className="list-item">
              <p className="center">No Search Results available</p>
            </div>
          ) : (
            <ul className="basic-list">
              {words.map((word) => (
                <li key={word.id} className="list-item">
                  {confirm && confirmedItemId === word.id ? (
                    <div className="data-vertical">
                      <div className="data-vertical-left">
                        <label className="label-margin">
                          <span className="deletion-warning">
                            Delete word: {word.english_word}
                          </span>
                        </label>
                      </div>
                      <div className="data-vertical-right">
                        <span>
                          <button
                            className="small-button"
                            onClick={() => handleConfirmDelete(word.id)}
                          >
                            confirm
                          </button>
                        </span>
                        <span>
                          <button
                            className="delete-button"
                            onClick={handleCancelDelete}
                          >
                            cancel
                          </button>
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="data-vertical">
                      <div className="data-vertical-left">
                        <span className="word-id">ID: {word.id}</span>
                        <span className="english-word">
                          {word.english_word}
                        </span>
                        <span className="finnish-word">
                          {word.finnish_word}
                        </span>
                        <span className="word-id">
                          Tags: {word.category_tags}
                        </span>
                      </div>

                      <div className="data-vertical-right">
                        <span>
                          <button
                            className="small-button"
                            onClick={() =>
                              handleButtonClick(`/patch-word/${word.id}`)
                            }
                          >
                            edit
                          </button>
                        </span>
                        <span>
                          <button
                            className="delete-button"
                            onClick={() => handleDelete(word.id)}
                          >
                            delete
                          </button>
                        </span>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      </div>
    </>
  );
};

export default InspectWordsPageComponent;
