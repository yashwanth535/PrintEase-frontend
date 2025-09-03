import { useNavigate, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FaSignOutAlt, FaUser, FaMoneyBillWave, FaClipboardList, FaChartLine } from "react-icons/fa";
import ThemeToggle from '../ui/ThemeToggle';

const VendorHeader = () => {
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
            <Link to="/v/home" className="flex items-center space-x-3 group floating">
              <div className="p-2 bg-white/20 dark:bg-black/20 rounded-xl backdrop-blur-sm">
                <img src='/printer.svg' alt="PrintEase Logo" className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:opacity-80 transition-opacity duration-300">
                PrintEase
              </h1>
            </Link>
            <div className="flex items-center space-x-3">
              <button 
                onClick={() => navigate("/v/settlements")} 
                className="btn-primary text-sm"
              >
                Settlements
              </button>
              
              <Link to="/v/profile" className="text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 px-5 ">
                <FaUser className="h-4 w-4" />
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
        transition={{ delay: 0.1 }}
        className="fixed top-28 left-4 right-4 z-40 glass-nav rounded-xl mx-auto max-w-3xl"
      >
        <div className="px-6 py-3">
          <nav className="flex items-center justify-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/v/home"
                className={`nav-link transition-all duration-300 ${
                  isActive('/v/home') 
                    ? 'bg-orange-100/80 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-b-2 border-orange-600 shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-orange-600 dark:hover:text-orange-400 hover:bg-orange-50/50 dark:hover:bg-orange-900/10'
                }`}
              >
                <FaClipboardList className="h-4 w-4" />
                <span>Orders</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/v/payments"
                className={`nav-link transition-all duration-300 ${
                  isActive('/v/payments') 
                    ? 'bg-green-100/80 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-b-2 border-green-600 shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50/50 dark:hover:bg-green-900/10'
                }`}
              >
                <FaMoneyBillWave className="h-4 w-4" />
                <span>Payments</span>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                to="/v/dashboard"
                className={`nav-link transition-all duration-300 ${
                  isActive('/v/dashboard') 
                    ? 'bg-cyan-100/80 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 border-b-2 border-cyan-600 shadow-sm' 
                    : 'text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-50/50 dark:hover:bg-cyan-900/10'
                }`}
              >
                <FaChartLine className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </motion.div>
          </nav>
        </div>
      </motion.div>
    </>
  );
}

export default VendorHeader;
