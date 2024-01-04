import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPageComponent from "./pages/MainPage";
import FirstPageComponent from "./pages/FirstPage";
import SecondPageComponent from "./pages/SecondPage";
import TestPageComponent from "./pages/TestPage";
import InspectWordsPageComponent from "./pages/InspectWordsPage";
import AddWordsPageComponent from "./pages/AddWordsPage";
import PatchWordPageComponent from "./pages/PatchWordPage";
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
        <Route path="/add-words" element={<AddWordsPageComponent />} />
        <Route path="/patch-word/:id" element={<PatchWordPageComponent />} />
        <Route path="/" element={<MainPageComponent />} />
        <Route path="/first-page" element={<FirstPageComponent />} />
        <Route path="/second-page" element={<SecondPageComponent />} />
        <Route
          path="/test-page/:wordsNum/:lang"
          element={<TestPageComponent />}
        />
        <Route path="/inspect-words" element={<InspectWordsPageComponent />} />
        <Route path="/about" element={<AboutPageComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
