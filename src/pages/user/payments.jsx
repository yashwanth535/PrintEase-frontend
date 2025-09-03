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
    <div className="flex justify-between items-center py-2">
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" />}
        <span className="text-slate-600 dark:text-slate-400 text-sm">{label}</span>
      </div>
      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">{value}</span>
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedOrder(null)}
          >
            <motion.div 
              className="feature-card floating max-w-lg w-full p-8 relative"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </motion.button>
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/40 dark:to-emerald-800/40 rounded-xl">
                  <Receipt className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Order #{selectedOrder._id.slice(-6)}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <CheckCircle className="h-4 w-4 text-emerald-500" />
                    <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                      Payment Completed
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1 mb-6">
                <DetailRow 
                  label="Pages per copy:" 
                  value={selectedOrder.pages} 
                  icon={FileText}
                />
                <DetailRow 
                  label="Total copies:" 
                  value={selectedOrder.sets} 
                  icon={Package}
                />
                <DetailRow 
                  label="Print type:" 
                  value={selectedOrder.color ? "Color" : "Black & White"} 
                  icon={selectedOrder.color ? Palette : Printer}
                />
                <DetailRow 
                  label="Paper size:" 
                  value={selectedOrder.size} 
                  icon={FileText}
                />
                <DetailRow 
                  label="Binding:" 
                  value={selectedOrder.binding === "no" ? "None" : selectedOrder.binding} 
                  icon={Package}
                />
                <DetailRow 
                  label="Vendor:" 
                  value={selectedOrder?.vendorId?.shopName || "Unknown"} 
                  icon={Store}
                />
                <DetailRow 
                  label="Paid At:" 
                  value={selectedOrder.paidAt ? new Date(selectedOrder.paidAt).toLocaleString() : "-"} 
                  icon={Calendar}
                />
                {selectedOrder.notes && (
                  <DetailRow 
                    label="Notes:" 
                    value={selectedOrder.notes} 
                    icon={FileText}
                  />
                )}
              </div>
              
              <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-4 border border-emerald-200/50 dark:border-emerald-800/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    <span className="text-emerald-800 dark:text-emerald-200 font-semibold">
                      Total Amount Paid
                    </span>
                  </div>
                  <span className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                    ₹{selectedOrder.totalPrice}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Payments;
