import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, ArrowLeft, Package, Trash2, CreditCard, FileText, Copy, Calendar, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";


const API_URL = import.meta.env.VITE_API_URL;

const Cart = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
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
        // Filter only pending orders
        const pendingOrders = data.orders.filter(order => order.status === "pending");
        setOrders(pendingOrders);
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

  const calculateSubtotal = () => {
    return orders
      .filter(order => selectedOrders.has(order._id))
      .reduce((total, order) => total + order.totalPrice, 0);
  };

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    return subtotal * 0.18; // 18% GST
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleOrderSelection = (orderId) => {
    const newSelected = new Set(selectedOrders);
    if (newSelected.has(orderId)) {
      newSelected.delete(orderId);
    } else {
      newSelected.add(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedOrders.size === orders.length) {
      setSelectedOrders(new Set());
    } else {
      setSelectedOrders(new Set(orders.map(order => order._id)));
    }
  };

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
        // Remove from selected orders
        const newSelected = new Set(selectedOrders);
        newSelected.delete(orderId);
        setSelectedOrders(newSelected);
      } else {
        toast.error("Failed to delete order: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error("Error deleting order. Please try again.");
    } finally {
      setDeletingOrder(null);
    }
  };

  const handleCheckout = () => {
    if (selectedOrders.size === 0) {
      toast.error("Please select at least one order to checkout!");
      return;
    }
    
    // Navigate to checkout with selected orders
    const selectedOrderIds = Array.from(selectedOrders);
    const selectedOrderData = orders.filter(order => selectedOrderIds.includes(order._id));
    const totalAmount = selectedOrderData.reduce((sum, order) => sum + order.totalPrice, 0);
    
    navigate('/u/checkout', {
      state: {
        selectedOrders: selectedOrderIds,
        totalAmount: totalAmount
      }
    });
  };

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-7xl mx-auto px-4 py-8 pt-24 mt-20">
        <motion.div
          className="space-y-6"
        >
          <div className="feature-card floating p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <ShoppingCart size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Shopping Cart
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Review your pending orders before checkout
                  </p>
                </div>
              </div>
              <button 
                onClick={() => navigate('/u/home')} 
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Home
              </button>
            </div>
          </div>

          {loading ? (
            <motion.div
              className="feature-card floating p-8"
            >
              <div className="flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
                <span className="text-slate-600 dark:text-slate-400">Loading your cart...</span>
              </div>
            </motion.div>
          ) : error ? (
            <motion.div
              className="feature-card floating p-8"
            >
              <div className="text-center">
                <div className="p-3 bg-gradient-to-r from-red-500 to-pink-600 rounded-xl text-white w-fit mx-auto mb-4">
                  <AlertCircle size={24} />
                </div>
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={fetchOrders}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            </motion.div>
          ) : orders.length === 0 ? (
            <motion.div
              className="feature-card floating p-8"
            >
              <div className="text-center">
                <div className="p-4 bg-gradient-to-r from-slate-500 to-slate-600 rounded-xl text-white w-fit mx-auto mb-4">
                  <ShoppingCart size={32} />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Your cart is empty
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  No pending orders found. Create a new order to get started.
                </p>
                <button 
                  onClick={() => navigate('/u/vendors')}
                  className="btn-primary"
                >
                  Browse Vendors
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              className="grid lg:grid-cols-3 gap-8"
            >
              {/* Orders List */}
              <div className="lg:col-span-2">
                <div className="feature-card floating p-6">
                   <div className="flex items-center justify-between mb-6">
                     <div className="flex items-center gap-3">
                       <div className="p-2 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-lg text-white">
                         <Package size={20} />
                       </div>
                       <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                         Pending Orders ({orders.length})
                       </h2>
                     </div>
                     {orders.length > 0 && (
                       <button
                         onClick={handleSelectAll}
                         className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
                       >
                         {selectedOrders.size === orders.length ? 'Deselect All' : 'Select All'}
                       </button>
                     )}
                   </div>
                  
                  <div className="space-y-4">
                    {orders.map((order, index) => (
                       <motion.div 
                         key={order._id} 
                         className={`feature-card p-6 transition-all duration-200 ${
                         selectedOrders.has(order._id) ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'hover:shadow-lg'
                       }`}>
                         <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center gap-4">
                             {/* Selection Checkbox */}
                             <input
                               type="checkbox"
                               checked={selectedOrders.has(order._id)}
                               onChange={() => handleOrderSelection(order._id)}
                               className="w-5 h-5 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                             />
                             <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 dark:from-slate-300 dark:to-slate-400 text-white dark:text-slate-900 rounded-full flex items-center justify-center font-bold text-sm">
                               {index + 1}
                             </div>
                            <div>
                              <h3 className="font-bold text-slate-900 dark:text-slate-100">
                                Order #{order._id.slice(-6)}
                              </h3>
                              <p className="text-sm text-slate-600 dark:text-slate-400">
                                {order.vendorId?.shopName || 'Unknown Vendor'}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                             <span className="px-3 py-1 bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 text-xs rounded-full font-medium">
                               PENDING
                             </span>
                             <button
                               onClick={() => handleDeleteOrder(order._id)}
                               disabled={deletingOrder === order._id}
                               className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                               title="Delete Order"
                             >
                               {deletingOrder === order._id ? (
                                 <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                               ) : (
                                 <Trash2 size={16} />
                               )}
                             </button>
                           </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <FileText size={14} />
                                Pages:
                              </span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">{order.pages}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <Copy size={14} />
                                Copies:
                              </span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">{order.sets}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">Paper Size:</span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">{order.size}</span>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">Print Type:</span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {order.color ? 'Color' : 'Black & White'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400">Binding:</span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {order.binding === 'none' ? 'None' : order.binding}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-600 dark:text-slate-400 flex items-center gap-1">
                                <Calendar size={14} />
                                Created:
                              </span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-lg p-4 border border-slate-200/50 dark:border-slate-700/50">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">Pricing Breakdown</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">Base Price:</span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                ₹{(order.totalPrice / 1.18).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-600 dark:text-slate-400">GST (18%):</span>
                              <span className="font-medium text-slate-900 dark:text-slate-100">
                                ₹{((order.totalPrice / 1.18) * 0.18).toFixed(2)}
                              </span>
                            </div>
                            <div className="border-t border-slate-200 dark:border-slate-700 pt-2 flex justify-between font-semibold">
                              <span className="text-slate-900 dark:text-slate-100">Total:</span>
                              <span className="text-slate-900 dark:text-slate-100">₹{order.totalPrice}</span>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                          <div className="mt-4 p-3 bg-blue-50/50 dark:bg-blue-900/20 rounded-lg border border-blue-200/50 dark:border-blue-800/50">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              <strong>Notes:</strong> {order.notes}
                            </p>
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="feature-card floating p-6 sticky top-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white">
                      <CreditCard size={20} />
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                      Order Summary
                    </h2>
                  </div>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between text-sm">
                       <span className="text-slate-600 dark:text-slate-400">Selected Items:</span>
                       <span className="font-medium text-slate-900 dark:text-slate-100">{selectedOrders.size} of {orders.length}</span>
                     </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-600 dark:text-slate-400">GST (18%):</span>
                      <span className="font-medium text-slate-900 dark:text-slate-100">₹{calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between text-lg font-bold">
                      <span className="text-slate-900 dark:text-slate-100">Total:</span>
                      <span className="text-slate-900 dark:text-slate-100">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                     onClick={handleCheckout}
                     className="w-full btn-primary mt-6 py-3 text-lg font-semibold flex items-center justify-center gap-2"
                     disabled={selectedOrders.size === 0}
                   >
                    <CreditCard size={20} />
                    Proceed to Checkout
                  </button>

                  <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center">
                    By proceeding, you agree to our terms and conditions
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Cart; 