import React from 'react';
import Quiz from '../components/Quiz';

const QuizPage = ({ onQuizSubmit }) => {
  return (
    <div className="bg-dark shadow-md rounded-lg">
      <Quiz onQuizSubmit={onQuizSubmit} />
    </div>
  );
};

export default QuizPage;
