import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Favicon from 'react-favicon';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import QuizPage from './pages/QuizPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';

const App = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleQuizSubmit = () => {
    setRefreshTrigger(prev => prev + 1); // Increment to trigger leaderboard refresh
  };

  return (
    <Router>
      <Favicon url="/favicon.ico" />
      <div className="flex flex-col min-h-screen bg-gray-100">
        <Navbar />
        <main className="flex-grow p-6">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/quiz" element={<QuizPage onQuizSubmit={handleQuizSubmit} />} />
            <Route
              path="/leaderboard"
              element={<LeaderboardPage key={refreshTrigger} refreshTrigger={refreshTrigger} />}
            />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
