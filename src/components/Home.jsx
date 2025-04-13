import React from 'react';
import Slider from 'react-slick';
import { motion } from 'framer-motion';
import { FaLightbulb } from 'react-icons/fa'; // Import lightbulb icon

const Home = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000, // 5 seconds
    cssEase: 'linear',
  };

  const carouselItems = [
    { id: 1, content: 'Slide 1: Welcome to the Quiz App!' },
    { id: 2, content: 'Slide 2: Test your knowledge!' },
    { id: 3, content: 'Slide 3: Compete with friends!' },
    { id: 4, content: 'Slide 4: Track your progress!' },
    { id: 5, content: 'Slide 5: Learn while having fun!' },
    { id: 6, content: 'Slide 6: Start your quiz journey now!' },
  ];

  return (
    <div className="home-container min-h-screen bg-gradient-to-b from-[#CADCFC] via-[#8AB6F9] to-[#00246B] text-gray-800">
      <header className="home-header">
        {/* Animated Heading with Icon */}
        <motion.div
          className="flex justify-center items-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Animated Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <FaLightbulb className="text-[#00246B] text-4xl mr-3" />
          </motion.div>

          {/* Animated Heading */}
          <motion.h1
            className="text-4xl font-bold text-center text-[#00246B]"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Welcome to the Quiz App
          </motion.h1>
        </motion.div>
      </header>
      <div className="carousel">
        <Slider {...settings}>
          {carouselItems.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-center h-64 bg-white text-[#00246B] rounded-lg shadow-md"
            >
              <h2 className="text-xl font-semibold">{item.content}</h2>
            </div>
          ))}
        </Slider>
      </div>
      <footer className="home-footer mt-8 text-center">
        <button className="start-quiz-button bg-[#00246B] text-white px-6 py-3 rounded-lg hover:bg-[#8AB6F9] hover:text-[#00246B] transition-colors">
          Start Quiz
        </button>
      </footer>
    </div>
  );
};

export default Home;