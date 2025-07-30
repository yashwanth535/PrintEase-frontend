import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Header from "../../components/user/header"

const VendorProfile = () => {
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
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <Header/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md border mt-32"
      >
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Vendor Profile</h2>

        {/* Basic Info */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <p><strong>Shop Name:</strong> {vendor.shopName}</p>
          <p><strong>Email:</strong> {vendor.email}</p>
          <p><strong>Contact Number:</strong> {vendor.contactNumber}</p>
          <p><strong>Verified:</strong> {vendor.isVerified ? "Yes" : "No"}</p>
          <p><strong>Created At:</strong> {new Date(vendor.createdAt).toLocaleString()}</p>
        </div>

        {/* Location */}
        <fieldset className="border rounded p-4 mb-6">
          <legend className="font-semibold text-gray-700">Location</legend>
          <div className="grid md:grid-cols-4 gap-4 mt-2">
            <p><strong>Address:</strong> {vendor.location.address}</p>
            <p><strong>Pincode:</strong> {vendor.location.pincode}</p>
            <p><strong>Latitude:</strong> {vendor.location.lat}</p>
            <p><strong>Longitude:</strong> {vendor.location.lng}</p>
          </div>
        </fieldset>

        {/* Prices */}
        <fieldset className="border rounded p-4 mb-6">
          <legend className="font-semibold text-gray-700">Prices</legend>
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
        <fieldset className="border rounded p-4 mb-6">
          <legend className="font-semibold text-gray-700">Services Offered</legend>
          <div className="grid md:grid-cols-3 gap-2 mt-2">
            <p>Color Printing: {vendor.services.colorPrinting ? "Yes" : "No"}</p>
            <p>Black & White Printing: {vendor.services.blackWhitePrinting ? "Yes" : "No"}</p>
            <p>Binding: {vendor.services.binding ? "Yes" : "No"}</p>
          </div>
        </fieldset>

        {/* Open Hours */}
        <fieldset className="border rounded p-4">
          <legend className="font-semibold text-gray-700">Open Hours</legend>
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
