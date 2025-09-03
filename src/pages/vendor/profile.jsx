/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

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

  const handleGetLocation = () => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        console.log(position.coords);
        const { latitude, longitude, accuracy } = position.coords;
  
        console.log("📍 New location received");
        console.log("Latitude:", latitude);
        console.log("Longitude:", longitude);
        console.log("Accuracy (in meters):", accuracy);
  
        // Only accept location with accuracy better than 25 meters
        if (accuracy <= 50) {
          setVendorData((prev) => ({
            ...prev,
            location: {
              ...prev.location,
              lat: latitude.toString(),
              lng: longitude.toString()
            }
          }));
  
          // Stop watching for further updates once we get good accuracy
          navigator.geolocation.clearWatch(watchId);
        }
      },
      (error) => {
        alert("Failed to get location: " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,      // Wait up to 20 sec
        maximumAge: 0
      }
    );
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
  const renderPriceSection = (label, category, sizes) => (
    <fieldset className="border rounded p-4 mb-4">
      <legend className="font-semibold text-gray-700">{label}</legend>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col">
            <label className="text-sm text-gray-600 font-medium">{size}</label>
            {isEditing ? (
              <input
                type="number"
                className="border rounded p-1"
                value={vendorData.prices[category]?.[size] || ""}
                onChange={(e) => handlePriceChange(category, size, e.target.value)}
              />
            ) : (
              <span>{vendorData.prices[category]?.[size] ?? "-"}</span>
            )}
          </div>
        ))}
      </div>
    </fieldset>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-12 mt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-xl shadow-xl border"
        >
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">Vendor Profile</h2>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <fieldset className="border rounded p-4 mb-4">
                <legend className="font-semibold text-gray-700">Basic Info</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label>Email</label>
                    <input value={vendorData.email} disabled className="border p-2 rounded w-full bg-gray-100" />
                  </div>
                  <div>
                    <label>Shop Name</label>
                    <input name="shopName" value={vendorData.shopName} onChange={handleChange} className="border p-2 rounded w-full" />
                  </div>
                  <div>
                    <label>Contact Number</label>
                    <input name="contactNumber" value={vendorData.contactNumber} onChange={handleChange} className="border p-2 rounded w-full" />
                  </div>
                  <div>
                    <label>Verified</label>
                    <input value={vendorData.isVerified ? "Yes" : "No"} disabled className="border p-2 rounded w-full bg-gray-100" />
                  </div>
                  <div>
                    <label>Created At</label>
                    <input value={vendorData.createdAt ? new Date(vendorData.createdAt).toLocaleString() : "-"} disabled className="border p-2 rounded w-full bg-gray-100" />
                  </div>
                </div>
              </fieldset>

              <fieldset className="border rounded p-4 mb-4">
                <legend className="font-semibold text-gray-700">Location</legend>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label>Address</label>
                    <input name="address" value={vendorData.location.address || ""} onChange={handleLocationChange} className="border p-2 rounded w-full" />
                  </div>
                  <div>
                    <label>Pincode</label>
                    <input name="pincode" value={vendorData.location.pincode || ""} onChange={handleLocationChange} className="border p-2 rounded w-full" />
                  </div>
                  <div>
                    <label>Latitude</label>
                    <input name="lat" value={vendorData.location.lat || ""} onChange={handleLocationChange} className="border p-2 rounded w-full" />
                  </div>
                  <div>
                    <label>Longitude</label>
                    <input name="lng" value={vendorData.location.lng || ""} onChange={handleLocationChange} className="border p-2 rounded w-full" />
                  </div>
                  <button
                    type="button"
                    onClick={handleGetLocation}
                    className="col-span-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                  >
                    Get My Location
                  </button>
                </div>
              </fieldset>

              {renderPriceSection("Color Printing", "color", ["A4", "A5", "A6"])}
              {renderPriceSection("Black & White Printing", "black_white", ["A4", "A5", "A6"])}
              {renderPriceSection("Binding", "binding", ["soft", "hard"])}

              <fieldset className="border rounded p-4 mb-4">
                <legend className="font-semibold text-gray-700">Services Offered</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {Object.keys(serviceLabels).map((key) => (
                    <label key={key} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        name={key}
                        checked={!!vendorData.services[key]}
                        onChange={handleServiceChange}
                      />
                      {serviceLabels[key]}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset className="border rounded p-4 mb-4">
                <legend className="font-semibold text-gray-700">Open Hours</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label>Open</label>
                    <input name="open" value={vendorData.openHours.open || ""} onChange={handleOpenHoursChange} className="border p-2 rounded w-full" />
                  </div>
                  <div>
                    <label>Close</label>
                    <input name="close" value={vendorData.openHours.close || ""} onChange={handleOpenHoursChange} className="border p-2 rounded w-full" />
                  </div>
                </div>
              </fieldset>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsEditing(false); fetchVendorData(); setMessage(""); }}
                  className="bg-gray-300 px-6 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
              {message && <p className="text-center text-green-600 mt-2">{message}</p>}
            </form>
          ) : (
            <div className="space-y-4">
              <fieldset className="border rounded p-4 mb-4">
                <legend className="font-semibold text-gray-700">Basic Info</legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><strong>Email:</strong> {vendorData.email}</div>
                  <div><strong>Shop Name:</strong> {vendorData.shopName}</div>
                  <div><strong>Contact Number:</strong> {vendorData.contactNumber}</div>
                  <div><strong>Verified:</strong> {vendorData.isVerified ? "Yes" : "No"}</div>
                  <div><strong>Created At:</strong> {vendorData.createdAt ? new Date(vendorData.createdAt).toLocaleString() : "-"}</div>
                </div>
              </fieldset>
              
              <fieldset className="border rounded p-4 mb-4">
                <legend className="font-semibold text-gray-700">Location</legend>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div><strong>Address:</strong> {vendorData.location.address}</div>
                  <div><strong>Pincode:</strong> {vendorData.location.pincode}</div>
                  <div><strong>Latitude:</strong> {vendorData.location.lat}</div>
                  <div><strong>Longitude:</strong> {vendorData.location.lng}</div>
                </div>
              </fieldset>
              
              {renderPriceSection("Color Printing", "color", ["A4", "A5", "A6"])}
              {renderPriceSection("Black & White Printing", "black_white", ["A4", "A5", "A6"])}
              {renderPriceSection("Binding", "binding", ["soft", "hard"])}
              
              <fieldset className="border rounded p-4 mb-4">
                <legend className="font-semibold text-gray-700">Services Offered</legend>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  {Object.keys(serviceLabels).map((key) => (
                    <div key={key}><strong>{serviceLabels[key]}:</strong> {vendorData.services[key] ? "Yes" : "No"}</div>
                  ))}
                </div>
              </fieldset>
              
              <fieldset className="border rounded p-4 mb-4">
                <legend className="font-semibold text-gray-700">Open Hours</legend>
                <div className="grid grid-cols-2 gap-4">
                  <div><strong>Open:</strong> {vendorData.openHours.open}</div>
                  <div><strong>Close:</strong> {vendorData.openHours.close}</div>
                </div>
              </fieldset>
              
              <button
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default Profile;
