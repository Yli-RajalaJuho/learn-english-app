import NavigationBar from "./NavigationBar";
import { useNavigate } from "react-router-dom";

const MainPageComponent = () => {
  const navigate = useNavigate();

  // Transition to different page
  const handleButtonClick = (path) => {
    navigate(path);
  };

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
