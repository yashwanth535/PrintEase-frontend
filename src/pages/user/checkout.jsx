import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { initializeCashfreeCheckout, isCashfreeAvailable } from "../../utils/cashfree.js";

const API_URL = import.meta.env.VITE_API_URL;

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sdkLoading, setSdkLoading] = useState(true);
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    phone: ""
  });

  // Get selected orders from location state
  const selectedOrders = location.state?.selectedOrders || [];
  const totalAmount = location.state?.totalAmount || 0;

  useEffect(() => {
    if (selectedOrders.length === 0) {
      navigate('/u/cart');
    }
  }, [selectedOrders, navigate]);

  // Check if Cashfree SDK is loaded
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
    const { name, value } = e.target;
    setCustomerDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = async () => {
    if (!customerDetails.name || !customerDetails.email || !customerDetails.phone) {
      alert("Please fill in all customer details");
      return;
    }

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
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
        <main className="pt-32 md:pt-36 px-4 pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 dark:text-gray-400">No orders selected for checkout.</p>
            <button onClick={handleBack} className="btn-primary mt-4">Back to Cart</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <main className="pt-32 md:pt-36 px-4 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Checkout
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Complete your payment to process your orders
              </p>
            </div>
            <button 
              onClick={handleBack}
              className="btn-secondary flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Cart
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Customer Details */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Customer Details
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={customerDetails.name}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={customerDetails.email}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerDetails.phone}
                    onChange={handleInputChange}
                    className="input-field"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                Order Summary
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Orders:</span>
                  <span className="font-medium text-gray-900 dark:text-white">{selectedOrders.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Subtotal:</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{(totalAmount / 1.18).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">GST (18%):</span>
                  <span className="font-medium text-gray-900 dark:text-white">₹{((totalAmount / 1.18) * 0.18).toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between text-lg font-bold">
                  <span className="text-gray-900 dark:text-white">Total:</span>
                  <span className="text-black dark:text-white">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
                </div>
              )}

                             <button
                 onClick={handlePayment}
                 disabled={loading || sdkLoading || !customerDetails.name || !customerDetails.email || !customerDetails.phone}
                 className="w-full btn-primary mt-6 py-3 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
               >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </div>
                                 ) : sdkLoading ? (
                   <div className="flex items-center justify-center">
                     <div className="animate-spin h-5 w-5 border-b-2 border-white mr-2"></div>
                     Loading Payment Gateway...
                   </div>
                 ) : (
                   <>
                     <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                     </svg>
                     Pay ₹{totalAmount.toFixed(2)}
                   </>
                 )}
              </button>

              <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                By proceeding, you agree to our terms and conditions
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout; 