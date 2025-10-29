import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Shield } from 'lucide-react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const AdminLandingPage = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formType, setFormType] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Clear message when form type changes
  useEffect(() => {
    setMessage("");
    setOtpDigits(["", "", "", "", "", ""]);
    setOtp("");
  }, [formType]);

  // Update OTP string when digits change
  useEffect(() => {
    setOtp(otpDigits.join(""));
  }, [otpDigits]);

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    if (value && !/^[0-9]$/.test(value)) return;
    
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
      }
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newDigits = [...otpDigits];
    
    for (let i = 0; i < 6; i++) {
      newDigits[i] = pastedData[i] || "";
    }
    
    setOtpDigits(newDigits);
    
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    const targetInput = document.getElementById(`otp-${lastFilledIndex}`);
    if (targetInput) targetInput.focus();
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setMessage(""); 
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.success) {
        window.location.href = "/admin/home";
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error during signin:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setMessage(""); 
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/auth/userExists`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.status === 400) {
        generateOTP("This is your one time password to reset admin password");
      } else {
        setMessage("Email is not registered as admin");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const generateOTP = async (text) => {
    const otpResponse = await fetch(`${API_URL}/api/admin/auth/generateOTP`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, text }),
    });
    const otpData = await otpResponse.json();

    if (otpResponse.ok) {
      setMessage("OTP sent to your email");
      setLoading(false);
      setFormType("otp-verify");
    } else {
      setMessage(otpData.message || "Failed to send OTP");
      setLoading(false);
    }
  };

  const verifyOtp = async (event) => {
    event.preventDefault();
    setMessage(""); 
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/admin/auth/verifyOTP`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
      });
      const data = await response.json();
      if (response.status === 400) {
        setMessage(data.message);
      } else {
        setFormType("new-password");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setMessage(""); 
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/admin/auth/reset_password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Password reset successful. Redirecting to sign in...");
        setTimeout(() => setFormType("signin"), 2000);
      } else {
        setMessage(data.message || "Failed to reset password.");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex flex-col">
      {/* Simple Header */}
      <header className="p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            PrintEase
          </h1>
        </div>
      </header>

      {/* Main Content - Centered Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            {/* Title */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                {formType === 'signin' ? 'Admin Portal' : 
                 formType === 'forgot-password' ? 'Reset Password' :
                 formType === 'otp-verify' ? 'Verify OTP' : 'New Password'}
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                {formType === 'signin' ? 'Sign in to access the admin dashboard' :
                 formType === 'forgot-password' ? 'Enter your email to receive a reset code' :
                 formType === 'otp-verify' ? 'Enter the code sent to your email' : 'Create your new password'}
              </p>
            </div>

            {/* Sign In Form */}
            {formType === 'signin' && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="admin@printease.com"
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Signing in...' : 'Sign In'}
                </button>

                {message && (
                  <div className={`text-center p-3 rounded-lg ${message.includes('successful') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}

                <div className="text-center">
                  <button 
                    onClick={() => setFormType('forgot-password')}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    Forgot password?
                  </button>
                </div>
              </div>
            )}

            {/* Forgot Password Form */}
            {formType === 'forgot-password' && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="admin@printease.com"
                  />
                </div>

                <button
                  onClick={handleForgotPassword}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Sending OTP...' : 'Send Reset Code'}
                </button>

                {message && (
                  <div className={`text-center p-3 rounded-lg ${message.includes('successful') || message.includes('sent') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}

                <div className="text-center">
                  <button 
                    onClick={() => setFormType('signin')}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    ← Back to Sign In
                  </button>
                </div>
              </div>
            )}

            {/* OTP Verification Form */}
            {formType === 'otp-verify' && (
              <div className="space-y-5">
                <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                  {otpDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(index, e)}
                      className="w-12 h-12 text-center text-lg font-mono font-semibold bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                      autoComplete="off"
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  Paste your 6-digit code or enter each digit individually
                </p>

                <button
                  onClick={verifyOtp}
                  disabled={loading || otp.length !== 6}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                {message && (
                  <div className={`text-center p-3 rounded-lg ${message.includes('successful') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}

                <div className="text-center">
                  <button 
                    onClick={() => setFormType('forgot-password')}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  >
                    ← Back
                  </button>
                </div>
              </div>
            )}

            {/* New Password Form */}
            {formType === 'new-password' && (
              <div className="space-y-5">
                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                      {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-12 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                    </button>
                  </div>
                </div>

                {password !== confirmPassword && password && confirmPassword && (
                  <div className="text-center p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20">
                    <p className="text-xs text-amber-700 dark:text-amber-300">Passwords don't match</p>
                  </div>
                )}

                <button
                  onClick={resetPassword}
                  disabled={loading || password !== confirmPassword || !password}
                  className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Updating Password...' : 'Update Password'}
                </button>

                {message && (
                  <div className={`text-center p-3 rounded-lg ${message.includes('successful') ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300' : 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                    <p className="text-sm font-medium">{message}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Simple Footer */}
      <footer className="p-6 text-center text-sm text-slate-600 dark:text-slate-400">
        <p>&copy; {new Date().getFullYear()} PrintEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default AdminLandingPage;