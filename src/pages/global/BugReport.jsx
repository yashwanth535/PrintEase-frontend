import { useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import LandingHeader from "../../components/global/LandingHeader";
import Footer from "../../components/global/Footer";
import { Bug, Send, CheckCircle, AlertCircle } from "lucide-react";

const BugReport = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", content: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [formRef, formInView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!text.trim()) {
      setMessage({ type: "error", content: "Please describe the bug" });
      return;
    }

    setLoading(true);
    setMessage({ type: "", content: "" });

    try {
      const response = await fetch(`${API_URL}/api/bugreport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        setMessage({ 
          type: "success", 
          content: "Bug report submitted successfully! Thank you for helping us improve PrintEase." 
        });
        setText("");
      } else {
        setMessage({ 
          type: "error", 
          content: "Failed to submit bug report. Please try again." 
        });
      }
    } catch (error) {
      setMessage({ 
        type: "error", 
        content: "An error occurred. Please try again later." 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen hero-gradient transition-colors duration-300">
      <LandingHeader 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <div className="pt-6 pl-5">
        {/* Hero Section */}
        <div className="minimal-gradient relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center min-h-[40vh] px-8 py-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-4xl text-center space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-full border border-white/20 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                <Bug className="w-4 h-4 mr-2" />
                Help Us Improve
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl md:text-6xl lg:text-7xl font-bold"
              >
                <span className="block text-slate-900 dark:text-slate-100">
                  Report a
                </span>
                <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Bug
                </span>
              </motion.h1>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
              >
                Found an issue? Let us know and help us make PrintEase better for everyone.
              </motion.p>
            </motion.section>
          </div>
        </div>

        {/* Form Section */}
        <section 
          ref={formRef}
          className="py-24 px-8 minimal-gradient relative transition-colors duration-300"
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={formInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="max-w-3xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="feature-card p-8 md:p-12"
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div>
                  <label 
                    htmlFor="bugDescription" 
                    className="block text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4"
                  >
                    Bug Description *
                  </label>
                  <textarea
                    id="bugDescription"
                    rows="8"
                    className="w-full px-5 py-4 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 resize-none"
                    placeholder="Please describe the bug in detail. Include steps to reproduce if possible..."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    disabled={loading}
                  />
                  <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    The more details you provide, the faster we can fix the issue
                  </p>
                </div>

                {message.content && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-5 rounded-2xl flex items-start space-x-3 ${
                      message.type === "success"
                        ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    )}
                    <p className={`text-base font-medium ${
                      message.type === "success"
                        ? "text-green-800 dark:text-green-200"
                        : "text-red-800 dark:text-red-200"
                    }`}>
                      {message.content}
                    </p>
                  </motion.div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary text-lg px-8 py-5 floating shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-3 group"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
                      <span>Submit Bug Report</span>
                    </>
                  )}
                </button>
              </form>

              {/* Helpful Tips */}
              <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                  Tips for a good bug report:
                </h3>
                <ul className="space-y-3 text-slate-600 dark:text-slate-400">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>Describe what you expected to happen vs. what actually happened</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>Include the steps to reproduce the issue</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-pink-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>Mention your browser, device, and operating system if relevant</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span>Include any error messages you received</span>
                  </li>
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </section>

        <Footer />
      </div>
    </div>
  );
};

export default BugReport;