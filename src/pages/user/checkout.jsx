import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CreditCard, ArrowLeft, User, Mail, Phone, ShoppingBag, AlertCircle, Lock } from "lucide-react";
import { initializeCashfreeCheckout, isCashfreeAvailable } from "../../utils/cashfree.js";

const API_URL = import.meta.env.VITE_API_URL;

// Default customer details (bypass)
const DEFAULT_CUSTOMER = {
  name: "Yashwanth Munikuntla",
  email: "yashwanth.lumia535@gmail.com",
  phone: "09966990206"
};

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sdkLoading, setSdkLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState(DEFAULT_CUSTOMER);

  // Get selected orders from location state
  const selectedOrders = location.state?.selectedOrders || [];
  const totalAmount = location.state?.totalAmount || 0;

  useEffect(() => {
    if (selectedOrders.length === 0) {
      navigate('/u/cart');
    }
  }, [selectedOrders, navigate]);

  // Check if Cashfree SDK is loaded
  useEffect(() => {
    const checkSDK = () => {
      console.log("🔍 Checking if Cashfree SDK is available...");

      if (isCashfreeAvailable()) {
        console.log("✅ Cashfree SDK is available.");
        setSdkLoading(false);
      } else {
        console.log("❌ Cashfree SDK not available yet. Retrying in 500ms...");
        // Retry after a short delay
        setTimeout(checkSDK, 500);
      }
    };

    checkSDK();
  }, []);


  const handleInputChange = (e) => {
    // kept in case you later want to allow edits — but inputs are readOnly by default now
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    // No longer blocking for missing customer details — defaults provided
    try {
      setLoading(true);
      setError(null);

      // Create payment order
      const response = await fetch(`${API_URL}/api/order/create-payment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderIds: selectedOrders,
          customerDetails
        }),
      });

      const data = await response.json();

      if (data.success) {
        try {
          // Check if Cashfree SDK is available
          if (!isCashfreeAvailable()) {
            setError("Payment gateway not loaded. Please refresh the page and try again.");
            return;
          }

          // Initialize Cashfree checkout with utility function
          await initializeCashfreeCheckout(
            data.paymentSessionId,
            `${window.location.origin}/u/payment-success?order_id=${data.orderId}`,
            import.meta.env.VITE_PROD === 'true' ? 'production' : 'sandbox'
          );
        } catch (error) {
          console.error("Cashfree initialization error:", error);
          setError(`Payment gateway error: ${error.message}`);
        }
      } else {
        setError(data.message || "Failed to create payment order");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      setError("Error creating payment. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/u/cart');
  };

  if (selectedOrders.length === 0) {
    return (
      <div className="min-h-screen minimal-gradient">
        <main className="max-w-2xl mx-auto px-4 py-8 pt-24 mt-20">
          <div className="feature-card floating p-8 text-center">
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white w-fit mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              No Orders Selected
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">No orders selected for checkout.</p>
            <button onClick={handleBack} className="btn-primary">Back to Cart</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-4xl mx-auto px-4 py-8 pt-24 mt-20">
        <motion.div className="space-y-6">
          <div className="feature-card floating p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                    Checkout
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Complete your payment to process your orders
                  </p>
                </div>
              </div>
              <button 
                onClick={handleBack}
                className="btn-secondary flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Cart
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Customer Details (prefilled & readOnly) */}
            

            {/* Order Summary */}
            <div className="feature-card floating p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white">
                  <ShoppingBag size={20} />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                  Order Summary
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Orders:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">{selectedOrders.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">₹{(totalAmount / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-400">GST (18%):</span>
                  <span className="font-medium text-slate-900 dark:text-slate-100">₹{((totalAmount / 1.18) * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between text-lg font-bold">
                  <span className="text-slate-900 dark:text-slate-100">Total:</span>
                  <span className="text-slate-900 dark:text-slate-100">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
                    <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
                  </div>
                </div>
              )}

              <button
                 onClick={handlePayment}
                 disabled={loading || sdkLoading}
                 className="w-full btn-primary mt-6 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                {loading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : sdkLoading ? (
                  <>
                    <div className="animate-spin h-5 w-5 border-b-2 border-white"></div>
                    Loading Payment Gateway...
                  </>
                ) : (
                  <>
                    <Lock size={20} />
                    Pay ₹{totalAmount.toFixed(2)}
                  </>
                )}
              </button>

              <div className="mt-4 text-xs text-slate-500 dark:text-slate-400 text-center flex items-center justify-center gap-1">
                <Lock size={12} />
                Secure payment • By proceeding, you agree to our terms and conditions
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Checkout;
