// hooks/useLocation.js
import React from "react";

export const useLocation = (
  enabled,
  accuracyThreshold,
  accuracyThresholdWaitTime,
  options
) => {
  const [accuracy, setAccuracy] = React.useState();
  const [location, setLocation] = React.useState();
  const [error, setError] = React.useState();

  // Track the best (most accurate) location so far
  const bestLocationRef = React.useRef(null);
  const bestAccuracyRef = React.useRef(Infinity);

  React.useEffect(() => {
    if (!enabled) {
      setAccuracy(undefined);
      setError(undefined);
      setLocation(undefined);
      bestLocationRef.current = null;
      bestAccuracyRef.current = Infinity;
      return;
    }

    if (navigator.geolocation) {
      let timeout;
      const geoId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude: lat, longitude: lng, accuracy: acc } = position.coords;
          setAccuracy(acc);

          // Save if it's the best accuracy so far
          if (acc < bestAccuracyRef.current) {
            bestAccuracyRef.current = acc;
            bestLocationRef.current = { lat, lng };
          }

          // If within threshold, stop early and return
          if (
            accuracyThreshold == null ||
            acc <= accuracyThreshold
          ) {
            setLocation({ lat, lng });
            console.log("✅ Got accurate location:", acc);
          }
        },
        (e) => {
          setError(e.message);
        },
        options ?? { enableHighAccuracy: true, maximumAge: 2000, timeout: 5000 }
      );

      // Wait for threshold time — if not reached, return best location
      if (accuracyThreshold && accuracyThresholdWaitTime) {
        timeout = setTimeout(() => {
          if (!bestLocationRef.current) {
            setError("Failed to get any location");
          } else if (bestAccuracyRef.current > accuracyThreshold) {
            console.log("⚠️ Threshold not met, returning best available location");
            setError("Failed to reach desired accuracy, returning best available");
            setLocation(bestLocationRef.current);
            setAccuracy(bestAccuracyRef.current);
          }
        }, accuracyThresholdWaitTime * 1000);
      }

      return () => {
        navigator.geolocation.clearWatch(geoId);
        if (timeout) clearTimeout(timeout);
      };
    }

    setError("Geolocation API not available");
  }, [enabled, accuracyThreshold, accuracyThresholdWaitTime, options]);

  if (!enabled) {
    return [undefined, undefined, undefined];
  }

  return [location, accuracy, error];
};


