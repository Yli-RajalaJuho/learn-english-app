import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PatchWordPageComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patchWords, setPatchWords] = useState([]);
  const [displayWords, setDisplayWords] = useState([]);
  const [validInput, setValidInput] = useState(true);

  const [words, setWords] = useState([]);
  const [patchWordTags, setPatchWordTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [newTags, setNewTags] = useState([]);
  const [newTagInput, setNewTagInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setPatchWords((prevWords) => {
      return prevWords.map((word) => {
        return { ...word, [name]: value };
      });
    });
  };

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

  useEffect(() => {
    fetchWordData();
  }, [id]);

  useEffect(() => {
    fetchPatchTags();
    setSelectedTags(patchWordTags);
  }, [patchWords]);

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

  // FOR TAGS
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

  console.log(patchWords[0]);
  console.log(selectedTags);

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
              <label className="label-margin">
                English Word{": "}
                <input
                  type="text"
                  name="english_word"
                  value={patchWords[0].english_word}
                  onChange={handleInputChange}
                />
              </label>
              <label className="label-margin">
                Finnish Word{": "}
                <input
                  type="text"
                  name="finnish_word"
                  value={patchWords[0].finnish_word}
                  onChange={handleInputChange}
                />
              </label>
            </form>
          </div>
          <div className="select-tags">
            <form className="tags-form">
              <label className="label-margin">
                Create new Tags{": "}
                <input
                  type="text"
                  name="category_tags"
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                />
              </label>
              <button type="button" onClick={handleAddTagClick}>
                Add Tag
              </button>
            </form>
            <div className="selected-buttons">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={
                    selectedTags.includes(tag) ? "selected-button" : ""
                  }
                >
                  {tag}
                </button>
              ))}
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
