import NavigationBar from "./NavigationBar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const InspectWordsPageComponent = () => {
  const navigate = useNavigate();
  const [words, setWords] = useState([]);
  const [confirm, setConfirm] = useState(false);
  const [confirmedItemId, setConfirmedItemId] = useState(null);

  const fetchWords = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/words/");
      const result = await response.json();
      setWords(result);
    } catch (error) {
      console.error("Error fetching words:", error);
    }
  };

  useEffect(() => {
    fetchWords();
  }, []);

  const handleButtonClick = (path) => {
    navigate(path);
  };

  const deleteWord = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/words/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // If the response is successful, update the list of words
        fetchWords();
        setConfirm(false);
        setConfirmedItemId(null);
      } else {
        console.error(`Failed to delete word with id ${id}.`);
      }
    } catch (error) {
      console.error(`Error deleting word with id ${id}`, error);
    }
  };

  const handleDelete = (id) => {
    setConfirm(true);
    setConfirmedItemId(id);
  };

  const handleConfirmDelete = (id) => {
    deleteWord(id);
  };

  const handleCancelDelete = () => {
    setConfirm(false);
    setConfirmedItemId(null);
  };

  return (
    <>
      <NavigationBar />
      <div className="inspect-words-page">
        <h1>Inspect Words</h1>
        <button onClick={() => handleButtonClick("/add-words")}>
          Add new Word
        </button>

        <button onClick={() => handleButtonClick("/")}>
          back to Main Page
        </button>

        <ul className="basic-list">
          {words.map((word) => (
            <li key={word.id} className="list-item">
              {confirm && confirmedItemId === word.id ? (
                <div>
                  <span className="deletion-warning">
                    Delete word: {word.english_word}
                  </span>
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
              ) : (
                <div>
                  <span className="word-id">ID: {word.id}</span>
                  <span className="english-word">{word.english_word}</span>
                  <span className="finnish-word">{word.finnish_word}</span>
                  <span className="word-id">Tags: {word.category_tags}</span>
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
              )}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default InspectWordsPageComponent;
