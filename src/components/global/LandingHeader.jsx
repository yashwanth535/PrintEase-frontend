import React from "react";
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Menu, X, Home, Info } from 'lucide-react';
import logo from '../../assets/printer.svg';
import ThemeToggle from '../ui/ThemeToggle';

const LandingHeader = ({ setShowAuth, setFormType, isMenuOpen, setIsMenuOpen }) => {
  const navItems = [
    { name: 'Home', path: '/', icon: Home, reload: true },
    { name: 'About', path: '/about', icon: Info }
  ];

  return (
    <motion.header 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed w-full z-50 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white shadow-lg transition-colors duration-300"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" onClick={() => window.location.reload()} className="flex items-center space-x-2 group">
            <img src={logo} alt="" className="h-8 w-8 group-hover:scale-110 transition-transform duration-300" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white group-hover:opacity-80 transition-opacity duration-300">
              PrintEase
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="relative flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 group"
                onClick={(e) => {
                  if (item.reload) {
                    e.preventDefault();
                    window.location.href = item.path;
                  }
                }}
              >
                <item.icon className="h-4 w-4 group-hover:text-black dark:group-hover:text-white transition-colors duration-300" />
                <span>{item.name}</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-black dark:bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />
            <button
              className="px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300"
              onClick={() => { setShowAuth(true); setFormType("signin-form"); }}
            >
              Sign In
            </button>
            <button
              className="btn-primary"
              onClick={() => { setShowAuth(true); setFormType("signup-form"); }}
            >
              Get Started
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-colors duration-300"
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
                className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md transition-colors duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 space-y-2">
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              <button
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all duration-300"
                onClick={() => { setShowAuth(true); setFormType("signin"); setIsMenuOpen(false); }}
              >
                Sign In
              </button>
              <button
                className="w-full btn-primary"
                onClick={() => { setShowAuth(true); setFormType("signup"); setIsMenuOpen(false); }}
              >
                Get Started
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default LandingHeader;