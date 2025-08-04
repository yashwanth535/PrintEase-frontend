import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/header";
import { FaHeart, FaTrash } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Favourites = () => {
  const navigate = useNavigate();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavourites();
  }, []);

  const fetchFavourites = async () => {
    try {
      const res = await fetch(`${API_URL}/api/user/favourites`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setVendors(data.vendors);
      }
    } catch (err) {
      console.error("Error fetching favourites:", err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavourite = async (vendorId) => {
    try {
      await fetch(`${API_URL}/api/user/favourites/${vendorId}`, {
        method: "DELETE",
        credentials: "include",
      });
      setVendors((prev) => prev.filter((v) => v._id !== vendorId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <UserHeader />
      <main className="max-w-7xl mx-auto px-4 py-10 mt-32">
        <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-900 dark:text-white">
          <FaHeart /> Favourite Vendors
        </h1>
        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading favourites...</p>
        ) : vendors.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No favourites added.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor._id}
                className="border border-gray-200 dark:border-gray-800 rounded-lg p-4 bg-white dark:bg-gray-900 relative"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {vendor.shopName}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {vendor.location?.address || "No address"}
                </p>
                <button
                  onClick={() => removeFavourite(vendor._id)}
                  className="absolute top-3 right-3 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  title="Remove from favourites"
                >
                  <FaTrash />
                </button>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => navigate(`/u/vendor-profile/${vendor._id}`)}
                    className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => navigate(`/u/order/create/${vendor._id}`)}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    Create Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favourites;
