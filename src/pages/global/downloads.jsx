/* eslint-disable no-unused-vars */
import { useState } from "react";
import LandingHeader from "../../components/global/LandingHeader";
import Footer from "../../components/global/Footer";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  Download,
  Smartphone,
  Shield,
  Zap,
  CheckCircle,
  Github,
  FileDown,
  Star,
  Package,
  Clock,
  Users
} from 'lucide-react';

const DownloadPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [formType, setFormType] = useState("signin");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [featuresRef, featuresInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [stepsRef, stepsInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const handleShowAuth = (formType) => {
    setShowAuth(true);
    setFormType(formType);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const apkLink = "https://github.com/yashwanth535/printease-android/releases/download/1.0/Printease.apk";
  const githubReleaseLink = "https://github.com/yashwanth535/printease-android/releases/tag/1.0";

  return (
    <div className="flex flex-col min-h-screen hero-gradient transition-colors duration-300">
      <LandingHeader 
        setShowAuth={handleShowAuth}
        setFormType={setFormType}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <div className="pt-6 pl-5">
        {/* Hero Section */}
        <div className="minimal-gradient relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center min-h-screen px-8 py-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-5xl mx-auto text-center space-y-12"
            >
              {/* Main Heading */}
              <div className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.6 }}
                  className="inline-flex items-center px-4 py-2 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-full border border-white/20 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  📱 Mobile App Available Now
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="hero-title"
                >
                  Download
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    PrintEase
                  </span>
                  <span className="block text-slate-700 dark:text-slate-300">
                    for Android
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="hero-subtitle mx-auto max-w-3xl"
                >
                  Get the PrintEase mobile app and print documents on the go. Fast, secure, and easy to use—right from your Android device.
                </motion.p>
              </div>

              {/* Download Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto"
              >
                {/* APK Download Card */}
                <div className="feature-card p-8 group hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="inline-flex p-6 rounded-3xl bg-gradient-to-r from-blue-500 to-purple-500 group-hover:scale-110 transition-transform duration-300">
                      <Download className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        Direct APK Download
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        Download and install the latest version directly
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                        <Package className="w-4 h-4" />
                        <span>Version 1.0</span>
                      </div>
                    </div>
                    <a
                      href={apkLink}
                      className="w-full btn-primary text-lg px-8 py-4 floating shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
                    >
                      <FileDown className="w-5 h-5" />
                      <span>Download APK</span>
                    </a>
                  </div>
                </div>

                {/* GitHub Release Card */}
                <div className="feature-card p-8 group hover:scale-105 transition-all duration-300">
                  <div className="flex flex-col items-center space-y-6">
                    <div className="inline-flex p-6 rounded-3xl bg-gradient-to-r from-purple-500 to-pink-500 group-hover:scale-110 transition-transform duration-300">
                      <Github className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        GitHub Release
                      </h3>
                      <p className="text-slate-600 dark:text-slate-400">
                        View release notes and download from GitHub
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-slate-500 dark:text-slate-400">
                        <Star className="w-4 h-4" />
                        <span>Open Source</span>
                      </div>
                    </div>
                    <a
                      href={githubReleaseLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-secondary text-lg px-8 py-4 floating flex items-center justify-center space-x-2"
                    >
                      <Github className="w-5 h-5" />
                      <span>View on GitHub</span>
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Version Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="flex items-center justify-center space-x-8 text-sm text-slate-600 dark:text-slate-400"
              >
                <span className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Latest Version
                </span>
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-2 text-blue-500" />
                  Secure Download
                </span>
                <span className="flex items-center">
                  <Zap className="w-4 h-4 mr-2 text-purple-500" />
                  Fast & Lightweight
                </span>
              </motion.div>
            </motion.section>
          </div>
        </div>

        {/* App Features Section */}
        <section 
          ref={featuresRef}
          className="py-24 px-8 minimal-gradient relative transition-colors duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                What's Inside the App?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                All the features you love, optimized for mobile
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: <Smartphone className="w-8 h-8 text-white" />,
                  title: "Mobile Optimized",
                  description: "Seamless experience designed specifically for Android devices with intuitive navigation",
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Zap className="w-8 h-8 text-white" />,
                  title: "Lightning Fast",
                  description: "Upload and process documents in seconds with optimized performance",
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: <Shield className="w-8 h-8 text-white" />,
                  title: "Secure & Private",
                  description: "End-to-end encryption ensures your documents remain confidential",
                  gradient: "from-green-500 to-teal-500"
                },
                {
                  icon: <Clock className="w-8 h-8 text-white" />,
                  title: "Real-time Updates",
                  description: "Get instant notifications about your order status on your device",
                  gradient: "from-orange-500 to-red-500"
                },
                {
                  icon: <Users className="w-8 h-8 text-white" />,
                  title: "Easy Sharing",
                  description: "Share documents directly from other apps to PrintEase for quick printing",
                  gradient: "from-pink-500 to-rose-500"
                },
                {
                  icon: <Download className="w-8 h-8 text-white" />,
                  title: "Offline Access",
                  description: "View your order history and saved documents even without internet",
                  gradient: "from-indigo-500 to-purple-500"
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="feature-card p-6 group hover:scale-105 transition-all duration-300"
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Installation Steps */}
        <section 
          ref={stepsRef}
          className="py-24 px-8 minimal-gradient relative transition-colors duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                How to Install
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Get started in three simple steps
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                {
                  step: "01",
                  title: "Download the APK",
                  description: "Click the download button above to get the PrintEase APK file on your Android device."
                },
                {
                  step: "02",
                  title: "Enable Unknown Sources",
                  description: "Go to Settings → Security → Enable 'Install from Unknown Sources' to allow APK installation."
                },
                {
                  step: "03",
                  title: "Install & Launch",
                  description: "Open the downloaded APK file, tap Install, and start printing with PrintEase!"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -30 }}
                  animate={stepsInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.2, duration: 0.6 }}
                  className="feature-card p-8 flex items-start space-x-6 group hover:scale-[1.02] transition-all duration-300"
                >
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform duration-300">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* System Requirements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={stepsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="mt-12 feature-card p-8"
            >
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center">
                <Smartphone className="w-6 h-6 mr-3 text-purple-500" />
                System Requirements
              </h3>
              <div className="grid md:grid-cols-2 gap-4 text-slate-600 dark:text-slate-400">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Android 5.0 (Lollipop) or higher</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Minimum 2GB RAM</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>50MB free storage space</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span>Internet connection required</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-8 minimal-gradient relative transition-colors duration-300">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="feature-card p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">
                Download PrintEase now and experience the future of mobile printing
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href={apkLink}
                  className="btn-primary text-lg px-8 py-4 floating shadow-2xl hover:shadow-blue-500/25 flex items-center justify-center space-x-2"
                >
                  <Download className="w-5 h-5" />
                  <span>Download Now</span>
                </a>
                <a
                  href={githubReleaseLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-lg px-8 py-4 floating flex items-center justify-center space-x-2"
                >
                  <Github className="w-5 h-5" />
                  <span>View on GitHub</span>
                </a>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer/>
      </div>
    </div>
  );
};

export default DownloadPage;