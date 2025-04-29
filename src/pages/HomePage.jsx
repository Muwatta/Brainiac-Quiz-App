import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaBrain } from 'react-icons/fa';
import heroImage from '../assets/hero-image.jpg'; // Local image

const HomePage = () => {
  const robots = [
    { id: 1, question: 'What is 2 + 2?', answer: "It's 4!" },
    { id: 2, question: 'What is the capital of France?', answer: "It's Paris!" },
    { id: 3, question: 'What is 5 x 6?', answer: "It's 30!" },
    { id: 4, question: 'What is the square root of 16?', answer: "It's 4!" },
    { id: 5, question: 'Who wrote Hamlet?', answer: "It's Shakespeare!" },
    { id: 6, question: 'What is the boiling point of water?', answer: "It's 100°C!" },
  ];

  return (
    <motion.div
      className="text-center p-4 md:p-10 bg-gradient-to-b from-[#2963A2] to-[#72C2C9] shadow-md rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Banner Section */}
      <motion.div
        className="relative w-full max-w-[1200px] h-[200px] md:h-[300px] mx-auto bg-cover bg-center rounded-lg mb-10"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <motion.div
          className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          {/* Staggered Word Animation */}
          <motion.div
            className="flex space-x-2 text-3xl md:text-4xl font-bold mb-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.3, // Delay between each word
                },
              },
            }}
          >
            {['Welcome', 'to', 'Brainiac', 'Quiz'].map((word, index) => (
              <motion.span
                key={index}
                className="inline-block"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.5 }}
              >
                {word}
              </motion.span>
            ))}
          </motion.div>

          <motion.p
            className="text-md md:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.8, ease: 'easeOut' }}
          >
            Challenge your mind and test your knowledge!
          </motion.p>
        </motion.div>
      </motion.div>

      <motion.p
        className="text-lg mt-4 text-[#e1e4cd]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.4,
          duration: 0.6,
          ease: 'easeOut',
        }}
      >
        Test your knowledge with our exciting quizzes.
      </motion.p>

      {/* Robot Animation Section */}
      <motion.div
        className="robot-animation-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10 bg-[#4CAABC] p-4 rounded-lg"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {robots.map((robot, index) => (
          <motion.div
            key={robot.id}
            className="robot flex flex-col items-center bg-white p-4 rounded-lg shadow-md"
            initial={{ y: index % 2 === 0 ? -20 : 20 }}
            animate={{ y: index % 2 === 0 ? 20 : -20 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          >
            {/* Robot SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 64 64"
              className="w-24 h-24 md:w-32 md:h-32"
            >
              <circle cx="32" cy="32" r="30" fill="#72C2C9" />
              <rect x="20" y="20" width="24" height="24" rx="4" fill="#4CAABC" />
              <circle cx="26" cy="28" r="3" fill="#2963A2" />
              <circle cx="38" cy="28" r="3" fill="#2963A2" />
              <rect x="26" y="36" width="12" height="4" rx="2" fill="#2963A2" />
            </svg>
            <motion.p
              className="text-center text-lg font-bold mt-4 text-[#2963A2]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              "{robot.question}"
            </motion.p>
            <motion.p
              className="text-center text-sm font-medium mt-2 text-[#2963A2]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              "{robot.answer}"
            </motion.p>
          </motion.div>
        ))}
      </motion.div>

      {/* Start Quiz Button */}
      <Link to="/quiz">
        <motion.button
          className="mt-6 px-6 py-3 bg-[#2963A2] text-white rounded-lg hover:bg-[#4CAABC]"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          Start Quiz
        </motion.button>
      </Link>
    </motion.div>
  );
};

export default HomePage;
