import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClipboardList, FaTrash, FaShoppingCart, FaClock, FaCheckCircle, FaHourglassHalf } from "react-icons/fa";
import { Receipt, X, Eye, Calendar, Store, FileText, CreditCard, CheckCircle, Package, Printer, Palette } from "lucide-react";
import toast from "react-hot-toast";

import { useDispatch, useSelector } from "react-redux";
import { fetchOrders, deleteOrder, setSelectedOrder, clearSelectedOrder } from "../../store/slices/orderSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /** Redux state */
  const {
    pendingOrders,
    activeOrders,
    completedOrders,
    selectedOrder,
    loading,
    error,
    deletingOrder
  } = useSelector((state) => state.orders);

  /** Local UI state only */
  const [selectedTab, setSelectedTab] = useState("active");
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  /** Fetch orders on mount */
  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  /** DetailRow Component */
  const DetailRow = ({ label, value, icon: Icon }) => (
    <div className="flex justify-between items-center py-3 px-4 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-800/30 dark:to-slate-700/30 rounded-xl backdrop-blur-sm border border-slate-200/30 dark:border-slate-600/30">
      <div className="flex items-center gap-3">
        {Icon && (
          <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg">
            <Icon className="h-4 w-4 text-slate-600 dark:text-slate-400" />
          </div>
        )}
        <span className="text-slate-600 dark:text-slate-400 font-medium">{label}</span>
      </div>
      <span className="font-semibold text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );

  /** Dataset selection */
  let ordersToShow = [];
  if (selectedTab === "active") ordersToShow = activeOrders;
  if (selectedTab === "pending") ordersToShow = pendingOrders;
  if (selectedTab === "completed") {
    ordersToShow = showAllCompleted
      ? completedOrders
      : [...completedOrders].slice(-10).reverse();
  }

  /** Delete handler using Redux */
  const handleDeleteOrderRedux = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    dispatch(deleteOrder(orderId))
      .unwrap()
      .catch((err) => toast.error("Failed to delete: " + err));
  };

  return (
    <div className="min-h-screen minimal-gradient dark:minimal-gradient transition-all duration-500">

      <div id="orders-section" className="max-w-7xl mt-36 mx-auto px-4 py-8">

        {/* Tabs */}
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

              const count =
                tab.key === "active" ? activeOrders.length :
                tab.key === "pending" ? pendingOrders.length :
                completedOrders.length;

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

                  {count > 0 && (
                    <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
                      isActive 
                        ? 'bg-white/20 text-white' 
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {count}
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

          {/* Loading */}
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
                onClick={() => dispatch(fetchOrders())}
                className="btn-primary"
              >
                Try Again
              </motion.button>
            </div>
          ) : (

            <>
              <AnimatePresence>
                {/* No orders */}
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

                    {selectedTab === "pending" && (
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
                                {order.vendorId?.shopName || "Unknown Vendor"}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {/* Status */}
                            <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                              order.status === 'completed' 
                                ? 'bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-400'
                                : order.status === 'pending'
                                ? 'bg-gradient-to-r from-orange-100 to-yellow-100 dark:from-orange-900/30 dark:to-yellow-900/30 text-orange-700 dark:text-orange-400'
                                : 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400'
                            }`}>
                              {order.status.replace("_", " ").toUpperCase()}
                            </span>

                            {order.status === "pending" && (
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => handleDeleteOrderRedux(order._id)}
                                disabled={deletingOrder === order._id}
                                className="p-2 rounded-full bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 transition-all duration-300"
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

                        {/* Order Info Grid */}
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
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{order.color ? "Color" : "B&W"}</p>
                          </div>

                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-3">
                            <p className="text-green-600 dark:text-green-400 text-xs font-medium mb-1">Total</p>
                            <p className="font-bold text-green-700 dark:text-green-400 text-lg">₹{order.totalPrice}</p>
                          </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Created: {new Date(order.createdAt).toLocaleDateString()}
                          </p>

                          <motion.button
                            onClick={() => dispatch(setSelectedOrder(order))}
                            className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </motion.button>
                        </div>

                      </motion.div>
                    ))}
                  </div>

                )}
              </AnimatePresence>
            </>

          )}
        </motion.div>

        {/* Checkout button */}
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

      {/* Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={() => dispatch(clearSelectedOrder())}
          >
            <motion.div 
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-2xl shadow-2xl max-w-md w-full p-0 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >

              {/* Modal Header */}
              <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 p-5 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-sm"></div>

                <motion.button
                  onClick={() => dispatch(clearSelectedOrder())}
                  className="absolute top-3 right-3 p-1.5 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-4 h-4 text-white" />
                </motion.button>

                <div className="flex items-center gap-3 relative z-10">
                  <motion.div 
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  >
                    <Receipt className="h-6 w-6 text-white" />
                  </motion.div>
                  <div>
                    <motion.h2 
                      className="text-2xl font-bold text-white mb-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Order #{selectedOrder._id.slice(-6)}
                    </motion.h2>
                    <motion.div 
                      className="flex items-center gap-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <CheckCircle className="h-4 w-4 text-white" />
                      <span className="text-white/90 text-sm font-semibold">
                        Payment Completed
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-5">

                {/* Grid */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div 
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-3 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Pages per copy</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedOrder.pages}</span>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-3 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
                        <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Total copies</span>
                    </div>
                    <span className="text-xl font-bold text-slate-900 dark:text-slate-100">{selectedOrder.sets}</span>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-3 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-orange-100 dark:bg-orange-900/40 rounded-lg">
                        {selectedOrder.color ? (
                          <Palette className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        ) : (
                          <Printer className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                        )}
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Print type</span>
                    </div>
                    <span className="text-base font-semibold text-slate-900 dark:text-slate-100">
                      {selectedOrder.color ? "Color" : "Black & White"}
                    </span>
                  </motion.div>

                  <motion.div 
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-3 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 bg-green-100 dark:bg-green-900/40 rounded-lg">
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Paper size</span>
                    </div>
                    <span className="text-base font-semibold text-slate-900 dark:text-slate-100">{selectedOrder.size}</span>
                  </motion.div>
                </motion.div>

                {/* Extra Details */}
                <motion.div 
                  className="space-y-3 mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <DetailRow label="Binding" value={selectedOrder.binding === "no" ? "None" : selectedOrder.binding} icon={Package} />
                  <DetailRow label="Vendor" value={selectedOrder?.vendorId?.shopName || "Unknown"} icon={Store} />
                  <DetailRow label="Paid At" value={selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString() : "-"} icon={Calendar} />

                  {selectedOrder.notes && (
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl p-3 border border-slate-200/50 dark:border-slate-600/50">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400 text-xs font-medium">Notes</span>
                      </div>
                      <p className="text-slate-900 dark:text-slate-100 text-sm">{selectedOrder.notes}</p>
                    </div>
                  )}
                </motion.div>

                {/* Total */}
                <motion.div 
                  className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-xl p-4 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", damping: 20 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-sm"></div>

                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-2">
                      <motion.div 
                        className="p-2 bg-white/20 backdrop-blur-sm rounded-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CreditCard className="h-5 w-5 text-white" />
                      </motion.div>
                      <div>
                        <span className="text-white/80 text-xs font-medium block">Total Amount Paid</span>
                        <span className="text-white text-sm font-semibold">Transaction Completed</span>
                      </div>
                    </div>

                    <motion.span 
                      className="text-3xl font-bold text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8, type: "spring", damping: 15 }}
                    >
                      ₹{selectedOrder.totalPrice}
                    </motion.span>
                  </div>
                </motion.div>

              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default Home;
