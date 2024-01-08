import { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";

const FirstPageComponent = () => {
  const navigate = useNavigate();
  const [wordsNum, setWordsNum] = useState(5);
  const [lang, setLang] = useState("fin");
  const [words, setWords] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [possibleWordsCount, setPossibleWordsCount] = useState(5);

  const handleButtonClick = () => {
    let effectiveWordsNum = wordsNum;
    if (possibleWordsCount < wordsNum && possibleWordsCount !== "") {
      effectiveWordsNum = possibleWordsCount;
    }
    const tagsParam = selectedTags.length > 0 ? selectedTags.join(",") : "all";
    navigate(`/test-page/${effectiveWordsNum}/${lang}/${tagsParam}`);
  };

  useEffect(() => {
    // Update wordsNum if it's greater than possibleWordsCount
    if (wordsNum > possibleWordsCount && possibleWordsCount !== "") {
      setWordsNum(possibleWordsCount);
    }
  }, [possibleWordsCount]);

  const handleInputChange = (event) => {
    const { value } = event.target;

    if (!value.trim() || isNaN(value)) {
      // If the input is empty or not a number, set it to 1
      setWordsNum(1);
    } else {
      // Ensure positive integer and not less than 1
      const newValue = Math.max(1, Math.floor(Number(value)));
      setWordsNum(newValue);
    }
  };

  const handleLangFin = () => {
    setLang("fin");
  };

  const handleLangEng = () => {
    setLang("eng");
  };

  const toggleTag = (tag) => {
    setSelectedTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((selectedTag) => selectedTag !== tag)
        : [...prevTags, tag]
    );
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
    const uniqueTags = Array.from(
      new Set(
        words.flatMap((word) =>
          word.category_tags.split(",").map((tag) => tag.trim())
        )
      )
    );
    setTags(uniqueTags);
  };

  useEffect(() => {
    fetchWords();
  }, [selectedTags]);

  useEffect(() => {
    fetchTags();
  }, [words]);

  useEffect(() => {
    // Filter words based on selected tags and update the count
    const filteredWords = words.filter((word) => {
      const wordTags = word.category_tags.split(",").map((tag) => tag.trim());
      return selectedTags.some((tag) => wordTags.includes(tag));
    });

    if (selectedTags.length !== 0) {
      setPossibleWordsCount(filteredWords.length);
    } else {
      setPossibleWordsCount("");
    }
  }, [selectedTags, words]);

  return (
    <>
      <NavigationBar />
      <h1>First Page</h1>
      <div className="test-init-form">
        <p>Number of words with these tags :{possibleWordsCount}</p>
        <label className="test-words-number">
          Number of Words on the Test :
          <input
            type="number"
            value={wordsNum}
            onChange={handleInputChange}
            min="1"
            max={possibleWordsCount || words.length}
          />
        </label>
        <div className="select-tags">
          <p>What type of words should be on the test based on tags</p>
          <div className="selected-buttons">
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={selectedTags.includes(tag) ? "selected-button" : ""}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="test-lang">
          <p>See Words in Finnish or English</p>
          <div className="selected-buttons">
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
        </div>

        <button className="start-test" onClick={handleButtonClick}>
          Start Test
        </button>
      </div>
    </>
  );
};

export default FirstPageComponent;
