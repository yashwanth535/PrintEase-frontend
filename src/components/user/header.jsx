import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaMoneyCheckAlt, FaClipboardList, FaChartLine, FaShoppingCart, FaBell, FaHeart, FaHeadset, FaPlus } from "react-icons/fa";
import logo from '../../assets/printer.svg';
import ThemeToggle from '../ui/ThemeToggle';

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
      <header className="bg-white/95 dark:bg-black/95 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Link to="/u/home" className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 group">
                <div className="relative">
                  <img src={logo} alt="PrintEase Logo" className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  PrintEase
                </h1>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/u/notifications"
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive('/u/notifications') 
                    ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/10'
                }`}
                aria-label="Notifications"
              >
                <FaBell className="w-4 h-4" />
              </Link>
              <Link
                to="/u/support"
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive('/u/support') 
                    ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                }`}
              >
                <FaHeadset className="w-4 h-4" />
                <span className="hidden sm:inline">Support</span>
              </Link>
              <Link
                to="/u/profile"
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive('/u/profile') 
                    ? 'bg-black dark:bg-white text-white dark:text-black shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                <FaUser className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <Link
                to="/u/cart"
                className={`flex items-center gap-2 px-3 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 ${
                  isActive('/u/cart') 
                    ? 'bg-green-600 dark:bg-green-500 text-white shadow-sm' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                <FaShoppingCart className="w-4 h-4" />
                <span>Checkout</span>
              </Link>
              <ThemeToggle className="ml-2" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 hover:scale-105"
              >
                <FaSignOutAlt className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>
      {/* Navigation Bar */}
      <div className="bg-white/90 dark:bg-black/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 fixed top-16 left-0 right-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-3">
            <Link
              to="/u/home"
              className={`nav-link ${
                isActive('/u/home') 
                  ? 'nav-link-active border-b-2 border-black dark:border-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FaClipboardList className="w-4 h-4" />
              <span>My Orders</span>
            </Link>
            <Link
              to="/u/vendors"
              className={`nav-link ${
                isActive('/u/vendors') 
                  ? 'nav-link-active border-b-2 border-black dark:border-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FaPlus className="w-4 h-4" />
              <span>New Order</span>
            </Link>
            <Link
              to="/u/payments"
              className={`nav-link ${
                isActive('/u/payments') 
                  ? 'nav-link-active border-b-2 border-black dark:border-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FaMoneyCheckAlt className="w-4 h-4" />
              <span>Payments</span>
            </Link>
            <Link
              to="/u/dashboard"
              className={`nav-link ${
                isActive('/u/dashboard') 
                  ? 'nav-link-active border-b-2 border-black dark:border-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FaChartLine className="w-4 h-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/u/favourites"
              className={`nav-link ${
                isActive('/u/favourites') 
                  ? 'nav-link-active border-b-2 border-black dark:border-white' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <FaHeart className="w-4 h-4" />
              <span>Favorites</span>
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}

export default UserHeader;
