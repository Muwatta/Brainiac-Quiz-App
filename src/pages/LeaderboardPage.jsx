import React from 'react';
import Leaderboard from '../components/Leaderboard';

const LeaderboardPage = ({ refreshTrigger }) => {
  return (
    <div className="bg-white shadow-md rounded-lg">
      <Leaderboard refreshTrigger={refreshTrigger} />
    </div>
  );
};

export default LeaderboardPage;
