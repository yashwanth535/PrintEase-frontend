/* eslint-disable no-unused-vars */
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect, useState } from 'react';
import UserHome from "./pages/user/home";
import VendorHome from "./pages/vendor/home";
import VendorProfile from "./pages/vendor/profile";
import VendorPayments from "./pages/vendor/payments";
import VendorSettlements from "./pages/vendor/settlements";
import VendorDashboard from "./pages/vendor/dashboard";
import Error from "./pages/global/ui/unAuth";
import ProtectedRoute from "./components/global/ProtectedRoute";
import LandingPage from "./pages/global/landing";
import About from "./pages/global/About";
import NotFound from "./pages/global/ui/PageNotFound";
import { Toaster } from "react-hot-toast";
import BackendCheck from './pages/global/ui/BackendCheck';
import VendorMap from "./pages/vendor/vendorMap";
import Cart from "./pages/user/cart";
import Payments from "./pages/user/payments";
import UserProfile from "./pages/user/profile";
import UserDashboard from "./pages/user/dashboard";
import Favourites from "./pages/user/favourites";
import Notifications from "./pages/user/notifications";
import Checkout from "./pages/user/checkout";
import PaymentSuccess from "./pages/user/paymentSuccess";
import CreateOrder from "./pages/user/createOrder";
import VendorList from "./pages/user/vendorList";
import Dev from "./pages/global/dev";
import VendorProfileForUser from "./pages/user/vendorProfile";
import { ThemeProvider } from "./contexts/ThemeContext";
import UserHeader from "./components/user/header";
import VendorHeader from "./components/vendor/header";

function App() {
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [userAddress, setUserAddress] = useState('Fetching address...');

  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY; // Replace with your actual API key

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          console.log("User location:", position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLocationError(error.message);
          console.error("Error getting user location:", error);
        }
      );
    } else {
      setLocationError("Geolocation is not supported by your browser.");
      console.error("Geolocation is not supported by your browser.");
    }
  }, []);

  useEffect(() => {
    const fetchAddress = async () => {
      if (userLocation && GOOGLE_MAPS_API_KEY !== "YOUR_GOOGLE_MAPS_API_KEY") {
        try {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${userLocation.latitude},${userLocation.longitude}&key=${GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          if (data.results && data.results.length > 0) {
            setUserAddress(data.results[0].formatted_address);
          } else {
            setUserAddress('Address not found');
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          setUserAddress('Error fetching address');
        }
      }
    };
    fetchAddress();
  }, [userLocation, GOOGLE_MAPS_API_KEY]);

  useEffect(() => {
    const sendLocationToBackend = async () => {
      if (userLocation) {
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/vendors/nearest`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              userLat: userLocation.latitude,
              userLng: userLocation.longitude,
            }),
          });

          const data = await response.json();
          if (data.success) {
            console.log("Nearest vendors:", data.vendors);
            // You can now use this data to display nearest vendors
          } else {
            console.error("Error from backend:", data.message);
          }
        } catch (error) {
          console.error("Error sending location to backend:", error);
        }
      }
    };
    sendLocationToBackend();
  }, [userLocation]);

  return (
    <ThemeProvider>
      <Router>
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            className: 'dark:bg-gray-800 dark:text-white dark:border-gray-700',
          }}
        />
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/backend" element={<BackendCheck/>} />
          <Route path="/about" element={<About />} />
          <Route path="/error" element={<Error/>} />
          <Route path = "/u/dev" element={<Dev user={true}/>}/> 
          <Route path = "/v/dev" element={<Dev user={false}/>} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute role="user"/>}>
            <Route path="/u/*" element={
              <div>
                <UserHeader />
                <Routes>
                  <Route path="home" element={<UserHome />} />
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="payment-success" element={<PaymentSuccess />} />
                  <Route path="payments" element={<Payments />} />
                  <Route path="dashboard" element={<UserDashboard />} />
                  <Route path="favourites" element={<Favourites />} />
                  <Route path="notifications" element={<Notifications />} />
                  <Route path="vendors" element={<VendorList />} />
                  <Route path="order/create/:vendorId" element={<CreateOrder />} />
                  <Route path="vendor-profile/:vendorId" element={<VendorProfileForUser/>} />
                  <Route path="profile" element={<UserProfile/>}/>
                </Routes>
              </div>
            } />
          </Route>

          {/* Protected Vendor Routes */}
          <Route element={<ProtectedRoute role="vendor" />}>
            <Route
              path="/v/*"
              element={
                <div>
                  <VendorHeader />
                  <Routes>
                    <Route path="home" element={<VendorHome />} />
                    <Route path="profile" element={<VendorProfile />} />
                    <Route path="payments" element={<VendorPayments />} />
                    <Route path="settlements" element={<VendorSettlements />} />
                    <Route path="dashboard" element={<VendorDashboard />} />
                    <Route path="map" element={<VendorMap />} />
                  </Routes>
                </div>
              }
            />
          </Route>


          <Route path="*" element={<NotFound />} />

        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
