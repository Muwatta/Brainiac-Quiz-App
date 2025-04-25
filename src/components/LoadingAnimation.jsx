import React from 'react';

const LoadingAnimation = () => {
  return (
    <div className="p-4 md:p-10 bg-gradient-to-b from-[#2963A2] to-[#72C2C9] min-h-screen">
      {/* Skeleton for Header */}
      <div className="flex justify-center items-center mb-6">
        <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse mr-3"></div>
        <div className="w-2/3 h-6 bg-gray-300 rounded animate-pulse"></div>
      </div>

      {/* Skeleton for Description */}
      <div className="w-1/2 h-4 bg-gray-300 rounded animate-pulse mx-auto mb-6"></div>

      {/* Skeleton for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center bg-gray-300 p-4 rounded-lg shadow-md animate-pulse"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-400 rounded-full mb-4"></div>
            <div className="w-3/4 h-4 bg-gray-400 rounded mb-2"></div>
            <div className="w-2/3 h-4 bg-gray-400 rounded"></div>
          </div>
        ))}
      </div>

      {/* Skeleton for Button */}
      <div className="mt-6 w-32 h-10 bg-gray-300 rounded-lg mx-auto animate-pulse"></div>
    </div>
  );
};

export default LoadingAnimation;