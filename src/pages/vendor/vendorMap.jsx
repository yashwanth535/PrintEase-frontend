import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import VendorHeader from '../../components/vendor/header';

const mapContainerStyle = {
  width: "100%",
  height: "500px"
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
        console.log(data);
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

  if (!isLoaded) return <div>Loading Map...</div>;

  return (
    <>
      <VendorHeader />
      <div className="mt-32">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          onLoad={onLoad}
          // Optional: default center before panTo
          center={{ lat: 20.5937, lng: 78.9629 }}
          zoom={5}
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
              />
            ) : null
          )}
        </GoogleMap>
      </div>
    </>
  );
};

export default VendorMap;
