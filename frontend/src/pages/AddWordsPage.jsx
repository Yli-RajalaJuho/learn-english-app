import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddWordsPageComponent = () => {
  const navigate = useNavigate();
  const [newWord, setNewWord] = useState({
    english_word: "",
    finnish_word: "",
    category_tags: "",
  });
  const [validInput, setValidInput] = useState(true);

  // Transition to different page
  const handleButtonClick = (path) => {
    navigate(path);
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
        body: JSON.stringify(newWord),
      });

      if (response.ok) {
        // Clear the form fields after saving
        setValidInput(true);
        setNewWord({
          english_word: "",
          finnish_word: "",
          category_tags: "",
        });
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
            English and Finnish words cannot be empty!
          </p>
        ) : (
          ""
        )}
        <form>
          <label>
            English Word:{" "}
            <input
              type="text"
              name="english_word"
              value={newWord.english_word}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Finnish Word:{" "}
            <input
              type="text"
              name="finnish_word"
              value={newWord.finnish_word}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Category Tags:{" "}
            <input
              type="text"
              name="category_tags"
              value={newWord.category_tags}
              onChange={handleInputChange}
            />
          </label>
          <div className="center">
            <button type="button" onClick={handleSaveButtonClick}>
              confirm
            </button>
            <button onClick={() => handleButtonClick("/inspect-words")}>
              cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default AddWordsPageComponent;
