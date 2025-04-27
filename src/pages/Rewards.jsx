import React, { useState, useEffect } from 'react';
import { openDatabase } from '../utils/indexedDB';
import { generatePlayerID } from '../utils/idGenerator'; // Import the ID generator
import { FaStar } from 'react-icons/fa'; // Favicon for credits

const Rewards = () => {
  const [eligiblePlayers, setEligiblePlayers] = useState([]); // Players eligible for rewards
  const [feedbackMessage, setFeedbackMessage] = useState(''); // Feedback message

  // Fetch eligible players from the leaderboard
  useEffect(() => {
    const fetchEligiblePlayers = async () => {
      const db = await openDatabase();
      const transaction = db.transaction('leaderboard', 'readonly');
      const store = transaction.objectStore('leaderboard');

      const allPlayers = await new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result || []);
        request.onerror = () => resolve([]);
      });

      // Assign IDs to players without IDs
      const playersWithIDs = allPlayers.map((player) => {
        if (!player.id) {
          player.id = generatePlayerID(); // Generate a new ID if missing
        }
        return player;
      });

      // Save players with new IDs back to IndexedDB
      const writeTransaction = db.transaction('leaderboard', 'readwrite');
      const writeStore = writeTransaction.objectStore('leaderboard');
      playersWithIDs.forEach((player) => writeStore.put(player));

      // Aggregate players by ID and sum their points and credits
      const aggregatedPlayers = playersWithIDs.reduce((acc, player) => {
        if (!acc[player.id]) {
          acc[player.id] = { ...player };
        } else {
          acc[player.id].points += player.points;
          acc[player.id].credits += player.credits;
        }
        return acc;
      }, {});

      // Filter players with more than 10 points
      const eligible = Object.values(aggregatedPlayers).filter(
        (player) => player.points > 10
      );

      setEligiblePlayers(eligible);
    };

    fetchEligiblePlayers();
  }, []);

  // Handle claiming rewards
  const handleClaimReward = async (playerID) => {
    const db = await openDatabase();
    const transaction = db.transaction('leaderboard', 'readwrite');
    const store = transaction.objectStore('leaderboard');

    const player = eligiblePlayers.find((p) => p.id === playerID);
    if (player) {
      // Deduct all credits
      const updatedPlayer = { ...player, credits: 0 };
      store.put(updatedPlayer);

      // Update the UI
      setEligiblePlayers((prev) =>
        prev.map((p) =>
          p.id === playerID ? { ...p, credits: 0 } : p
        )
      );
      setFeedbackMessage(`🎉 Player ${playerID} has claimed their rewards!`);
    }
  };

  return (
    <div className="rewards-container p-6 bg-gradient-to-b from-[#2963A2] to-[#72C2C9] min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Rewards</h1>
      {feedbackMessage && (
        <div className="mb-4 text-center text-sm text-green-500">
          {feedbackMessage}
        </div>
      )}

      {/* Reward Targets */}
      <div className="reward-targets mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="target-item p-4 bg-white text-black rounded-lg shadow-md text-center">
            <p className="text-lg font-bold">🎖️ Badge</p>
            <p className="text-sm text-gray-600">50 Points</p>
          </div>
          <div className="target-item p-4 bg-white text-black rounded-lg shadow-md text-center">
            <p className="text-lg font-bold">📜 Certificate</p>
            <p className="text-sm text-gray-600">200 Points</p>
          </div>
          <div className="target-item p-4 bg-white text-black rounded-lg shadow-md text-center">
            <p className="text-lg font-bold">🎓 Tuition Fee</p>
            <p className="text-sm text-gray-600">500 Points</p>
          </div>
        </div>
      </div>

      {/* Eligible Players List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eligiblePlayers.map((player) => {
          const badgeProgress = Math.min((player.points / 50) * 100, 100); // Progress toward badge
          const certificateProgress = Math.min((player.points / 200) * 100, 100); // Progress toward certificate
          const tuitionProgress = Math.min((player.points / 500) * 100, 100); // Progress toward free tuition

          return (
            <div
              key={player.id}
              className="reward-item p-4 bg-white text-black rounded-lg shadow-md"
            >
              <h3 className="text-lg font-bold text-center">{player.id}</h3>
              <p className="text-center text-sm text-gray-600">
                Points: {player.points}
              </p>
              <p className="text-center text-sm text-gray-600 flex items-center justify-center">
                Credits: {player.credits} <FaStar className="text-yellow-400 ml-1" />
              </p>

              {/* Progress Toward Badge */}
              <div className="mt-4">
                <p className="text-sm text-gray-600">🎖️ Badge (50 Points)</p>
                <div className="relative w-full h-4 bg-gray-200 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-4 bg-blue-500 rounded-full"
                    style={{ width: `${badgeProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {badgeProgress === 100
                    ? 'Achieved!'
                    : `${player.points} / 50 Points`}
                </p>
              </div>

              {/* Progress Toward Certificate */}
              <div className="mt-4">
                <p className="text-sm text-gray-600">📜 Certificate (200 Points)</p>
                <div className="relative w-full h-4 bg-gray-200 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-4 bg-green-500 rounded-full"
                    style={{ width: `${certificateProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {certificateProgress === 100
                    ? 'Achieved!'
                    : `${player.points} / 200 Points`}
                </p>
              </div>

              {/* Progress Toward Free Tuition */}
              <div className="mt-4">
                <p className="text-sm text-gray-600">🎓 Free Tuition (500 Points)</p>
                <div className="relative w-full h-4 bg-gray-200 rounded-full">
                  <div
                    className="absolute top-0 left-0 h-4 bg-yellow-500 rounded-full"
                    style={{ width: `${tuitionProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {tuitionProgress === 100
                    ? 'Achieved!'
                    : `${player.points} / 500 Points`}
                </p>
              </div>

              {/* Claim Reward Button */}
              <button
                onClick={() => handleClaimReward(player.id)}
                className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                disabled={player.credits === 0}
              >
                {player.credits === 0 ? 'Already Claimed' : 'Claim Reward'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Rewards;