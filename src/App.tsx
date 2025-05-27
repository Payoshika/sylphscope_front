import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Components from "./pages/components";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/components" element={<Components />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
