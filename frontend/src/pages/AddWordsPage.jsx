import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AddWordsPageComponent = () => {
  const navigate = useNavigate();
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

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const fetchWords = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/words/");
      const result = await response.json();
      setWords(result);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

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

  useEffect(() => {
    fetchWords();
  }, [selectedTags]);

  useEffect(() => {
    fetchTags();
  }, [words, newTags]);

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((selectedTag) => selectedTag !== tag)
        : [...prevTags, tag]
    );
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewWord((prevWord) => ({
      ...prevWord,
      [name]: value,
    }));
  };

  const handleSaveButtonClick = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/words/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...newWord,
          category_tags: selectedTags.join(","),
        }),
      });

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

  return (
    <>
      <div className="add-words-page">
        <h1>Add New Word</h1>
        {validInput === false ? (
          <p className="error-msg">
            Tags, English and Finnish words cannot be empty!
          </p>
        ) : null}

        <div className="select-tags">
          <form className="tags-form">
            <div className="data-vertical-right">
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
            <div className="data-vertical-right">
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
          <form className="tags-form">
            <div className="data-vertical-right">
              <label className="label-margin">
                Create a new tag:{" "}
                <input
                  type="text"
                  name="category_tags"
                  value={newWord.category_tags}
                  onChange={handleInputChange}
                />
              </label>
            </div>
            <button
              className="selected-button"
              type="button"
              onClick={handleAddTagClick}
            >
              Add Tag
            </button>
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
      </div>
    </>
  );
};

export default AddWordsPageComponent;
