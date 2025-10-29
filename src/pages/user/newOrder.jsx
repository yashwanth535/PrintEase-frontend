/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FaMap, FaList } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useLocation } from "../../hooks/geolocation";
import VendorMap from "../../components/global/vendorMap";
import VendorListView from "../../components/user/VendorListView";

const API_URL = import.meta.env.VITE_API_URL;

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favourites, setFavourites] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("map");

  const vendorsPerPage = 10;
  const navigate = useNavigate();

  const serviceOptions = [
    { value: "colorPrinting", label: "Color Printing" },
    { value: "blackWhitePrinting", label: "Black & White Printing" },
    { value: "binding", label: "Binding" },
  ];

  const [userLocation, accuracy, locationError] = useLocation(true, 50, 1);

  useEffect(() => {
    fetchVendors();
    fetchFavourites();
  }, []);

  useEffect(() => {
    if (userLocation) {
      const updated = vendors.map((vendor) => {
        const distance =
          vendor.location?.lat && vendor.location?.lng
            ? calculateDistance(
                userLocation.lat,
                userLocation.lng,
                vendor.location.lat,
                vendor.location.lng
              )
            : null;
        return { ...vendor, distance };
      });
      setVendors(updated);
    }
  }, [userLocation]);

  useEffect(() => {
    filterAndSortVendors();
  }, [vendors, selectedServices, searchTerm]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return null;
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchVendors = async () => {
    try {
      console.log("fetching vendors");
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/vendors`);
      if (response.data.success) {
        setVendors(response.data.vendors);
      } else {
        setVendors([]);
      }
    } catch (err) {
      console.error("Error:", err);
      setVendors([]);
    } finally {
      console.log("set Loading false");
      setLoading(false);
    }
  };

  const fetchFavourites = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/favourites`, {
        withCredentials: true,
      });
      if (res.data.success) {
        setFavourites(res.data.vendors.map((v) => v._id));
      }
    } catch (err) {
      console.error("Error fetching favourites:", err);
    }
  };

  const toggleFavourite = async (vendorId) => {
    try {
      if (favourites.includes(vendorId)) {
        await axios.delete(`${API_URL}/api/user/favourites/${vendorId}`, {
          withCredentials: true,
        });
        setFavourites((prev) => prev.filter((id) => id !== vendorId));
      } else {
        await axios.post(
          `${API_URL}/api/user/favourites`,
          { vendorId },
          { withCredentials: true }
        );
        setFavourites((prev) => [...prev, vendorId]);
      }
    } catch (err) {
      console.error("Error toggling favourite:", err);
    }
  };

  const filterAndSortVendors = () => {
    let filtered = vendors;

    if (searchTerm.trim() !== "") {
      filtered = filtered.filter((v) =>
        v.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedServices.length > 0) {
      filtered = filtered.filter((vendor) =>
        selectedServices.some((service) => vendor.services?.[service])
      );
    }

    filtered = filtered.sort((a, b) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });

    setFilteredVendors(filtered);
    setCurrentPage(1);
  };

  const formatDistance = (distance) => {
    if (distance == null) return "N/A";
    if (distance < 1) return `${(distance * 1000).toFixed(0)}m`;
    return `${distance.toFixed(1)}km`;
  };

  const handleCreateOrder = (vendorId) => {
    navigate(`/u/order/create/${vendorId}`);
  };

  const handleViewProfile = (vendorId) => {
    navigate(`/u/vendor-profile/${vendorId}`);
  };

  const handleGetDirections = (vendorLat, vendorLng) => {
    if (userLocation && vendorLat && vendorLng) {
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation.lat},${userLocation.lng}&destination=${vendorLat},${vendorLng}`;
      window.open(googleMapsUrl, "_blank");
    } else {
      toast.error(
        "Cannot get directions: User location or vendor location is missing."
      );
    }
  };

  const handleServiceToggle = (serviceValue) => {
    setSelectedServices((prev) =>
      prev.includes(serviceValue)
        ? prev.filter((s) => s !== serviceValue)
        : [...prev, serviceValue]
    );
  };

  const indexOfLast = currentPage * vendorsPerPage;
  const indexOfFirst = indexOfLast - vendorsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirst, indexOfLast);

  const isLocationLoading = !userLocation;

  return (
    <div className="relative min-h-screen">
      {/* Location Loading Overlay */}
      {isLocationLoading && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex flex-col items-center justify-center text-white">
          <div className="w-14 h-14 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-lg font-medium">
            Fetching your current location...
          </p>
          <p className="text-sm text-gray-300 mt-1">
            Make sure location permissions are enabled
          </p>
        </div>
      )}

      {/* Main content */}
      <div
        className={`transition-all duration-300 ${
          isLocationLoading ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            Loading vendors...
          </div>
        ) : (
          <div className="min-h-screen minimal-gradient dark:minimal-gradient transition-all duration-500">
            <div className="max-w-7xl mx-auto px-4 py-8 pt-40">
              {/* View Toggle Buttons */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-center gap-3 mb-6"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("map")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === "map"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
                  }`}
                >
                  <FaMap className="w-4 h-4" />
                  View Map
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                      : "bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
                  }`}
                >
                  <FaList className="w-4 h-4" />
                  View List
                </motion.button>
              </motion.div>

              {/* Conditional Rendering: Map or List */}
              <AnimatePresence mode="wait">
                {viewMode === "map" ? (
                  <motion.div
                    key="map"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VendorMap />
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <VendorListView
                      searchTerm={searchTerm}
                      setSearchTerm={setSearchTerm}
                      selectedServices={selectedServices}
                      handleServiceToggle={handleServiceToggle}
                      setSelectedServices={setSelectedServices}
                      serviceOptions={serviceOptions}
                      currentVendors={currentVendors}
                      favourites={favourites}
                      toggleFavourite={toggleFavourite}
                      formatDistance={formatDistance}
                      handleViewProfile={handleViewProfile}
                      handleCreateOrder={handleCreateOrder}
                      handleGetDirections={handleGetDirections}
                      filteredVendors={filteredVendors}
                      vendorsPerPage={vendorsPerPage}
                      currentPage={currentPage}
                      setCurrentPage={setCurrentPage}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorList;