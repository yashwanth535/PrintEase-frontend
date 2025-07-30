import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dev = ({ user }) => {
  const api = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndRedirect = async () => {
      try {
        const endpoint = user ? `${api}/api/user/dev` : `${api}/api/vendor/dev`;
        console.log(endpoint);
        const response = await fetch(endpoint, {
          method: "GET",
          credentials: "include", 
        });
        console.log("resopnse came");

        if (response.ok) {
          if (user) {
            navigate("/u/home");
          } else {
            navigate("/v/home");
          }
        } else {
          console.error("Failed to fetch:", response.status);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchAndRedirect();
  }, [user, api, navigate]);

  return <p>Redirecting...</p>; 
}

export default Dev;
