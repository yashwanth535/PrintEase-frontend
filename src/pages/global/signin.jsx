import { useState } from "react";
import { motion } from "framer-motion";
import { GoogleLogin } from "@react-oauth/google";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { googleSignIn } from "../../components/global/google";
import LandingHeader from "../../components/global/LandingHeader";
import Footer from "../../components/global/Footer";
import mainImage from '../../assets/main_img.png';

const SignIn = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isVendor, setIsVendor] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleGoogleSuccess = async (response) => {
    setMessage("");
    setLoading(true);
    try {
      const data = await googleSignIn(response.credential, isVendor);
      if (data?.success) {
        console.log("Login successful, navigating to dashboard...");
        if (data.role === 'vendor')
          window.location.href = "/v/home";
        else window.location.href = '/u/home';
      } else {
        setMessage(data.message || "Login failed, please try again.");
      }
    } catch (error) {
      setMessage(error.message || "An unexpected error occurred.");
    }
    setLoading(false);
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
        window.location.href = isVendor ? "v/home" : "u/home";
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error during signin:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
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
        {/* Hero section with Sign In Form */}
        <div className="minimal-gradient relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center min-h-screen px-8 py-20">
            
            {/* Sign In Form Section */}
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
                      Welcome Back
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
                  onSubmit={handleSignIn}
                  className="space-y-6"
                >
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

                  <div className="space-y-3">
                    <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-4 py-3 pr-12 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2 border-slate-200/50 dark:border-slate-700/50 rounded-xl focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:border-transparent transition-all duration-300 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500"
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
                    className="w-full bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 text-white dark:text-slate-900 py-3 px-6 rounded-xl font-semibold hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In'}
                  </button>

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

                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                      <span className="px-4 bg-white/50 dark:bg-black/50 text-slate-500 dark:text-slate-400 backdrop-blur-sm rounded-full">
                        Or continue with
                      </span>
                    </div>
                  </div>

                  <div className="w-full">
                    <GoogleLogin
                      onSuccess={handleGoogleSuccess}
                      onError={() => {
                        setMessage("Google login failed");
                      }}
                      theme="filled_black"
                      size="large"
                      text="continue_with"
                      shape="rectangular"
                      width="100%"
                    />
                  </div>
                  <div className="flex justify-between text-sm pt-4 border-t border-slate-200/50 dark:border-slate-700/50">
                    <a
                      href="/reset-password"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors duration-200 hover:underline"
                    >
                      Forgot password?
                    </a>

                    <a
                      href="/signup"
                      className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors duration-200 hover:underline"
                    >
                      Create account
                    </a>
                  </div>
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

export default SignIn;