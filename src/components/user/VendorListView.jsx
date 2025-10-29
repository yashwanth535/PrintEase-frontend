/* eslint-disable no-unused-vars */
import React from "react";
import {
  FaStar,
  FaRegStar,
  FaSearch,
  FaMapMarkerAlt,
  FaEye,
  FaPlus,
  FaDirections,
  FaFilter,
} from "react-icons/fa";
import { motion } from "framer-motion";

const VendorListView = ({
  searchTerm,
  setSearchTerm,
  selectedServices,
  handleServiceToggle,
  setSelectedServices,
  serviceOptions,
  currentVendors,
  favourites,
  toggleFavourite,
  formatDistance,
  handleViewProfile,
  handleCreateOrder,
  handleGetDirections,
  filteredVendors,
  vendorsPerPage,
  currentPage,
  setCurrentPage,
}) => {
  const indexOfLast = currentPage * vendorsPerPage;

  return (
    <>
      {/* Search and Filter Section */}
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
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Filter by Services:
            </span>
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
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/25"
                  : "bg-white/60 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-white/80 dark:hover:bg-slate-700/80 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50"
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
      {currentVendors.length === 0 ? (
        <motion.div className="feature-card text-center py-16">
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
                  <span className="text-sm truncate">
                    {vendor.location?.address || "Address not available"}
                  </span>
                </div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium">
                  📍 {formatDistance(vendor.distance)}
                </div>
              </div>

              {/* Services */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Available Services
                </h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(vendor.services)
                    .filter(([key, val]) => val)
                    .map(([key, val]) => (
                      <span
                        key={key}
                        className="px-3 py-1 text-xs font-medium bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 rounded-full backdrop-blur-sm border border-slate-200/50 dark:border-slate-600/50"
                      >
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())}
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
                  onClick={() =>
                    handleGetDirections(
                      vendor.location?.lat,
                      vendor.location?.lng
                    )
                  }
                  className="px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg shadow-green-500/25"
                >
                  <FaDirections className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

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
              Page {currentPage} of{" "}
              {Math.ceil(filteredVendors.length / vendorsPerPage)}
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
    </>
  );
};

export default VendorListView;