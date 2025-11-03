import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CreditCard,
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  Lock,
} from "lucide-react";
import {
  initializeCashfreeCheckout,
  isCashfreeAvailable,
} from "../../utils/cashfree.js";

const API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sdkLoading, setSdkLoading] = useState(true);
  const [paymentSession, setPaymentSession] = useState(null);

  // Get selected orders and total amount from location state
  const selectedOrders = location.state?.selectedOrders || [];
  const totalAmount = location.state?.totalAmount || 0;

  // Redirect to cart if no orders selected
  useEffect(() => {
    if (selectedOrders.length === 0) navigate("/u/cart");
  }, [selectedOrders, navigate]);

  // Check Cashfree SDK availability
  useEffect(() => {
    const checkSDK = () => {
      if (isCashfreeAvailable()) {
        console.log("✅ Cashfree SDK loaded");
        setSdkLoading(false);
      } else {
        console.log("❌ SDK not ready, retrying...");
        setTimeout(checkSDK, 500);
      }
    };
    checkSDK();
  }, []);

  // Pre-create payment session (so user click stays synchronous)
  useEffect(() => {
    const createPaymentSession = async () => {
      try {
        setError(null);
        const res = await fetch(`${API_URL}/api/order/create-payment`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderIds: selectedOrders }),
        });

        const data = await res.json();

        if (data.success) {
          setPaymentSession({
            id: data.paymentSessionId,
            orderId: data.orderId,
          });
          console.log("✅ Payment session created");
        } else {
          setError(data.message || "Failed to initialize payment session");
        }
      } catch (err) {
        console.error("Error creating payment session:", err);
        setError("Error initializing payment. Please try again.");
      }
    };

    if (selectedOrders.length > 0) createPaymentSession();
  }, [selectedOrders]);

  // Mobile-safe handler (no async/await before popup)
  const handlePaymentClick = () => {
    if (sdkLoading) {
      setError("Payment gateway still loading. Please wait...");
      return;
    }

    if (!paymentSession?.id) {
      setError("Payment session not ready yet. Please wait...");
      return;
    }

    try {
      initializeCashfreeCheckout(
        paymentSession.id,
        `${window.location.origin}/u/payment-success?order_id=${paymentSession.orderId}&total_amount=${totalAmount}`,
        import.meta.env.VITE_PROD === "true" ? "production" : "sandbox"
      );
    } catch (err) {
      console.error("Cashfree init error:", err);
      setError("Payment gateway failed to open. Please try again.");
    }
  };

  const handleBack = () => navigate("/u/cart");

  if (selectedOrders.length === 0) {
    return (
      <div className="min-h-screen minimal-gradient">
        <main className="max-w-2xl mx-auto px-4 py-8 pt-24 mt-20">
          <div className="feature-card floating p-8 text-center">
            <div className="p-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl text-white w-fit mx-auto mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              No Orders Selected
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              No orders selected for checkout.
            </p>
            <button onClick={handleBack} className="btn-primary">
              Back to Cart
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen minimal-gradient">
      <main className="max-w-4xl mx-auto px-4 py-8 pt-24 mt-20">
        <motion.div className="space-y-6">
          {/* Header */}
          <div className="feature-card floating p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-emerald-500 to-blue-600 rounded-xl text-white">
                  <CreditCard size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">Checkout</h1>
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

          {/* Order Summary */}
          <div className="feature-card floating p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg text-white">
                <ShoppingBag size={20} />
              </div>
              <h2 className="text-xl font-bold">Order Summary</h2>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Orders:
                </span>
                <span className="font-medium">{selectedOrders.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Subtotal:
                </span>
                <span className="font-medium">₹{totalAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  Platform Fee:
                </span>
                <span className="font-medium">
                  ₹{(totalAmount * 0.05).toFixed(2)}
                </span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4 flex justify-between text-lg font-bold">
                <span>Total:</span>
                <span>
                  ₹{(totalAmount + totalAmount * 0.05).toFixed(2)}
                </span>
              </div>
            </div>

            {error && (
              <div className="mt-6 p-4 bg-red-50/50 dark:bg-red-900/20 border border-red-200/50 dark:border-red-800/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertCircle
                    size={16}
                    className="text-red-600 dark:text-red-400"
                  />
                  <p className="text-red-600 dark:text-red-400 text-sm font-medium">
                    {error}
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={handlePaymentClick}
              disabled={!paymentSession?.id || sdkLoading}
              className="w-full btn-primary mt-6 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {sdkLoading ? (
                <>
                  <div className="animate-spin h-5 w-5 border-b-2 border-white"></div>
                  Loading Gateway...
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
        </motion.div>
      </main>
    </div>
  );
};

export default Checkout;
