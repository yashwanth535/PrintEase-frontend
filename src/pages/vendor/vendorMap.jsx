import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Users, Loader2, AlertCircle } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "16px"
};

const VendorMap = () => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [mapRef, setMapRef] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [currentVendor, setCurrentVendor] = useState(null);

  const onLoad = (map) => {
    setMapRef(map);
  };

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendors/locations`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        // console.log(data);
        setVendors(data.vendors || []);
        setCurrentVendor(data.currentVendor || null);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };

    fetchVendors();
  }, []);

  // 🔄 Center and zoom to current vendor
  useEffect(() => {
    if (
      mapRef &&
      currentVendor?.location?.lat &&
      currentVendor?.location?.lng
    ) {
      mapRef.panTo({
        lat: parseFloat(currentVendor.location.lat),
        lng: parseFloat(currentVendor.location.lng),
      });
      mapRef.setZoom(12); // Set zoom as needed
    }
  }, [currentVendor, mapRef]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen minimal-gradient">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-40">
          <div className="feature-card floating p-12 text-center">
            <Loader2 className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-spin" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">Loading Google Maps...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Page Header */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl">
                <MapPin className="h-8 w-8 text-purple-700 dark:text-purple-300" />
              </div>
              Vendor Locations
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Discover printing vendors near you on the interactive map.
            </p>
          </motion.div>

          {/* Map Stats */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="feature-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">Total Vendors</span>
              </div>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{vendors.length}</p>
            </div>
            
            <div className="feature-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">Your Location</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                {currentVendor?.shopName || 'Not set'}
              </p>
            </div>
            
            <div className="feature-card p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-slate-900 dark:text-slate-100">Active Locations</span>
              </div>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                {vendors.filter(v => v.location?.lat && v.location?.lng).length}
              </p>
            </div>
          </motion.div>

          {/* Map Container */}
          <motion.div 
            className="feature-card floating p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl">
                <MapPin className="h-5 w-5 text-purple-700 dark:text-purple-300" />
              </div>
              <h3 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
                Interactive Vendor Map
              </h3>
            </div>
            
            {vendors.length === 0 ? (
              <div className="text-center py-12">
                <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <AlertCircle className="h-12 w-12 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No vendor locations available.</p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  onLoad={onLoad}
                  center={{ lat: 20.5937, lng: 78.9629 }}
                  zoom={5}
                  options={{
                    styles: [
                      {
                        featureType: "all",
                        elementType: "geometry.fill",
                        stylers: [{ color: "#f8fafc" }]
                      },
                      {
                        featureType: "water",
                        elementType: "geometry",
                        stylers: [{ color: "#e2e8f0" }]
                      },
                      {
                        featureType: "road",
                        elementType: "geometry",
                        stylers: [{ color: "#ffffff" }]
                      }
                    ],
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: true,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: true
                  }}
                >
                  {vendors.map((vendor, idx) =>
                    vendor.location?.lat && vendor.location?.lng ? (
                      <Marker
                        key={idx}
                        position={{
                          lat: parseFloat(vendor.location.lat),
                          lng: parseFloat(vendor.location.lng),
                        }}
                        title={vendor.shopName}
                        icon={{
                          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <circle cx="16" cy="16" r="12" fill="#8b5cf6" stroke="white" stroke-width="3"/>
                              <circle cx="16" cy="16" r="6" fill="white"/>
                            </svg>
                          `),
                          scaledSize: new window.google.maps.Size(32, 32),
                          anchor: new window.google.maps.Point(16, 16)
                        }}
                      />
                    ) : null
                  )}
                </GoogleMap>
              </div>
            )}
            
            {/* Map Legend */}
            <div className="mt-4 flex items-center justify-center gap-6 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-purple-500 rounded-full border-2 border-white shadow-sm"></div>
                <span>Vendor Location</span>
              </div>
              {currentVendor?.location?.lat && (
                <div className="flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-blue-500" />
                  <span>Your Shop</span>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
};

export default VendorMap;
