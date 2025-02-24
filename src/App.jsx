import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/auth"; // Import Auth component
import Home from "./components/home"; // Import Home component

function App() {
  return (
    <Router>
      <Routes>
        {/* Default route ("/") shows Auth */}
        <Route path="/" element={<Auth />} />
        {/* "/home" route shows Home component */}
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
