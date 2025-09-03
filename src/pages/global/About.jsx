import { motion } from 'framer-motion';
import { Users, Target, Heart, ArrowLeft, Zap, Shield, Globe } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';

const About = () => {
  const [valuesRef, valuesInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const [missionRef, missionInView] = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const values = [
    {
      icon: Users,
      title: 'User-Centric',
      description: 'We prioritize our users, providing intuitive and efficient solutions for all your printing needs.',
      color: 'from-blue-500 to-purple-500'
    },
    {
      icon: Zap,
      title: 'Innovation',
      description: 'We continuously innovate to provide the best printing experience, ensuring high-quality results.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Your documents and payments are protected with enterprise-grade security measures.',
      color: 'from-green-500 to-blue-500'
    },
    {
      icon: Globe,
      title: 'Accessibility',
      description: 'Making printing services accessible to everyone, everywhere, at any time.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Target,
      title: 'Precision',
      description: 'Delivering exact results with attention to detail in every print job.',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about simplifying the printing process and helping you achieve your goals.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen hero-gradient transition-colors duration-300">
      {/* Enhanced Hero Section */}
      <div className="-pt-10 pl-10">
        <div className="minimal-gradient relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-transparent to-purple-50/50 dark:from-blue-950/20 dark:via-transparent dark:to-purple-950/20"></div>
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-200/20 to-purple-200/20 dark:from-blue-800/10 dark:to-purple-800/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col items-center min-h-screen px-8 py-20">
            {/* Back Button */}
            <div className="w-full max-w-7xl mb-8">
              <Link
                to="/"
                className="inline-flex items-center text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 transition-colors group floating"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
                Back to Home
              </Link>
            </div>

            {/* Hero Content */}
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="w-full max-w-4xl text-center space-y-12"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="inline-flex items-center px-4 py-2 bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-full border border-white/20 dark:border-white/10 text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                ✨ Our Story & Mission
              </motion.div>
              
              {/* Main Heading */}
              <div className="space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="hero-title"
                >
                  About
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    PrintEase
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.6 }}
                  className="hero-subtitle mx-auto"
                >
                  Revolutionizing the printing experience through innovative technology and user-centric design.
                </motion.p>
              </div>
            </motion.section>
          </div>
        </div>

        {/* Mission Section */}
        <section className="py-24 px-8 minimal-gradient relative transition-colors duration-300">
          <motion.div
            ref={missionRef}
            initial={{ opacity: 0, y: 40 }}
            animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                Our Mission
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                Transforming how the world thinks about printing
              </p>
            </div>
            
            <div className="feature-card p-8 md:p-12 text-center">
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                <p>
                  PrintEase was born from the vision to eliminate the complexities and frustrations of modern printing. 
                  We believe that printing should be as simple as clicking a button, regardless of where you are or what device you&apos;re using.
                </p>
                <p>
                  Our platform combines cutting-edge technology with intuitive design to create a seamless printing experience. 
                  Whether you&apos;re a student rushing to print an assignment, a business professional preparing for a presentation, 
                  or an entrepreneur managing your company&apos;s printing needs, PrintEase is here to make your life easier.
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Values Section */}
        <section 
          ref={valuesRef} 
          className="py-24 px-8 minimal-gradient relative transition-colors duration-300"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            className="max-w-7xl mx-auto"
          >
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">Our Values</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                The principles that guide everything we do at PrintEase
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="feature-card p-8 text-center group cursor-pointer"
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${value.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">{value.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section className="py-24 px-8 minimal-gradient relative transition-colors duration-300">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="max-w-7xl mx-auto text-center"
          >
            <div className="feature-card p-12">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">Let&apos;s Connect</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
                Have questions, feedback, or just want to say hello? We&apos;d love to hear from you.
              </p>
              <a 
                href="mailto:contact@printease.com" 
                className="btn-primary inline-flex items-center px-8 py-4 text-lg font-semibold floating shadow-2xl hover:shadow-blue-500/25"
              >
                <Heart className="w-5 h-5 mr-2" />
                Get in Touch
              </a>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default About;