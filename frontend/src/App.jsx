import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainPageComponent from "./pages/MainPage";
import FirstPageComponent from "./pages/FirstPage";
import ResultsPageComponent from "./pages/ResultsPage";
import TestPageComponent from "./pages/TestPage";
import ScoreboardPageComponent from "./pages/ScoreboardPage";
import InspectWordsPageComponent from "./pages/InspectWordsPage";
import AddWordsPageComponent from "./pages/AddWordsPage";
import PatchWordPageComponent from "./pages/PatchWordPage";

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
        <Route path="/results-page" element={<ResultsPageComponent />} />
        <Route path="/scoreboard-page" element={<ScoreboardPageComponent />} />
        <Route
          path="/test-page/:wordsNum/:lang/:tags"
          element={<TestPageComponent />}
        />
        <Route path="/inspect-words" element={<InspectWordsPageComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
