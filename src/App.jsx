import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Favicon from 'react-favicon';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import Community from './pages/Community';
import Rewards from './pages/Rewards'; // Ensure the path is correct
import Multiplayer from './pages/Multiplayer'; 
import { motion } from 'framer-motion';
import LoadingAnimation from './components/LoadingAnimation'; // Adjust the path as needed

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Show loader for 3 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer
  }, []);

  if (isLoading) {
    return <LoadingAnimation />; // Use the loader component
  }

  return (
    <Router>
      <Favicon url="/favicon.ico" />
      <div className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900">
        <Navbar />
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="/leaderboard" element={<LeaderboardPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/community" element={<Community />} />
            <Route path="/rewards" element={<Rewards />} />
            <Route path="/multiplayer" element={<Multiplayer />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;