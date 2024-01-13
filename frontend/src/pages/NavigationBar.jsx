import { useNavigate } from "react-router-dom";

const NavigationBar = () => {
  const navigate = useNavigate();

  // Transition to different page
  const handleButtonClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="main-navbar">
      <button onClick={() => handleButtonClick("/")}>Main Page</button>
      <button onClick={() => handleButtonClick("/about")}>About</button>
    </nav>
  );
};

export default NavigationBar;
