import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import AuthForms from "../../components/global/auth";
import mainImage from '../../assets/main_img.png';
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Printer, Menu, X, Home, Info, Wrench, PhoneCall } from 'lucide-react';
import LandingHeader from "../../components/global/LandingHeader";

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [formType, setFormType] = useState("signin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 500], [0, -100]);

  const [headerRef, headerInView] = useInView({
    threshold: 0,
    triggerOnce: true,
  });

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

  const navItems = [
    { name: 'Home', path: '/', icon: Home, reload: true },
    { name: 'About', path: '/about', icon: Info }
];


  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-black transition-colors duration-300">
      <LandingHeader 
        setShowAuth={handleShowAuth}
        setFormType={setFormType}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {/* Add margin-top to account for fixed header */}
      <div className="pt-16">
        <div className="bg-white dark:bg-black flex flex-col md:flex-row items-center transition-all duration-300">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full md:w-1/2 flex justify-center items-center"
          >
            <img
              src={mainImage}
              alt="Hero Image"
              className="max-w-md max-h-96 object-contain transition-all duration-300"
            />
          </motion.div>
          <motion.section
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`py-20 px-4 transition-all duration-300 ${
              showAuth ? "hidden" : "w-full md:w-1/2"
            }`}
          >
            <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Hassle-Free Printing, Anytime, Anywhere!
              </h1>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                PrintEase connects you with local print shops for seamless PDF uploads, secure payments, and real-time
                order tracking.
              </p>
              <button
                className="mt-6 btn-primary text-lg px-6 py-3"
                onClick={() => handleShowAuth("signup-form")}
              >
                Get Started
              </button>
            </div>
          </motion.section>
          {showAuth && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-full md:w-1/2 flex justify-center"
            >
              <AuthForms initialForm={formType} onClose={handleCloseAuth} />
            </motion.div>
          )}
        </div>

        <section 
          ref={featuresRef} 
          className="py-16 px-6 bg-white dark:bg-black relative transition-colors duration-300"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12"
          >
            Key Features
          </motion.h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto relative z-10">
            {[
              {
                title: "Seamless PDF Uploads",
                description: "Easily upload your documents for quick and hassle-free printing."
              },
              {
                title: "Real-Time Order Tracking",
                description: "Track your print orders in real-time with live updates."
              },
              {
                title: "Secure Payments",
                description: "Ensure safe transactions with 50% upfront payments to prevent fraud."
              },
              {
                title: "Vendor Order Management",
                description: "Printing shops can easily manage and fulfill customer orders."
              },
              {
                title: "Dual-Login System",
                description: "Separate access for customers and vendors with tailored experiences."
              },
              {
                title: "Instant Notifications",
                description: "Get notified at every stage of your order for peace of mind."
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                animate={featuresInView ? "visible" : "hidden"}
                whileHover="hover"
                transition={{ delay: index * 0.1 }}
                className="card p-6 h-64 flex flex-col justify-between relative overflow-hidden group hover:shadow-lg transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">{feature.description}</p>
                </div>
                <div className="mt-4 relative z-10">
                  <Link to="/about" className="text-black dark:text-white hover:text-gray-700 dark:hover:text-gray-300 underline decoration-gray-400 dark:decoration-gray-600 hover:decoration-gray-700 dark:hover:decoration-gray-500 transition duration-200">
                    Learn More
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="bg-gray-900 dark:bg-black text-gray-300 py-4 text-center transition-colors duration-300">
          <p>&copy; {new Date().getFullYear()} PrintEase. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;