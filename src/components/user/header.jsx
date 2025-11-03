import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FaSignOutAlt, FaUser, FaMoneyCheckAlt, FaClipboardList, 
  FaChartLine, FaShoppingCart, FaBell, FaHeart, FaPlus 
} from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { AnimatedThemeToggler } from "../../pages/global/animated-theme";

const UserHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  const handleLogout = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error(`Logout failed: ${response.statusText}`);
      const data = await response.json();
      if (data.success) navigate("/");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <>
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-4 right-4 z-50 glass-nav rounded-2xl mx-auto max-w-screen text-slate-900 dark:text-slate-100 transition-all duration-300"
      >
        <div className="px-6 py-4 flex justify-between items-center">
          {/* Logo */}
          <Link to="/u/home" className="flex items-center space-x-3 group">
            <div className="p-2 bg-white/20 dark:bg-black/20 rounded-xl backdrop-blur-sm">
              <img
                src="/printer.svg"
                alt="PrintEase Logo"
                className="h-6 w-6 group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <h1 className="text-xl font-bold sm:block">PrintEase</h1>
          </Link>

          {/* Desktop icons */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/u/notifications"
              className={`nav-link ${
                isActive("/u/notifications")
                  ? "bg-amber-100/80 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
              aria-label="Notifications"
            >
              <FaBell className="h-4 w-4" />
            </Link>
            <Link
              to="/u/profile"
              className={`nav-link ${
                isActive("/u/profile")
                  ? "bg-slate-900/80 dark:bg-slate-100/80 text-white dark:text-slate-900"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <FaUser className="h-4 w-4" />
              <span>Profile</span>
            </Link>
            <Link
              to="/u/cart"
              className={`nav-link ${
                isActive("/u/cart")
                  ? "bg-emerald-600/80 dark:bg-emerald-500/80 text-white"
                  : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
              }`}
            >
              <FaShoppingCart className="h-4 w-4" />
              <span>Cart</span>
            </Link>
            <AnimatedThemeToggler />
            <button
              onClick={handleLogout}
              className="nav-link text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50/80 dark:hover:bg-red-900/20"
            >
              <FaSignOutAlt className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile header: cart + theme + menu */}
          <div className="flex md:hidden items-center space-x-3">
            <Link to="/u/cart" aria-label="Cart">
              <FaShoppingCart className="h-5 w-5 text-slate-700 dark:text-slate-200" />
            </Link>
            <AnimatedThemeToggler />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl hover:bg-white/20 dark:hover:bg-black/20 transition"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="md:hidden border-t border-white/20 dark:border-white/10 px-6 py-4 space-y-3"
          >
            <Link to="/u/notifications" className="nav-link block" onClick={() => setIsMenuOpen(false)}>
              <FaBell className="inline mr-2" /> Notifications
            </Link>
            <Link to="/u/profile" className="nav-link block" onClick={() => setIsMenuOpen(false)}>
              <FaUser className="inline mr-2" /> Profile
            </Link>
            <Link to="/u/favourites" className="nav-link block" onClick={() => setIsMenuOpen(false)}>
              <FaHeart className="inline mr-2" /> Favorites
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="nav-link text-red-600 dark:text-red-400 block"
            >
              <FaSignOutAlt className="inline mr-2" /> Logout
            </button>
          </motion.div>
        )}
      </motion.header>

      {/* Navigation Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-[80px] left-4 right-4 z-40 glass-nav rounded-xl mx-auto max-w-4xl"
      >
        <div className="px-6 py-3">
          <nav className="flex items-center justify-center gap-2">
            {[
              { path: "/u/home", icon: <FaClipboardList />, label: "My Orders", color: "blue" },
              { path: "/u/vendors", icon: <FaPlus />, label: "New Order", color: "emerald" },
              { path: "/u/payments", icon: <FaMoneyCheckAlt />, label: "Payments", color: "purple" },
              { path: "/u/dashboard", icon: <FaChartLine />, label: "Dashboard", color: "indigo" },
              { path: "/u/favourites", icon: <FaHeart />, label: "Favorites", color: "rose" },
            ].map((item) => (
              <motion.div key={item.path} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to={item.path}
                  className={`nav-link transition-all duration-300 ${
                    isActive(item.path)
                      ? `bg-${item.color}-100/80 dark:bg-${item.color}-900/30 text-${item.color}-700 dark:text-${item.color}-400 border-b-2 border-${item.color}-600 shadow-sm`
                      : `text-slate-700 dark:text-slate-300 hover:text-${item.color}-600 dark:hover:text-${item.color}-400 hover:bg-${item.color}-50/50 dark:hover:bg-${item.color}-900/10`
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {item.icon}
                    <span className="hidden md:inline text-xs mt-1">{item.label}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </nav>
        </div>
      </motion.div>
    </>
  );
};

export default UserHeader;
