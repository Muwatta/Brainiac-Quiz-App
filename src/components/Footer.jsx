import React from 'react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <motion.footer
      className="bg-[#00246B] text-white text-center p-4 mt-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeIn' }}
    >
      <p>&copy; {new Date().getFullYear()} Brainiac-Quiz App. All rights reserved.</p>
      <p>Developed by Team Solace</p>
    </motion.footer>
  );
};

export default Footer;
