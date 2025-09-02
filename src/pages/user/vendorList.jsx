import React, { useState, useEffect } from 'react';
import { FaStar, FaRegStar, FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import UserHeader from '../../components/user/header';
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
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <UserHeader />

      <div className="max-w-6xl mx-auto py-10 px-4 mt-32">
        <h1 className="text-2xl font-bold mb-4">Nearby Print Vendors</h1>

        {/* Search */}
        <div className="relative max-w-xs mb-6">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendor..."
            className="w-full pl-10 pr-3 py-2 rounded border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="mb-6">
          <label className="block text-sm font-medium mb-3">Filter by Services</label>
          <div className="flex flex-wrap gap-2">
            {serviceOptions.map((service) => (
              <button
                key={service.value}
                onClick={() => handleServiceToggle(service.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedServices.includes(service.value)
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {service.label}
              </button>
            ))}
            {selectedServices.length > 0 && (
              <button
                onClick={() => setSelectedServices([])}
                className="px-4 py-2 rounded-full text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Vendor List */}
        {currentVendors.length === 0 ? (
          <p className="text-center text-gray-500">No vendors found for selected filters.</p>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 p-4 bg-gray-50 dark:bg-gray-800 border-b font-medium text-gray-700 dark:text-gray-200">
              <div className="col-span-3">Vendor Name</div>
              <div className="col-span-3">Address</div>
              <div className="col-span-2">Distance</div>
              <div className="col-span-2">Services</div>
              <div className="col-span-2">Actions</div>
            </div>

            {/* Vendor List Items */}
            {currentVendors.map((vendor, index) => (
              <div 
                key={vendor._id} 
                className={`grid grid-cols-12 gap-4 p-4 items-center border-b hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                  index === currentVendors.length - 1 ? 'border-b-0' : ''
                }`}
              >
                <div className="col-span-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleFavourite(vendor._id)} className="focus:outline-none">
                      {favourites.includes(vendor._id) ? (
                        <FaStar className="text-yellow-400" />
                      ) : (
                        <FaRegStar className="text-gray-400 hover:text-yellow-400" />
                      )}
                    </button>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{vendor.shopName}</h3>
                  </div>
                </div>
                
                <div className="col-span-3">
                  <p className="text-sm text-gray-600 dark:text-gray-400">{vendor.location?.address || 'No address'}</p>
                </div>
                
                <div className="col-span-2">
                  <p className="text-sm text-blue-600">📍 {formatDistance(vendor.distance)}</p>
                </div>
                
                <div className="col-span-2">
                  <div className="text-sm text-gray-700">
                    {Object.entries(vendor.services)
                      .filter(([key, val]) => val)
                      .map(([key, val], idx) => (
                        <span key={key} className="inline-block bg-gray-100 rounded px-2 py-1 text-xs mr-1 mb-1">
                          {key}
                        </span>
                      ))}
                  </div>
                </div>
                
                <div className="col-span-2">
                  <div className="flex justify-around items-center mt-4 space-x-2">
                    <button
                      onClick={() => handleViewProfile(vendor._id)}
                      className="py-2 px-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 text-sm"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => handleCreateOrder(vendor._id)}
                      className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-sm"
                    >
                      Create Order
                    </button>
                     <button
                      onClick={() => handleGetDirections(vendor.location?.lat, vendor.location?.lng)}
                      className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors duration-200 text-sm"
                    >
                      Get Directions
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {filteredVendors.length > vendorsPerPage && (
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  indexOfLast < filteredVendors.length ? prev + 1 : prev
                )
              }
              disabled={indexOfLast >= filteredVendors.length}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorList;
