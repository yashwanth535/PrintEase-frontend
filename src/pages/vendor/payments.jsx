import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaMoneyBillWave, FaClipboardList, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";
import VendorHeader from '../../components/vendor/header';

const Payments = () => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const [paymentData, setPaymentData] = useState({
    pending: 0,
    received: 0,
    transactions: []
  });

  useEffect(() => {
    fetchPaymentData();
  }, []);

  const fetchPaymentData = async () => {
    try {
      const response = await fetch(`${API_URL}/api/vendor/payments`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setPaymentData(data.payments);
      }
    } catch (error) {
      console.error("Error fetching payment data:", error);
    }
  };


  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
    hover: { scale: 1.02, transition: { duration: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <VendorHeader/>
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-32">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/60 backdrop-blur-sm border border-black/5 p-6 rounded-xl shadow-lg"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white/60 backdrop-blur-sm border border-black/5 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:bg-white/80 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              <div className="relative z-10">
                <h3 className="font-semibold text-blue-800 text-lg mb-2">Pending Payments</h3>
                <p className="text-3xl font-bold text-blue-600">₹{paymentData.pending}</p>
              </div>
            </motion.div>
            <motion.div 
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              className="bg-white/60 backdrop-blur-sm border border-black/5 p-6 rounded-xl shadow-lg relative overflow-hidden group hover:bg-white/80 transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
              <div className="relative z-10">
                <h3 className="font-semibold text-green-800 text-lg mb-2">Received Payments</h3>
                <p className="text-3xl font-bold text-green-600">₹{paymentData.received}</p>
              </div>
            </motion.div>
          </div>

          <div className="bg-white/60 backdrop-blur-sm border border-black/5 p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Transactions</h2>
            <div className="space-y-4">
              {paymentData.transactions.map((transaction, index) => (
                <motion.div
                  key={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="bg-white/60 backdrop-blur-sm border border-black/5 p-4 rounded-xl shadow-lg relative overflow-hidden group hover:bg-white/80 transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-800">{transaction.orderId}</p>
                        <p className="text-sm text-gray-600">{transaction.date}</p>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.type === 'received' ? 'text-green-600' : 'text-blue-600'
                        }`}>
                          ₹{transaction.amount}
                        </p>
                        <p className="text-sm text-gray-600">{transaction.status}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Payments; 