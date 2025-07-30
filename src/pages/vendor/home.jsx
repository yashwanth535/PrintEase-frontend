import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaMoneyBillWave, FaClipboardList, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import VendorHeader from '../../components/vendor/header';

const Home = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/orders`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

 
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      {/* Header */}
      <VendorHeader/>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="card p-6"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Order Management</h2>
          <div className="grid gap-6">
            {orders.map((order) => (
              <motion.div
                key={order.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="card p-6 relative overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <div className="relative z-10">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Order #{order.id}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{order.customerName}</p>
                    </div>
                    <span className={`px-4 py-2 text-sm font-medium ${
                      order.status === 'pending' ? 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400' :
                      order.status === 'processing' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400' :
                      order.status === 'completed' ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' :
                      'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Items</p>
                      <p className="font-medium text-gray-900 dark:text-white">{order.items}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                      <p className="font-medium text-gray-900 dark:text-white">₹{order.total}</p>
                    </div>
                  </div>
                  <div className="mt-6 flex gap-3">
                    <button className="btn-primary">
                      View Details
                    </button>
                    <button className="btn-secondary">
                      Update Status
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
