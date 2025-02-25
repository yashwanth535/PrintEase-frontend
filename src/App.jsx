import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/auth"; // Import Auth component
import Home from "./pages/home"; // Import Home component
import Error from "./pages/error";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/landing";
import About from "./pages/About";

function App() {
  return (
    <Router>
       <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/error" element={<Error/>} />
        
        {/* Protected Route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
