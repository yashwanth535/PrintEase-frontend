/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { Menu, X, Home, Info,Download,Bug } from 'lucide-react';
import ThemeToggle from '../ui/ThemeToggle';
import { AnimatedThemeToggler } from '../../pages/global/animated-theme';

const LandingHeader = ({ setShowAuth, setFormType, isMenuOpen, setIsMenuOpen }) => {
  const isStandaloneAuth = setShowAuth == null;
  const navItems = [
    { name: 'Home', path: '/', icon: Home, reload: true },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Downloads', path: '/downloads', icon: Download },
    { name: 'Bug Report', path: '/bugreport', icon: Bug }
  ];

  const headerRef = useRef(null);

  // ✅ Close menu when clicking outside the header
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (isMenuOpen && headerRef.current && !headerRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMenuOpen, setIsMenuOpen]);

  return (
    <motion.header 
      ref={headerRef}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-4 right-4 z-50 glass-nav rounded-2xl mx-auto max-w-6xl text-slate-900 dark:text-slate-100 transition-all duration-300"
    >
      <div className="px-6 py-4">
        <div 
          className="flex justify-between items-center md:cursor-default cursor-pointer md:cursor-auto"
          onClick={() => {
            if (window.innerWidth < 768) setIsMenuOpen((prev) => !prev);
          }}
        >
          <Link to="/"  className="flex items-center space-x-3 group floating">
            <div className="p-2 bg-white/20 dark:bg-black/20 rounded-xl backdrop-blur-sm">
              <img src='/printer.svg' alt="" className="h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:opacity-80 transition-opacity duration-300">
              PrintEase
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="nav-link text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                onClick={(e) => {
                  if (item.reload) {
                    e.preventDefault();
                    window.location.href = item.path;
                  }
                }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <AnimatedThemeToggler />
            {isStandaloneAuth ? (
              <>
                <Link to="/signin" className="btn-secondary text-sm">Sign In</Link>
                <Link to="/signup" className="btn-primary text-sm">Get Started</Link>
              </>
            ) : (
              <>
                <button
                  className="btn-secondary text-sm"
                  onClick={() => { setShowAuth(true); setFormType("signin-form"); }}
                >
                  Sign In
                </button>
                <button
                  className="btn-primary text-sm"
                  onClick={() => { setShowAuth(true); setFormType("signup-form"); }}
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 hover:bg-white/20 dark:hover:bg-black/20 rounded-xl transition-colors duration-300 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
          <div className="py-4 space-y-3 border-t border-white/20 dark:border-white/10 mt-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="nav-link text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-100"
                onClick={(e) => {
                  setIsMenuOpen(false);
                  if (item.reload) {
                    e.preventDefault(); // prevent React Router navigation first
                    window.location.href = item.path; // full reload to that route
                  }
                }}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.name}</span>
              </Link>
            ))}

            <div className="pt-3 space-y-3 border-t border-white/20 dark:border-white/10">
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
              {isStandaloneAuth ? (
                <>
                  <Link to="/signin" className="w-full btn-secondary text-sm block text-center" onClick={() => setIsMenuOpen(false)}>Sign In</Link>
                  <Link to="/signup" className="w-full btn-primary text-sm block text-center" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
                </>
              ) : (
                <>
                  <button
                    className="w-full btn-secondary text-sm"
                    onClick={() => { setShowAuth(true); setFormType("signin-form"); setIsMenuOpen(false); }}
                  >
                    Sign In
                  </button>
                  <button
                    className="w-full btn-primary text-sm"
                    onClick={() => { setShowAuth(true); setFormType("signup-form"); setIsMenuOpen(false); }}
                  >
                    Get Started
                  </button>
                </>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

export default LandingHeader;
