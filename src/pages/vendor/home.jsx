import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import VendorHeader from "../../components/vendor/header";

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
    <div className="min-h-screen bg-gray-50 dark:bg-black flex flex-col transition-colors duration-300">
      <VendorHeader />
      <main
        className="flex-1 flex flex-col items-center justify-start pt-32 md:pt-36"
        style={{ minHeight: "calc(100vh - 4rem)" }}
      >
        <div className="w-full max-w-7xl px-4 md:px-8">
          {/* Tabs */}
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
            {/* Optionally, vendor might want to navigate somewhere else */}
            <div className="flex gap-2">
              
              <button onClick={() => navigate("/v/profile")} className="btn-primary">
                Profile
              </button>
            </div>
          </div>

          {/* Orders List Card */}
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
                <button onClick={fetchOrders} className="btn-primary">
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
                    ordersToShow.map((order) => (
                      <li
                        key={order._id}
                        className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              {/* Complete button for active orders */}
                              {(order.status === "accepted" || order.status === "in_progress") && (
                                <button
                                  onClick={() => handleCompleteOrder(order._id)}
                                  disabled={updatingOrder === order._id}
                                  className="p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 disabled:opacity-50"
                                  title="Mark as Completed"
                                >
                                  {updatingOrder === order._id ? (
                                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                                  ) : (
                                    "Complete"
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900 dark:text-white">
                                Order #{order._id?.slice(-6)}
                              </h4>
                              <span
                                className={`px-2 py-1 text-xs rounded-full ${
                                  order.status === "completed"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : order.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                    : order.status === "accepted" || order.status === "in_progress"
                                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                                }`}
                              >
                                {order.status?.replace("_", " ").toUpperCase()}
                              </span>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              <p>Customer: {order.userId?.email || "Unknown"}</p>
                              <p>Pages: {order.pages} | Copies: {order.sets} | Size: {order.size}</p>
                              <p>Type: {order.color ? "Color" : "Black & White"} | Binding: {order.binding}</p>
                              <p>Total: ₹{order.totalPrice}</p>
                              <p className="text-xs text-gray-500">
                                Created: {new Date(order.createdAt).toLocaleDateString()}
                              </p>
                              {/* File Actions */}
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={() => window.open(order.fileUrl, '_blank')}
                                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:hover:bg-blue-800 rounded"
                                >
                                  Open
                                </button>
                                <button
                                  onClick={() => downloadFile(order.fileUrl, `order-${order._id.slice(-6)}.pdf`)}
                                  className="text-xs px-2 py-1 bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-300 dark:hover:bg-green-800 rounded"
                                >
                                  Download
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  )}
                </ul>

                {/* Show More for Completed Orders */}
                {selectedTab === "completed" &&
                  !showAllCompleted &&
                  orders.filter((order) => order.status === "completed").length > 10 && (
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
        </div>
      </main>
    </div>
  );
};

export default Home;
