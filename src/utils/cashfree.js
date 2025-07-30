// Cashfree SDK utility functions

/**
 * Wait for Cashfree SDK to be available
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise} Promise that resolves when SDK is available
 */
export const waitForCashfree = (timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    
    const checkCashfree = () => {
      if (typeof window.Cashfree !== 'undefined') {
        resolve(window.Cashfree);
        return;
      }
      
      if (Date.now() - startTime > timeout) {
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

    return new Promise((resolve, reject) => {
      try {
        cashfree.checkout(checkoutOptions);
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  } catch (error) {
    throw new Error(`Failed to initialize Cashfree: ${error.message}`);
  }
};

/**
 * Check if Cashfree SDK is available
 * @returns {boolean} True if SDK is available
 */
export const isCashfreeAvailable = () => {
  return typeof window.Cashfree !== 'undefined';
}; 