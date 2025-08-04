import { useEffect, useState } from "react";
import UserHeader from "../../components/user/header";
import { FaClipboardList, FaRupeeSign, FaCheckCircle, FaMoneyBillAlt } from "react-icons/fa";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    paidOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/order`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        const orders = data.orders;
        const totalOrders = orders.length;
        const paidOrders = orders.filter((o) => o.paymentStatus === "paid").length;
        const totalSpent = orders
          .filter((o) => o.paymentStatus === "paid")
          .reduce((sum, o) => sum + o.totalPrice, 0);
        const completedOrders = orders.filter((o) => o.status === "completed").length;

        setStats({ totalOrders, paidOrders, totalSpent, completedOrders });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-6 flex items-center gap-4 shadow-sm">
      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{label}</p>
        <p className="text-xl font-semibold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <UserHeader />
      <main className="max-w-7xl mx-auto px-4 py-10 mt-32">
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Dashboard Overview</h1>

        {loading ? (
          <p className="text-gray-500 dark:text-gray-400">Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={FaClipboardList} label="Total Orders" value={stats.totalOrders} />
            <StatCard icon={FaMoneyBillAlt} label="Paid Orders" value={stats.paidOrders} />
            <StatCard icon={FaCheckCircle} label="Completed Orders" value={stats.completedOrders} />
            <StatCard icon={FaRupeeSign} label="Total Spent" value={`₹${stats.totalSpent}`} />
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
