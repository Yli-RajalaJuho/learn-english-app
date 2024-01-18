import { useNavigate } from "react-router-dom";

/**
 * React component for the navigation bar of the application.
 *
 * @component
 * @returns {JSX.Element} JSX element representing the NavigationBarComponent.
 */
const NavigationBar = () => {
  const navigate = useNavigate();

  /**
   * Handles navigation to a specified path.
   *
   * @param {string} path - The path to navigate to.
   * @returns {void}
   */
  const handleButtonClick = (path) => {
    navigate(path);
  };

  /**
   * Renders the NavigationBarComponent.
   *
   * @returns {JSX.Element} JSX element.
   */
  return (
    <nav className="main-navbar">
      <button onClick={() => handleButtonClick("/")}>Home</button>
      <button onClick={() => handleButtonClick("/inspect-words")}>Words</button>
      <button onClick={() => handleButtonClick("/scoreboard-page")}>
        Scoreboard
      </button>
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
