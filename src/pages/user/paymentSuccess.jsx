import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

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
      <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
        <main className="pt-32 md:pt-36 px-4 pb-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="animate-spin h-12 w-12 border-b-2 border-black dark:border-white mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Please wait while we verify your payment...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <main className="pt-32 md:pt-36 px-4 pb-8">
        <div className="max-w-2xl mx-auto">
          {paymentStatus === 'success' && (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Successful!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your payment has been processed successfully. Your orders have been moved to active status and will be processed by the vendors.
              </p>
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
                <p className="text-green-800 dark:text-green-200 text-sm">
                  <strong>Order ID:</strong> {orderId}
                </p>
                <p className="text-green-800 dark:text-green-200 text-sm mt-1">
                  You will receive an email confirmation shortly.
                </p>
              </div>
              <button
                onClick={handleViewOrders}
                className="btn-primary"
              >
                View My Orders
              </button>
            </div>
          )}

          {paymentStatus === 'pending' && (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Pending
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your payment is still being processed. Please wait a few minutes and check again.
              </p>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  <strong>Order ID:</strong> {orderId}
                </p>
                <p className="text-yellow-800 dark:text-yellow-200 text-sm mt-1">
                  You can check your order status in your dashboard.
                </p>
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="btn-secondary"
                >
                  Check Again
                </button>
                <button
                  onClick={handleViewOrders}
                  className="btn-primary"
                >
                  View Orders
                </button>
              </div>
            </div>
          )}

          {paymentStatus === 'error' && (
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Payment Verification Failed
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || "We couldn't verify your payment. Please contact support if you believe this is an error."}
              </p>
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
                <p className="text-red-800 dark:text-red-200 text-sm">
                  <strong>Order ID:</strong> {orderId}
                </p>
                <p className="text-red-800 dark:text-red-200 text-sm mt-1">
                  If you made a payment, please contact our support team.
                </p>
              </div>
              <div className="flex space-x-4 justify-center">
                <button
                  onClick={handleRetry}
                  className="btn-secondary"
                >
                  Try Again
                </button>
                <button
                  onClick={handleViewOrders}
                  className="btn-primary"
                >
                  View Orders
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default PaymentSuccess; 