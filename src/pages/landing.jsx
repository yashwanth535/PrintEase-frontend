import React, { useState, useRef, useEffect } from "react";
import AuthForms from "../components/auth";
import { motion } from "framer-motion";
import mainImage from "../assets/main_img.png";
const LandingPage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [formType, setFormType] = useState("signin");
  const featureCardsRef = useRef(null);
  const [cardsVisible, setCardsVisible] = useState(false);

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
    hover: { scale: 1.05, transition: { duration: 0.3 } },
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setCardsVisible(true);
          } else {
            setCardsVisible(false);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (featureCardsRef.current) {
      observer.observe(featureCardsRef.current);
    }

    return () => {
      if (featureCardsRef.current) {
        observer.unobserve(featureCardsRef.current);
      }
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">

   {/* Header */}

   <header className="bg-gray-800 text-white p-4 flex justify-between items-center shadow-md">

    {/* Left - Logo */}

    <div className="flex items-center">

     <img

      src="/logo.png"

      alt="Logo"

      className="h-10 w-10 mr-2 cursor-pointer"

      onClick={() => window.location.href = "/"}

     />

     <h1 className="text-xl font-bold cursor-pointer" onClick={() => window.location.href = "/"}>

      PrintEase

     </h1>

    </div>



    {/* Center - Navigation */}

    <nav className="flex gap-6">

     <a href="/" className="hover:underline">Home</a>

     <a href="/about" className="hover:underline">About</a>

    </nav>



    {/* Right - Auth Buttons */}

    <div>

    <button

     className="bg-transparent text-white px-4 py-2 rounded-md mr-2 border border-white transition-colors duration-300 hover:bg-gray-700" // Added transition and hover style

     onClick={() => { setShowAuth(true); setFormType("signin"); }}

    >

     Sign In

    </button>

    <button

     className="bg-white text-gray-800 px-4 py-2 rounded-md transition-colors duration-300 hover:bg-gray-200" // Added transition and hover style

     onClick={() => { setShowAuth(true); setFormType("signup"); }}

    >

     Get Started

    </button>

    </div>

   </header>
   <div className="bg-gray-100 flex flex-col md:flex-row items-center transition-all duration-300">
        <div className="w-full md:w-1/2 flex justify-center items-center">
          <img
            src={mainImage}
            alt="Hero Image"
            className="max-w-md max-h-96 object-contain transition-all duration-300"
          />
        </div>
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
          <div className="w-full md:w-1/2 flex justify-center"> {/* justify-center here */}
            <AuthForms initialForm={formType} onClose={handleCloseAuth} />
          </div>
        )}
      </div>
      {/* Features Section */}
      <section ref={featureCardsRef} className="py-16 px-6 bg-white">
        <h2 className="text-3xl font-bold text-center text-gray-800">Key Features</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Feature Cards */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={cardsVisible ? "visible" : "hidden"}
            whileHover="hover" // Added whileHover prop
            className="bg-gray-100 p-6 rounded-lg shadow-md feature-card h-64 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Seamless PDF Uploads</h3>
              <p className="text-gray-600 mt-2">Easily upload your documents for quick and hassle-free printing.</p>
            </div>
            <div className="mt-4">
              <a href="/about" className="text-blue-600 hover:underline">Learn More</a>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={cardsVisible ? "visible" : "hidden"}
            whileHover="hover" // Added whileHover prop
            className="bg-gray-100 p-6 rounded-lg shadow-md feature-card h-64 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Real-Time Order Tracking</h3>
              <p className="text-gray-600 mt-2">Track your print orders in real-time with live updates.</p>
            </div>
            <div className="mt-4">
              <a href="/about" className="text-blue-600 hover:underline">Learn More</a>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={cardsVisible ? "visible" : "hidden"}
            whileHover="hover" // Added whileHover prop
            className="bg-gray-100 p-6 rounded-lg shadow-md feature-card h-64 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Secure Payments</h3>
              <p className="text-gray-600 mt-2">Ensure safe transactions with 50% upfront payments to prevent fraud.</p>
            </div>
            <div className="mt-4">
              <a href="/about" className="text-blue-600 hover:underline">Learn More</a>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={cardsVisible ? "visible" : "hidden"}
            whileHover="hover" // Added whileHover prop
            className="bg-gray-100 p-6 rounded-lg shadow-md feature-card h-64 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Vendor Order Management</h3>
              <p className="text-gray-600 mt-2">Printing shops can easily manage and fulfill customer orders.</p>
            </div>
            <div className="mt-4">
              <a href="/about" className="text-blue-600 hover:underline">Learn More</a>
            </div>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate={cardsVisible ? "visible" : "hidden"}
            whileHover="hover" // Added whileHover prop
            className="bg-gray-100 p-6 rounded-lg shadow-md feature-card h-64 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Dual-Login System</h3>
              <p className="text-gray-600 mt-2">Separate access for customers and vendors with tailored experiences.</p>
            </div>
            <div className="mt-4">
              <a href="/about" className="text-blue-600 hover:underline">Learn More</a>
            </div>
          </motion.div>


          <motion.div variants={cardVariants} initial="hidden" className="bg-gray-100 p-6 rounded-lg shadow-md feature-card h-64 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold text-gray-800">Instant Notifications</h3>
              <p className="text-gray-600 mt-2">Get notified at every stage of your order for peace of mind.</p>
            </div>
            <div className="mt-4">
              <a href="/about" className="text-blue-600 hover:underline">Learn More</a>
            </div>
          </motion.div>

          
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-4 text-center">
        <p>&copy; {new Date().getFullYear()} PrintEase. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;