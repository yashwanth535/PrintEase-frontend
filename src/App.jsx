import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Auth from "./components/auth"; // Import Auth component
import Home from "./components/home"; // Import Home component
import Error from "./components/error";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
       <Routes>
        {/* Public Route */}
        <Route path="/" element={<Auth />} />
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
