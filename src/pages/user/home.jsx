import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/header";
import { useState, useEffect } from "react";

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
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col transition-colors duration-300">
      <UserHeader />
      <main className="flex-1 flex flex-col items-center justify-start pt-32 md:pt-36" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="w-full max-w-7xl px-4 md:px-8">
          <div className="flex justify-between items-center mb-8">
            <div className="flex space-x-4 mt-2">
              <button
                className={`px-4 py-2 font-medium transition-colors duration-200 ${
                  selectedTab === "active" 
                    ? "bg-white dark:bg-black text-black dark:text-white shadow border-b-2 border-black dark:border-white" 
                    : "bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800"
                }`}
                onClick={() => setSelectedTab("active")}
              >
                Active
              </button>
              <button
                className={`px-4 py-2 font-medium transition-colors duration-200 ${
                  selectedTab === "completed" 
                    ? "bg-white dark:bg-black text-black dark:text-white shadow border-b-2 border-black dark:border-white" 
                    : "bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800"
                }`}
                onClick={() => setSelectedTab("completed")}
              >
                Completed
              </button>
              <button
                className={`px-4 py-2 font-medium transition-colors duration-200 ${
                  selectedTab === "pending" 
                    ? "bg-white dark:bg-black text-black dark:text-white shadow border-b-2 border-black dark:border-white" 
                    : "bg-gray-200 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-300 dark:hover:bg-gray-800"
                }`}
                onClick={() => setSelectedTab("pending")}
              >
                Pending
              </button>
            </div>
            <button
              onClick={() => navigate("/u/vendors")}
              className="btn-primary"
            >
              New Order
            </button>
          </div>
          <div className="card p-6 min-h-[200px]">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Orders
            </h3>
            
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin h-8 w-8 border-b-2 border-black dark:border-white mr-3"></div>
                <span className="text-gray-600 dark:text-gray-400">Loading orders...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={fetchOrders}
                  className="btn-primary"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <ul className="space-y-3">
                  {ordersToShow.length === 0 ? (
                    <li className="text-gray-400 dark:text-gray-500 text-center py-8">
                      No {selectedTab} orders found.
                    </li>
                  ) : (
                    ordersToShow.map(order => (
                      <li key={order._id} className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              
                              {/* Delete button for pending orders */}
                              {order.status === 'pending' && (
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
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                Order #{order._id.slice(-6)}
                              </h4>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                order.status === 'completed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                                order.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                order.status === 'accepted' || order.status === 'in_progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}>
                                {order.status.replace('_', ' ').toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              <p>Vendor: {order.vendorId?.shopName || 'Unknown Vendor'}</p>
                              <p>Pages: {order.pages} | Copies: {order.sets} | Size: {order.size}</p>
                              <p>Type: {order.color ? 'Color' : 'Black & White'} | Binding: {order.binding}</p>
                              <p>Total: ₹{order.totalPrice}</p>
                              <p className="text-xs text-gray-500">
                                Created: {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>
                
                {/* Show More for Completed Orders */}
                {selectedTab === "completed" && !showAllCompleted && orders.filter(order => order.status === "completed").length > 10 && (
                  <div className="flex justify-center mt-4">
                    <button
                      onClick={() => setShowAllCompleted(true)}
                      className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 underline text-sm"
                    >
                      Show More
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
          {/* Checkout button for Pending Orders */}
          {selectedTab === "pending" && ordersToShow.length > 0 && (
            <div className="flex justify-end mt-4">
              <button
                onClick={() => navigate("/u/cart")}
                className="btn-success"
              >
                Checkout
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;
