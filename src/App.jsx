import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserHome from "./pages/user/home";
import VendorHome from "./pages/vendor/home";
import VendorProfile from "./pages/vendor/profile";
import VendorPayments from "./pages/vendor/payments";
import VendorDashboard from "./pages/vendor/dashboard";
import Error from "./pages/global/ui/unAuth";
import ProtectedRoute from "./components/global/ProtectedRoute";
import LandingPage from "./pages/global/landing";
import About from "./pages/global/About";
import NotFound from "./pages/global/ui/PageNotFound";
import PdfUpload from "./components/user/PdfUpload";
import { Toaster } from "react-hot-toast";
import CashfreeCheckout from "./pages/chashFree";
import BackendCheck from './pages/global/ui/BackendCheck';
import VendorMap from "./pages/vendor/vendorMap";
import Cart from "./pages/user/cart";
import CreateOrder from "./pages/user/createOrder";
import Dev from "./pages/global/dev";

function App() {
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        {/* Public Route */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/backend" element={<BackendCheck/>} />
        <Route path="/about" element={<About />} />
        <Route path="/error" element={<Error/>} />
        <Route path="/checkout" element ={<CashfreeCheckout/>} />   
        <Route path = "/u/dev" element={<Dev user={true}/>}/> 
        <Route path = "/v/dev" element={<Dev user={false}/>} />

        {/* Protected Route */}
        <Route element={<ProtectedRoute role="user"/>}>
          <Route path="/u/home" element={<UserHome />} />
          <Route path="/u/upload" element={<PdfUpload />} />
          <Route path="/u/cart" element={<Cart />} />
          <Route path="/u/order/create" element={<CreateOrder />} />
        </Route>

        <Route element={<ProtectedRoute role="vendor"/>}>
          <Route path="/v/home" element={<VendorHome/>} />
          <Route path="/v/profile" element={<VendorProfile/>} />
          <Route path="/v/payments" element={<VendorPayments/>} />
          <Route path="/v/dashboard" element={<VendorDashboard/>} />
          <Route path="/v/map" element={<VendorMap/>} />
        </Route>

        <Route path="*" element={<NotFound />} />

      </Routes>
    </Router>
  );
}

export default App;
