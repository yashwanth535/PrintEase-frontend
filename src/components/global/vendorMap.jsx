import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapPin, Navigation, Users, Loader2, AlertCircle } from "lucide-react";

const mapContainerStyle = {
  width: "100%",
  height: "600px",
  borderRadius: "16px"
};

// ✅ FIX 1: Move libraries outside component to prevent re-creation
const libraries = ["marker"];

const VendorMap = () => {
  console.log("maps rendering");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries, // ✅ Now using stable reference
  });

  const [mapRef, setMapRef] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [currentVendor, setCurrentVendor] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 }); // ✅ Track map center
  const [mapZoom, setMapZoom] = useState(5); // ✅ Track zoom level
  const markersRef = useRef([]);

  const onLoad = (map) => {
    setMapRef(map);
  };

  useEffect(() => {
    if (vendors.length > 0) {
      console.log("Updated vendors state:", vendors);
    }
  }, [vendors]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/vendors/locations`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();

        const parsedVendors = (data.vendors || []).filter(v => v.location?.lat && v.location?.lng).map(v => ({
          ...v,
          vendorId: v.vendorId || v._id, // ✅ Include vendorId
          location: {
            lat: parseFloat(v.location.lat),
            lng: parseFloat(v.location.lng),
          },
        }));

        setVendors(parsedVendors);
        setCurrentVendor(data.currentVendor || null);
        
        // ✅ Set initial map center to current vendor location
        if (data.currentVendor?.location?.lat && data.currentVendor?.location?.lng) {
          setMapCenter({
            lat: parseFloat(data.currentVendor.location.lat),
            lng: parseFloat(data.currentVendor.location.lng),
          });
          setMapZoom(12);
        }
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
      mapRef.setZoom(12);
    }
  }, [currentVendor, mapRef]);

  // ✅ Render vendor markers with AdvancedMarkerElement
  useEffect(() => {
    if (!mapRef || !isLoaded || !window.google?.maps?.marker) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.map = null);
    markersRef.current = [];

    vendors.forEach(vendor => {
      // Create custom marker content with click handler
      const markerContent = document.createElement('div');
      markerContent.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #a855f7 0%, #9333ea 100%);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: transform 0.2s;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
          </svg>
        </div>
      `;

      // Add hover effect
      markerContent.firstElementChild.addEventListener('mouseenter', (e) => {
        e.currentTarget.style.transform = 'scale(1.1)';
      });
      markerContent.firstElementChild.addEventListener('mouseleave', (e) => {
        e.currentTarget.style.transform = 'scale(1)';
      });

      const marker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef,
        position: vendor.location,
        title: vendor.shopName,
        content: markerContent,
      });

      // ✅ Add click handler to navigate to vendor profile
      marker.addListener('click', () => {
        if (vendor.vendorId) {
          window.location.href = `/u/vendor-profile/${vendor.vendorId}`;
        }
      });

      markersRef.current.push(marker);
    });

    // Add a special marker for the current vendor (optional)
    if (currentVendor?.location) {
      const myMarkerContent = document.createElement('div');
      myMarkerContent.innerHTML = `
        <div style="
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
      `;

      const myMarker = new window.google.maps.marker.AdvancedMarkerElement({
        map: mapRef,
        position: currentVendor.location,
        title: "Your Shop",
        content: myMarkerContent,
      });
      markersRef.current.push(myMarker);
    }

    return () => {
      markersRef.current.forEach(marker => marker.map = null);
      markersRef.current = [];
    };
  }, [mapRef, vendors, currentVendor, isLoaded]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen minimal-gradient">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-40">
          <div className="feature-card floating p-12 text-center">
            <Loader2 className="h-12 w-12 text-slate-400 mx-auto mb-4 animate-spin" />
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Loading Google Maps...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[-40px]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
         {/* Header + Stats Row */}
<motion.div
  className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 items-center"
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* Header (Left) */}
  <div>
    <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-3">
      <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900 dark:to-purple-800 rounded-xl">
        <MapPin className="h-8 w-8 text-purple-700 dark:text-purple-300" />
      </div>
      Vendor Locations
    </h1>
    <p className="text-slate-600 dark:text-slate-400 text-lg">
      Discover printing vendors near you on the interactive map.
    </p>
  </div>

  {/* Stats (Right) */}
  <motion.div
    className="grid grid-cols-1 sm:grid-cols-3 gap-4"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
  >
    {/* Total Vendors */}
    <div className="feature-card p-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          Total Vendors
        </span>
      </div>
      <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
        {vendors.length}
      </p>
    </div>

    {/* Your Location */}
    <div className="feature-card p-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <Navigation className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          Your Location
        </span>
      </div>
      <p className="text-sm text-slate-600 dark:text-slate-400">
        {currentVendor?.shopName || "Not set"}
      </p>
    </div>

    {/* Active Locations */}
    <div className="feature-card p-4 text-center">
      <div className="flex items-center justify-center gap-2 mb-2">
        <MapPin className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
        <span className="font-semibold text-slate-900 dark:text-slate-100">
          Active Locations
        </span>
      </div>
      <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
        {vendors.filter((v) => v.location?.lat && v.location?.lng).length}
      </p>
    </div>
  </motion.div>
</motion.div>


          {/* Map */}
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
                  <p className="text-slate-500 dark:text-slate-400">
                    No vendor locations available.
                  </p>
                </div>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200/50 dark:border-slate-700/50 shadow-lg">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  onLoad={onLoad}
                  center={mapCenter} // ✅ Use dynamic center
                  zoom={mapZoom} // ✅ Use dynamic zoom
                  options={{
                    // ✅ FIX 2: Add mapId to enable Advanced Markers
                    mapId: "VENDOR_MAP", // You can use any string ID
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: true,
                    streetViewControl: false,
                    rotateControl: false,
                    fullscreenControl: true,
                  }}
                />
              </div>
            )}

            {/* Legend */}
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