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
  const [timeLeft, setTimeLeft] = useState(90); 
  const [quizEnded, setQuizEnded] = useState(false);
  const [message, setMessage] = useState('');
  const [hintCount, setHintCount] = useState(2); 
  const [filteredOptions, setFilteredOptions] = useState(null); 
  const [optionColorsMap, setOptionColorsMap] = useState([]);
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
          setQuestions(
            subjectQuestions.questions.sort(() => Math.random() - 0.5)
          );
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

  // Timer logic
  useEffect(() => {
    if (!playerInfo) return; 
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer); // Stop the timer when it reaches 0
          handleSubmit();
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playerInfo]);

  useEffect(() => {
    if (questions.length > 0) {
      const currentOptions = questions[currentQuestionIndex]?.options || [];
      const shuffledColors = [...optionColors].sort(() => Math.random() - 0.5);
      const colorsMap = currentOptions.map((_, index) => shuffledColors[index]);
      setOptionColorsMap(colorsMap);
    }
  }, [currentQuestionIndex, questions]);

  const handleAnswer = selectedOption => {
    const currentQuestion = questions[currentQuestionIndex];
    if (selectedOption === currentQuestion.answer) {
      setScore(prevScore => prevScore + 1);
    }

    setFilteredOptions(null);
    setTimeout(() => {
      setCurrentQuestionIndex(prev => Math.min(prev + 1, questions.length - 1));
    }, 1000);
  };

  const useHint = () => {
    if (hintCount > 0) {
      const currentQuestion = questions[currentQuestionIndex];
      const incorrectOptions = currentQuestion.options.filter(
        option => option !== currentQuestion.answer
      );
      const distractor =
        incorrectOptions[Math.floor(Math.random() * incorrectOptions.length)];
      const newOptions = [currentQuestion.answer, distractor].sort(
        () => Math.random() - 0.5
      );
      setFilteredOptions(newOptions);
      setHintCount(prevCount => prevCount - 1);
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
      timeUsed: 90 - timeLeft,
    };


    await saveResult(result); // Save the result in IndexedDB

    setQuizEnded(true);

    if (score >= questions.length / 2) {
      setMessage('Congratulations! You performed well. Keep it up!');
    } else {
      setMessage('Good effort! Keep practicing to improve your score.');
    }

    setTimeout(() => {
      navigate('/leaderboard');
    }, 20000);
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
      className="quiz-container p-6 bg-white rounded-lg shadow-lg max-w-3xl mx-auto"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold">Player: {playerInfo?.name}</h3>
          <p className="text-sm text-gray-600">School: {playerInfo?.school}</p>
        </div>
        <div
          className={`w-16 h-16 flex items-center justify-center rounded-full text-white font-bold text-lg ${
            timeLeft <= 10 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'
          }`}
        >
          {timeLeft}s
        </div>
      </div>

      {/* Submit and Hint Buttons */}
      <div className="flex justify-start items-center mb-4 space-x-4">
        <button
          className="bg-green-500 text-blue-950 py-2 px-4 rounded hover:bg-green-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
        <button
          className="bg-yellow-500 text-white py-2 px-4 rounded-full hover:bg-yellow-700 animate-pulse"
          onClick={useHint}
          disabled={hintCount === 0}
        >
          {hintCount}
        </button>
      </div>

      {/* Quiz Progress Bar */}
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-500 h-2.5 rounded-full"
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
        className="text-lg font-bold mb-4 text-black" // Set text color to black
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
            className="block w-full text-left py-2 px-4 rounded mb-2 hover:opacity-90"
            style={{
              backgroundColor: optionColorsMap[index],
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
    </motion.div>
  );
};

export default Quiz;
