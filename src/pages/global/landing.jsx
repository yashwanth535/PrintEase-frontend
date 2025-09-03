import { useState } from "react";
import { Link } from 'react-router-dom';
import AuthForms from "../../components/global/auth";
import mainImage from '../../assets/main_img.png';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import LandingHeader from "../../components/global/LandingHeader";

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [formType, setFormType] = useState("signin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [featuresRef, featuresInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  const handleShowAuth = (formType) => {
    setShowAuth(true);
    setFormType(formType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };


  return (
    <div className="flex flex-col min-h-screen hero-gradient transition-colors duration-300">
      <LandingHeader 
        setShowAuth={handleShowAuth}
        setFormType={setFormType}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Enhanced Hero Section */}
      <div className="pt-6 pl-10">
        <div className="minimal-gradient relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 dark:from-blue-800/10 dark:to-purple-800/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center min-h-screen px-8 py-20">
            {/* Content Section */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`w-full lg:w-3/5 transition-all duration-300 ${
                showAuth ? "hidden lg:block lg:w-1/2" : ""
              }`}
            >
              <div className="max-w-4xl mx-auto text-center lg:text-left space-y-12">
                {/* Main Heading */}
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="inline-flex items-center px-4 py-2 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-full border border-white/20 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300"
                  >
                    ✨ Revolutionizing Print Services
                  </motion.div>
                  
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="hero-title"
                  >
                    Print
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                      Anywhere
                    </span>
                    <span className="block text-slate-700 dark:text-slate-300">
                      Anytime
                    </span>
                  </motion.h1>
                  
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="hero-subtitle mx-auto lg:mx-0"
                  >
                    Connect instantly with local print shops. Upload documents, track orders, and pay securely—all in one seamless experience.
                  </motion.p>
                </div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="hero-cta-group justify-center lg:justify-start"
                >
                  <button
                    className="btn-primary text-lg px-8 py-4 floating shadow-2xl hover:shadow-blue-500/25"
                    onClick={() => handleShowAuth("signup-form")}
                  >
                    Start Printing Now
                  </button>
                  <button
                    className="btn-secondary text-lg px-8 py-4 floating"
                    onClick={() => handleShowAuth("signin-form")}
                  >
                    Sign In
                  </button>
                </motion.div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.6 }}
                  className="hero-stats justify-center lg:justify-start"
                >
                  <div className="hero-stat-item">
                    <div className="hero-stat-number">500+</div>
                    <div className="hero-stat-label">Print Shops</div>
                  </div>
                  <div className="hero-stat-item">
                    <div className="hero-stat-number">10K+</div>
                    <div className="hero-stat-label">Orders Completed</div>
                  </div>
                  <div className="hero-stat-item">
                    <div className="hero-stat-number">99.9%</div>
                    <div className="hero-stat-label">Uptime</div>
                  </div>
                </motion.div>
              </div>
            </motion.section>

            {/* Image Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-2/5 flex justify-center items-center p-8"
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
          {/* Auth Form Overlay */}
          {showAuth && (
            <div className="absolute inset-0 z-20 bg-white/95 dark:bg-black/95 backdrop-blur-sm flex items-center justify-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md mx-4"
              >
                <AuthForms initialForm={formType} onClose={handleCloseAuth} />
              </motion.div>
            </div>
          )}
        </div>

        <section 
          ref={featuresRef} 
          className="py-24 px-8 minimal-gradient relative transition-colors duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Key Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Everything you need for seamless printing experiences
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                title: "Seamless PDF Uploads",
                description: "Easily upload your documents for quick and hassle-free printing.",
                icon: "📄"
              },
              {
                title: "Real-Time Order Tracking",
                description: "Track your print orders in real-time with live updates.",
                icon: "📍"
              },
              {
                title: "Secure Payments",
                description: "Ensure safe transactions with 50% upfront payments to prevent fraud.",
                icon: "🔒"
              },
              {
                title: "Vendor Order Management",
                description: "Printing shops can easily manage and fulfill customer orders.",
                icon: "📋"
              },
              {
                title: "Dual-Login System",
                description: "Separate access for customers and vendors with tailored experiences.",
                icon: "👥"
              },
              {
                title: "Instant Notifications",
                description: "Get notified at every stage of your order for peace of mind.",
                icon: "🔔"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                className="feature-card group"
              >
                <div className="text-center space-y-4">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {feature.description}
                  </p>
                  <Link 
                    to="/about" 
                    className="inline-flex items-center text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100 font-medium transition-colors duration-200 group-hover:translate-x-1"
                  >
                    Learn More →
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="py-8 px-8 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-t border-white/20 dark:border-white/10 text-slate-600 dark:text-slate-400 text-center transition-colors duration-300">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm">
              &copy; {new Date().getFullYear()} PrintEase. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;