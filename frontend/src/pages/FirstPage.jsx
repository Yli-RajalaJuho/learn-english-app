import { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";

const FirstPageComponent = () => {
  const navigate = useNavigate();
  const [wordsNum, setWordsNum] = useState(5);
  const [lang, setLang] = useState("fin");
  const [words, setWords] = useState([]);

  const handleButtonClick = () => {
    navigate(`/test-page/${wordsNum}/${lang}`);
  };

  const handleInputChange = (event) => {
    const { value } = event.target;
    setWordsNum(value);
  };

  const handleLangFin = () => {
    setLang("fin");
  };

  const handleLangEng = () => {
    setLang("eng");
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

  return (
    <>
      <NavigationBar />
      <h1>First Page</h1>
      <div className="test-init-form">
        <label>
          Number of Words on the Test{" "}
          <input
            type="number"
            value={wordsNum}
            onChange={handleInputChange}
            min="1"
            max={words.length}
          />
        </label>
        <div className="test-lang">
          <p>See Words in Finnish or English</p>
          <button
            onClick={handleLangFin}
            className={lang === "fin" ? "selected-button" : ""}
          >
            FIN
          </button>
          <button
            onClick={handleLangEng}
            className={lang === "eng" ? "selected-button" : ""}
          >
            ENG
          </button>
        </div>

        <button className="start-test" onClick={handleButtonClick}>
          Start Test
        </button>
      </div>
    </>
  );
};

export default FirstPageComponent;
