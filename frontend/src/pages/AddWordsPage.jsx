import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

/**
 * React component for adding new words with tags to the database.
 *
 * @component
 * @returns {JSX.Element} JSX element representing the AddWordsPageComponent.
 */
const AddWordsPageComponent = () => {
  const navigate = useNavigate();

  // State variables
  const [words, setWords] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newWord, setNewWord] = useState({
    english_word: "",
    finnish_word: "",
    category_tags: "",
  });
  const [validInput, setValidInput] = useState(true);

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
   * Fetches words from the server.
   *
   * @async
   * @returns {void}
   */
  const fetchWords = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/words/`
      );
      const result = await response.json();
      setWords(result);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  /**
   * Fetches tags and updates the state.
   *
   * @returns {void}
   */
  const fetchTags = () => {
    const uniqueOldTags = Array.from(
      new Set(
        words.flatMap((word) =>
          word.category_tags.split(",").map((tag) => tag.trim())
        )
      )
    );
    const allTags = [...uniqueOldTags, ...newTags];
    setTags(allTags);
  };

  /**
   * Handles the click event for adding a new tag.
   * If the tag already exists then it will be marked as selected.
   * If it doesn't already exist then a new tag will be created and it will be marked as selected
   *
   * @returns {void}
   */
  const handleAddTagClick = () => {
    const newTag = newWord.category_tags.trim();
    if (newTag) {
      if (!tags.includes(newTag)) {
        // Add the new tag to both tags and newTags arrays
        setTags((prevTags) => [...prevTags, newTag]);
        setNewTags((prevNewTags) => [...prevNewTags, newTag]);

        // Add the new tag to the selected tags array
        setSelectedTags((prevTags) => [...prevTags, newTag]);

        setNewWord((prevWord) => ({
          ...prevWord,
          category_tags: "",
        }));
      } else {
        // Handle case where the tag already exists
        setSelectedTags((prevTags) =>
          prevTags.includes(newTag) ? prevTags : [...prevTags, newTag]
        );
        setNewWord((prevWord) => ({
          ...prevWord,
          category_tags: "",
        }));
      }
    }
  };

  /**
   * Effect hook that runs after every render.
   * Fetch all the words whenever the @param selectedTags changes.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    fetchWords();
  }, [selectedTags]);

  /**
   * Effect hook that runs after every render.
   * Fetch all the tags whenever @param words or @param newTags changes
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    fetchTags();
  }, [words, newTags]);

  /**
   * Toggles the clicked tag on and off making it selected or unselected
   *
   * @param {string} tag - The tag to toggle on and off
   * @returns {void}
   */
  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((selectedTag) => selectedTag !== tag)
        : [...prevTags, tag]
    );
  };

  /**
   * Handles the change event for input fields.
   *
   * @param {Object} event - The input change event.
   * @returns {void}
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewWord((prevWord) => ({
      ...prevWord,
      [name]: value,
    }));
  };

  /**
   * Effect hook that runs after every render.
   * Set @param validInput to true whenever @param selectedTags or @param newWord changes
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    setValidInput(true);
  }, [selectedTags, newWord]);

  /**
   * Handles unselecting all tags.
   *
   * @returns {void}
   */
  const handleUnselectAll = () => {
    setSelectedTags([]);
  };

  /**
   * Handles the click event for saving the word to the database and then navigating out of the page
   *
   * @async
   * @returns {void}
   */
  const handleSaveButtonClick = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/words/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...newWord,
            category_tags: selectedTags.join(","),
          }),
        }
      );

      if (response.ok) {
        setValidInput(true);
        setNewWord({
          english_word: "",
          finnish_word: "",
          category_tags: "",
        });
        setSelectedTags([]);
        navigate("/inspect-words");
      } else {
        setValidInput(false);
        console.error("Failed to save word:", response.statusText);
      }
    } catch (error) {
      console.error("Error saving word:", error);
    }
  };

  /**
   * Renders the AddWordsPageComponent.
   *
   * @returns {JSX.Element} JSX element.
   */
  return (
    <>
      <div className="add-words-page">
        <h1>Add New Word</h1>

        <div className="select-tags">
          <form className="tags-form">
            <div className="data-vertical-left">
              <label className="label-margin">
                New English Word:{" "}
                <input
                  type="text"
                  name="english_word"
                  value={newWord.english_word}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <div className="data-vertical-left">
              <label className="label-margin">
                New Finnish Word:{" "}
                <input
                  type="text"
                  name="finnish_word"
                  value={newWord.finnish_word}
                  onChange={handleInputChange}
                />
              </label>
            </div>
          </form>
        </div>

        <h2>Add Tags</h2>
        <div className="select-tags">
          <form className="data-vertical">
            <div className="data-vertical-left">
              <label className="label-margin">
                Create a new tag:{" "}
                <input
                  type="text"
                  name="category_tags"
                  value={newWord.category_tags}
                  onChange={handleInputChange}
                />
              </label>
              <button
                className="selected-button"
                type="button"
                onClick={handleAddTagClick}
              >
                Add-Tag
              </button>
            </div>
          </form>
          <div className="data-vertical">
            <div className="data-vertical-left">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={
                    selectedTags.includes(tag)
                      ? "selected-button"
                      : "small-button"
                  }
                >
                  {tag}
                </button>
              ))}
              <button className="unselect" onClick={() => handleUnselectAll()}>
                unselect-all
              </button>
            </div>
          </div>
        </div>
        {validInput === false ? (
          <div className="data-vertical">
            <label className="error-msg">
              Tags, English and Finnish words cannot be empty!
            </label>
          </div>
        ) : null}

        <div className="confirm-cancel">
          <button
            className="start-test"
            type="button"
            onClick={handleSaveButtonClick}
          >
            Confirm
          </button>
          <button
            className="cancel-button"
            onClick={() => handleButtonClick("/inspect-words")}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};

export default AddWordsPageComponent;
