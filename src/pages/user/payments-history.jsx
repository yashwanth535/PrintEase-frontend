/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Receipt, X, Eye, Calendar, Store, FileText, CreditCard, CheckCircle, Package, Printer, Palette } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const Payments = () => {
  const [paidOrders, setPaidOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchPaidOrders();
  }, []);

  const fetchPaidOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/order`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        const paid = data.orders.filter((o) => o.paymentStatus === "paid");
        setPaidOrders(paid);
      } else {
        setError(data.message || "Failed to fetch payments");
      }
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Error fetching payments");
    } finally {
      setLoading(false);
    }
  };

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

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-7xl mx-auto px-4 py-10 mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-8">
            <motion.h1 
              className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl">
                <Receipt className="h-8 w-8 text-slate-700 dark:text-slate-300" />
              </div>
              Payments History
            </motion.h1>
            <motion.p 
              className="text-slate-600 dark:text-slate-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              View and manage your payment history and order receipts.
            </motion.p>
          </div>
        </motion.div>

        {loading ? (
          <motion.div 
            className="feature-card floating p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative mb-6">
              <div className="animate-spin h-12 w-12 border-4 border-slate-200 dark:border-slate-700 border-t-slate-600 dark:border-t-slate-400 rounded-full mx-auto"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <CreditCard className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Loading your payments...
            </p>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="feature-card floating p-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-red-600 dark:text-red-400 text-lg font-semibold mb-2">Error Loading Payments</p>
            <p className="text-slate-600 dark:text-slate-400">{error}</p>
          </motion.div>
        ) : paidOrders.length === 0 ? (
          <motion.div 
            className="feature-card floating p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Receipt className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              No Payments Yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
              You haven&apos;t made any payments yet.
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm">
              Your completed payments will appear here once you place and pay for orders.
            </p>
          </motion.div>
        ) : (
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {paidOrders.map((order, index) => (
              <motion.div
                key={order._id}
                className="feature-card floating p-6 hover:scale-[1.01] transition-transform duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded-lg">
                        <Package className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                          Order #{order._id.slice(-6)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30 px-2 py-1 rounded-full">
                            PAID
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                          Paid: {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : "-"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Store className="h-4 w-4 text-slate-500" />
                        <span className="text-slate-600 dark:text-slate-400">
                          {order?.vendorId?.shopName || "Unknown Vendor"}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        ₹{order.totalPrice}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-3">
                    <motion.button
                      onClick={() => setSelectedOrder(order)}
                      className="btn-primary inline-flex items-center gap-2 px-4 py-2 text-sm"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>

      {/* Enhanced Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 rounded-3xl shadow-2xl max-w-2xl w-full p-0 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header with Gradient */}
              <div className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 p-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-sm"></div>
                <motion.button
                  onClick={() => setSelectedOrder(null)}
                  className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full transition-all duration-200 backdrop-blur-sm"
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-white" />
                </motion.button>
                
                <div className="flex items-center gap-4 relative z-10">
                  <motion.div 
                    className="p-4 bg-white/20 backdrop-blur-sm rounded-2xl"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 0.2, type: "spring", damping: 15 }}
                  >
                    <Receipt className="h-8 w-8 text-white" />
                  </motion.div>
                  <div>
                    <motion.h2 
                      className="text-3xl font-bold text-white mb-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      Order #{selectedOrder._id.slice(-6)}
                    </motion.h2>
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <CheckCircle className="h-5 w-5 text-white" />
                      <span className="text-white/90 font-semibold">
                        Payment Completed
                      </span>
                    </motion.div>
                  </div>
                </div>
              </div>
              
              {/* Modal Body */}
              <div className="p-8">
                {/* Order Details Grid */}
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div 
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-4 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-xl">
                        <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Pages per copy</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedOrder.pages}</span>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-4 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/40 rounded-xl">
                        <Package className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Total copies</span>
                    </div>
                    <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedOrder.sets}</span>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-4 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 rounded-xl">
                        {selectedOrder.color ? <Palette className="h-4 w-4 text-orange-600 dark:text-orange-400" /> : <Printer className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Print type</span>
                    </div>
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedOrder.color ? "Color" : "Black & White"}</span>
                  </motion.div>
                  
                  <motion.div 
                    className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-4 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ type: "spring", damping: 20 }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 rounded-xl">
                        <FileText className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Paper size</span>
                    </div>
                    <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">{selectedOrder.size}</span>
                  </motion.div>
                </motion.div>
                
                {/* Additional Details */}
                <motion.div 
                  className="space-y-4 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <DetailRow 
                    label="Binding" 
                    value={selectedOrder.binding === "no" ? "None" : selectedOrder.binding} 
                    icon={Package}
                  />
                  <DetailRow 
                    label="Vendor" 
                    value={selectedOrder?.vendorId?.shopName || "Unknown"} 
                    icon={Store}
                  />
                  <DetailRow 
                    label="Paid At" 
                    value={selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString() : "-"} 
                    icon={Calendar}
                  />
                  {selectedOrder.notes && (
                    <div className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-600/50">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                        <span className="text-slate-600 dark:text-slate-400 text-sm font-medium">Notes</span>
                      </div>
                      <p className="text-slate-900 dark:text-slate-100">{selectedOrder.notes}</p>
                    </div>
                  )}
                </motion.div>
                {/* Total Amount Section */}
                <motion.div 
                  className="bg-gradient-to-r from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-6 relative overflow-hidden"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.7, type: "spring", damping: 20 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-emerald-500/20 to-teal-500/20 backdrop-blur-sm"></div>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <motion.div 
                        className="p-3 bg-white/20 backdrop-blur-sm rounded-xl"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <CreditCard className="h-6 w-6 text-white" />
                      </motion.div>
                      <div>
                        <span className="text-white/80 text-sm font-medium block">
                          Total Amount Paid
                        </span>
                        <span className="text-white font-semibold">
                          Transaction Completed
                        </span>
                      </div>
                    </div>
                    <motion.span 
                      className="text-4xl font-bold text-white"
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

export default Payments;
