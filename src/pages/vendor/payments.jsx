/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, X, Calendar, User, FileText, Package, Eye, DollarSign, CheckCircle } from "lucide-react";

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
      const response = await fetch(`${API_URL}/api/vendor/orders`, {
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

  const DetailRow = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm p-2 bg-white/50 dark:bg-slate-800/50 rounded-lg">
      <span className="text-slate-600 dark:text-slate-400 font-medium">{label}:</span>
      <span className="font-semibold text-slate-900 dark:text-slate-100">{value}</span>
    </div>
  );

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
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl">
                <CreditCard className="h-8 w-8 text-emerald-700 dark:text-emerald-300" />
              </div>
              Payments Received
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Track all successful payments and completed transactions.
            </p>
          </motion.div>

          {/* Payments List */}
          <motion.div 
            className="feature-card floating p-6 min-h-[400px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900 dark:to-emerald-800 rounded-xl">
                <DollarSign className="h-5 w-5 text-emerald-700 dark:text-emerald-300" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Payment History
              </h3>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin h-8 w-8 border-4 border-slate-200 dark:border-slate-700 border-t-slate-600 dark:border-t-slate-300 rounded-full mr-3"></div>
                <span className="text-slate-600 dark:text-slate-400">Loading payments...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 mb-4">
                  <p className="text-red-600 dark:text-red-400">{error}</p>
                </div>
              </div>
            ) : paidOrders.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <CreditCard className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No payments found.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {paidOrders.map((order, index) => (
                  <motion.div
                    key={order._id}
                    className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 rounded-xl p-5 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-200 hover:shadow-lg hover:scale-[1.01]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg">
                            <FileText className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                              Order #{order._id.slice(-6)}
                            </h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Paid: {order.paidAt ? new Date(order.paidAt).toLocaleDateString() : "-"}
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between mb-3">
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 backdrop-blur-sm flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            PAID
                          </span>
                          <span className="text-lg font-bold text-slate-900 dark:text-slate-100">
                            ₹{order.totalPrice}
                          </span>
                        </div>
                        
                        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                          <p className="flex items-center gap-2">
                            <User className="h-3 w-3" />
                            <span className="font-medium">Customer:</span> {order?.userId?.email || "Unknown"}
                          </p>
                        </div>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="btn-secondary text-xs px-3 py-1 flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* Enhanced Modal */}
      {selectedOrder && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="feature-card max-w-lg w-full p-6 relative"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-xl">
                <Package className="h-6 w-6 text-slate-700 dark:text-slate-300" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  Order #{selectedOrder._id.slice(-6)}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">Payment Details</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <DetailRow label="Pages per copy" value={selectedOrder.pages} />
                <DetailRow label="Total copies" value={selectedOrder.sets} />
                <DetailRow label="Print type" value={selectedOrder.color ? "Color" : "Black & White"} />
                <DetailRow label="Paper size" value={selectedOrder.size} />
                <DetailRow label="Binding" value={selectedOrder.binding === "no" ? "None" : selectedOrder.binding} />
                <DetailRow label="Payment Status" value={<span className="text-emerald-600 dark:text-emerald-400 font-medium">PAID</span>} />
              </div>
              {selectedOrder.notes && (
                <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1 font-medium">Notes:</p>
                  <p className="text-sm text-slate-900 dark:text-slate-100">{selectedOrder.notes}</p>
                </div>
              )}
            </div>
            
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-slate-600 dark:text-slate-400">Total Amount:</span>
                <span className="text-2xl font-bold text-slate-900 dark:text-slate-100">₹{selectedOrder.totalPrice}</span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default Payments;
