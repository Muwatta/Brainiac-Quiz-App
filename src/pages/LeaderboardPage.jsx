import React from 'react';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = () => {
  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      {/* <h1 className="text-2xl font-bold text-gray-800 mb-4">Leaderboard</h1> */}
      <Leaderboard />
    </div>
  );
};

export default LeaderboardPage;
