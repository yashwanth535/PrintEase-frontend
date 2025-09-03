import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Clock, XCircle, RefreshCw, Home, Mail, Copy } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [error, setError] = useState(null);

  const orderId = searchParams.get('order_id');

  useEffect(() => {
    if (orderId) {
      verifyPayment();
    } else {
      setError("No order ID found");
      setLoading(false);
    }
  }, [orderId]);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/order/verify-payment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const data = await response.json();
      
      if (data.success) {
        setPaymentStatus(data.isPaid ? 'success' : 'pending');
      } else {
        setError(data.message || "Payment verification failed");
        setPaymentStatus('error');
      }
    } catch (error) {
      console.error("Error verifying payment:", error);
      setError("Error verifying payment");
      setPaymentStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrders = () => {
    navigate('/u/home');
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    verifyPayment();
  };

  if (loading) {
    return (
      <div className="min-h-screen minimal-gradient">
        <main className="pt-32 md:pt-36 px-4 pb-8">
          <motion.div 
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="feature-card floating p-12 text-center">
              <div className="relative mb-8">
                <div className="animate-spin h-16 w-16 border-4 border-slate-200 dark:border-slate-700 border-t-slate-600 dark:border-t-slate-400 rounded-full mx-auto"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <RefreshCw className="h-6 w-6 text-slate-600 dark:text-slate-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                Verifying Payment
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg">
                Please wait while we verify your payment...
              </p>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="pt-32 md:pt-36 px-4 pb-8">
        <motion.div 
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {paymentStatus === 'success' && (
            <motion.div 
              className="feature-card floating p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="relative mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-emerald-400/20 rounded-full animate-pulse"></div>
              </motion.div>
              
              <motion.h1 
                className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Payment Successful!
              </motion.h1>
              
              <motion.p 
                className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Your payment has been processed successfully. Your orders have been moved to active status and will be processed by the vendors.
              </motion.p>
              
              <motion.div 
                className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border border-emerald-200/50 dark:border-emerald-800/50 rounded-xl p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Copy className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-emerald-800 dark:text-emerald-200 font-semibold">
                    Order ID: {orderId}
                  </p>
                </div>
                <div className="flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                    You will receive an email confirmation shortly.
                  </p>
                </div>
              </motion.div>
              
              <motion.button
                onClick={handleViewOrders}
                className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Home className="h-5 w-5" />
                View My Orders
              </motion.button>
            </motion.div>
          )}

          {paymentStatus === 'pending' && (
            <motion.div 
              className="feature-card floating p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="relative mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <Clock className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-amber-400/20 rounded-full animate-pulse"></div>
              </motion.div>
              
              <motion.h1 
                className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Payment Pending
              </motion.h1>
              
              <motion.p 
                className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Your payment is still being processed. Please wait a few minutes and check again.
              </motion.p>
              
              <motion.div 
                className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border border-amber-200/50 dark:border-amber-800/50 rounded-xl p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Copy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  <p className="text-amber-800 dark:text-amber-200 font-semibold">
                    Order ID: {orderId}
                  </p>
                </div>
                <p className="text-amber-700 dark:text-amber-300 text-sm">
                  You can check your order status in your dashboard.
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.button
                  onClick={handleRetry}
                  className="btn-secondary inline-flex items-center gap-2 px-6 py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Check Again
                </motion.button>
                <motion.button
                  onClick={handleViewOrders}
                  className="btn-primary inline-flex items-center gap-2 px-6 py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="h-4 w-4" />
                  View Orders
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {paymentStatus === 'error' && (
            <motion.div 
              className="feature-card floating p-12 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <motion.div 
                className="relative mb-8"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, type: "spring", stiffness: 200 }}
              >
                <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                  <XCircle className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -inset-2 bg-red-400/20 rounded-full animate-pulse"></div>
              </motion.div>
              
              <motion.h1 
                className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                Payment Verification Failed
              </motion.h1>
              
              <motion.p 
                className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                {error || "We couldn't verify your payment. Please contact support if you believe this is an error."}
              </motion.p>
              
              <motion.div 
                className="bg-white/60 dark:bg-black/40 backdrop-blur-sm border border-red-200/50 dark:border-red-800/50 rounded-xl p-6 mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Copy className="h-5 w-5 text-red-600 dark:text-red-400" />
                  <p className="text-red-800 dark:text-red-200 font-semibold">
                    Order ID: {orderId}
                  </p>
                </div>
                <p className="text-red-700 dark:text-red-300 text-sm">
                  If you made a payment, please contact our support team.
                </p>
              </motion.div>
              
              <motion.div 
                className="flex flex-col sm:flex-row gap-4 justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <motion.button
                  onClick={handleRetry}
                  className="btn-secondary inline-flex items-center gap-2 px-6 py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </motion.button>
                <motion.button
                  onClick={handleViewOrders}
                  className="btn-primary inline-flex items-center gap-2 px-6 py-3"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Home className="h-4 w-4" />
                  View Orders
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default PaymentSuccess; 