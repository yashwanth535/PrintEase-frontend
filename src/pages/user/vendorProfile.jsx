import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../../components/user/header"

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
    return <div className="text-center mt-20">Loading vendor details...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300 px-4 py-10">
      <Header/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto bg-white dark:bg-gray-900 p-8 rounded-xl shadow-md border border-gray-200 dark:border-gray-800 text-gray-800 dark:text-gray-200 mt-32"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">Vendor Profile</h2>
          <button
            onClick={() => navigate(`/u/order/create/${vendor._id}`)}
            className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create Order
          </button>
        </div>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <p><strong>Shop Name:</strong> {vendor.shopName}</p>
          <p><strong>Email:</strong> {vendor.email}</p>
          <p><strong>Contact Number:</strong> {vendor.contactNumber}</p>
          <p><strong>Verified:</strong> {vendor.isVerified ? "Yes" : "No"}</p>
          <p><strong>Created At:</strong> {new Date(vendor.createdAt).toLocaleString()}</p>
        </div>

        {/* Location */}
        <fieldset className="border border-gray-200 dark:border-gray-800 rounded p-4 mb-6">
          <legend className="font-semibold text-gray-700 dark:text-gray-300">Location</legend>
          <div className="grid md:grid-cols-4 gap-4 mt-2">
            <p><strong>Address:</strong> {vendor.location.address}</p>
            <p><strong>Pincode:</strong> {vendor.location.pincode}</p>
            <p><strong>Latitude:</strong> {vendor.location.lat}</p>
            <p><strong>Longitude:</strong> {vendor.location.lng}</p>
          </div>
        </fieldset>

        {/* Prices */}
        <fieldset className="border border-gray-200 dark:border-gray-800 rounded p-4 mb-6">
          <legend className="font-semibold text-gray-700 dark:text-gray-300">Prices</legend>
          <div className="grid md:grid-cols-3 gap-4 mt-2">
            <div>
              <h4 className="font-semibold">Color</h4>
              {Object.entries(vendor.prices.color).map(([size, price]) => (
                <p key={size}>{size}: ₹{price}</p>
              ))}
            </div>
            <div>
              <h4 className="font-semibold">Black & White</h4>
              {Object.entries(vendor.prices.black_white).map(([size, price]) => (
                <p key={size}>{size}: ₹{price}</p>
              ))}
            </div>
            <div>
              <h4 className="font-semibold">Binding</h4>
              {Object.entries(vendor.prices.binding).map(([type, price]) => (
                <p key={type}>{type}: ₹{price}</p>
              ))}
            </div>
          </div>
        </fieldset>

        {/* Services */}
        <fieldset className="border border-gray-200 dark:border-gray-800 rounded p-4 mb-6">
          <legend className="font-semibold text-gray-700 dark:text-gray-300">Services Offered</legend>
          <div className="grid md:grid-cols-3 gap-2 mt-2">
            <p>Color Printing: {vendor.services.colorPrinting ? "Yes" : "No"}</p>
            <p>Black & White Printing: {vendor.services.blackWhitePrinting ? "Yes" : "No"}</p>
            <p>Binding: {vendor.services.binding ? "Yes" : "No"}</p>
          </div>
        </fieldset>

        {/* Open Hours */}
        <fieldset className="border border-gray-200 dark:border-gray-800 rounded p-4">
          <legend className="font-semibold text-gray-700 dark:text-gray-300">Open Hours</legend>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <p><strong>Open:</strong> {vendor.openHours.open}</p>
            <p><strong>Close:</strong> {vendor.openHours.close}</p>
          </div>
        </fieldset>
      </motion.div>
    </div>
  );
};

export default VendorProfile;
