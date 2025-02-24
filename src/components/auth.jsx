import { FaEye, FaEyeSlash } from 'react-icons/fa';
import React, { useState, useEffect } from "react"; // Add useEffect to the import

const AuthForms = ({ initialForm = "signin" }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formType, setFormType] = useState(initialForm);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    setFormType(initialForm);
  }, [initialForm]);

  const handleSignIn = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Login successful"); // Display success message
        setTimeout(() => {
          window.location.href = "/home"; // Redirect after 1.5 seconds
        }, 1500);
      } else {
        setMessage(data.message); // Display error message if login fails
      }
      
    } catch (error) {
      console.error("Error during signin:", error);
    }
    setLoading(false);
  };

  const handleOTP = async (event,type) => { 
    event.preventDefault();
    setLoading(true);
  
    try {
      // Step 1: Check if the user exists
      const response = await fetch(`${API_URL}/auth/userExists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
  
      const data = await response.json();
  
      if (response.status === 400) {
        if(type==='signup'){
          setMessage("Email Already registered")
        }
        else{
          generateOTP("This is your one time password to reset password");
        }
        
      }
      else{
        if(type==='signup'){
          generateOTP("This is your one time password to register into printEase");
        }
        else{
          setMessage("Email is not registered")
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Something went wrong. Please try again.");
    }
  
    setLoading(false);
  };

  const generateOTP = async(text)=>{
    const otpResponse = await fetch(`${API_URL}/auth/generateOTP`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        email, 
        text: text, 
      }),
    });
    const otpData = await otpResponse.json();

    if (otpResponse.ok) {
      setMessage("OTP sent to your email");
      setFormType("otp-reset");
    } else {
      setMessage(otpData.message || "Failed to send OTP");
    }
  }

  const verifyOtp = async (event, type) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/verifyOTP`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();
      if (response.status === 400) {
        setMessage(data.message);
      } else {
        if (type === "signup") {
          signUpUser();
        }
        else{
           console.log("entering password form");
           setFormType("Enter-password");
        }
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
    setLoading(false);
  };

  const signUpUser = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.status === 400) {
        setMessage(data.message);
      } else {
        window.location.href = "/home";
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
    setLoading(false);
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/reset_password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        setMessage("Password reset successful. Click below to sign in.");
      } else {
        setMessage(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Something went wrong. Please try again.");
    }
  
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        {formType === 'signin' && (
          <form onSubmit={handleSignIn} className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-center">Sign In</h2>
            <input
              className="border p-2 rounded-md"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                className="border p-2 rounded-md w-full"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
            >
              Sign In
            </button>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            <p className="text-red-500">{message}</p>
            <div className="flex justify-between text-sm">
              <a href="#" onClick={() => setFormType('reset')} className="text-blue-500">
                Forgot password?
              </a>
              <a href="#" onClick={() => setFormType('signup')} className="text-blue-500">
                Sign up
              </a>
            </div>
          </form>
        )}

        {formType === 'signup' && (
          <form onSubmit={(e) => handleOTP(e, 'signup')} className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-center">Create an Account</h2>
            <input
              className="border p-2 rounded-md"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="relative">
              <input
                className="border p-2 rounded-md w-full"
                placeholder="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <button
              type="submit"
              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600"
            >
              Send OTP
            </button>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            <p className="text-red-500">{message}</p>
            <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-500 hover:underline"
              onClick={() => setFormType("signin")}
            >
              Sign In
            </button>
          </p>
          </form>
        )}

        {formType === 'otp-signup' && (
          <form onSubmit={(e) => verifyOtp(e, 'signup')} className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-center">Enter OTP</h2>
            <input
              className="border p-2 rounded-md"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600"
            >
              Verify OTP
            </button>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            <p className="text-red-500">{message}</p>
          </form>
        )}

        {formType === 'otp-reset' && (
          <form onSubmit={(e) => verifyOtp(e, 'reset')} className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-center">Enter OTP</h2>
            <input
              className="border p-2 rounded-md"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600"
            >
              Verify OTP
            </button>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            <p className="text-red-500">{message}</p>
          </form>
        )}

        {formType === 'reset' && (
          <form onSubmit={(e) => handleOTP(e, 'reset')} className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-center">Reset Password</h2>
            <input
              className="border p-2 rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-yellow-500 text-white p-2 rounded-md hover:bg-yellow-600"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>
            {loading && <p className="text-center text-gray-500">Loading...</p>}
            <p className="text-red-500">{message}</p>
            <button
              type="button"
              className="text-blue-500 text-sm"
              onClick={() => setFormType('signin')}
            >
              Back to Sign In
            </button>
          </form>
        )}

        {formType === 'Enter-password' && (
          <form onSubmit={resetPassword} className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold text-center">Set New Password</h2>
            <div className="relative">
              <input
                className="border p-2 rounded-md w-full"
                placeholder="New Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            <div className="relative">
              <input
                className="border p-2 rounded-md w-full"
                placeholder="Confirm New Password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={toggleConfirmPasswordVisibility}
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              </div>
            </form>
        )}

      </div>
    </div>
  );
};

export default AuthForms;
