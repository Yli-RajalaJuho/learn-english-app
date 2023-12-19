import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPageComponent from "./pages/MainPage";
import FirstPageComponent from "./pages/FirstPage";
import SecondPageComponent from "./pages/SecondPage";
import AboutPageComponent from "./pages/AboutPage";

/*
import { Provider } from "react-redux";
import store from "./store";
<Provider store={store}></Provider>
*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPageComponent />} />
        <Route path="/first-page" element={<FirstPageComponent />} />
        <Route path="/second-page" element={<SecondPageComponent />} />
        <Route path="/about" element={<AboutPageComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
