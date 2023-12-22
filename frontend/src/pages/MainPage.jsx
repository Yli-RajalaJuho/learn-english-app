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
      <h1>Main Page</h1>
      <button onClick={() => handleButtonClick("/inspect-words")}>
        Inspect Words View
      </button>
    </>
  );
};

export default MainPageComponent;
