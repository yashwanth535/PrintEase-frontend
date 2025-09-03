import { useState, useEffect } from "react";
import { FaFileAlt, FaCheckCircle, FaSpinner, FaTimesCircle } from "react-icons/fa";
import { motion } from "framer-motion";

const Dashboard = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [stats, setStats] = useState({
    totalOrders: 0,
    completedOrders: 0,
    pendingOrders: 0,
    totalEarnings: 0,
    monthlyEarnings: 0,
    averageOrderValue: 0,
    popularServices: [],
    recentOrders: []
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/dashboard`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'cancelled':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-600" />;
      case 'pending':
        return <FaSpinner className="text-yellow-600" />;
      case 'cancelled':
        return <FaTimesCircle className="text-red-600" />;
      default:
        return <FaFileAlt className="text-gray-600" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white/60 backdrop-blur-sm border border-black/5 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:bg-white/80 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              <div className="relative z-10">
                <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                <p className="mt-2 text-3xl font-bold text-gray-800">{stats.totalOrders}</p>
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Completed: {stats.completedOrders}</span>
                  <span className="text-sm text-gray-500">Pending: {stats.pendingOrders}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white/60 backdrop-blur-sm border border-black/5 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:bg-white/80 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              <div className="relative z-10">
                <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                <p className="mt-2 text-3xl font-bold text-gray-800">₹{stats.totalEarnings}</p>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">This Month: ₹{stats.monthlyEarnings}</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white/60 backdrop-blur-sm border border-black/5 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:bg-white/80 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              <div className="relative z-10">
                <h3 className="text-sm font-medium text-gray-500">Average Order Value</h3>
                <p className="mt-2 text-3xl font-bold text-gray-800">₹{stats.averageOrderValue}</p>
                <div className="mt-4">
                  <span className="text-sm text-gray-500">Per Order</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white/60 backdrop-blur-sm border border-black/5 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:bg-white/80 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              <div className="relative z-10">
                <h3 className="text-sm font-medium text-gray-500">Popular Services</h3>
                <div className="mt-2 space-y-2">
                  {stats.popularServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{service.name}</span>
                      <span className="text-sm font-medium text-gray-800">{service.count} orders</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Recent Orders */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white/60 backdrop-blur-sm border border-black/5 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:bg-white/80 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
            <div className="relative z-10">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Orders</h3>
              <div className="space-y-4">
                {stats.recentOrders.map((order, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                    <div className="flex items-center gap-4">
                      {getStatusIcon(order.status)}
                      <div>
                        <p className="text-sm font-medium text-gray-800">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.service}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="text-sm font-medium text-gray-800">₹{order.amount}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard; 