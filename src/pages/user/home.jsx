import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("Logout called");
    const API_URL = import.meta.env.VITE_API_URL;
    console.log(API_URL);
    try {
      const response = await fetch(`${API_URL}/auth/logout`, { // Replace with your API URL
        method: "POST",
        credentials: "include", // Ensures cookies (session) are sent
        headers: { "Content-Type": "application/json" }
      });
  
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }
  
      const data = await response.json();
  
      if (data.success) {
        console.log("Logout successful");
        navigate("/"); // Redirect to login page
      } else {
        console.error("Logout error:", data.message);
      }
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <h1 className="text-2xl font-bold mb-4">Welcome to PrintEase</h1>
        <p className="text-gray-600 mb-6">This is your user home!</p>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Home;
