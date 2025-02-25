import React from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const About = () => {
  const values = [
    {
      icon: Users,
      title: 'User-Centric',
      description: 'We prioritize our users, providing intuitive and efficient solutions for all your printing needs.'
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'We continuously innovate to provide the best printing experience, ensuring high-quality results.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'We are passionate about simplifying the printing process and helping you achieve your goals.'
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
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex items-center text-gray-600 hover:text-blue-400 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </Link>

        <div className="text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
          >
            About
            <span className="block mt-2 bg-clip-text text-transparent bg-blue-400">
              PrintEase
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 max-w-2xl mx-auto text-xl text-gray-500"
          >
            Simplifying the printing process for everyone.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-20 prose prose-lg mx-auto text-gray-500"
        >
          <p>
            PrintEase was created to address the complexities of modern printing needs. We aim to make the printing process as simple and efficient as possible.
          </p>
          <p>
            Our platform combines powerful technology with user-friendly design to help you manage your printing needs seamlessly. Whether you're an individual or a business, PrintEase provides the tools you need to get your prints done quickly and efficiently.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {values.map((value, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="text-center"
            >
              <div className="inline-flex p-3 rounded-lg bg-blue-400">
                <value.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{value.title}</h3>
              <p className="mt-2 text-gray-500">{value.description}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center"
        >
          <h2 className="text-3xl font-bold text-gray-900">Get in Touch</h2>
          <p className="mt-4 text-xl text-gray-500">
            We'd love to hear from you. Reach out to us at{' '}
            <a href="mailto:contact@printease.com" className="text-blue-400 hover:text-blue-500">
              contact@printease.com
            </a>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default About;