import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      className="bg-[#00246B] p-4 text-white shadow-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto relative p-4 flex items-center justify-between">
        {!isMenuOpen && (
          <motion.h1
            className="text-2xl font-bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link to="/" className="hover:text-[#0805279c]">
              Brainiac
            </Link>
          </motion.h1>
        )}

        <button
          className="md:hidden text-white z-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            // X Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 ml-40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            // Hamburger Icon
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>

        {/* Desktop Navigation Links (Always visible on medium screens and above) */}
        <div className="hidden md:flex space-x-8">
          <Link to="/quiz" className="text-lg text-white hover:text-[#1c744f] transition-colors duration-300">
            Quiz
          </Link>
          <Link to="/leaderboard" className="text-lg text-white hover:text-[#3497399c] transition-colors duration-300">
            Leaderboard
          </Link>
          <Link to="/about" className="text-lg text-white hover:text-[#3497399c] transition-colors duration-300">
            About
          </Link>
          <Link to="/contact" className="text-lg text-white hover:text-[#3497399c] transition-colors duration-300">
            Contact
          </Link>
        </div>
      </div>

      {/* Sidebar Menu (Visible only on mobile) */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex">
          {/* Sidebar */}
          <div className="w-64 bg-[#00246B] p-6">
            {/* Logo in Sidebar */}
            <motion.h1
              className="text-2xl font-bold mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link to="/" className="hover:underline text-white">
                Brainiac
              </Link>
            </motion.h1>

            {/* Navigation Links */}
            <ul className="space-y-4">
              <li>
                <Link
                  to="/quiz"
                  className="block text-lg text-white hover:text-[#1c744f] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quiz
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="block text-lg text-white hover:text-[#3497399c] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block text-lg text-white hover:text-[#3497399c] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block text-lg text-white hover:text-[#3497399c] transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Overlay: Clicking outside closes the sidebar */}
          <div
            className="flex-1 bg-black opacity-50"
            onClick={() => setIsMenuOpen(false)}
          ></div>
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
