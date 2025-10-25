/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const AuthForms = ({ initialForm = "signin-form", onClose }) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [formType, setFormType] = useState(initialForm);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState('');
const [phone, setPhone] = useState('');
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    setFormType(initialForm);
  }, [initialForm]);

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
    // Only allow single digit
    if (value.length > 1) return;
    
    // Only allow numbers
    if (value && !/^[0-9]$/.test(value)) return;
    
    const newDigits = [...otpDigits];
    newDigits[index] = value;
    setOtpDigits(newDigits);
    
    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
        const newDigits = [...otpDigits];
        newDigits[index - 1] = "";
        setOtpDigits(newDigits);
      }
    }
    
    // Handle arrow keys
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
    
    // Focus the last filled input or first empty one
    const lastFilledIndex = Math.min(pastedData.length - 1, 5);
    const targetInput = document.getElementById(`otp-${lastFilledIndex}`);
    if (targetInput) targetInput.focus();
  };

  const handleSignIn = async (event) => {
    event.preventDefault();
    setMessage(""); 
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signin`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isVendor }),
      });
      const data = await response.json();
      if (data.success) {
          window.location.href = isVendor?"v/home":"u/home";
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error during signin:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const handleOTP = async (event, type) => {
    event.preventDefault();
    setMessage(""); 
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/userExists`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, isVendor }),
      });

      const data = await response.json();

      if (response.status === 400) {
        if (type === 'signup') {
          setMessage("Email Already registered")
        } else {
          generateOTP("This is your one time password to reset password",type);
        }
      } else {
        if (type === 'signup') {
          generateOTP("This is your one time password to register into printEase",type);
        } else {
          setMessage("Email is not registered")
        }
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  const generateOTP = async (text,type) => {
    const otpResponse = await fetch(`${API_URL}/api/auth/generateOTP`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        text: text,
      }),
    });
    const otpData = await otpResponse.json();

    if (otpResponse.ok) {
      setMessage("OTP sent to your email");
      setLoading(false);
      if(type==='signup'){
        setFormType("otp-signup")
      }else{
        setFormType("otp-reset");
      }
    } else {
      setMessage(otpData.message || "Failed to send OTP");
    }
  }

  const verifyOtp = async (event, type) => {
    event.preventDefault();
    setMessage(""); 
    setLoading(true);
    console.log('otp is:'+otp);
    try {
      const response = await fetch(`${API_URL}/api/auth/verifyOTP`, {
        method: "POST",
        credentials: "include",
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
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, isVendor,fullName,phone}),
      });
      const data = await response.json();
      if (response.status === 400) {
        setMessage(data.message);
      } else {
        window.location.href = isVendor?"v/home":"u/home";
      }
    } catch (error) {
      console.error("Error during signup:", error);
    }
    finally{
      setLoading(false);
    }
  };

  const resetPassword = async (event) => {
    event.preventDefault();
    setMessage(""); 
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/reset_password`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password ,isVendor}),
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
    finally{
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="flex justify-center items-center h-[600px] max-w-screen overflow-hidden -pl-20 py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md floating"
      >

        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-sans font-bold text-slate-900 dark:text-slate-100 pr-5">
            {formType === 'signin-form' ? 'Welcome Back' : 
             formType === 'signup-form' ? 'Create Account' :
             formType === 'reset-password-form' ? 'Reset Password' :
             formType.includes('otp') ? 'Verify OTP' : 'New Password'}
          </h2>
          {(formType === 'signin-form' || formType === 'signup-form' || formType=== 'reset-password-form') && (
            <div className="flex items-center space-x-3 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-full p-1">
              <span className={`text-xs font-medium px-2 ${!isVendor ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>User</span>
              <button
                onClick={() => setIsVendor(!isVendor)}
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500
                  ${isVendor ? 'bg-slate-900 dark:bg-slate-100' : 'bg-slate-300 dark:bg-slate-600'}`}
              >
                <span
                  className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300
                    ${isVendor ? 'translate-x-5' : 'translate-x-1'}`}
                />
              </button>
              <span className={`text-xs font-medium px-2 ${isVendor ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>Vendor</span>
            </div>
          )}
        </div>

        {formType === 'signin-form' && (
          <form onSubmit={handleSignIn} className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                className="input-field"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <input
                  className="input-field pr-12"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full btn-primary mt-6"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {message && (
              <div className={`text-center p-3 rounded-xl backdrop-blur-sm ${message.includes('successful') ? 'bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            <div className="flex justify-between text-sm pt-4">
              <button
                type="button"
                onClick={() => setFormType('reset-password-form')}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors duration-200"
              >
                Forgot password?
              </button>
              <button
                type="button"
                onClick={() => setFormType('signup-form')}
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors duration-200"
              >
                Create account
              </button>
            </div>
          </form>
        )}

        {formType === 'signup-form' && (
          <form onSubmit={(e) => handleOTP(e, 'signup')} className="space-y-6">

            {/* Full Name */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <input
                className="input-field"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Phone Number
              </label>
              <input
                className="input-field"
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Email
              </label>
              <input
                className="input-field"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  className="input-field pr-12"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Choose a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full btn-primary mt-6"
              disabled={loading}
            >
              {loading ? 'Sending OTP...' : 'Continue'}
            </button>

            {/* Message Display */}
            {message && (
              <div
                className={`text-center p-3 rounded-xl backdrop-blur-sm ${
                  message.includes('successful')
                    ? 'bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                    : 'bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                }`}
              >
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            {/* Switch to Sign In */}
            <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-4">
              Already have an account?{' '}
              <button
                type="button"
                className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors duration-200"
                onClick={() => setFormType('signin-form')}
              >
                Sign In
              </button>
            </p>
          </form>
        )}


        {(formType === 'otp-signup' || formType === 'otp-reset') && (
          <form onSubmit={(e) => verifyOtp(e, formType === 'otp-signup' ? 'signup' : 'reset')} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">We&apos;ve sent a verification code to your email</p>
            </div>
            
            <div className="space-y-4">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300 text-center block">Enter Verification Code</label>
              <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    className="w-12 h-12 text-center text-lg font-mono font-semibold bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100"
                    type="text"
                    inputMode="numeric"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    autoComplete="off"
                  />
                ))}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 text-center">Paste your 6-digit code or enter each digit individually</p>
            </div>

            <motion.button
              type="submit"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full btn-primary mt-6"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </motion.button>

            {message && (
              <div className={`text-center p-3 rounded-xl backdrop-blur-sm ${message.includes('successful') ? 'bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
            
            <div className="text-center pt-4">
              <button
                type="button"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors duration-200"
                onClick={() => setFormType(formType === 'otp-signup' ? 'signup-form' : 'reset-password-form')}
              >
                ← Back
              </button>
            </div>
          </form>
        )}

        {formType === 'reset-password-form' && (
          <form onSubmit={(e) => handleOTP(e, 'reset')} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">Enter your email to receive a password reset code</p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input
                className="input-field"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <motion.button
              type="submit"
              className="w-full btn-primary mt-6"
              disabled={loading}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {loading ? 'Sending OTP...' : 'Send Reset Code'}
            </motion.button>

            {message && (
              <div className={`text-center p-3 rounded-xl backdrop-blur-sm ${message.includes('successful') ? 'bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}

            <div className="text-center pt-4">
              <button
                type="button"
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors duration-200"
                onClick={() => setFormType('signin-form')}
              >
                ← Back to Sign In
              </button>
            </div>
          </form>
        )}

        {formType === 'Enter-password' && (
          <form onSubmit={resetPassword} className="space-y-6">
            <div className="text-center mb-6">
              <p className="text-sm text-slate-600 dark:text-slate-400">Create your new password</p>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
              <div className="relative">
                <input
                  className="input-field pr-12"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <motion.button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200"
                  onClick={togglePasswordVisibility}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
              <div className="relative">
                <input
                  className="input-field pr-12"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <motion.button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors duration-200"
                  onClick={toggleConfirmPasswordVisibility}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </motion.button>
              </div>
            </div>

            <motion.button
              type="submit"
              className="w-full btn-primary mt-6"
              disabled={loading || password !== confirmPassword}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {loading ? 'Updating Password...' : 'Update Password'}
            </motion.button>

            {password !== confirmPassword && password && confirmPassword && (
              <div className="text-center p-2 rounded-lg bg-amber-50/80 dark:bg-amber-900/20">
                <p className="text-xs text-amber-700 dark:text-amber-300">Passwords don&apos;t match</p>
              </div>
            )}

            {message && (
              <div className={`text-center p-3 rounded-xl backdrop-blur-sm ${message.includes('successful') ? 'bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : 'bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-300'}`}>
                <p className="text-sm font-medium">{message}</p>
              </div>
            )}
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default AuthForms;