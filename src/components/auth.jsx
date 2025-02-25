import { FaEye, FaEyeSlash } from 'react-icons/fa';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AuthForms = ({ initialForm = "signin", onClose }) => {
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
  const [isVendor, setIsVendor] = useState(false);

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
        body: JSON.stringify({ email, password, isVendor }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage("Login successful");
        setTimeout(() => {
          window.location.href = "/home";
        }, 1500);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error during signin:", error);
    }
    setLoading(false);
  };

  const handleOTP = async (event, type) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/userExists`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, isVendor }),
      });

      const data = await response.json();

      if (response.status === 400) {
        if (type === 'signup') {
          setMessage("Email Already registered")
        } else {
          generateOTP("This is your one time password to reset password");
        }
      } else {
        if (type === 'signup') {
          generateOTP("This is your one time password to register into printEase");
        } else {
          setMessage("Email is not registered")
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const generateOTP = async (text) => {
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
        } else {
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
        body: JSON.stringify({ email, password, isVendor }),
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white p-12 rounded-xl shadow-2xl w-full max-w-lg"
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 pr-5">
            {formType === 'signin' ? 'Welcome Back' : 
             formType === 'signup' ? 'Create Account' :
             formType === 'reset' ? 'Reset Password' :
             formType.includes('otp') ? 'Verify OTP' : 'New Password'}
          </h2>
          {(formType === 'signin' || formType === 'signup') && (
            <div className="flex items-center space-x-2">
              <span className={`text-sm ${!isVendor ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>User</span>
              <button
                onClick={() => setIsVendor(!isVendor)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none
                  ${isVendor ? 'bg-blue-600' : 'bg-gray-200'}`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300
                    ${isVendor ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
              <span className={`text-sm ${isVendor ? 'text-blue-600 font-semibold' : 'text-gray-500'}`}>Vendor</span>
            </div>
          )}
        </div>

        {formType === 'signin' && (
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {message && (
              <p className={`text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <div className="flex justify-between text-sm">
              <button
                type="button"
                onClick={() => setFormType('reset')}
                className="text-blue-600 hover:text-blue-800 transition duration-200"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => setFormType('signup')}
                className="text-blue-600 hover:text-blue-800 transition duration-200"
              >
                Create account
              </button>
            </div>
          </form>
        )}

        {formType === 'signup' && (
          <form onSubmit={(e) => handleOTP(e, 'signup')} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Continue'}
            </button>

            {message && (
              <p className={`text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <p className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 transition duration-200"
                onClick={() => setFormType("signin")}
              >
                Sign In
              </button>
            </p>
          </form>
        )}

        {(formType === 'otp-signup' || formType === 'otp-reset') && (
          <form onSubmit={(e) => verifyOtp(e, formType === 'otp-signup' ? 'signup' : 'reset')} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Enter OTP</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                type="text"
                placeholder="Enter the OTP sent to your email"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>

            {message && (
              <p className={`text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        )}

        {formType === 'reset' && (
          <form onSubmit={(e) => handleOTP(e, 'reset')} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <input
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Send OTP'}
            </button>

            {message && (
              <p className={`text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}

            <button
              type="button"
              className="w-full text-center text-sm text-blue-600 hover:text-blue-800 transition duration-200"
              onClick={() => setFormType('signin')}
            >
              Back to Sign In
            </button>
          </form>
        )}

        {formType === 'Enter-password' && (
          <form onSubmit={resetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <div className="relative">
                <input
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  onClick={toggleConfirmPasswordVisibility}
                >
                  {showConfirmPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
              disabled={loading}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </button>

            {message && (
              <p className={`text-center ${message.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
                {message}
              </p>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AuthForms;