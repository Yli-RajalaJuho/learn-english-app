import NavigationBar from "./NavigationBar";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const TestPageComponent = () => {
  const navigate = useNavigate();
  const { wordsNum } = useParams();
  const [words, setWords] = useState([]);
  const [randomWords, setRandomWords] = useState([]);

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

  useEffect(() => {
    fetchWords();
  }, []);

  useEffect(() => {
    const getRandomWords = () => {
      const shuffledWords = [...words].sort(() => 0.5 - Math.random());
      const selectedWords = shuffledWords.slice(0, wordsNum);
      setRandomWords(selectedWords);
    };

    getRandomWords();
  }, [words, wordsNum]);

  return (
    <>
      <NavigationBar />
      <h1>Test Page</h1>
      <ul className="basic-list">
        {randomWords.map((word) => (
          <li key={word.id} className="list-item">
            <div>
              <span className="english-word">{word.english_word}</span>
              <span className="finnish-word">{word.finnish_word}</span>
            </div>
          </li>
        ))}
      </ul>
      <button onClick={() => handleButtonClick("/second-page")}>
        Submit Answers
      </button>
    </>
  );
};

export default TestPageComponent;
