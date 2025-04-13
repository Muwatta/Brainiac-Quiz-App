import React from 'react';
import { motion } from 'framer-motion';

const LoadingAnimation = () => {
  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black">
      {/* Rotating Spinner */}
      <motion.div
        className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        variants={spinnerVariants}
        animate="animate"
      ></motion.div>

      {/* Loading Text */}
      <p className="mt-4 text-lg font-semibold text-white">
        Loading, please wait...
      </p>
    </div>
  );
};

export default LoadingAnimation;