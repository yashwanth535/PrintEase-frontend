import { useState } from "react";
import { motion } from "framer-motion";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import LandingHeader from "../../components/global/LandingHeader";
import Footer from "../../components/global/Footer";
import mainImage from '../../assets/main_img.png';

const SignUp = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleOTP = async (event) => {
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
        setMessage("Email Already registered");
        setLoading(false);
      } else {
        generateOTP("This is your one time password to register into printEase");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setMessage("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const generateOTP = async (text) => {
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
      // TODO: Navigate to OTP verification page with user data
      // For now, you might want to redirect or show next step
    } else {
      setMessage(otpData.message || "Failed to send OTP");
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col min-h-screen hero-gradient transition-colors duration-300">
      <LandingHeader 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* all sections */}
      <div className="pt-6 pl-5">
        {/* Hero section with Sign Up Form */}
        <div className="minimal-gradient relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center min-h-screen px-8 py-20">
            
            {/* Sign Up Form Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2"
            >
              <div className="max-w-md mx-auto">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="mb-8"
                >
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-3xl font-sans font-bold text-slate-900 dark:text-slate-100">
                      Create Account
                    </h2>
                    <div className="flex items-center space-x-3 bg-white/30 dark:bg-black/30 backdrop-blur-sm rounded-full p-1">
                      <span className={`text-xs font-medium px-2 ${!isVendor ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        User
                      </span>
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
                      <span className={`text-xs font-medium px-2 ${isVendor ? 'text-slate-900 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400'}`}>
                        Vendor
                      </span>
                    </div>
                  </div>
                </motion.div>

                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  onSubmit={handleOTP}
                  className="space-y-5"
                >
                  {/* Full Name */}
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Full Name
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
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
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
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
                      className="w-full px-4 py-3 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
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
                        className="w-full px-4 py-3 pr-12 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
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
                    className="w-full bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-white dark:text-slate-900 py-3 px-6 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-6"
                    disabled={loading}
                  >
                    {loading ? 'Sending OTP...' : 'Continue'}
                  </button>

                  {/* Message Display */}
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`text-center p-3 rounded-xl backdrop-blur-sm ${
                        message.includes('successful')
                          ? 'bg-emerald-50/80 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300'
                          : 'bg-red-50/80 dark:bg-red-900/20 text-red-700 dark:text-red-300'
                      }`}
                    >
                      <p className="text-sm font-medium">{message}</p>
                    </motion.div>
                  )}

                  {/* Switch to Sign In */}
                  <p className="text-center text-sm text-slate-600 dark:text-slate-400 pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    Already have an account?{" "}
                    <a
                      href="/signin"
                      className="text-slate-900 dark:text-slate-100 font-medium hover:underline"
                    >
                      Sign In
                    </a>
                  </p>

                </motion.form>
              </div>
            </motion.section>

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="hidden lg:flex w-full lg:w-1/2 justify-center items-center p-8"
            >
              <div className="hero-image-container group max-w-lg">
                <div className="hero-image-glow"></div>
                <motion.img
                  src={mainImage}
                  alt="PrintEase Hero"
                  className="relative z-10 w-full h-auto object-contain drop-shadow-2xl floating"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </motion.div>
          </div>
        </div>

        <Footer/>
      </div>
    </div>
  );
};

export default SignUp;