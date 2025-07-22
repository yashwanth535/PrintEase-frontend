// File: CashfreeCheckout.js
import React, { useState } from 'react';

const CashfreeCheckout = () => {
  const [sessionId, setSessionId] = useState('');
  const [mode, setMode] = useState('sandbox'); // or 'production'

  const handlePayment = () => {
    if (!sessionId) {
      alert('Please enter a valid Payment Session ID');
      return;
    }

    const cashfree = window.Cashfree({
      mode: mode, // 'sandbox' or 'production'
    });

    const checkoutOptions = {
      paymentSessionId: sessionId,
      returnUrl:"http://localhost:5173?myorder={order_id}",
      redirectTarget: '_blank', // _blank, _modal, _top also supported
    };

    cashfree.checkout(checkoutOptions);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h2>Cashfree Payment Simulator</h2>

      <label htmlFor="sessionId">Enter Payment Session ID:</label><br />
      <input
        type="text"
        id="sessionId"
        value={sessionId}
        onChange={(e) => setSessionId(e.target.value)}
        style={{ width: '300px', margin: '10px 0', padding: '8px' }}
        placeholder="paste session_id here"
      />
      <br />

      <label>Mode:</label>{' '}
      <select onChange={(e) => setMode(e.target.value)} value={mode}>
        <option value="sandbox">Sandbox</option>
        <option value="production">Production</option>
      </select>

      <br /><br />
      <button
        onClick={handlePayment}
        style={{
          padding: '10px 20px',
          backgroundColor: '#00b386',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Open Checkout
      </button>
    </div>
  );
};

export default CashfreeCheckout;
