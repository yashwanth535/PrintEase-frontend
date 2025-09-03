import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Trash2, MapPin, Eye, Plus, Store, HeartOff } from "lucide-react";

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
              <div className="p-2 bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/40 dark:to-red-800/40 rounded-xl">
                <Heart className="h-8 w-8 text-red-600 dark:text-red-400 fill-current" />
              </div>
              Favourite Vendors
            </motion.h1>
            <motion.p 
              className="text-slate-600 dark:text-slate-400 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Your saved vendors for quick access and easy ordering.
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
                <Heart className="h-5 w-5 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Loading your favourite vendors...
            </p>
          </motion.div>
        ) : vendors.length === 0 ? (
          <motion.div 
            className="feature-card floating p-12 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <HeartOff className="h-10 w-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              No Favourites Yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-lg mb-4">
              You haven&apos;t added any vendors to your favourites.
            </p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mb-6">
              Browse vendors and click the heart icon to save them here for quick access.
            </p>
            <motion.button
              onClick={() => navigate('/u/home')}
              className="btn-primary inline-flex items-center gap-2 px-6 py-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Store className="h-4 w-4" />
              Browse Vendors
            </motion.button>
          </motion.div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {vendors.map((vendor, index) => (
              <motion.div
                key={vendor._id}
                className="feature-card floating p-6 relative group hover:scale-[1.02] transition-transform duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ y: -4 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-lg">
                      <Store className="h-5 w-5 text-slate-700 dark:text-slate-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                        {vendor.shopName}
                      </h3>
                      <div className="flex items-center gap-1 mt-1">
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <span className="text-sm text-red-600 dark:text-red-400 font-medium">
                          Favourite
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={() => removeFavourite(vendor._id)}
                    className="p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg"
                    title="Remove from favourites"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </motion.button>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      {vendor.location?.address || "No address provided"}
                    </p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <motion.button
                    onClick={() => navigate(`/u/vendor-profile/${vendor._id}`)}
                    className="btn-secondary flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye className="h-4 w-4" />
                    View Profile
                  </motion.button>
                  <motion.button
                    onClick={() => navigate(`/u/order/create/${vendor._id}`)}
                    className="btn-primary flex-1 inline-flex items-center justify-center gap-2 py-2 text-sm"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Plus className="h-4 w-4" />
                    Create Order
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Favourites;
