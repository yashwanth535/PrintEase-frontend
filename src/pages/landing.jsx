import React, { useState, useRef, useEffect } from "react";
import { Link } from 'react-router-dom';
import AuthForms from "../components/auth";
import mainImage from '../assets/main_img.png';
import { motion, useScroll, useTransform } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Printer, Menu, X, Home, Info, Wrench, PhoneCall } from 'lucide-react';

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

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'About', path: '/about', icon: Info },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <motion.header 
        ref={headerRef}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed w-full z-50 bg-gray-800 bg-opacity-95 backdrop-blur-sm text-white shadow-lg"
      >
        <div className="container mx-auto px-4 py-3">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <Printer className="h-6 w-6 group-hover:text-blue-400 transition-colors duration-300" />
              <h1 className="text-xl font-bold group-hover:text-blue-400 transition-colors duration-300">
                PrintEase
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="relative flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300 group"
                >
                  <item.icon className="h-4 w-4 group-hover:text-blue-400 transition-colors duration-300" />
                  <span>{item.name}</span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-blue-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <button
                className="px-4 py-2 rounded-md border border-white/50 hover:border-white hover:bg-white/10 transition-all duration-300"
                onClick={() => { setShowAuth(true); setFormType("signin"); }}
              >
                Sign In
              </button>
              <button
                className="px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
                onClick={() => { setShowAuth(true); setFormType("signup"); }}
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-gray-700 rounded-md transition-colors duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial="hidden"
            animate={isMenuOpen ? "visible" : "hidden"}
            variants={{
              visible: { height: 'auto', opacity: 1 },
              hidden: { height: 0, opacity: 0 }
            }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden"
          >
            <div className="py-4 space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-md transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <button
                  className="w-full px-4 py-2 rounded-md border border-white/50 hover:border-white hover:bg-white/10 transition-all duration-300"
                  onClick={() => { setShowAuth(true); setFormType("signin"); setIsMenuOpen(false); }}
                >
                  Sign In
                </button>
                <button
                  className="w-full px-4 py-2 rounded-md bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
                  onClick={() => { setShowAuth(true); setFormType("signup"); setIsMenuOpen(false); }}
                >
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.header>

      {/* Add margin-top to account for fixed header */}
      <div className="pt-16">
        <div className="bg-gray-100 flex flex-col md:flex-row items-center transition-all duration-300">
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
              <h1 className="text-4xl font-bold text-gray-800">
                Hassle-Free Printing, Anytime, Anywhere!
              </h1>
              <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
                PrintEase connects you with local print shops for seamless PDF uploads, secure payments, and real-time
                order tracking.
              </p>
              <button
                className="mt-6 bg-gray-800 text-white px-6 py-3 rounded-md text-lg transition-colors duration-300 hover:bg-gray-700"
                onClick={() => {
                  setShowAuth(true);
                  setFormType("signup");
                }}
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
          className="py-16 px-6 bg-white"
        >
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            className="text-3xl font-bold text-center text-gray-800"
          >
            Key Features
          </motion.h2>
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                className="bg-gray-100 p-6 rounded-lg shadow-md feature-card h-64 flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 mt-2">{feature.description}</p>
                </div>
                <div className="mt-4">
                  <Link to="/about" className="text-blue-600 hover:underline">Learn More</Link>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <footer className="bg-gray-800 text-gray-300 py-4 text-center">
          <p>&copy; {new Date().getFullYear()} PrintEase. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;