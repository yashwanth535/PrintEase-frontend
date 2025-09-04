/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaClipboardList, FaRupeeSign, FaCheckCircle, FaMoneyBillAlt, FaChartLine, FaArrowUp } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    paidOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/order`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const orders = data.orders;
        const totalOrders = orders.length;
        const paidOrders = orders.filter((o) => o.paymentStatus === "paid").length;
        const totalSpent = orders
          .filter((o) => o.paymentStatus === "paid")
          .reduce((sum, o) => sum + o.totalPrice, 0);
        const completedOrders = orders.filter((o) => o.status === "completed").length;

        setStats({ totalOrders, paidOrders, totalSpent, completedOrders });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value, color, gradient, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -5, scale: 1.02 }}
      className="feature-card floating group cursor-pointer relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">{label}</p>
          <p className={`text-2xl font-bold ${color} group-hover:scale-110 transition-transform duration-300`}>
            {value}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <FaArrowUp className={`w-3 h-3 ${color}`} />
        <span className="text-slate-500 dark:text-slate-400">View details</span>
      </div>
    </motion.div>
  );

  const statsData = [
    {
      icon: FaClipboardList,
      label: "Total Orders",
      value: stats.totalOrders,
      color: "text-blue-600 dark:text-blue-400",
      gradient: "from-blue-500 to-blue-600"
    },
    {
      icon: FaMoneyBillAlt,
      label: "Paid Orders",
      value: stats.paidOrders,
      color: "text-purple-600 dark:text-purple-400",
      gradient: "from-purple-500 to-purple-600"
    },
    {
      icon: FaCheckCircle,
      label: "Completed Orders",
      value: stats.completedOrders,
      color: "text-green-600 dark:text-green-400",
      gradient: "from-green-500 to-green-600"
    },
    {
      icon: FaRupeeSign,
      label: "Total Spent",
      value: `₹${stats.totalSpent.toLocaleString()}`,
      color: "text-emerald-600 dark:text-emerald-400",
      gradient: "from-emerald-500 to-emerald-600"
    }
  ];

  return (
    <div className="min-h-screen minimal-gradient dark:minimal-gradient transition-all duration-500">
      <div className="max-w-7xl mt-4 mx-auto px-4 py-8 pt-40">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-2">
            <FaChartLine className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
              Dashboard Overview
            </h1>
          </div>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Track your printing activity and spending insights
          </p>
        </motion.div>

        {/* Statistics Cards */}
        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="feature-card floating"
          >
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Loading your dashboard...</span>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsData.map((stat, index) => (
                <StatCard
                  key={stat.label}
                  icon={stat.icon}
                  label={stat.label}
                  value={stat.value}
                  color={stat.color}
                  gradient={stat.gradient}
                  index={index}
                />
              ))}
            </div>

            {/* Additional Insights */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="feature-card floating"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg">
                  <FaArrowUp className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Quick Insights
                </h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                    {stats.totalOrders > 0 ? Math.round((stats.completedOrders / stats.totalOrders) * 100) : 0}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Completion Rate</div>
                </div>
                
                <div className="text-center p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                    {stats.totalOrders > 0 ? Math.round((stats.paidOrders / stats.totalOrders) * 100) : 0}%
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Payment Rate</div>
                </div>
                
                <div className="text-center p-4 bg-white/40 dark:bg-slate-800/40 rounded-xl backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                    ₹{stats.paidOrders > 0 ? Math.round(stats.totalSpent / stats.paidOrders) : 0}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">Avg. Order Value</div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
