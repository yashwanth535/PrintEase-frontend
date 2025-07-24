import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaMoneyCheckAlt, FaClipboardList, FaChartLine, FaShoppingCart, FaBell, FaHeart, FaHeadset } from "react-icons/fa";
import logo from '../../../public/printer.svg';

const UserHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const API_URL = import.meta.env.VITE_API_URL;
  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      console.log(response);
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }
  
      const data = await response.json();
      if (data.success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  // Determine which nav link is active
  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm shadow-sm fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Link to="/u/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-300">
                <img src={logo} alt="PrintEase Logo" className="h-8 w-8" />
                <h1 className="text-2xl font-bold text-gray-800">PrintEase</h1>
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/u/notifications"
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors duration-300 ${isActive('/u/notifications') ? 'bg-yellow-100 text-yellow-700 shadow' : 'text-gray-600 hover:text-yellow-700 hover:bg-yellow-50'}`}
                aria-label="Notifications"
              >
                <FaBell />
              </Link>
              <Link
                to="/u/support"
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors duration-300 ${isActive('/u/support') ? 'bg-blue-100 text-blue-700 shadow' : 'text-gray-600 hover:text-blue-700 hover:bg-blue-50'}`}
              >
                <FaHeadset />
                <span className="hidden sm:inline">Support</span>
              </Link>
              <Link
                to="/u/profile"
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors duration-300 ${isActive('/u/profile') ? 'bg-blue-600 text-white shadow' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <FaUser />
                <span>Profile</span>
              </Link>
              <Link
                to="/u/cart"
                className={`flex items-center gap-2 px-4 py-2 rounded transition-colors duration-300 ${isActive('/u/cart') ? 'bg-green-600 text-white shadow' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}
              >
                <FaShoppingCart />
                <span>Checkout</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors duration-300"
              >
                <FaSignOutAlt />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Navigation Bar */}
      <div className="bg-white/60 backdrop-blur-sm border-b border-black/5 fixed top-16 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8 py-4">
            <Link
              to="/u/home"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive('/u/home') ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-800 hover:border-gray-800'}`}
            >
              <FaClipboardList />
              <span>My Orders</span>
            </Link>
            <Link
              to="/u/payments"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive('/u/payments') ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-800 hover:border-gray-800'}`}
            >
              <FaMoneyCheckAlt />
              <span>Payments</span>
            </Link>
            <Link
              to="/u/dashboard"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive('/u/dashboard') ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-800 hover:border-gray-800'}`}
            >
              <FaChartLine />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/u/favourites"
              className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive('/u/favourites') ? 'text-gray-800 border-b-2 border-gray-800' : 'text-gray-500 hover:text-gray-800 hover:border-gray-800'}`}
            >
              <FaHeart />
              <span>Favorites</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
export default UserHeader;
