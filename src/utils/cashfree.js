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
export const initializeCashfreeCheckout = async (paymentSessionId, returnUrl, mode = 'sandbox') => {
  console.log("🛠️ Initializing Cashfree Checkout...");
  console.log("📦 Payment Session ID:", paymentSessionId);
  console.log("🔁 Return URL:", returnUrl);
  console.log("🌐 Mode:", mode);

  try {
    const Cashfree = await waitForCashfree();

    const cashfree = Cashfree({
      mode: mode,
    });

    const checkoutOptions = {
      paymentSessionId: paymentSessionId,
      returnUrl: returnUrl,
      redirectTarget: '_self',
    };

    console.log("🚀 Calling `cashfree.checkout()` with options:", checkoutOptions);

    return new Promise((resolve, reject) => {
      try {
        cashfree.checkout(checkoutOptions);
        console.log("✅ Cashfree checkout initialized.");
        resolve();
      } catch (error) {
        console.error("❌ Error during `cashfree.checkout()`:", error);
        reject(error);
      }
    });
  } catch (error) {
    console.error("❌ Failed to initialize Cashfree:", error.message);
    throw new Error(`Failed to initialize Cashfree: ${error.message}`);
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
