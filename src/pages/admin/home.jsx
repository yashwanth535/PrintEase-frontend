import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Users, Store, FileText, TrendingUp, LogOut } from 'lucide-react';

const AdminHome = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [loading, setLoading] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");



  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/admin";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

 
  const stats = [
    { label: "Users", value: "1,234", icon: Users, color: "from-blue-500 to-blue-600" },
    { label: "Vendors", value: "456", icon: Store, color: "from-green-500 to-green-600" },
    { label: "Orders", value: "8,901", icon: FileText, color: "from-purple-500 to-purple-600" },
    { label: "Revenue", value: "₹45K", icon: TrendingUp, color: "from-orange-500 to-orange-600" },
  ];

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">PrintEase Admin</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400">Welcome</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center"
        >
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Admin Dashboard
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            Manage users, vendors, and orders from this dashboard
          </p>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminHome;