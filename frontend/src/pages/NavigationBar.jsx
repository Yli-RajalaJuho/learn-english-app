import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();

  // Transition to different page
  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="main-navbar">
      <button onClick={() => handleButtonClick("/")}>Home</button>
      <button onClick={() => handleButtonClick("/scoreboard-page")}>
        Scoreboard
      </button>
      <button onClick={() => handleButtonClick("/about")}>About</button>
      <button
        className="selected-button"
        onClick={() => handleButtonClick("/first-page")}
      >
        Start Learning
      </button>
    </nav>
  );
};

export default NavigationBar;
