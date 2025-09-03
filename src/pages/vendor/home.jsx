import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Package, CheckCircle, Clock, AlertCircle, Eye, Download, User, Calendar, FileText, CreditCard } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTab, setSelectedTab] = useState("active");
  const [showAllCompleted, setShowAllCompleted] = useState(false);
  const [updatingOrder, setUpdatingOrder] = useState(null);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/vendor/orders`, {
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
    const filtered = orders.filter((order) => {
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

  const downloadFile = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Error downloading file:', error);
      alert('Failed to download file');
    }
  };



  const handleCompleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to mark this order as completed?")) {
      return;
    }

    try {
      setUpdatingOrder(orderId);
      const response = await fetch(`${API_URL}/api/order/update-status/${orderId}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      const data = await response.json();

      if (data.success) {
        // Update order status locally
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: "completed" } : order
          )
        );
      } else {
        alert("Failed to update order: " + data.message);
      }
    } catch (error) {
      console.error("Error updating order:", error);
      alert("Error updating order. Please try again.");
    } finally {
      setUpdatingOrder(null);
    }
  };

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl">
                <Package className="h-8 w-8 text-slate-700 dark:text-slate-300" />
              </div>
              Order Management
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Manage and track all your printing orders efficiently.
            </p>
          </motion.div>
          {/* Tabs and Actions */}
          <motion.div 
            className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="feature-card p-1 flex space-x-1">
              <button
                className={`px-4 py-2 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  selectedTab === "active"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
                onClick={() => setSelectedTab("active")}
              >
                <Clock className="h-4 w-4" />
                Active
              </button>
              <button
                className={`px-4 py-2 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  selectedTab === "completed"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
                onClick={() => setSelectedTab("completed")}
              >
                <CheckCircle className="h-4 w-4" />
                Completed
              </button>
              <button
                className={`px-4 py-2 font-medium rounded-lg transition-all duration-200 flex items-center gap-2 ${
                  selectedTab === "pending"
                    ? "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                }`}
                onClick={() => setSelectedTab("pending")}
              >
                <AlertCircle className="h-4 w-4" />
                Pending
              </button>
            </div>
            <div className="flex gap-3">
              <button onClick={() => navigate("/v/payments")} className="btn-secondary flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                Payments
              </button>
              <button onClick={() => navigate("/v/profile")} className="btn-primary flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </button>
            </div>
          </motion.div>

          {/* Orders List Card */}
          <motion.div 
            className="feature-card floating p-6 min-h-[400px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`p-2 rounded-xl ${
                selectedTab === "active" ? "bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800" :
                selectedTab === "completed" ? "bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800" :
                "bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900 dark:to-amber-800"
              }`}>
                {selectedTab === "active" && <Clock className="h-5 w-5 text-blue-700 dark:text-blue-300" />}
                {selectedTab === "completed" && <CheckCircle className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />}
                {selectedTab === "pending" && <AlertCircle className="h-5 w-5 text-amber-700 dark:text-amber-300" />}
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Orders
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-slate-200 dark:border-slate-700 border-t-slate-600 dark:border-t-slate-300 rounded-full mr-3"></div>
                <span className="text-slate-600 dark:text-slate-400">Loading orders...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mb-4">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
                <button onClick={fetchOrders} className="btn-primary">
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {ordersToShow.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                        <Package className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                        <p className="text-slate-500 dark:text-slate-400">No {selectedTab} orders found.</p>
                      </div>
                    </div>
                  ) : (
                    ordersToShow.map((order, index) => (
                      <motion.div
                        key={order._id}
                        className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-5 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                                  <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                                    Order #{order._id?.slice(-6)}
                                  </h4>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                                    <Calendar className="h-3 w-3" />
                                    {new Date(order.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {/* Complete button for active orders */}
                              {(order.status === "accepted" || order.status === "in_progress") && (
                                <button
                                  onClick={() => handleCompleteOrder(order._id)}
                                  disabled={updatingOrder === order._id}
                                  className="btn-primary text-sm px-3 py-1 disabled:opacity-50 flex items-center gap-1"
                                  title="Mark as Completed"
                                >
                                  {updatingOrder === order._id ? (
                                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    <>
                                      <CheckCircle className="h-3 w-3" />
                                      Complete
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="flex items-center justify-between mb-3">
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full backdrop-blur-sm ${
                                  order.status === "completed"
                                    ? "bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
                                    : order.status === "pending"
                                    ? "bg-amber-100/80 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                    : order.status === "accepted" || order.status === "in_progress"
                                    ? "bg-blue-100/80 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                                    : "bg-slate-100/80 text-slate-700 dark:bg-slate-900/50 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
                                }`}
                              >
                                {order.status?.replace("_", " ").toUpperCase()}
                              </span>
                              <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                                ₹{order.totalPrice}
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-slate-600 dark:text-slate-400 mb-4">
                              <div className="space-y-2">
                                <p className="flex items-center gap-2">
                                  <User className="h-3 w-3" />
                                  <span className="font-medium">Customer:</span> {order.userId?.email || "Unknown"}
                                </p>
                                <p><span className="font-medium">Pages:</span> {order.pages} | <span className="font-medium">Copies:</span> {order.sets}</p>
                                <p><span className="font-medium">Size:</span> {order.size}</p>
                              </div>
                              <div className="space-y-2">
                                <p><span className="font-medium">Type:</span> {order.color ? "Color" : "Black & White"}</p>
                                <p><span className="font-medium">Binding:</span> {order.binding}</p>
                              </div>
                            </div>
                            {/* File Actions */}
                            <div className="flex gap-2">
                              <button
                                onClick={() => window.open(order.fileUrl, '_blank')}
                                className="btn-secondary text-xs px-3 py-1 flex items-center gap-1"
                              >
                                <Eye className="h-3 w-3" />
                                View
                              </button>
                              <button
                                onClick={() => downloadFile(order.fileUrl, `order-${order._id.slice(-6)}.pdf`)}
                                className="btn-secondary text-xs px-3 py-1 flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>

                {/* Show More for Completed Orders */}
                {selectedTab === "completed" &&
                  !showAllCompleted &&
                  orders.filter((order) => order.status === "completed").length > 10 && (
                    <div className="flex justify-center mt-6">
                      <button
                        onClick={() => setShowAllCompleted(true)}
                        className="btn-secondary text-sm"
                      >
                        Show More Orders
                      </button>
                    </div>
                  )}
              </>
            )}
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default Home;
