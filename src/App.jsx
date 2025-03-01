import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserHome from "./pages/user/home";
import VendorHome from "./pages/vendor/home";
import Error from "./pages/error";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/landing";
import About from "./pages/About";
import NotFound from "./pages/PageNotFound";

function App() {
  return (
    <Router>
       <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/error" element={<Error/>} />
        
        {/* Protected Route */}
        <Route element={<ProtectedRoute role="user"/>}>
          <Route path="/u/home" element={<UserHome />} />
        </Route>

        <Route element={<ProtectedRoute role="vendor"/>}>
          <Route path="/v/home" element={<VendorHome/>} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
