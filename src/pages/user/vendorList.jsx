/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaSearch, FaMapMarkerAlt, FaEye, FaPlus, FaDirections, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const VendorList = () => {
  const [vendors, setVendors] = useState([]);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [favourites, setFavourites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const vendorsPerPage = 10;
  const navigate = useNavigate();

  const serviceOptions = [
    { value: 'colorPrinting', label: 'Color Printing' },
    { value: 'blackWhitePrinting', label: 'Black & White Printing' },
    { value: 'binding', label: 'Binding' }
  ];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log('Error getting location:', error);
          setUserLocation(null);
        }
      );
    }
  }, []);

  // Fetch vendors & favourites once
  useEffect(() => {
    fetchVendors();
    fetchFavourites();
  }, []);

  // Refilter when service or location changes
  useEffect(() => {
    filterAndSortVendors();
  }, [vendors, selectedServices, userLocation, searchTerm]);

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    if (!lat1 || !lng1 || !lat2 || !lng2) return null;

    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/vendors`);
      if (response.data.success) {
        const enriched = response.data.vendors.map((vendor) => {
          const distance = userLocation && vendor.location?.lat && vendor.location?.lng
            ? calculateDistance(userLocation.lat, userLocation.lng, vendor.location.lat, vendor.location.lng)
            : null;
          return { ...vendor, distance };
        });
        setVendors(enriched);
      } else {
        setVendors([]);
      }
    } catch (err) {
      console.error('Error:', err);
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavourites = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/user/favourites`, { withCredentials: true });
      if (res.data.success) {
        setFavourites(res.data.vendors.map(v => v._id));
      }
    } catch (err) {
      console.error('Error fetching favourites:', err);
    }
  };

  const toggleFavourite = async (vendorId) => {
    try {
      if (favourites.includes(vendorId)) {
        await axios.delete(`${API_URL}/api/user/favourites/${vendorId}`, { withCredentials: true });
        setFavourites(prev => prev.filter(id => id !== vendorId));
      } else {
        await axios.post(`${API_URL}/api/user/favourites`, { vendorId }, { withCredentials: true });
        setFavourites(prev => [...prev, vendorId]);
      }
    } catch (err) {
      console.error('Error toggling favourite:', err);
    }
  };

  const filterAndSortVendors = () => {
    let filtered = vendors;

    if (searchTerm.trim() !== '') {
      filtered = filtered.filter(v => v.shopName?.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    if (selectedServices.length > 0) {
      filtered = filtered.filter((vendor) => 
        selectedServices.some(service => vendor.services?.[service])
      );
    }

    filtered = filtered.map((vendor) => {
      const distance = userLocation && vendor.location?.lat && vendor.location?.lng
        ? calculateDistance(userLocation.lat, userLocation.lng, vendor.location.lat, vendor.location.lng)
        : null;
      return { ...vendor, distance };
    });

    filtered.sort((a, b) => {
      if (a.distance == null) return 1;
      if (b.distance == null) return -1;
      return a.distance - b.distance;
    });

    setFilteredVendors(filtered);
    setCurrentPage(1); // reset to first page on filter
  };

  const formatDistance = (distance) => {
    if (distance == null) return 'N/A';
    if (distance < 1) return `${(distance * 1000).toFixed(0)}m`;
    return `${distance.toFixed(1)}km`;
  };

  const formatPrice = (price) => price != null ? `₹${price}` : 'N/A';

  const handleCreateOrder = (vendorId) => {
    navigate(`/u/order/create/${vendorId}`);
  };

  const handleViewProfile = (vendorId) => {
    navigate(`/u/vendor-profile/${vendorId}`);
  };

  const handleGetDirections = (vendorLat, vendorLng) => {
    if (userLocation && vendorLat && vendorLng) {
      const userLat = userLocation.lat;
      const userLng = userLocation.lng;
      const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${vendorLat},${vendorLng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      alert('Cannot get directions: User location or vendor location is missing.');
    }
  };

  const handleServiceToggle = (serviceValue) => {
    setSelectedServices(prev => 
      prev.includes(serviceValue)
        ? prev.filter(s => s !== serviceValue)
        : [...prev, serviceValue]
    );
  };

  const indexOfLast = currentPage * vendorsPerPage;
  const indexOfFirst = indexOfLast - vendorsPerPage;
  const currentVendors = filteredVendors.slice(indexOfFirst, indexOfLast);

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Loading vendors...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-40">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="feature-card floating mb-8 mt-4"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="relative flex-1 max-w-md">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search vendors by name..."
                className="input-field pl-12 w-full"
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-4">
              <FaFilter className="text-slate-500 dark:text-slate-400" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Filter by Services:</span>
            </div>
          </div>

          {/* Service Filters */}
          <div className="flex flex-wrap gap-3 mt-6">
            {serviceOptions.map((service) => (
              <motion.button
                key={service.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleServiceToggle(service.value)}
                className={`px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 ${
                  selectedServices.includes(service.value)
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25'
                    : 'bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50'
                }`}
              >
                {service.label}
              </motion.button>
            ))}
            {selectedServices.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedServices([])}
                className="px-6 py-3 rounded-full text-sm font-medium bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg shadow-red-500/25 transition-all duration-300"
              >
                Clear All
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Vendor Cards Grid */}
        <AnimatePresence>
          {currentVendors.length === 0 ? (
            <motion.div
              className="feature-card text-center py-16"
            >
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-2">
                No vendors found
              </h3>
              <p className="text-slate-500 dark:text-slate-400">
                Try adjusting your search criteria or clearing the filters
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {currentVendors.map((vendor, index) => (
                <motion.div
                  key={vendor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="feature-card floating group cursor-pointer relative overflow-hidden"
                >
                  {/* Favorite Button */}
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleFavourite(vendor._id)}
                    className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-lg"
                  >
                    {favourites.includes(vendor._id) ? (
                      <FaStar className="text-yellow-500 w-4 h-4" />
                    ) : (
                      <FaRegStar className="text-slate-400 hover:text-yellow-500 w-4 h-4 transition-colors" />
                    )}
                  </motion.button>

                  {/* Vendor Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {vendor.shopName}
                    </h3>
                    <div className="flex items-center text-slate-600 dark:text-slate-400 mb-3">
                      <FaMapMarkerAlt className="w-4 h-4 mr-2 text-red-500" />
                      <span className="text-sm truncate">{vendor.location?.address || 'Address not available'}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
                      📍 {formatDistance(vendor.distance)}
                    </div>
                  </div>

                  {/* Services */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Available Services</h4>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(vendor.services)
                        .filter(([key, val]) => val)
                        .map(([key, val]) => (
                          <span 
                            key={key} 
                            className="px-3 py-1 text-xs font-medium bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-full backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                          >
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </span>
                        ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleViewProfile(vendor._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-white/80 dark:hover:bg-slate-600/80 transition-all duration-300 backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                    >
                      <FaEye className="w-4 h-4" />
                      <span className="text-sm font-medium">View</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCreateOrder(vendor._id)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-300 shadow-lg shadow-blue-500/25"
                    >
                      <FaPlus className="w-4 h-4" />
                      <span className="text-sm font-medium">Order</span>
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleGetDirections(vendor.location?.lat, vendor.location?.lng)}
                      className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/25"
                    >
                      <FaDirections className="w-4 h-4" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>

        {/* Pagination */}
        {filteredVendors.length > vendorsPerPage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center items-center gap-4 mt-12"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-6 py-3 rounded-xl bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 font-medium"
            >
              Previous
            </motion.button>
            
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Page {currentPage} of {Math.ceil(filteredVendors.length / vendorsPerPage)}
              </span>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                setCurrentPage((prev) =>
                  indexOfLast < filteredVendors.length ? prev + 1 : prev
                )
              }
              disabled={indexOfLast >= filteredVendors.length}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-blue-500/25 font-medium"
            >
              Next
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default VendorList;
