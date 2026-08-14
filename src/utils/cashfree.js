// Cashfree SDK utility functions

/**
 * Wait for Cashfree SDK to be available
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Promise that resolves when SDK is available
 */
export const waitForCashfree = (timeout = 10000) => {
  console.log("🕐 Waiting for Cashfree SDK to load...");

  return new Promise((resolve, reject) => {
    const startTime = Date.now();

    const checkCashfree = () => {
      if (typeof window.Cashfree !== 'undefined') {
        console.log("✅ Cashfree SDK loaded successfully.");
        resolve(window.Cashfree);
        return;
      }

      if (Date.now() - startTime > timeout) {
        console.error("❌ Cashfree SDK failed to load within timeout.");
        reject(new Error('Cashfree SDK failed to load within timeout'));
        return;
      }

      setTimeout(checkCashfree, 100);
    };

    checkCashfree();
  });
};

/**
 * Initialize Cashfree checkout
 * @param {string} paymentSessionId - Payment session ID
 * @param {string} returnUrl - Return URL after payment
 * @param {string} mode - 'sandbox' or 'production'
 * @returns {Promise} Promise that resolves when checkout is initiated
 */
export const initializeCashfreeCheckout = async (
  paymentSessionId,
  mode = "sandbox"
) => {
  console.log("🛠️ Initializing Cashfree Checkout...");
  console.log("📦 Payment Session ID:", paymentSessionId);
  console.log("🌐 Mode:", mode);

  if (!paymentSessionId) {
    throw new Error("Payment Session ID is missing");
  }

  try {
    const Cashfree = await waitForCashfree();

    const cashfree = Cashfree({
      mode,
    });

    const checkoutOptions = {
      paymentSessionId,
      redirectTarget: "_self",
    };

    console.log(
      "🚀 Calling cashfree.checkout():",
      checkoutOptions
    );

    await cashfree.checkout(checkoutOptions);

    console.log("✅ Cashfree checkout called successfully.");

  } catch (error) {
    console.error("❌ Cashfree checkout error:", error);
    throw error;
  }
};

/**
 * Check if Cashfree SDK is available
 * @returns {boolean} True if SDK is available
 */
export const isCashfreeAvailable = () => {
  const available = typeof window.Cashfree !== 'undefined';
  console.log(`🔎 Cashfree SDK available: ${available}`);
  return available;
};
