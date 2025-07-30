import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/header";
import { useState, useEffect } from "react";

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
        alert("Failed to delete order: " + data.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("Error deleting order. Please try again.");
    } finally {
      setDeletingOrder(null);
    }
  };

  const handleCheckout = () => {
    if (selectedOrders.size === 0) {
      alert("Please select at least one order to checkout!");
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
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <UserHeader />
      <main className="pt-32 md:pt-36 px-4 pb-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Shopping Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Review your pending orders before checkout
              </p>
            </div>
            <button 
              onClick={() => navigate('/u/home')} 
              className="btn-secondary flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </button>
          </div>

          {loading ? (
            <div className="card p-8">
              <div className="flex items-center justify-center">
                <div className="animate-spin h-8 w-8 border-b-2 border-black dark:border-white mr-3"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading your cart...</span>
              </div>
            </div>
          ) : error ? (
            <div className="card p-8">
              <div className="text-center">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={fetchOrders}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : orders.length === 0 ? (
            <div className="card p-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Your cart is empty
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  No pending orders found. Create a new order to get started.
                </p>
                <button 
                  onClick={() => navigate('/u/vendors')}
                  className="btn-primary"
                >
                  Browse Vendors
                </button>
              </div>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Orders List */}
              <div className="lg:col-span-2">
                                 <div className="card p-6">
                   <div className="flex justify-between items-center mb-6">
                     <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                       Pending Orders ({orders.length})
                     </h2>
                     {orders.length > 0 && (
                       <button
                         onClick={handleSelectAll}
                         className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                       >
                         {selectedOrders.size === orders.length ? 'Deselect All' : 'Select All'}
                       </button>
                     )}
                   </div>
                  
                  <div className="space-y-6">
                                                              {orders.map((order, index) => (
                       <div key={order._id} className={`border border-gray-200 dark:border-gray-800 rounded-lg p-6 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors ${
                         selectedOrders.has(order._id) ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                       }`}>
                         <div className="flex justify-between items-start mb-4">
                           <div className="flex items-center space-x-3">
                             {/* Selection Checkbox */}
                             <input
                               type="checkbox"
                               checked={selectedOrders.has(order._id)}
                               onChange={() => handleOrderSelection(order._id)}
                               className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                             />
                             <div className="w-10 h-10 bg-black dark:bg-white text-white dark:text-black rounded-full flex items-center justify-center font-semibold">
                               {index + 1}
                             </div>
                            <div>
                              <h3 className="font-semibold text-gray-900 dark:text-white">
                                Order #{order._id.slice(-6)}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                {order.vendorId?.shopName || 'Unknown Vendor'}
                              </p>
                            </div>
                          </div>
                                                     <div className="flex items-center space-x-2">
                             <span className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 text-xs rounded-full font-medium">
                               PENDING
                             </span>
                             <button
                               onClick={() => handleDeleteOrder(order._id)}
                               disabled={deletingOrder === order._id}
                               className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50"
                               title="Delete Order"
                             >
                               {deletingOrder === order._id ? (
                                 <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                               ) : (
                                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                 </svg>
                               )}
                             </button>
                           </div>
                        </div>

                        {/* Order Details */}
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Pages:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{order.pages}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Copies:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{order.sets}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Paper Size:</span>
                              <span className="font-medium text-gray-900 dark:text-white">{order.size}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Print Type:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {order.color ? 'Color' : 'Black & White'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Binding:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {order.binding === 'none' ? 'None' : order.binding}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 dark:text-gray-400">Created:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                {new Date(order.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Pricing Breakdown */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Pricing Breakdown</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">Base Price:</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                ₹{(order.totalPrice / 1.18).toFixed(2)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600 dark:text-gray-400">GST (18%):</span>
                              <span className="font-medium text-gray-900 dark:text-white">
                                ₹{((order.totalPrice / 1.18) * 0.18).toFixed(2)}
                              </span>
                            </div>
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between font-semibold">
                              <span className="text-gray-900 dark:text-white">Total:</span>
                              <span className="text-black dark:text-white">₹{order.totalPrice}</span>
                            </div>
                          </div>
                        </div>

                        {/* Notes */}
                        {order.notes && (
                          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              <strong>Notes:</strong> {order.notes}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="card p-6 sticky top-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Order Summary
                  </h2>
                  
                                     <div className="space-y-4">
                     <div className="flex justify-between text-sm">
                       <span className="text-gray-600 dark:text-gray-400">Selected Items:</span>
                       <span className="font-medium text-gray-900 dark:text-white">{selectedOrders.size} of {orders.length}</span>
                     </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                      <span className="font-medium text-gray-900 dark:text-white">₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">GST (18%):</span>
                      <span className="font-medium text-gray-900 dark:text-white">₹{calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg font-bold">
                      <span className="text-gray-900 dark:text-white">Total:</span>
                      <span className="text-black dark:text-white">₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>

                                     <button
                     onClick={handleCheckout}
                     className="w-full btn-primary mt-6 py-3 text-lg font-semibold"
                     disabled={selectedOrders.size === 0}
                   >
                    <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Proceed to Checkout
                  </button>

                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                    By proceeding, you agree to our terms and conditions
                  </div>
                </div>
              </div>
        </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Cart; 