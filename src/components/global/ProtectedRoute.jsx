import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ role }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                console.log("checking authentication");
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await fetch(`${API_URL}/api/auth/isAuthenticated`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                console.log(data);
                setIsAuthenticated(data.authenticated?data.role===role:false);
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
            }
        };
        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return (
            <div className="flex items-center justify-center h-screen bg-white">
              <div className="relative w-12 h-12 animate-spin-custom">
                <div className="absolute w-5 h-5 bg-black rounded-full top-0 left-0"></div>
                <div className="absolute w-5 h-5 bg-black rounded-full top-0 right-0"></div>
                <div className="absolute w-5 h-5 bg-black rounded-full bottom-0 left-0"></div>
                <div className="absolute w-5 h-5 bg-black rounded-full bottom-0 right-0"></div>
              </div>
            </div>
          );
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/error" />;
};

export default ProtectedRoute;
