import { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";

/**
 * React component for configuring the test setup.
 *
 * @component
 * @returns {JSX.Element} JSX element representing the FirstPageComponent.
 */
const FirstPageComponent = () => {
  const navigate = useNavigate();

  // State variables
  const [wordsNum, setWordsNum] = useState(1);
  const [lang, setLang] = useState("fin");
  const [words, setWords] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [possibleWordsCount, setPossibleWordsCount] = useState(1);

  const [validWordsNum, setValidWordsNum] = useState(true);

  /**
   * Handles navigation to the test page with the configured setup.
   *
   * @returns {void}
   */
  const handleButtonClick = () => {
    if (validWordsNum === true) {
      const tagsParam =
        selectedTags.length > 0 ? selectedTags.join(",") : "all";
      navigate(`/test-page/${wordsNum}/${lang}/${tagsParam}`);
    }
  };

  /**
   * Handles navigation to a specified path.
   *
   * @param {string} path - The path to navigate to.
   * @returns {void}
   */
  const handleTransition = (path) => {
    navigate(path);
  };

  /**
   * Handles unselecting all tags.
   *
   * @returns {void}
   */
  const handleUnselectAll = () => {
    setSelectedTags([]);
  };

  /**
   * Effect hook that runs after every render.
   * Sets the @param validWordsNum to true or false
   * based on how many possible words are currently available when the @param wordsNum changes
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    if (wordsNum > possibleWordsCount || wordsNum <= 0) {
      setValidWordsNum(false);
    } else {
      setValidWordsNum(true);
    }
  }, [wordsNum]);

  /**
   * Handles input change for the number of words.
   *
   * @param {Object} event - The input change event.
   * @returns {void}
   */
  const handleInputChange = (event) => {
    const { value } = event.target;

    setWordsNum(value);
  };

  /**
   * Handles selecting the words to be in Finnish.
   *
   * @returns {void}
   */
  const handleLangFin = () => {
    setLang("fin");
  };

  /**
   * Handles selecting the words to be in English.
   *
   * @returns {void}
   */
  const handleLangEng = () => {
    setLang("eng");
  };

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
    const uniqueTags = Array.from(
      new Set(
        words.flatMap((word) =>
          word.category_tags.split(",").map((tag) => tag.trim())
        )
      )
    );
    setTags(uniqueTags);
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
   * Fetch all the tags whenever the @param words changes.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    fetchTags();
  }, [words]);

  /**
   * Effect hook that runs after every render.
   * Sets the @param wordsNum to be the number of @param possibleWordsCount if tags are being selected.
   * If no tags are selected then the maximum number of words is @param possibleWordsCount
   * Effect runs every time @param selectedTags or @param words changes.
   *
   * @effect
   * @returns {void}
   */
  useEffect(() => {
    // Filter words based on selected tags and update the count
    const filteredWords = words.filter((word) => {
      const wordTags = word.category_tags.split(",").map((tag) => tag.trim());
      return selectedTags.some((tag) => wordTags.includes(tag));
    });

    if (selectedTags.length !== 0) {
      setPossibleWordsCount(filteredWords.length);
      setWordsNum(filteredWords.length);
    } else {
      setPossibleWordsCount(words.length);
    }
  }, [selectedTags, words]);

  /**
   * Renders the FirstPageComponent.
   *
   * @returns {JSX.Element} JSX element.
   */
  return (
    <>
      <NavigationBar />
      <h1>Test Setup</h1>

      <div className="test-init-form">
        <div className="select-tags">
          <p>Select words based on tags</p>
          <div className="select-buttons">
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
          <button className="unselect" onClick={() => handleUnselectAll()}>
            unselect-all
          </button>
        </div>

        <div className="data-vertical-left">
          {validWordsNum === false ? (
            <label className="error-msg">
              Please enter a number between 0-{possibleWordsCount}!
            </label>
          ) : null}
        </div>

        <div className="select-tags">
          <p>Number of Words on the Test{": "}</p>
          <div className="test-words">
            <input
              className="extra-padding"
              type="number"
              value={wordsNum}
              onChange={handleInputChange}
              min="1"
              max={possibleWordsCount}
            />
          </div>
        </div>

        <div className="select-tags">
          <p>Language of words:</p>
          <div className="test-lang">
            <button
              onClick={handleLangFin}
              className={lang === "fin" ? "selected-button" : "small-button"}
            >
              FIN
            </button>
            <button
              onClick={handleLangEng}
              className={lang === "eng" ? "selected-button" : "small-button"}
            >
              ENG
            </button>
          </div>
        </div>

        <div className="confirm-cancel">
          <button
            className="start-test"
            type="button"
            onClick={handleButtonClick}
          >
            Start
          </button>
          <button
            className="cancel-button"
            type="button"
            onClick={() => handleTransition("/")}
          >
            back
          </button>
        </div>
      </div>
    </>
  );
};

export default FirstPageComponent;
