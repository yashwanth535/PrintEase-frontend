import { useNavigate } from "react-router-dom";
import UserHeader from "../../components/user/header";

const Checkout = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen mt-10 bg-gray-100">
      <UserHeader />
      <div className="max-w-7xl mx-auto pt-32 px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">cart</h2>
          <button onClick={() => navigate('/u/home')} className="text-blue-600 hover:underline">Back to Home</button>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <p className="text-gray-700">This is the checkout page. Add your checkout logic here.</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 