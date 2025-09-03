/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { FaReceipt, FaTimes } from "react-icons/fa";

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
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-600 dark:text-gray-400">{label}</span>
      <span className="font-semibold text-gray-900 dark:text-white">{value}</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <main className="max-w-7xl mx-auto px-4 py-10 mt-32">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
          <FaReceipt /> Payments Received
        </h1>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading payments...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : paidOrders.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No payments found.</p>
        ) : (
          <div className="space-y-4">
            {paidOrders.map((order) => (
              <div
                key={order._id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Order #{order._id.slice(-6)}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Paid At: {order.paidAt ? new Date(order.paidAt).toLocaleString() : "-"}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Customer: {order?.userId?.email || "Unknown"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-green-600 dark:text-green-400">PAID</span>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="btn-secondary text-xs px-3 py-1"
                    >
                      View Order
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Overlay Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Order Details #{selectedOrder._id.slice(-6)}
            </h2>
            <div className="space-y-2 mb-4">
              <DetailRow label="Pages per copy:" value={selectedOrder.pages} />
              <DetailRow label="Total copies:" value={selectedOrder.sets} />
              <DetailRow label="Print type:" value={selectedOrder.color ? "Color" : "Black & White"} />
              <DetailRow label="Paper size:" value={selectedOrder.size} />
              <DetailRow label="Binding:" value={selectedOrder.binding === "no" ? "None" : selectedOrder.binding} />
              {selectedOrder.notes && <DetailRow label="Notes:" value={selectedOrder.notes} />}
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <DetailRow label="Total Cost:" value={`₹${selectedOrder.totalPrice}`} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
