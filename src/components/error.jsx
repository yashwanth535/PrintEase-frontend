import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-red-500">Unauthorized Access</h1>
      <p className="text-gray-600 mt-2">Please log in to access this page.</p>
      <button
        onClick={() => navigate("/")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Go to Login
      </button>
    </div>
  );
};

export default Unauthorized;
