import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";

/**
 * React component for the main page of the application.
 *
 * @component
 * @returns {JSX.Element} JSX element representing the MainPageComponent.
 */
const MainPageComponent = () => {
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
   * Renders the MainPageComponent.
   *
   * @returns {JSX.Element} JSX element.
   */
  return (
    <>
      <NavigationBar />
      <h1>Learn English</h1>
      <div className="selected-buttons">
        <button
          className="start-test"
          onClick={() => handleButtonClick("/first-page")}
        >
          Start Learning
        </button>
      </div>
    </>
  );
};

export default MainPageComponent;
