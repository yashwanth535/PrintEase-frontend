/* eslint-disable no-unused-vars */
import { useState, Suspense } from "react";
import { Link } from 'react-router-dom';
import AuthForms from "../../components/global/auth";
import mainImage from '../../assets/main_img.png';
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import LandingHeader from "../../components/global/LandingHeader";
import Spline from '@splinetool/react-spline';
import { ErrorBoundary } from 'react-error-boundary';
import { 
  Upload, 
  MapPin, 
  Shield, 
  Bell, 
  Users, 
  FileText,
  Clock,
  Star,
  CheckCircle,
  Play,
  ChevronDown,
  ChevronUp,
  Mail,
  Phone,
  MapPin as LocationIcon
} from 'lucide-react';

const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [formType, setFormType] = useState("signin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [featuresRef, featuresInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [bentoRef, bentoInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [videoRef, videoInView] = useInView({
    threshold: 0.3,
    triggerOnce: true,
  });

  const [testimonialsRef, testimonialsInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [pricingRef, pricingInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [faqRef, faqInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [splineRef, splineInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [expandedFaq, setExpandedFaq] = useState(null);

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
      <div className="pt-6 pl-20">
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
              className={`w-full lg:w-2/5 transition-all duration-300 ${
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

            {/* 3D Robot Model Section */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full lg:w-3/5 flex justify-center items-center p-4"
            >
              <div className="relative w-full max-w-7xl h-[550px] lg:h-[750px]">
                {/* Seamless Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-3xl"></div>
                <div className="absolute inset-4 bg-gradient-to-tr from-cyan-500/3 via-transparent to-orange-500/3"></div>
                
                {/* 3D Model Container - Seamless Integration */}
                <motion.div 
                  className="relative z-50 w-full h-full overflow-hidden"
                  whileHover={{ scale: 1.02, rotateY: 2 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  <Suspense fallback={
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900/30 via-blue-900/20 to-purple-900/30">
                      <div className="text-center space-y-6">
                        {/* Enhanced Loading Animation */}
                        <div className="relative">
                          <div className="animate-spin h-16 w-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto"></div>
                          <div className="animate-ping absolute inset-0 h-16 w-16 border-4 border-purple-500/20 rounded-full mx-auto"></div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-white font-semibold text-lg">Loading 3D Robot...</p>
                          <p className="text-blue-200 text-sm animate-pulse">Preparing interactive experience</p>
                        </div>
                      </div>
                    </div>
                  }>
                    <Spline 
                      scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                      className="w-full h-full"
                      onLoad={() => console.log('Spline robot model loaded successfully on landing page')}
                      onError={(error) => {
                        console.error('Spline model failed to load:', error);
                        // Fallback to original image if 3D model fails
                      }}
                    />
                  </Suspense>
                </motion.div>
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



        {/* Bento Grid Section */}
        <section 
          ref={bentoRef}
          className="py-24 px-8 minimal-gradient relative transition-colors duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={bentoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Why Choose PrintEase?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Discover the features that make printing effortless
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-[minmax(200px,auto)]">
              {/* Large Feature Card - Instant Upload */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={bentoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="md:col-span-2 md:row-span-2 feature-card p-8 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Upload className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                      Instant Document Upload
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed mb-6">
                      Upload your documents in seconds with our advanced file processing system. Support for PDF, DOC, images, and more.
                    </p>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-slate-500 dark:text-slate-400">
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                      Multiple formats
                    </span>
                    <span className="flex items-center">
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                      Cloud storage
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Find Nearby Shops */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={bentoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="md:col-span-2 feature-card p-6 group hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Find Nearby Shops
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Locate print shops near you with real-time availability
                </p>
              </motion.div>

              {/* Secure Payments */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={bentoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="md:col-span-2 feature-card p-6 group hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Secure Payments
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  50% upfront payment system prevents fraud and ensures quality
                </p>
              </motion.div>

              {/* Real-time Tracking - Wide Card */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={bentoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="md:col-span-4 feature-card p-6 group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 group-hover:scale-110 transition-transform duration-300">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      Real-time Tracking
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Track your order status from upload to pickup with live notifications
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Smart Alerts */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={bentoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="md:col-span-2 feature-card p-6 group hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Smart Alerts
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Get notified at every step of your printing journey
                </p>
              </motion.div>

              {/* Quality Guarantee */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={bentoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="md:col-span-2 md:row-span-2 feature-card p-6 group hover:scale-105 transition-all duration-300"
              >
                <div className="h-full flex flex-col justify-between">
                  <div>
                    <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-3">
                      Quality Guarantee
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4">
                      We ensure every print meets our high standards with quality checks and satisfaction guarantee.
                    </p>
                  </div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    <span className="flex items-center mb-1">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                      24/7 Quality Control
                    </span>
                    <span className="flex items-center">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></div>
                      Money-back Guarantee
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Dual Access */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={bentoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="md:col-span-2 feature-card p-6 group hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Dual Access
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Separate portals for customers and print shop vendors
                </p>
              </motion.div>

              {/* Fast Delivery */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={bentoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="md:col-span-2 feature-card p-6 group hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Fast Delivery
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Express printing options available for urgent documents
                </p>
              </motion.div>

              {/* 24/7 Support */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={bentoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9, duration: 0.6 }}
                className="md:col-span-2 feature-card p-6 group hover:scale-105 transition-all duration-300"
              >
                <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  24/7 Support
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  Round-the-clock customer support for all your printing needs
                </p>
              </motion.div>

              {/* Statistics Card - Wide */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={bentoInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 1.0, duration: 0.6 }}
                className="md:col-span-6 feature-card p-8 group hover:scale-[1.01] transition-all duration-300"
              >
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                    Trusted by Thousands
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-2">
                      <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        500+
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Print Shops</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                        50K+
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Happy Customers</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                        1M+
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Documents Printed</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        99.9%
                      </div>
                      <div className="text-sm text-slate-600 dark:text-slate-400">Uptime</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        {/* Video Demo Section */}
        <section 
          ref={videoRef}
          className="py-24 px-8 minimal-gradient relative transition-colors duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={videoInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-6xl mx-auto text-center"
          >
            <div className="mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                See PrintEase in Action
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Watch how easy it is to print your documents with PrintEase
              </p>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={videoInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="relative feature-card p-8 group hover:scale-[1.02] transition-all duration-500"
            >
              <div className="relative aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl overflow-hidden">
                <div>
                  <video src="/video.mp4" autoPlay loop muted className="w-full h-full object-cover">
                  </video>
                </div>
                
                {/* Video Steps Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex justify-between items-center bg-white/90 dark:bg-black/90 backdrop-blur-sm rounded-lg p-3">
                    <div className="flex space-x-4 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        Upload Document
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                        Choose Shop
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Track & Collect
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Features Grid Below Video */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 mb-2">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Step 1: Upload</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Select and upload your documents</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 mb-2">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Step 2: Choose</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Pick a nearby print shop</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="inline-flex p-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 mb-2">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">Step 3: Collect</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">Track and collect your prints</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* Testimonials Section */}
        <section 
          ref={testimonialsRef}
          className="py-24 px-8 minimal-gradient relative transition-colors duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                What Our Users Say
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Join thousands of satisfied customers who trust PrintEase
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Student",
                  content: "PrintEase saved me so much time during finals week. I could print my assignments from my dorm and pick them up on my way to class!",
                  rating: 5,
                  avatar: "👩‍🎓"
                },
                {
                  name: "Mike Chen",
                  role: "Business Owner",
                  content: "As a print shop owner, PrintEase has streamlined our operations. We get more orders and the payment system is fantastic.",
                  rating: 5,
                  avatar: "👨‍💼"
                },
                {
                  name: "Emily Rodriguez",
                  role: "Freelancer",
                  content: "The real-time tracking feature is amazing. I always know exactly when my marketing materials will be ready.",
                  rating: 5,
                  avatar: "👩‍💻"
                },
                {
                  name: "David Park",
                  role: "Teacher",
                  content: "Printing lesson plans and worksheets has never been easier. The quality is consistent and the process is seamless.",
                  rating: 5,
                  avatar: "👨‍🏫"
                },
                {
                  name: "Lisa Thompson",
                  role: "Event Planner",
                  content: "PrintEase handles all our event printing needs. From invitations to banners, everything is perfect every time.",
                  rating: 5,
                  avatar: "👩‍🎨"
                },
                {
                  name: "Alex Kumar",
                  role: "Startup Founder",
                  content: "The dual-access system is brilliant. Our team can print documents while our print vendor manages everything efficiently.",
                  rating: 5,
                  avatar: "👨‍🚀"
                }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="feature-card p-6 group hover:scale-105 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed italic">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                    <div className="flex items-center space-x-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="text-2xl">{testimonial.avatar}</div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                          {testimonial.name}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>
        {/* Interactive 3D Model & FAQ Section */}
        <section 
          ref={splineRef}
          className="py-24 px-8 minimal-gradient relative transition-colors duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={splineInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            {/* Section Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Experience PrintEase
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Interact with our 3D model and get answers to your questions
              </p>
            </div>

            {/* Split Layout Container */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              
              {/* Left Side - 3D Model */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={splineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="relative -ml-8 lg:-ml-12"
              >
                <div className="relative h-[600px] lg:h-[700px] overflow-hidden group">
                  {/* Seamless Background Gradient Glow */}
                  <div className="absolute -inset-8 bg-gradient-to-br from-blue-500/8 via-purple-500/6 to-pink-500/8 blur-3xl"></div>
                  <div className="absolute -inset-4 bg-gradient-to-tr from-cyan-500/5 via-transparent to-orange-500/5 blur-2xl"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/3 via-purple-400/2 to-pink-400/3 animate-pulse"></div>
                  
                  {/* 3D Model Container */}
                  <motion.div 
                    className="relative z-10 w-full h-full overflow-hidden flex items-center justify-center"
                    whileHover={{ scale: 1.02, rotateY: 2 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                  >
                    <Suspense fallback={
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-transparent via-slate-50/20 to-transparent dark:from-transparent dark:via-slate-900/20 dark:to-transparent">
                        <div className="text-center space-y-6">
                          <div className="relative">
                            <div className="animate-spin h-20 w-20 border-4 border-blue-500/30 border-t-blue-500 rounded-full mx-auto"></div>
                            <div className="animate-ping absolute inset-0 h-20 w-20 border-4 border-purple-500/20 rounded-full mx-auto"></div>
                          </div>
                          <div className="space-y-3">
                            <p className="text-slate-900 dark:text-slate-100 font-semibold text-xl">Loading 3D Experience...</p>
                            <p className="text-blue-600 dark:text-blue-400 text-sm animate-pulse">Preparing interactive model</p>
                          </div>
                        </div>
                      </div>
                    }>
                      <ErrorBoundary fallback={
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-transparent via-slate-50/20 to-transparent dark:from-transparent dark:via-slate-900/20 dark:to-transparent">
                          <div className="text-center space-y-4 p-8">
                            <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 mb-4">
                              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                              </svg>
                            </div>
                            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">3D Model Unavailable</h4>
                            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm">
                              The interactive model is temporarily unavailable. Please refresh to try again.
                            </p>
                          </div>
                        </div>
                      }>
                        <Spline 
                          scene="https://prod.spline.design/q38YStnIHKrXskvB/scene.splinecode"
                          className="w-full h-full"
                          onLoad={() => console.log('Interactive 3D model loaded successfully in split layout')}
                          onError={(error) => {
                            console.error('Spline 3D model failed to load:', error);
                          }}
                        />
                      </ErrorBoundary>
                    </Suspense>
                  </motion.div>
                </div>
              </motion.div>

              {/* Right Side - FAQ Section */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={splineInView ? { opacity: 1, x: 0 } : {}}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="space-y-6"
              >
                <div className="mb-8">
                  <h3 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    Get quick answers to common questions about PrintEase
                  </p>
                </div>

                {/* FAQ Items */}
                <div className="space-y-4">
                  {[
                    {
                      question: "How does PrintEase work?",
                      answer: "Simply upload your documents, choose a nearby print shop, make a secure payment, and track your order in real-time. You'll receive notifications when your prints are ready for pickup."
                    },
                    {
                      question: "What file formats are supported?",
                      answer: "We support PDF, DOC, DOCX, JPG, PNG, and many other common document and image formats. Our system automatically optimizes files for the best print quality."
                    },
                    {
                      question: "How secure are my payments?",
                      answer: "We use industry-standard encryption and secure payment gateways. Our 50% upfront payment system protects both customers and vendors, with the remaining balance paid upon pickup."
                    },
                    {
                      question: "Can I track my order status?",
                      answer: "Yes! You'll receive real-time updates via notifications and can track your order status through your dashboard. You'll know exactly when your prints are ready."
                    },
                    {
                      question: "What if I'm not satisfied with the print quality?",
                      answer: "We offer a quality guarantee. If you're not satisfied with the print quality, contact our support team and we'll work with the vendor to resolve the issue or provide a refund."
                    },
                    {
                      question: "How do I become a vendor partner?",
                      answer: "Print shop owners can sign up as vendors through our platform. After verification, you'll get access to the vendor dashboard to manage orders, set pricing, and grow your business."
                    }
                  ].map((faq, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={splineInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                      className="feature-card p-6 group"
                    >
                      <button
                        onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                        className="w-full text-left flex items-center justify-between group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200"
                      >
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 pr-4">
                          {faq.question}
                        </h4>
                        <motion.div
                          animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex-shrink-0"
                        >
                          <ChevronDown className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                        </motion.div>
                      </button>
                      
                      <motion.div
                        initial={false}
                        animate={{
                          height: expandedFaq === index ? "auto" : 0,
                          opacity: expandedFaq === index ? 1 : 0
                        }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </section>

        <footer className="py-16 px-8 bg-white/50 dark:bg-black/50 backdrop-blur-xl border-t border-white/20 dark:border-white/10 text-slate-600 dark:text-slate-400 transition-colors duration-300">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
              {/* Company Info */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">PrintEase</h3>
                <p className="text-sm leading-relaxed">
                  Revolutionizing the printing experience through innovative technology and seamless connectivity between users and print shops.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </a>
                  <a href="#" className="text-slate-500 hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Quick Links */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  <li><Link to="/about" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">About Us</Link></li>
                  <li><a href="#features" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Features</a></li>
                  <li><a href="#pricing" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Help Center</a></li>
                  <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">API Documentation</a></li>
                </ul>
              </div>

              {/* Services */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Services</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Document Printing
                  </a></li>
                  <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Business Cards</a></li>
                  <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Posters & Banners</a></li>
                  <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Custom Printing</a></li>
                  <li><a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Vendor Partnership</a></li>
                </ul>
              </div>

              {/* Contact */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Contact</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <a href="mailto:yashwanth.lumia535@gmail.com" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                      yashwanth.lumia535@gmail.com
                    </a>
                  </li>
                  <li className="flex items-center">
                    <Phone className="w-4 h-4 mr-2" />
                    <a href="tel:+919380535535" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">
                      +91 9380535535
                    </a>
                  </li>
                  <li className="flex items-start">
                    <LocationIcon className="w-4 h-4 mr-2 mt-0.5" />
                    <span>123 Ibrahimpatnam<br />Hyderabad, Telangana 500038</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom Bar */}
            <div className="pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <p className="text-sm">
                &copy; {new Date().getFullYear()} PrintEase. All rights reserved.
              </p>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">Cookie Policy</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;