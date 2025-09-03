import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSignOutAlt, FaUser, FaMoneyCheckAlt, FaClipboardList, FaChartLine, FaShoppingCart, FaBell, FaHeart, FaPlus } from "react-icons/fa";
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
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-4 left-4 right-4 z-50 glass-nav rounded-2xl mx-auto max-w-screen text-slate-900 dark:text-slate-100 transition-all duration-300"
      >
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <Link to="/u/home" className="flex items-center space-x-3 group floating">
              <div className="p-2 bg-white/20 dark:bg-black/20 rounded-xl backdrop-blur-sm">
                <img src='/printer.svg' alt="PrintEase Logo" className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:opacity-80 transition-opacity duration-300">
                PrintEase
              </h1>
            </Link>
            <div className="flex items-center space-x-3">
              <Link
                to="/u/notifications"
                className={`nav-link ${
                  isActive('/u/notifications') 
                    ? 'bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
                aria-label="Notifications"
              >
                <FaBell className="h-4 w-4" />
              </Link>
              
              <Link
                to="/u/profile"
                className={`nav-link ${
                  isActive('/u/profile') 
                    ? 'bg-slate-900/80 dark:bg-slate-100/80 text-white dark:text-slate-900' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <FaUser className="h-4 w-4" />
                <span>Profile</span>
              </Link>
              
              <Link
                to="/u/cart"
                className={`nav-link ${
                  isActive('/u/cart') 
                    ? 'bg-emerald-600/80 dark:bg-emerald-500/80 text-white' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <FaShoppingCart className="h-4 w-4" />
                <span>Cart</span>
              </Link>
              
              <ThemeToggle />
              
              <button
                onClick={handleLogout}
                className="nav-link text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50/80 dark:hover:bg-red-900/20"
              >
                <FaSignOutAlt className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </motion.header>
      
      {/* Navigation Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-[100px] left-4 right-4 z-40 glass-nav rounded-xl mx-auto max-w-4xl"
      >
        <div className="px-6 py-3">
          <nav className="flex items-center justify-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/u/home"
                className={`nav-link transition-all duration-300 ${
                  isActive('/u/home') 
                    ? 'bg-blue-100/80 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-b-2 border-blue-600 shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10'
                }`}
              >
                <FaClipboardList className="h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/u/vendors"
                className={`nav-link transition-all duration-300 ${
                  isActive('/u/vendors') 
                    ? 'bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-600 shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/50 dark:hover:bg-emerald-900/10'
                }`}
              >
                <FaPlus className="h-4 w-4" />
                <span>New Order</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/u/payments"
                className={`nav-link transition-all duration-300 ${
                  isActive('/u/payments') 
                    ? 'bg-purple-100/80 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-b-2 border-purple-600 shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50/50 dark:hover:bg-purple-900/10'
                }`}
              >
                <FaMoneyCheckAlt className="h-4 w-4" />
                <span>Payments</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/u/dashboard"
                className={`nav-link transition-all duration-300 ${
                  isActive('/u/dashboard') 
                    ? 'bg-indigo-100/80 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 border-b-2 border-indigo-600 shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-900/10'
                }`}
              >
                <FaChartLine className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/u/favourites"
                className={`nav-link transition-all duration-300 ${
                  isActive('/u/favourites') 
                    ? 'bg-rose-100/80 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 border-b-2 border-rose-600 shadow-sm' 
                    : 'text-rose-500 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 hover:bg-rose-50/50 dark:hover:bg-rose-900/10'
                }`}
              >
                <FaHeart className="h-4 w-4" />
                <span>Favorites</span>
              </Link>
            </motion.div>

          </nav>
        </div>
      </motion.div>
    </>
  );
}

export default UserHeader;
