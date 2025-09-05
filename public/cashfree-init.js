// Cashfree SDK initialization
window.addEventListener('load', function() {
  let retryCount = 0;
  const maxRetries = 3;
  
  const loadCashfreeSDK = () => {
    if (typeof window.Cashfree !== 'undefined') {
      console.log('Cashfree SDK already loaded');
      return;
    }
    
    if (retryCount >= maxRetries) {
      console.error('Failed to load Cashfree SDK after multiple attempts');
      return;
    }
    
    console.warn(`Cashfree SDK not loaded, attempting to reload... (attempt ${retryCount + 1})`);
    retryCount++;
    
    const script = document.createElement('script');
    script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
    script.async = true;
    
    script.onload = function() {
      console.log('Cashfree SDK loaded successfully');
    };
    
    script.onerror = function() {
      console.error('Failed to load Cashfree SDK, retrying...');
      setTimeout(loadCashfreeSDK, 1000);
    };
    
    document.head.appendChild(script);
  };
  
  // Initial check and load
  setTimeout(loadCashfreeSDK, 100);
});
