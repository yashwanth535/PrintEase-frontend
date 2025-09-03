import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardList, FaTrash, FaEye, FaShoppingCart, FaClock, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("active");
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [deletingOrder, setDeletingOrder] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/order`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      
      if (data.success) {
        setOrders(data.orders);
      } else {
        setError(data.message || "Failed to fetch orders");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Error fetching orders");
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on status
  const getFilteredOrders = () => {
    const filtered = orders.filter(order => {
      switch (selectedTab) {
        case "active":
          return order.status === "accepted" || order.status === "in_progress";
        case "completed":
          return order.status === "completed";
        case "pending":
          return order.status === "pending";
        default:
          return true;
      }
    });

    // For completed orders, limit display unless showAllCompleted is true
    if (selectedTab === "completed" && !showAllCompleted) {
      return filtered.slice(-10).reverse();
    }

    return filtered;
  };

  const ordersToShow = getFilteredOrders();

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to delete this order?')) {
      return;
    }

    try {
      setDeletingOrder(orderId);
      const response = await fetch(`${API_URL}/api/order/${orderId}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      
      if (data.success) {
        // Remove order from local state
        setOrders(orders.filter(order => order._id !== orderId));
      } else {
        alert("Failed to delete order: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order. Please try again.");
    } finally {
      setDeletingOrder(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <div className="max-w-7xl mt-4 mx-auto px-4 py-8 pt-40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="feature-card floating mb-8"
        >
          <div className="flex flex-wrap gap-3 justify-center">
            {[
              { key: "active", label: "Active Orders", icon: FaHourglassHalf, color: "from-blue-500 to-blue-600" },
              { key: "completed", label: "Completed", icon: FaCheckCircle, color: "from-green-500 to-green-600" },
              { key: "pending", label: "Pending", icon: FaClock, color: "from-orange-500 to-orange-600" }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedTab === tab.key;
              return (
                <motion.button
                  key={tab.key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    isActive
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-${tab.color}-500/25`
                      : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  {orders.filter(order => {
                    switch (tab.key) {
                      case "active": return order.status === "accepted" || order.status === "in_progress";
                      case "completed": return order.status === "completed";
                      case "pending": return order.status === "pending";
                      default: return false;
                    }
                  }).length > 0 && (
                    <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {orders.filter(order => {
                        switch (tab.key) {
                          case "active": return order.status === "accepted" || order.status === "in_progress";
                          case "completed": return order.status === "completed";
                          case "pending": return order.status === "pending";
                          default: return false;
                        }
                      }).length}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
        {/* Orders Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="feature-card floating min-h-[400px]"
        >
          <div className="flex items-center gap-3 mb-6">
            <FaClipboardList className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Orders
            </h2>
          </div>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">Loading your orders...</span>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">⚠️</div>
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">Oops! Something went wrong</h3>
              <p className="text-red-500 mb-6">{error}</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={fetchOrders}
                className="btn-primary"
              >
                Try Again
              </motion.button>
            </div>
          ) : (
            <>
              <AnimatePresence>
                {ordersToShow.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16"
                  >
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                      No {selectedTab} orders yet
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mb-6">
                      {selectedTab === 'pending' ? 'Start by creating your first order!' : 
                       selectedTab === 'active' ? 'No orders are currently in progress.' :
                       'You haven\'t completed any orders yet.'}
                    </p>
                    {selectedTab === 'pending' && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => navigate("/u/vendors")}
                        className="btn-primary"
                      >
                        Create Your First Order
                      </motion.button>
                    )}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {ordersToShow.map((order, index) => (
                      <motion.div
                        key={order._id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -2 }}
                        className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-6 hover:bg-white/80 dark:hover:bg-slate-700/80 transition-all duration-300 group"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-lg">
                              <FaClipboardList className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                Order #{order._id.slice(-6)}
                              </h4>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {order.vendorId?.shopName || 'Unknown Vendor'}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              order.status === 'completed' ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400' :
                              order.status === 'pending' ? 'bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 text-orange-700 dark:text-orange-400' :
                              order.status === 'accepted' || order.status === 'in_progress' ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400' :
                              'bg-gradient-to-r from-slate-100 to-gray-100 dark:from-slate-900/30 dark:to-gray-900/30 text-slate-700 dark:text-slate-400'
                            }`}>
                              {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                            
                            {order.status === 'pending' && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteOrder(order._id)}
                                disabled={deletingOrder === order._id}
                                className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 transition-all duration-300"
                                title="Delete Order"
                              >
                                {deletingOrder === order._id ? (
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FaTrash className="w-4 h-4" />
                                )}
                              </motion.button>
                            )}
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-lg p-3">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Pages</p>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{order.pages}</p>
                          </div>
                          <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-lg p-3">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Copies</p>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{order.sets}</p>
                          </div>
                          <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-lg p-3">
                            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-1">Type</p>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{order.color ? 'Color' : 'B&W'}</p>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3">
                            <p className="text-green-600 dark:text-green-400 text-xs font-medium mb-1">Total</p>
                            <p className="font-bold text-green-700 dark:text-green-400 text-lg">₹{order.totalPrice}</p>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Created: {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="flex items-center gap-2 px-3 py-2 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300 text-sm"
                            >
                              <FaEye className="w-3 h-3" />
                              View Details
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>
              
              {/* Show More for Completed Orders */}
              {selectedTab === "completed" && !showAllCompleted && orders.filter(order => order.status === "completed").length > 10 && (
                <div className="flex justify-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowAllCompleted(true)}
                    className="px-6 py-3 bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 rounded-xl transition-all duration-300 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 font-medium"
                  >
                    Show All Orders
                  </motion.button>
                </div>
              )}
            </>
          )}
        </motion.div>
        {/* Checkout button for Pending Orders */}
        {selectedTab === "pending" && ordersToShow.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex justify-center mt-8"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/u/cart")}
              className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/25 font-medium text-lg"
            >
              <FaShoppingCart className="w-5 h-5" />
              Proceed to Checkout ({ordersToShow.length} items)
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
