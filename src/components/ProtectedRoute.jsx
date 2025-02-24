import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const API_URL = import.meta.env.VITE_API_URL;
                const response = await fetch(`${API_URL}/auth/isAuthenticated`, {
                    method: "POST",
                    credentials: "include",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                setIsAuthenticated(data.authenticated);
            } catch (error) {
                console.error("Error checking authentication:", error);
                setIsAuthenticated(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return <p>Loading...</p>; // Show a loader while checking authentication
    }

    return isAuthenticated ? <Outlet /> : <Navigate to="/error" />;
};

export default ProtectedRoute;
