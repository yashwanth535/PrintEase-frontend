import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/header";
import { useState } from "react";

const Home = () => {
  const navigate = useNavigate();

  // Placeholder data
  const activeOrders = [
    { id: 1, name: "Order #1", status: "active" },
    { id: 2, name: "Order #2", status: "active" },
  ];
  const completedOrders = Array.from({ length: 20 }, (_, i) => ({ id: i + 1, name: `Order #${i + 1}`, status: "completed" }));
  const pendingOrders = [
    { id: 1, name: "Order #3", status: "pending" },
  ];

  const [selectedTab, setSelectedTab] = useState("active");
  const [showAllCompleted, setShowAllCompleted] = useState(false);

  let ordersToShow = [];
  if (selectedTab === "active") ordersToShow = activeOrders;
  if (selectedTab === "completed") ordersToShow = showAllCompleted ? completedOrders : completedOrders.slice(-10).reverse();
  if (selectedTab === "pending") ordersToShow = pendingOrders;

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
            <ul className="space-y-2">
              {ordersToShow.length === 0 ? (
                <li className="text-gray-400 dark:text-gray-500">No {selectedTab} orders.</li>
              ) : (
                ordersToShow.map(order => (
                  <li key={order.id} className="border-b border-gray-200 dark:border-gray-800 py-2 last:border-b-0 text-gray-900 dark:text-white">{order.name}</li>
                ))
              )}
            </ul>
            {/* Show More for Completed Orders */}
            {selectedTab === "completed" && !showAllCompleted && completedOrders.length > 10 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAllCompleted(true)}
                  className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 underline text-sm"
                >
                  Show More
                </button>
              </div>
            )}
          </div>
          {/* Checkout button for Pending Orders */}
          {selectedTab === "pending" && pendingOrders.length > 0 && (
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
