import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthForms from "../../components/global/auth";
import LandingHeader from "../../components/global/LandingHeader";
import Footer from "../../components/global/Footer";
import mainImage from "../../assets/main_img.png";

const SignUp = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCloseAuth = () => {
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen hero-gradient transition-colors duration-300">
      <LandingHeader
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <div className="pt-6 pl-5">
        <div className="minimal-gradient relative overflow-hidden">
          <div className="relative z-10 flex flex-col lg:flex-row items-center min-h-screen px-8 py-20">
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full lg:w-1/2 flex justify-center"
            >
              <AuthForms initialForm="signup-form" onClose={handleCloseAuth} />
            </motion.section>

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

        <Footer />
      </div>
    </div>
  );
};

export default SignUp;
