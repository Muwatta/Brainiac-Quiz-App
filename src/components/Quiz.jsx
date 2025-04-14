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
  const [timeLeft, setTimeLeft] = useState(0);
  const [quizEnded, setQuizEnded] = useState(false);
  const [message, setMessage] = useState('');
  const [hintCount, setHintCount] = useState(2);
  const [filteredOptions, setFilteredOptions] = useState(null);
  const [optionColorsMap, setOptionColorsMap] = useState([]);
  const [hintUsed, setHintUsed] = useState(false);
  const [totalTimeUsed, setTotalTimeUsed] = useState(0);
  const navigate = useNavigate();

  const optionColors = ['#4169E1', '#2ECC71', '#FFC107', '#FF6F61', '#708090', '#87CEEB', '#B39DDB', '#00BFA5'];

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
          const response = await fetch('/data/questions.json');
          const data = await response.json();
          const subjectData = data.find(d => d.subject === playerInfo.subject);
          if (!subjectData) throw new Error('Subject not found');

          const shuffled = subjectData.questions.sort(() => Math.random() - 0.5);
          setQuestions(shuffled);
          setTimeLeft(shuffled.length * 10); // 10 seconds per question
        } catch (err) {
          console.error(err);
          setMessage('Error loading questions');
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [playerInfo]);

  useEffect(() => {
    if (!playerInfo || quizEnded || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit(); // auto-submit if time runs out
          return 0;
        }
        setTotalTimeUsed(prevTime => prevTime + 1);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [playerInfo, timeLeft, quizEnded]);

  const handleAnswer = (option) => {
    const correct = questions[currentQuestionIndex].answer === option;
    if (correct) {
      setScore(prev => prev + (hintUsed ? 0.5 : 1));
    }
    setFilteredOptions(null);
    setHintUsed(false);
    setTimeout(() => handleNextQuestion(), 800);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(i => i + 1);
    }
    // Do not auto-submit here — wait for user to click "Submit"
  };

  const useHint = () => {
    if (hintCount > 0) {
      const { options, answer } = questions[currentQuestionIndex];
      const toRemove = options.filter(o => o !== answer).sort(() => 0.5 - Math.random()).slice(0, 2);
      setFilteredOptions(options.filter(o => !toRemove.includes(o)));
      setHintUsed(true);
      setHintCount(h => h - 1);
    }
  };

  const handleSubmit = async () => {
    if (quizEnded || !playerInfo) return;

    setQuizEnded(true);

    const result = {
      name: playerInfo.name,
      school: playerInfo.school,
      class: playerInfo.class,
      score,
      timeUsed: totalTimeUsed,
    };

    try {
      await saveResult(result);
      setMessage('Submitted successfully');

      setTimeout(() => navigate('/leaderboard'), 2000);
    } catch (err) {
      setMessage('Submission failed. Try again.');
    }
  };

  if (!playerInfo) return <QuizValidationForm onSubmit={setPlayerInfo} />;
  if (loading) return <div className="text-center">Loading questions...</div>;

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
      className="p-6 max-w-3xl mx-auto bg-white rounded shadow"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="flex justify-between mb-4">
        <div>
          <h3 className="font-bold">Player: {playerInfo.name}</h3>
          <p className="text-sm">School: {playerInfo.school}</p>
        </div>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>

      {/* Timer & Hint */}
      <div className="flex justify-center gap-10 mb-6">
        <div className={`w-12 h-12 flex items-center justify-center rounded-full font-bold ${timeLeft <= 3 ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-200 text-black'}`}>
          {timeLeft}s
        </div>
        <button
          className="w-12 h-12 bg-yellow-500 text-white font-bold rounded-full"
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
            className="bg-green-500 h-2 rounded"
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
            className="p-4 rounded shadow text-white font-medium hover:scale-105 transition-transform"
            style={{ backgroundColor: optionColorsMap[index] || '#555' }} // safe fallback
            onClick={() => handleAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={currentQuestionIndex === 0}
          onClick={() => setCurrentQuestionIndex(i => Math.max(i - 1, 0))}
        >
          Back
        </button>
        <button
          className="bg-gray-500 text-white px-4 py-2 rounded"
          disabled={currentQuestionIndex === questions.length - 1}
          onClick={() => setCurrentQuestionIndex(i => Math.min(i + 1, questions.length - 1))}
        >
          Next
        </button>
      </div>
    </motion.div>
  );
};

export default Quiz;
