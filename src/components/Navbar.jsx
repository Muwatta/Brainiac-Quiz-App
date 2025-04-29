import React, { useState } from 'react';
import { NavLink } from 'react-router-dom'; // Use NavLink instead of Link
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
          <NavLink to="/" className="hover:text-gray-300 transition-colors duration-300">
            Brainiac
          </NavLink>
        </motion.h1>

        {/* Right Section: Dark Mode Toggle, Navigation Links, and Hamburger Menu */}
        <div className="flex items-center space-x-6">
          {/* Navigation Links for Larger Screens */}
          <div className="hidden md:flex items-center space-x-6 font-tesla">
            <NavLink
              to="/quiz"
              className={({ isActive }) =>
                `text-lg transition-colors duration-300 ${
                  isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                }`
              }
            >
              Quiz
            </NavLink>
            <NavLink
              to="/leaderboard"
              className={({ isActive }) =>
                `text-lg transition-colors duration-300 ${
                  isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                }`
              }
            >
              Leaderboard
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-lg transition-colors duration-300 ${
                  isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/community"
              className={({ isActive }) =>
                `text-lg transition-colors duration-300 ${
                  isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                }`
              }
            >
              Community
            </NavLink>
            <NavLink
              to="/rewards"
              className={({ isActive }) =>
                `text-lg transition-colors duration-300 ${
                  isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                }`
              }
            >
              Rewards
            </NavLink>
            <NavLink
              to="/multiplayer"
              className={({ isActive }) =>
                `text-lg transition-colors duration-300 ${
                  isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                }`
              }
            >
              Multiplayer
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-lg transition-colors duration-300 ${
                  isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                }`
              }
            >
              About
            </NavLink>
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
                <NavLink
                  to="/quiz"
                  className={({ isActive }) =>
                    `block text-lg transition-colors duration-300 ${
                      isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Quiz
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/leaderboard"
                  className={({ isActive }) =>
                    `block text-lg transition-colors duration-300 ${
                      isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Leaderboard
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={({ isActive }) =>
                    `block text-lg transition-colors duration-300 ${
                      isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/community"
                  className={({ isActive }) =>
                    `block text-lg transition-colors duration-300 ${
                      isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Community
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/rewards"
                  className={({ isActive }) =>
                    `block text-lg transition-colors duration-300 ${
                      isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Rewards
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/multiplayer"
                  className={({ isActive }) =>
                    `block text-lg transition-colors duration-300 ${
                      isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  Multiplayer
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `block text-lg transition-colors duration-300 ${
                      isActive ? 'text-blue-400 font-bold' : 'text-white hover:text-blue-400'
                    }`
                  }
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </NavLink>
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