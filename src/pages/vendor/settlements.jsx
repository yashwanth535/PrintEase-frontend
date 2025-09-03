import { useState, useEffect } from "react";
import { FaUniversity, FaTimes } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Settlements = () => {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSettlement, setSelectedSettlement] = useState(null);

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/vendor/settlements`, {
        method: "GET",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();
      if (data.success) {
        setSettlements(data.settlements || []);
      } else {
        setError(data.message || "Failed to fetch settlements");
      }
    } catch (err) {
      console.error("Error fetching settlements:", err);
      setError("Error fetching settlements");
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
          <FaUniversity /> Bank Settlements
        </h1>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading settlements...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : settlements.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No settlements found.</p>
        ) : (
          <div className="space-y-4">
            {settlements.map((st) => (
              <div
                key={st._id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900"
              >
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      Settlement #{st._id.slice(-6)}
                    </h3>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                      Date: {new Date(st.settledAt).toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Bank Ref: {st.bankReference || "-"}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm text-green-600 dark:text-green-400">₹{st.amount}</span>
                    <button
                      onClick={() => setSelectedSettlement(st)}
                      className="btn-secondary text-xs px-3 py-1"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Overlay Modal */}
      {selectedSettlement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setSelectedSettlement(null)}
              className="absolute top-3 right-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white"
            >
              <FaTimes className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
              Settlement #{selectedSettlement._id.slice(-6)}
            </h2>
            <div className="space-y-2 mb-4">
              <DetailRow label="Amount:" value={`₹${selectedSettlement.amount}`} />
              <DetailRow label="Settled At:" value={new Date(selectedSettlement.settledAt).toLocaleString()} />
              <DetailRow label="Bank Reference:" value={selectedSettlement.bankReference || "-"} />
              <DetailRow label="Status:" value={selectedSettlement.status} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settlements;
