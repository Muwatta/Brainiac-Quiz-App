import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import QuizValidationForm from './QuizValidationForm';
import { saveResult } from '../utils/indexedDB';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playerInfo, setPlayerInfo] = useState(null);
  const [timeLeft, setTimeLeft] = useState(10);
  const [quizEnded, setQuizEnded] = useState(false);
  const [message, setMessage] = useState('');
  const [hintCount, setHintCount] = useState(2);
  const [filteredOptions, setFilteredOptions] = useState(null);
  const [optionColorsMap, setOptionColorsMap] = useState([]);
  const [hintUsed, setHintUsed] = useState(false); 
  const navigate = useNavigate();

  // Colors for MCQ options
  const optionColors = [
    '#4169E1', // Royal Blue
    '#2ECC71', // Emerald Green
    '#FFC107', // Amber Yellow
    '#FF6F61', // Coral Red
    '#708090', // Slate Gray
    '#87CEEB', // Sky Blue
    '#B39DDB', // Lavender Purple
    '#00BFA5', // Cool Teal
  ];

  // Shuffle colors and map them to options
  useEffect(() => {
    if (questions.length > 0) {
      const currentOptions = questions[currentQuestionIndex]?.options || [];
      const shuffledColors = [...optionColors].sort(() => Math.random() - 0.5);
      const colorsMap = currentOptions.map((_, index) => shuffledColors[index]);
      setOptionColorsMap(colorsMap);
    }
  }, [currentQuestionIndex, questions]);

  // Fetch questions when player info is set
  useEffect(() => {
    if (playerInfo) {
      const fetchQuestions = async () => {
        try {
          const response = await fetch('/data/questions.json');
          if (!response.ok) {
            throw new Error('Failed to fetch questions');
          }
          const data = await response.json();
          const subjectQuestions = data.find(
            subject => subject.subject === playerInfo.subject
          );
          if (!subjectQuestions) {
            throw new Error('No questions found for the selected subject');
          }
          const shuffledQuestions = subjectQuestions.questions.sort(
            () => Math.random() - 0.5
          );
          setQuestions(shuffledQuestions);
        } catch (error) {
          console.error('Error fetching questions:', error);
          setMessage('Failed to load questions. Please try again.');
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [playerInfo]);

  // Timer logic for each question
  useEffect(() => {
    if (!playerInfo || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          handleNextQuestion(false);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playerInfo, timeLeft]);

  const handleAnswer = selectedOption => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      setScore(prevScore => prevScore + (hintUsed ? 0.5 : 1)); // Add 0.5 or 1 point based on hint usage
    }

    setFilteredOptions(null);
    setHintUsed(false); 

    setTimeout(() => {
      handleNextQuestion(true);
    }, 1000);
  };

  const useHint = () => {
    if (hintCount > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const incorrectOptions = currentQuestion.options.filter(
        option => option !== currentQuestion.answer
      );

      const optionsToRemove = incorrectOptions.sort(() => Math.random() - 0.5).slice(0, 2);

      const newOptions = currentQuestion.options.filter(
        option => !optionsToRemove.includes(option)
      );

      setFilteredOptions(newOptions); 
      setHintCount(prevCount => prevCount - 1);
      setHintUsed(true); // Mark that a hint was used
    }
  };

  const handleNextQuestion = (isCorrect) => {
    setTimeLeft(10); // Reset the timer for the next question

    // Logic to move to the next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    } else {
      handleSubmit(); // End the quiz if it's the last question
    }
  };

  const handleSubmit = async () => {
    if (!playerInfo) {
      console.error('Player information is missing');
      return;
    }

    const result = {
      name: playerInfo.name,
      school: playerInfo.school,
      class: playerInfo.class,
      score: score || 0,
      timeUsed: questions.length * 10 - timeLeft, // Total time used
    };

    try {
      // Send the player's result to the backend
      const response = await fetch('https://brainiac-quiz-app.onrender.com/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result),
      });

      if (!response.ok) {
        throw new Error('Failed to submit score to the leaderboard');
      }

      const data = await response.json();
      console.log('Score submitted successfully:', data.message);

      // Display a success message or navigate to the leaderboard
      setQuizEnded(true);

      if (score >= questions.length / 2) {
        setMessage('Congratulations! You performed well. Keep it up!');
      } else {
        setMessage('Good effort! Keep practicing to improve your score.');
      }

      setTimeout(() => {
        navigate('/leaderboard'); // Redirect to the leaderboard page
      }, 2000);
    } catch (error) {
      console.error('Error submitting score:', error);
      setMessage('Failed to submit your score. Please try again.');
    }
  };

  if (!playerInfo) {
    return <QuizValidationForm onSubmit={setPlayerInfo} />;
  }

  if (loading) {
    return <div className="text-center text-lg font-bold">Loading...</div>;
  }

  if (quizEnded) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold">Quiz Ended</h1>
        <p className="text-lg">{message}</p>
        <p className="text-lg">Your Score: {score}</p>
        <button
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4"
          onClick={() => navigate('/leaderboard')}
        >
          View Leaderboard
        </button>
      </div>
    );
  }

  const currentOptions =
    filteredOptions || questions[currentQuestionIndex]?.options;

  return (
    <motion.div
      className="quiz-container p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-600">Player: {playerInfo?.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300">
            School: {playerInfo?.school}
          </p>
        </div>
        <div className="flex flex-col items-end space-y-4">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-700"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>

      {/* Hint Bonus and Timer */}
      <div className="flex justify-center items-center space-x-8 mb-6">
        {/* Timer */}
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-full text-lg font-bold bg-black-200 ${
            timeLeft <= 3 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 dark:bg-gray-700 text-black dark:text-white'
          }`}
        >
          {timeLeft}s
        </div>

        {/* Hint Bonus */}
        <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-500 text-white text-lg font-bold">
          <button
            className="w-full h-full flex items-center justify-center rounded-full bg-yellow-500 text-white font-bold hover:bg-yellow-600"
            onClick={useHint}
            disabled={hintCount === 0} // Disable button when no hints are left
          >
            {hintCount}
          </button>
        </div>
      </div>

      {/* Quiz Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className="bg-green-500 h-2.5 rounded-full"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / questions.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      {/* Quiz Question */}
      <motion.h3
        className="text-lg font-bold mb-4 text-black dark:text-white"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentQuestionIndex + 1}.{' '}
        {questions[currentQuestionIndex]?.question || 'Loading...'}
      </motion.h3>

      {/* Quiz Options */}
      <motion.div
        className="options mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        {currentOptions.map((option, index) => (
          <button
            key={index}
            className="block w-full text-left py-4 px-6 rounded-lg shadow-md hover:scale-105 transition-transform duration-200"
            style={{
              backgroundColor: optionColorsMap[index], // Apply background color
              color: ['#FFC107', '#FF6F61'].includes(optionColorsMap[index])
                ? 'darkgray'
                : 'white',
            }}
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="flex justify-between items-center mt-4">
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
          onClick={() => setCurrentQuestionIndex(prev => Math.max(prev - 1, 0))}
          disabled={currentQuestionIndex === 0}
        >
          Back
        </button>
        <button
          className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-700"
          onClick={() =>
            setCurrentQuestionIndex(prev =>
              Math.min(prev + 1, questions.length - 1)
            )
          }
          disabled={currentQuestionIndex === questions.length - 1}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Quiz;