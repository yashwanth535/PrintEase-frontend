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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <UserHeader />
      <main className="flex-1 flex flex-col items-center justify-start pt-32 md:pt-36" style={{ minHeight: 'calc(100vh - 4rem)' }}>
        <div className="w-full max-w-7xl px-4 md:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">My Orders</h2>
            <button
              onClick={() => navigate("/u/order/create")}
              className="bg-blue-600 text-white px-6 py-2 rounded shadow hover:bg-blue-700 transition"
            >
              Create Order
            </button>
          </div>
          {/* Toggle Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              className={`px-4 py-2 rounded-t font-medium transition-colors duration-200 ${selectedTab === "active" ? "bg-white shadow text-blue-600" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
              onClick={() => setSelectedTab("active")}
            >
              Active
            </button>
            <button
              className={`px-4 py-2 rounded-t font-medium transition-colors duration-200 ${selectedTab === "completed" ? "bg-white shadow text-blue-600" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
              onClick={() => setSelectedTab("completed")}
            >
              Completed
            </button>
            <button
              className={`px-4 py-2 rounded-t font-medium transition-colors duration-200 ${selectedTab === "pending" ? "bg-white shadow text-blue-600" : "bg-gray-200 text-gray-600 hover:bg-gray-300"}`}
              onClick={() => setSelectedTab("pending")}
            >
              Pending
            </button>
          </div>
          {/* Orders List */}
          <div className="bg-white rounded-b-lg shadow p-6 min-h-[200px]">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)} Orders
            </h3>
            <ul className="space-y-2">
              {ordersToShow.length === 0 ? (
                <li className="text-gray-400">No {selectedTab} orders.</li>
              ) : (
                ordersToShow.map(order => (
                  <li key={order.id} className="border-b py-2 last:border-b-0">{order.name}</li>
                ))
              )}
            </ul>
            {/* Show More for Completed Orders */}
            {selectedTab === "completed" && !showAllCompleted && completedOrders.length > 10 && (
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowAllCompleted(true)}
                  className="text-blue-600 hover:underline text-sm"
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
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
