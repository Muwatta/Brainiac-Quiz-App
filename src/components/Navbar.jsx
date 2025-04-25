import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaMoon, FaSun, FaBars, FaTimes } from 'react-icons/fa';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Toggle dark mode
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <motion.nav
      className="bg-[#00246B] dark:bg-blue-900 p-4 text-white shadow-md font-serif"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="container mx-auto relative flex items-center justify-between">
        {/* Logo */}
        <motion.h1
          className="text-2xl font-bold font-cursive"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link to="/" className="hover:text-gray-300 transition-colors duration-300">
            Brainiac
          </Link>
        </motion.h1>

        {/* Right Section: Dark Mode Toggle, Navigation Links, and Hamburger Menu */}
        <div className="flex items-center space-x-6">
          {/* Navigation Links for Larger Screens */}
          <div className="hidden md:flex items-center space-x-6 font-tesla">
            <Link
              to="/quiz"
              className="text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
            >
              Quiz
            </Link>
            <Link
              to="/leaderboard"
              className="text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
            >
              Leaderboard
            </Link>
            <Link
              to="/contact"
              className="text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
            >
              Contact
            </Link>
            <Link
              to="/community"
              className="text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
            >
              Community
            </Link>
            <Link
              to="/rewards"
              className="text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
            >
              Rewards
            </Link>
            <Link
              to="/multiplayer"
              className="text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
            >
              Multiplayer
            </Link>
            <Link
              to="/about"
              className="text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
            >
              About
            </Link>
          </div>

          {/* Dark Mode Toggle */}
          <button
            className="bg-white text-blue-500 p-2 rounded-full shadow-md hover:bg-gray-200 active:scale-95 transition-transform duration-300"
            onClick={handleDarkModeToggle}
          >
            {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          {/* Hamburger Menu for Mobile */}
          <button
            className="md:hidden text-white z-50 hover:text-blue-400 active:scale-95 transition-transform duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <FaTimes className="h-6 w-6" /> : <FaBars className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-40 flex">
          <div className="w-64 bg-blue-500 dark:bg-blue-700 p-6 font-tesla">
            <ul className="space-y-4">
              <li>
                <Link
                  to="/quiz"
                  className="block text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quiz
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="block text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="block text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="block text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/rewards"
                  className="block text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Rewards
                </Link>
              </li>
              <li>
                <Link
                  to="/multiplayer"
                  className="block text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Multiplayer
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="block text-lg text-white hover:text-blue-400 active:text-blue-500 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
              </li>
            </ul>
          </div>
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