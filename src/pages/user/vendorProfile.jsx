import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Store, MapPin, Clock, DollarSign, Settings, CheckCircle, XCircle, ShoppingCart } from "lucide-react";

const VendorProfile = () => {
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const { vendorId } = useParams();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(`${API_URL}/api/vendors/${vendorId}`,{
            method: "GET",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
        });
        const data = await response.json();
        setVendor(data.vendor);
        console.log(data.vendor); 
      } catch (error) {
        console.error("Error fetching vendor profile:", error);
      }
    };
    getProfile();
  }, [vendorId]);

  if (!vendor) {
    return (
      <div className="min-h-screen minimal-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-6xl mx-auto px-4 py-8 pt-24 mt-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-6"
        >
          {/* Header Section */}
          <div className="feature-card floating p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <Store size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {vendor.shopName || "Vendor Profile"}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    View vendor details and create orders
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {vendor.isVerified ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                    <CheckCircle size={16} />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
                    <XCircle size={16} />
                    Unverified
                  </div>
                )}
                <button
                  onClick={() => navigate(`/u/order/create/${vendor._id}`)}
                  className="btn-primary flex items-center gap-2"
                >
                  <ShoppingCart size={16} />
                  Create Order
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            {/* Top Section - Basic Info & Location */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Basic Information */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Store className="text-slate-600 dark:text-slate-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Shop Information</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Shop Name</p>
                    <p className="text-slate-800 dark:text-slate-200">{vendor.shopName || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</p>
                    <p className="text-slate-800 dark:text-slate-200">{vendor.email || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Contact Number</p>
                    <p className="text-slate-800 dark:text-slate-200">{vendor.contactNumber || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Member Since</p>
                    <p className="text-slate-800 dark:text-slate-200">
                      {vendor.createdAt ? new Date(vendor.createdAt).toLocaleDateString() : "-"}
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Location Details */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <MapPin className="text-slate-600 dark:text-slate-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Location Details</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Address</p>
                    <p className="text-slate-800 dark:text-slate-200">{vendor.location?.address || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pincode</p>
                    <p className="text-slate-800 dark:text-slate-200">{vendor.location?.pincode || "-"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Coordinates</p>
                    <p className="text-slate-800 dark:text-slate-200">
                      {vendor.location?.lat && vendor.location?.lng 
                        ? `${vendor.location.lat}, ${vendor.location.lng}` 
                        : "-"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Pricing Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Color Printing */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="text-blue-500" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Color Printing</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(vendor.prices?.color || {}).map(([size, price]) => (
                    <div key={size} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{size}</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">₹{price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Black & White Printing */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <DollarSign className="text-slate-500" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Black & White</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(vendor.prices?.black_white || {}).map(([size, price]) => (
                    <div key={size} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">{size}</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">₹{price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Binding Services */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="text-purple-500" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Binding Services</h3>
                </div>
                <div className="space-y-3">
                  {Object.entries(vendor.prices?.binding || {}).map(([type, price]) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400 capitalize">{type}</span>
                      <span className="text-slate-800 dark:text-slate-200 font-semibold">₹{price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Bottom Section - Services & Hours */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Services Offered */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Settings className="text-slate-600 dark:text-slate-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Services Offered</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className={`w-3 h-3 rounded-full ${vendor.services?.colorPrinting ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Color Printing</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className={`w-3 h-3 rounded-full ${vendor.services?.blackWhitePrinting ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Black & White Printing</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <div className={`w-3 h-3 rounded-full ${vendor.services?.binding ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Binding Services</span>
                  </div>
                </div>
              </motion.div>

              {/* Operating Hours */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <Clock className="text-slate-600 dark:text-slate-400" size={20} />
                  <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Operating Hours</h3>
                </div>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Opening Time</p>
                    <p className="text-slate-800 dark:text-slate-200">
                      {vendor.openHours?.open ? new Date(`1970-01-01T${vendor.openHours.open}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Closing Time</p>
                    <p className="text-slate-800 dark:text-slate-200">
                      {vendor.openHours?.close ? new Date(`1970-01-01T${vendor.openHours.close}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default VendorProfile;
