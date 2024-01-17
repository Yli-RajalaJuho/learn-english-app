import { useState, useEffect } from "react";
import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";

const FirstPageComponent = () => {
  const navigate = useNavigate();
  const [wordsNum, setWordsNum] = useState(1);
  const [lang, setLang] = useState("fin");
  const [words, setWords] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [possibleWordsCount, setPossibleWordsCount] = useState(1);

  const [validWordsNum, setValidWordsNum] = useState(true);

  const handleButtonClick = () => {
    if (validWordsNum === true) {
      const tagsParam =
        selectedTags.length > 0 ? selectedTags.join(",") : "all";
      navigate(`/test-page/${wordsNum}/${lang}/${tagsParam}`);
    }
  };

  const handleTransition = (path) => {
    navigate(path);
  };

  const handleUnselectAll = () => {
    setSelectedTags([]);
  };

  useEffect(() => {
    if (wordsNum > possibleWordsCount || wordsNum <= 0) {
      setValidWordsNum(false);
    } else {
      setValidWordsNum(true);
    }
  }, [wordsNum]);

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
      setWordsNum(filteredWords.length);
    } else {
      setPossibleWordsCount(words.length);
    }
  }, [selectedTags, words]);

  return (
    <>
      <NavigationBar />
      <h1>Test Setup</h1>
      {validWordsNum === false ? (
        <p className="error-msg">
          Please set the number of words on the test to higher than 0 and{" "}
          {possibleWordsCount} at max!
        </p>
      ) : null}
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

        <div className="center">
          <button className="start-test" onClick={handleButtonClick}>
            Start
          </button>
          <button onClick={() => handleTransition("/")}>back</button>
        </div>
      </div>
    </>
  );
};

export default FirstPageComponent;
