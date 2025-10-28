/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, MapPin, Clock, DollarSign, Settings, CheckCircle, XCircle, Edit3, Save, X } from "lucide-react";
import { useLocation } from "../../hooks/geolocation";



const defaultVendorData = {
  email: "",
  collection_name: "",
  shopName: "",
  location: { 
    address: "", 
    pincode: "", 
    lat: "", 
    lng: "" 
  },
  contactNumber: "",
  prices: {
    color: {
      A4: "",
      A5: "",
      A6: ""
    },
    black_white: {
      A4: "",
      A5: "",
      A6: ""
    },
    binding: {
      soft: "",
      hard: ""
    }
  },
  services: {
    colorPrinting: true,
    blackWhitePrinting: true,
    binding: true
  },
  openHours: { 
    open: "", 
    close: "" 
  },
  isVerified: false,
  createdAt: ""
};

const serviceLabels = {
  colorPrinting: "Color Printing",
  blackWhitePrinting: "Black & White Printing",
  binding: "Binding"
};

const Profile = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [vendorData, setVendorData] = useState(defaultVendorData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [trackingEnabled, setTrackingEnabled] = useState(false);

  useEffect(() => {
    fetchVendorData();
  }, []);

  useEffect(() => {
    console.log("🔄 Latitude changed in state:", vendorData.location.lat);
    console.log("🔄 Longitude changed in state:", vendorData.location.lng);
  }, [vendorData.location.lat, vendorData.location.lng]);
  
  const fetchVendorData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/profile`, {
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        console.log("fetched vendor data");
        setVendorData({ ...defaultVendorData, ...data.vendor });
      }
    } catch (error) {
      console.error("Error fetching vendor data:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({
      ...prev,
      location: { ...prev.location, [name]: value }
    }));
  };

  const handlePriceChange = (category, size, value) => {
    setVendorData((prev) => ({
      ...prev,
      prices: {
        ...prev.prices,
        [category]: {
          ...prev.prices[category],
          [size]: value
        }
      }
    }));
  };

  const handleServiceChange = (e) => {
    const { name, checked } = e.target;
    setVendorData((prev) => ({
      ...prev,
      services: {
        ...prev.services,
        [name]: checked
      }
    }));
  };

  const handleOpenHoursChange = (e) => {
    const { name, value } = e.target;
    setVendorData((prev) => ({
      ...prev,
      openHours: { ...prev.openHours, [name]: value }
    }));
  };

const [userLocation, accuracy, locationError] = useLocation(
  true,   // enable tracking
  50,     // desired accuracy in meters
  10     // wait up to 10 seconds
);

useEffect(() => {
  if (userLocation && accuracy <= 50 && trackingEnabled) {
    console.log("📍 New accurate location received");
    console.log("Latitude:", userLocation.lat);
    console.log("Longitude:", userLocation.lng);
    console.log("Accuracy:", accuracy);

    // Update vendor data only once when we have a good location
    setVendorData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        lat: userLocation.lat.toString(),
        lng: userLocation.lng.toString()
      }
    }));

    setTrackingEnabled(false);
  }
}, [userLocation, accuracy]);

const handleGetLocation = () => {
    setTrackingEnabled(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch(`${API_URL}/api/vendor/updateProfile`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vendorData)
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Profile updated successfully!");
        setIsEditing(false);
        setVendorData({ ...defaultVendorData, ...data.vendor });
      } else {
        setMessage(data.message || "Update failed.");
      }
    } catch (error) {
      console.log("error submitting the data");
      setMessage("Error updating profile.");
    }
    setLoading(false);
  };

  // Helper for price fields
  const renderPriceSection = (label, category, sizes, icon) => (
    <motion.div 
      className="feature-card floating p-6 mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-3 mb-4">
        {icon}
        <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{label}</h3>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {sizes.map((size) => (
          <div key={size} className="space-y-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{size}</label>
            {isEditing ? (
              <input
                type="number"
                className="input-field"
                placeholder="₹0"
                value={vendorData.prices[category]?.[size] || ""}
                onChange={(e) => handlePriceChange(category, size, e.target.value)}
              />
            ) : (
              <div className="px-3 py-2 bg-slate-50 dark:bg-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                {vendorData.prices[category]?.[size] ? `₹${vendorData.prices[category][size]}` : "-"}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );

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
                  <User size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    {vendorData.shopName || "Vendor Profile"}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Manage your shop details and pricing
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {vendorData.isVerified ? (
                  <div className="flex items-center gap-2 px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium">
                    <CheckCircle size={16} />
                    Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-medium">
                    <XCircle size={16} />
                    Pending
                  </div>
                )}
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="btn-primary flex items-center gap-2"
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Top Section - Basic Info & Location */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Basic Info Card */}
                <motion.div 
                  className="feature-card floating p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-slate-600 dark:text-slate-400" size={20} />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Basic Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
                      <input 
                        value={vendorData.email} 
                        disabled 
                        className="input-field bg-slate-50 dark:bg-slate-800 cursor-not-allowed" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Shop Name</label>
                      <input 
                        name="shopName" 
                        value={vendorData.shopName} 
                        onChange={handleChange} 
                        className="input-field" 
                        placeholder="Enter your shop name"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Contact Number</label>
                      <input 
                        name="contactNumber" 
                        value={vendorData.contactNumber} 
                        onChange={handleChange} 
                        className="input-field" 
                        placeholder="Enter contact number"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Member Since</label>
                      <input 
                        value={vendorData.createdAt ? new Date(vendorData.createdAt).toLocaleDateString() : "-"} 
                        disabled 
                        className="input-field bg-slate-50 dark:bg-slate-800 cursor-not-allowed" 
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Location Card */}
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
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Address</label>
                      <input 
                        name="address" 
                        value={vendorData.location.address || ""} 
                        onChange={handleLocationChange} 
                        className="input-field" 
                        placeholder="Enter your shop address"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Pincode</label>
                      <input 
                        name="pincode" 
                        value={vendorData.location.pincode || ""} 
                        onChange={handleLocationChange} 
                        className="input-field" 
                        placeholder="000000"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Latitude</label>
                        <input 
                          name="lat" 
                          value={vendorData.location.lat || ""} 
                          onChange={handleLocationChange} 
                          className="input-field" 
                          placeholder="0.000000"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Longitude</label>
                        <input 
                          name="lng" 
                          value={vendorData.location.lng || ""} 
                          onChange={handleLocationChange} 
                          className="input-field" 
                          placeholder="0.000000"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
          <button
            type="button"
            onClick={handleGetLocation}
            disabled={trackingEnabled}
            className={`btn-secondary w-full flex items-center justify-center gap-2 ${
              trackingEnabled ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <MapPin size={16} />
            {trackingEnabled ? "Fetching location..." : "Get My Location"}
          </button>

          {/* Small loading indicator */}
          {trackingEnabled && (
            <div className="mt-3 flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>Fetching your current location...</span>
            </div>
          )}

          {/* Optional: show error */}
          {locationError && (
            <p className="mt-2 text-sm text-red-500">{locationError}</p>
          )}
        </div>
                  </div>
                </motion.div>
              </div>

              {/* Pricing Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {renderPriceSection("Color Printing", "color", ["A4", "A5", "A6"], <DollarSign className="text-blue-500" size={20} />)}
                {renderPriceSection("Black & White Printing", "black_white", ["A4", "A5", "A6"], <DollarSign className="text-slate-500" size={20} />)}
                {renderPriceSection("Binding Services", "binding", ["soft", "hard"], <Settings className="text-purple-500" size={20} />)}
              </div>

              {/* Bottom Section - Services & Hours */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Services Card */}
                <motion.div 
                  className="feature-card floating p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="text-slate-600 dark:text-slate-400" size={20} />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Services Offered</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.keys(serviceLabels).map((key) => (
                      <label key={key} className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                        <input
                          type="checkbox"
                          name={key}
                          checked={!!vendorData.services[key]}
                          onChange={handleServiceChange}
                          className="w-4 h-4 text-blue-600 bg-slate-100 border-slate-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-slate-800 focus:ring-2 dark:bg-slate-700 dark:border-slate-600"
                        />
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{serviceLabels[key]}</span>
                      </label>
                    ))}
                  </div>
                </motion.div>

                {/* Operating Hours Card */}
                <motion.div 
                  className="feature-card floating p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="text-slate-600 dark:text-slate-400" size={20} />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Operating Hours</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Opening Time</label>
                      <input 
                        name="open" 
                        type="time"
                        value={vendorData.openHours.open || ""} 
                        onChange={handleOpenHoursChange} 
                        className="input-field" 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Closing Time</label>
                      <input 
                        name="close" 
                        type="time"
                        value={vendorData.openHours.close || ""} 
                        onChange={handleOpenHoursChange} 
                        className="input-field" 
                      />
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Action Buttons */}
              <motion.div 
                className="feature-card floating p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <div className="flex flex-col sm:flex-row gap-4 justify-end">
                  <button
                    type="button"
                    onClick={() => { setIsEditing(false); fetchVendorData(); setMessage(""); }}
                    className="btn-secondary flex items-center gap-2 justify-center"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2 justify-center"
                    disabled={loading}
                  >
                    <Save size={16} />
                    {loading ? "Updating..." : "Save Changes"}
                  </button>
                </div>
                {message && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`mt-4 p-4 rounded-lg backdrop-blur-sm ${
                      message.includes('successfully') 
                        ? 'bg-emerald-100/80 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-red-100/80 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
                    }`}
                  >
                    <p className="text-center font-medium">{message}</p>
                  </motion.div>
                )}
              </motion.div>
            </form>
          ) : (
            <div className="space-y-8">
              {/* Top Section - Basic Info & Location */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Basic Info View */}
                <motion.div 
                  className="feature-card floating p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <User className="text-slate-600 dark:text-slate-400" size={20} />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Basic Information</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Email</p>
                      <p className="text-slate-800 dark:text-slate-200">{vendorData.email || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Shop Name</p>
                      <p className="text-slate-800 dark:text-slate-200">{vendorData.shopName || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Contact Number</p>
                      <p className="text-slate-800 dark:text-slate-200">{vendorData.contactNumber || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Member Since</p>
                      <p className="text-slate-800 dark:text-slate-200">
                        {vendorData.createdAt ? new Date(vendorData.createdAt).toLocaleDateString() : "-"}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Location View */}
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
                      <p className="text-slate-800 dark:text-slate-200">{vendorData.location.address || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Pincode</p>
                      <p className="text-slate-800 dark:text-slate-200">{vendorData.location.pincode || "-"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Coordinates</p>
                      <p className="text-slate-800 dark:text-slate-200">
                        {vendorData.location.lat && vendorData.location.lng 
                          ? `${vendorData.location.lat}, ${vendorData.location.lng}` 
                          : "-"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
              
              {/* Pricing Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {renderPriceSection("Color Printing", "color", ["A4", "A5", "A6"], <DollarSign className="text-blue-500" size={20} />)}
                {renderPriceSection("Black & White Printing", "black_white", ["A4", "A5", "A6"], <DollarSign className="text-slate-500" size={20} />)}
                {renderPriceSection("Binding Services", "binding", ["soft", "hard"], <Settings className="text-purple-500" size={20} />)}
              </div>
              
              {/* Bottom Section - Services & Hours */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Services View */}
                <motion.div 
                  className="feature-card floating p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Settings className="text-slate-600 dark:text-slate-400" size={20} />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Services Offered</h3>
                  </div>
                  <div className="space-y-3">
                    {Object.keys(serviceLabels).map((key) => (
                      <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                        <div className={`w-3 h-3 rounded-full ${vendorData.services[key] ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}></div>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">{serviceLabels[key]}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Operating Hours View */}
                <motion.div 
                  className="feature-card floating p-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center gap-3 mb-6">
                    <Clock className="text-slate-600 dark:text-slate-400" size={20} />
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">Operating Hours</h3>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Opening Time</p>
                      <p className="text-slate-800 dark:text-slate-200">
                        {vendorData.openHours.open ? new Date(`1970-01-01T${vendorData.openHours.open}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Closing Time</p>
                      <p className="text-slate-800 dark:text-slate-200">
                        {vendorData.openHours.close ? new Date(`1970-01-01T${vendorData.openHours.close}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : "-"}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
