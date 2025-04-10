import React from 'react';
import Quiz from '../components/Quiz';

const QuizPage = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* <h1 className="text-2xl text-center font-[500] text-gray-800 mb-4">
        Quiz Page
      </h1> */}
      <Quiz />
    </div>
  );
};

export default QuizPage;
