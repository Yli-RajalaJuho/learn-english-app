import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

/**
 * React component for editing a word.
 *
 * @component
 * @returns {JSX.Element} JSX element representing the PatchWordPageComponent.
 */
const PatchWordPageComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // State variables
  const [patchWords, setPatchWords] = useState([]);
  const [displayWords, setDisplayWords] = useState([]);
  const [validInput, setValidInput] = useState(true);

  const [words, setWords] = useState([]);
  const [patchWordTags, setPatchWordTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

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
   * Handles input change for the word being edited.
   *
   * @param {Object} event - The input change event.
   * @returns {void}
   */
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPatchWords((prevWords) => {
      return prevWords.map((word) => {
        return { ...word, [name]: value };
      });
    });
  };

  /**
   * Fetches word data for the word being edited.
   *
   * @returns {void}
   */
  const fetchWordData = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/words/${id}`);
      if (response.ok) {
        const wordData = await response.json();
        setDisplayWords(wordData);
        setPatchWords(wordData);
      } else {
        console.error("Failed to fetch word data:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching word data:", error);
    }
  };

  /**
   * Fetches tags for the word being edited.
   *
   * @returns {void}
   */
  const fetchPatchTags = () => {
    const uniqueTags = Array.from(
      new Set(
        patchWords.flatMap((word) =>
          word.category_tags.split(",").map((tag) => tag.trim())
        )
      )
    );
    setPatchWordTags(uniqueTags);
  };

  /**
   * Effect hook that runs after every render.
   * Fetch all the data of the word when @param id gets to be known.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    fetchWordData();
  }, [id]);

  /**
   * Effect hook that runs after every render.
   * Fetch all the tags for the word with @param id and set the tags of that word as @selectedTags
   * when ever @param patchWords changes.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    fetchPatchTags();
    setSelectedTags(patchWordTags);
  }, [patchWords]);

  /**
   * Handles saving the edited word.
   *
   * @returns {void}
   */
  const handleSaveButtonClick = async () => {
    try {
      patchWords[0].category_tags = "";
      const response = await fetch(`http://localhost:8080/api/words/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...patchWords[0],
          category_tags: selectedTags.join(", "),
        }),
      });

      if (response.ok) {
        // After successfully updating, navigate back to inspect-words
        setValidInput(true);
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
   * Fetches all words so the old tags can be constructed.
   *
   * @returns {void}
   */
  const fetchWords = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/words/");
      const result = await response.json();
      setWords(result);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  /**
   * Fetches all tags.
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
   * Handles the click event for adding a new tag.
   * If the tag already exists then it will be marked as selected.
   * If it doesn't already exist then a new tag will be created and it will be marked as selected
   *
   * @returns {void}
   */
  const handleAddTagClick = () => {
    const newTag = newTagInput.trim();
    if (newTag) {
      if (!tags.includes(newTag)) {
        // Add the new tag to both tags and newTags arrays
        setTags((prevTags) => [...prevTags, newTag]);
        setNewTags((prevNewTags) => [...prevNewTags, newTag]);

        // Add the new tag to the selected tags array
        setSelectedTags((prevTags) => [...prevTags, newTag]);

        // Clear the input field
        setNewTagInput("");
      } else {
        // Handle case where the tag already exists
        setSelectedTags((prevTags) =>
          prevTags.includes(newTag) ? prevTags : [...prevTags, newTag]
        );

        // Clear the input field
        setNewTagInput("");
      }
    }
  };

  /**
   * Renders the PatchWordPageComponent.
   *
   * @returns {JSX.Element} JSX element.
   */
  return (
    <div className="add-words-page">
      <h1>Edit Word</h1>
      <ul className="basic-list">
        {displayWords.map((word) => (
          <li key={word.id} className="list-item">
            <div>
              <span className="word-id">ID: {word.id}</span>
              <span className="english-word">{word.english_word}</span>
              <span className="finnish-word">{word.finnish_word}</span>
              <span className="word-id">Tags: {word.category_tags}</span>
            </div>
          </li>
        ))}
      </ul>
      {!validInput && (
        <p className="error-msg">
          Tags, English and Finnish words cannot be empty!
        </p>
      )}
      {patchWords.length !== 0 && (
        <>
          <div className="select-tags">
            <form className="tags-form">
              <div className="data-vertical-right">
                <label className="label-margin">
                  English Word{": "}
                  <input
                    type="text"
                    name="english_word"
                    value={patchWords[0].english_word}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
              <div className="data-vertical-right">
                <label className="label-margin">
                  Finnish Word{": "}
                  <input
                    type="text"
                    name="finnish_word"
                    value={patchWords[0].finnish_word}
                    onChange={handleInputChange}
                  />
                </label>
              </div>
            </form>
          </div>

          <h2>Tags</h2>

          <div className="select-tags">
            <form className="data-vertical">
              <div className="data-vertical-left">
                <label className="label-margin">
                  Create new Tags{": "}
                  <input
                    type="text"
                    name="category_tags"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                  />
                </label>

                <button
                  className="selected-button"
                  type="button"
                  onClick={handleAddTagClick}
                >
                  Add Tag
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
              </div>
            </div>
          </div>
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
        </>
      )}
    </div>
  );
};

export default PatchWordPageComponent;
