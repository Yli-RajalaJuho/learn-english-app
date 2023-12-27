import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const PatchWordPageComponent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [patchWords, setPatchWords] = useState([]);
  const [displayWords, setDisplayWords] = useState([]);
  const [validInput, setValidInput] = useState(true);

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

  useEffect(() => {
    fetchWordData();
  }, [id]);

  const handleSaveButtonClick = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/words/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patchWords[0]),
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
        <p className="error-msg">English and Finnish words cannot be empty!</p>
      )}
      {patchWords.length !== 0 && (
        <form>
          <label>
            English Word:{" "}
            <input
              type="text"
              name="english_word"
              value={patchWords[0].english_word}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Finnish Word:{" "}
            <input
              type="text"
              name="finnish_word"
              value={patchWords[0].finnish_word}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Category Tags:{" "}
            <input
              type="text"
              name="category_tags"
              value={patchWords[0].category_tags}
              onChange={handleInputChange}
            />
          </label>
          <div className="center">
            <button type="button" onClick={handleSaveButtonClick}>
              Confirm
            </button>
            <button onClick={() => handleButtonClick("/inspect-words")}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default PatchWordPageComponent;
