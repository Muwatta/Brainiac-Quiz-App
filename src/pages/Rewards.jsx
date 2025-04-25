import React, { useState, useEffect } from 'react';
import { openDatabase } from '../utils/indexedDB';
import { FaStar } from 'react-icons/fa'; // Import a favicon for credit updates

const Rewards = () => {
  const [points, setPoints] = useState(0); // Initialize points
  const [credits, setCredits] = useState(0); // Initialize credits
  const [rewards, setRewards] = useState([
    { id: 1, name: 'Certificate', cost: 200 },
    { id: 2, name: 'Badge', cost: 50 },
    { id: 3, name: 'Unlockable Content', cost: 70 },
  ]);
  const [feedbackMessage, setFeedbackMessage] = useState(''); // Add feedback message state

  // Fetch points and credits for the current player from IndexedDB
  useEffect(() => {
    const fetchPlayerData = async () => {
      const playerName = localStorage.getItem('currentPlayerName'); // Get the current player's name
      if (playerName) {
        const db = await openDatabase();
        const transaction = db.transaction('leaderboard', 'readonly');
        const store = transaction.objectStore('leaderboard');

        const playerData = await new Promise((resolve, reject) => {
          const request = store.get(playerName);
          request.onsuccess = () => resolve(request.result || { points: 0, credits: 0 });
          request.onerror = () => resolve({ points: 0, credits: 0 });
        });

        setPoints(playerData.points);
        setCredits(playerData.credits || 0); // Default to 0 if credits are not set
      }
    };

    fetchPlayerData();
  }, []);

  const handleRedeem = async (reward) => {
    if (points >= reward.cost) {
      const updatedPoints = points - reward.cost;
      setPoints(updatedPoints);

      const playerName = localStorage.getItem('currentPlayerName'); // Get the current player's name
      if (playerName) {
        const db = await openDatabase();
        const transaction = db.transaction('leaderboard', 'readwrite');
        const store = transaction.objectStore('leaderboard');

        store.put({ id: playerName, points: updatedPoints, credits }); // Update points in IndexedDB
      }

      setFeedbackMessage(`You have redeemed: ${reward.name}`);
    } else {
      setFeedbackMessage('Not enough points to redeem this reward.');
    }
  };

  // Handle leaderboard card click
  const handleLeaderboardClick = async () => {
    if (points >= 10) {
      const updatedCredits = credits + 5; // Add 5 credits
      setCredits(updatedCredits);

      const playerName = localStorage.getItem('currentPlayerName'); // Get the current player's name
      if (playerName) {
        const db = await openDatabase();
        const transaction = db.transaction('leaderboard', 'readwrite');
        const store = transaction.objectStore('leaderboard');

        // Update credits in IndexedDB
        store.put({ id: playerName, points, credits: updatedCredits });
      }

      setFeedbackMessage('🎉 You earned 5 credits for surpassing 10 points!');
    } else {
      setFeedbackMessage('You need at least 10 points to earn credits.');
    }
  };

  return (
    <div className="rewards-container p-6 bg-gradient-to-b from-[#2963A2] to-[#72C2C9] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Rewards</h1>
      <p className="text-center mb-4">Your Points: {points}</p>
      <p className="text-center mb-4">Your Credits: {credits}</p>
      {feedbackMessage && (
        <div className="mb-4 text-center text-sm text-red-500">
          {feedbackMessage}
        </div>
      )}

      {/* Leaderboard Card */}
      <div
        onClick={handleLeaderboardClick}
        className="leaderboard-card p-4 bg-white text-black rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
      >
        <h3 className="text-lg font-bold">Leaderboard</h3>
        <p>Click to earn credits if you have 10 or more points!</p>
        <FaStar className="text-yellow-500 text-2xl mt-2 animate-bounce" /> {/* Animated Favicon */}
      </div>

      {/* Display Badge and Certificate */}
      <div className="mb-6 text-center">
        {points >= 50 && (
          <div className="mb-4">
            <p className="text-lg font-bold text-yellow-400">🎖️ You have earned a Badge!</p>
          </div>
        )}
        {points >= 200 && (
          <div className="mb-4">
            <p className="text-lg font-bold text-green-400">📜 You have earned a Certificate!</p>
          </div>
        )}
      </div>

      {/* Rewards List */}
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