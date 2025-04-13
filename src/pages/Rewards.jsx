import React, { useState } from 'react';

const Rewards = () => {
  const [points, setPoints] = useState(100); // Example: User starts with 100 points
  const [rewards, setRewards] = useState([
    { id: 1, name: 'Certificate', cost: 50 },
    { id: 2, name: 'Badge', cost: 30 },
    { id: 3, name: 'Unlockable Content', cost: 70 },
  ]);

  const handleRedeem = (reward) => {
    if (points >= reward.cost) {
      setPoints((prevPoints) => prevPoints - reward.cost);
      alert(`You have redeemed: ${reward.name}`);
    } else {
      alert('Not enough points to redeem this reward.');
    }
  };

  return (
    <div className="rewards-container p-6 bg-gradient-to-b from-[#2963A2] to-[#72C2C9] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Rewards</h1>
      <p className="text-center mb-4">Your Points: {points}</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((reward) => (
          <div
            key={reward.id}
            className="reward-item p-4 bg-white text-black rounded-lg shadow-md"
          >
            <h3 className="text-lg font-bold">{reward.name}</h3>
            <p>Cost: {reward.cost} points</p>
            <button
              onClick={() => handleRedeem(reward)}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Redeem
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Rewards;