import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlay, FaStop } from 'react-icons/fa';
import QuizValidationForm from './QuizValidationForm';
import { saveResult, openDatabase } from '../utils/indexedDB';
import { useDarkMode } from '../context/DarkModeContext';

const Quiz = () => {
  const { darkMode } = useDarkMode();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [message, setMessage] = useState('');
  const [hintCount, setHintCount] = useState(2);
  const [filteredOptions, setFilteredOptions] = useState(null);
  const [optionColorsMap, setOptionColorsMap] = useState([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const [timeElapsed, setTimeElapsed] = useState(0); // Track time elapsed
  const [showConfirmationModal, setShowConfirmationModal] = useState(false); // Modal state
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(''); // Add feedback message state
  const navigate = useNavigate();

  const optionColors = ['#4169E1', '#2ECC71', '#FFC107', '#FF6F61', '#708090', '#87CEEB', '#B39DDB', '#00BFA5'];
  const audioRef = useRef(null);

  useEffect(() => {
    if (questions.length > 0) {
      const currentOptions = questions[currentQuestionIndex]?.options || [];
      const shuffledColors = [...optionColors].sort(() => Math.random() - 0.5);
      setOptionColorsMap(currentOptions.map((_, i) => shuffledColors[i]));
    }
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    if (playerInfo) {
      const fetchQuestions = async () => {
        try {
          const fileName =
            playerInfo.class.startsWith('JSS') ? '/data/jss_questions.json' : '/data/questions.json';
          const response = await fetch(fileName);
          const data = await response.json();

          const subjectData = data.find((d) => d.subject === playerInfo.subject);
          if (!subjectData || !subjectData.questions.length) {
            throw new Error('No questions available for the selected subject.');
          }

          const shuffled = subjectData.questions.sort(() => Math.random() - 0.5);
          setQuestions(shuffled);

          // Dynamically calculate total time based on the number of questions
          const totalTime = shuffled.length * 7; // 7 seconds per question
          setTimeLeft(totalTime);
        } catch (err) {
          console.error(err);
          setMessage('Sorry, no questions are available for the selected subject. Kindly try later or choose another subject.');
          setQuestions([]); // Ensure questions array is empty
          setFeedbackMessage('Failed to load questions. Please try again later.');
        } finally {
          // Delay the removal of the loading state by 1.5 seconds
          setTimeout(() => {
            setLoading(false);
          }, 1500);
        }
      };

      fetchQuestions();
    }
  }, [playerInfo]);

  useEffect(() => {
    if (!playerInfo || quizEnded || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // Auto-submit if time runs out
          return 0;
        }
        setTotalTimeUsed((prevTime) => prevTime + 1);
        setTimeElapsed((prevElapsed) => prevElapsed + 1); // Increment time elapsed
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playerInfo, timeLeft, quizEnded]);

  const handleAnswer = (option) => {
    const correct = questions[currentQuestionIndex].answer === option;
    if (correct) {
      setScore((prev) => prev + (hintUsed ? 0.5 : 1));
    }
    setFilteredOptions(null);
    setHintUsed(false);
    setTimeout(() => handleNextQuestion(), 800);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1);
    }
  };

  const useHint = () => {
    if (hintCount > 0) {
      const { options, answer } = questions[currentQuestionIndex];
      const toRemove = options.filter((o) => o !== answer).sort(() => 0.5 - Math.random()).slice(0, 2);
      setFilteredOptions(options.filter((o) => !toRemove.includes(o)));
      setHintUsed(true);
      setHintCount((h) => h - 1);
    }
  };

  const handleSubmit = async () => {
    if (quizEnded || !playerInfo) return;

    setQuizEnded(true);

    const result = {
      name: playerInfo.name,
      school: playerInfo.school,
      class: playerInfo.class,
      subject: playerInfo.subject,
      score,
      timeUsed: totalTimeUsed,
    };

    try {
      await saveResult(result);
      setMessage('Submitted successfully');
      setFeedbackMessage('Quiz submitted successfully!');

      // Award points only if the score is 10 or more
      if (score >= 10) {
        const db = await openDatabase();
        const transaction = db.transaction('leaderboard', 'readwrite');
        const store = transaction.objectStore('leaderboard');

        // Fetch the player's current points
        const playerKey = playerInfo.name;
        const playerData = await new Promise((resolve, reject) => {
          const request = store.get(playerKey);
          request.onsuccess = () => resolve(request.result || { id: playerKey, points: 0 });
          request.onerror = () => resolve({ id: playerKey, points: 0 });
        });

        // Update the player's points
        const updatedPoints = playerData.points + 5;
        store.put({ id: playerKey, points: updatedPoints });
      }

      setTimeout(() => navigate('/leaderboard'), 2000);
    } catch (err) {
      setMessage('Submission failed. Try again.');
      setFeedbackMessage('Submission failed. Please try again.');
    }
  };

  const handleEarlySubmit = () => {
    if (timeElapsed < 30) {
      setShowConfirmationModal(true); // Show confirmation modal
    } else {
      handleSubmit(); // Allow submission if 30 seconds have passed
    }
  };

  const toggleMusic = () => {
    if (musicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setMusicPlaying(!musicPlaying);
  };

  if (!playerInfo) return <QuizValidationForm onSubmit={setPlayerInfo} />;
  if (loading) {
    return (
      <motion.div
        className={`p-6 max-w-3xl mx-auto rounded shadow ${
          darkMode ? 'bg-gray-900 text-white' : 'bg-black text-white'
        }`}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Skeleton for Player Info */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-2"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-24 mb-1"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-20"></div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="h-8 w-20 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-8 w-8 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          </div>
        </div>

        {/* Skeleton for Timer & Hint */}
        <div className="flex justify-center gap-10 mb-6">
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
          <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
        </div>

        {/* Skeleton for Progress */}
        <div className="mb-4">
          <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
        </div>

        {/* Skeleton for Question */}
        <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-4"></div>

        {/* Skeleton for Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>

        {/* Skeleton for Navigation */}
        <div className="flex justify-between">
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </motion.div>
    );
  }

  if (!questions.length) {
    return (
      <div className="text-center p-6">
        <h2 className="text-2xl font-bold mb-4">No Questions Available</h2>
        <p className="mb-4">{message}</p>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={() => setPlayerInfo(null)}
        >
          Go Back
        </button>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">Quiz Ended</h2>
        <p>{message}</p>
        <p>Your Score: {score}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          onClick={() => navigate('/leaderboard')}
        >
          View Leaderboard
        </button>
      </div>
    );
  }

  const options = filteredOptions || questions[currentQuestionIndex]?.options;

  return (
    <motion.div
      className={`p-6 max-w-3xl mx-auto rounded shadow ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-black text-white'
      }`}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Audio Element for Background Music */}
      <audio ref={audioRef} loop>
        <source src="/assets/background-music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      {/* Player Info and Buttons */}
      <div className="flex justify-between items-center mb-4">
        {/* Player Info */}
        <div>
          <h3 className="font-bold">Player: {playerInfo.name}</h3>
          <p className="text-sm">School: {playerInfo.school}</p>
          <p className="text-sm">Subject: {playerInfo.subject}</p>
        </div>

        {/* Buttons: Submit and Music Toggle */}
        <div className="flex flex-col items-center space-y-2">
          {/* Submit Button */}
          <button
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm"
            onClick={handleEarlySubmit}
          >
            Submit
          </button>

          {/* Music Toggle */}
          <button
            className={`p-3 rounded-full transition-transform duration-300 ${
              musicPlaying
                ? 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
                : 'bg-blue-500 text-white hover:bg-blue-600 active:scale-95'
            }`}
            onClick={toggleMusic}
          >
            {musicPlaying ? <FaStop size={20} /> : <FaPlay size={20} />}
          </button>
        </div>
      </div>

      {/* Feedback Message */}
      {feedbackMessage && (
        <div className="mb-4 text-center text-sm text-red-500">
          {feedbackMessage}
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
            <h3 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
              You can't submit until 30 seconds have passed.
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to submit now?
            </p>
            <div className="flex justify-center space-x-4">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                onClick={() => {
                  if (timeElapsed < 30) {
                    // Close the modal and show a message
                    setShowConfirmationModal(false);
                    setMessage('You need to wait until 30 seconds have passed before submitting.');
                  } else {
                    // Allow submission
                    setShowConfirmationModal(false);
                    handleSubmit();
                  }
                }}
              >
                Yes
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
                onClick={() => setShowConfirmationModal(false)} // Cancel submission
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Timer Display */}
      <div className="flex justify-center gap-10 mb-6">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full font-bold transition-all duration-300 ${
            timeLeft <= 3
              ? 'bg-red-500 text-white animate-pulse'
              : 'bg-gray-200 text-black hover:bg-gray-300'
          }`}
        >
          {timeLeft}s
        </div>
        <button
          className={`w-12 h-12 font-bold rounded-full transition-transform duration-300 ${
            hintCount === 0
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-yellow-500 text-white hover:bg-yellow-600 active:scale-95'
          }`}
          onClick={useHint}
          disabled={hintCount === 0}
        >
          {hintCount}
        </button>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <p>Question {currentQuestionIndex + 1} of {questions.length}</p>
        <div className="h-2 bg-gray-200 rounded">
          <div
            className="bg-green-500 h-2 rounded transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h3 className="text-lg font-semibold mb-4">{questions[currentQuestionIndex]?.question}</h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {options.map((option, index) => (
          <button
            key={index}
            className="p-4 rounded shadow text-white font-medium transition-transform duration-300 hover:scale-105 active:scale-95"
            style={{
              backgroundColor: optionColorsMap[index] || '#555',
              cursor: 'pointer',
            }}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          className={`px-4 py-2 rounded transition-transform duration-300 ${
            currentQuestionIndex === 0
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600 active:scale-95'
          }`}
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex((i) => Math.max(i - 1, 0))}
        >
          Back
        </button>
        <button
          className={`px-4 py-2 rounded transition-transform duration-300 ${
            currentQuestionIndex === questions.length - 1
              ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
              : 'bg-gray-500 text-white hover:bg-gray-600 active:scale-95'
          }`}
          disabled={currentQuestionIndex === questions.length - 1}
          onClick={() => setCurrentQuestionIndex((i) => Math.min(i + 1, questions.length - 1))}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Quiz;
