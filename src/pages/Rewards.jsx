import React, { useState, useEffect } from 'react';
import { openDatabase } from '../utils/indexedDB';
import { FaStar, FaTrophy, FaGift } from 'react-icons/fa'; 
import { motion } from 'framer-motion'; 

const Rewards = () => {
  const [eligiblePlayers, setEligiblePlayers] = useState([]);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const generatePlayerID = () => {
    return `player-${Math.random().toString(36).substr(2, 9)}`;
  };

  useEffect(() => {
    const fetchEligiblePlayers = async () => {
      try {
        const db = await openDatabase();
        const transaction = db.transaction('leaderboard', 'readwrite');
        const store = transaction.objectStore('leaderboard');

        const allPlayers = await new Promise((resolve, reject) => {
          const request = store.getAll();
          request.onsuccess = () => resolve(request.result || []);
          request.onerror = () => reject('Failed to fetch players');
        });

        console.log('All Players Before ID Check:', allPlayers);

        // Assign IDs to players without one
        const updatedPlayers = allPlayers.map((player) => {
          if (!player.id) {
            player.id = generatePlayerID(); // Generate a new ID
            store.put(player); // Update the database
          }
          return player;
        });

        console.log('All Players After ID Check:', updatedPlayers);

        // Aggregate credits and points by player ID
        const aggregatedPlayers = updatedPlayers.reduce((acc, player) => {
          if (!acc[player.id]) {
            acc[player.id] = { ...player };
          } else {
            acc[player.id].credits += player.credits;
            acc[player.id].points += player.points;
          }
          return acc;
        }, {});

        console.log('Aggregated Players:', aggregatedPlayers);

        // Filter players with more than 10 credits
        const eligible = Object.values(aggregatedPlayers).filter(
          (player) => player.credits > 10
        );

        console.log('Eligible Players:', eligible);

        setEligiblePlayers(eligible);
      } catch (error) {
        console.error('Error fetching eligible players:', error);
      }
    };

    fetchEligiblePlayers();
  }, []);

  const handleClaimReward = async (playerID) => {
    try {
      const db = await openDatabase();
      const transaction = db.transaction('leaderboard', 'readwrite');
      const store = transaction.objectStore('leaderboard');

      const player = eligiblePlayers.find((p) => p.id === playerID);
      if (player) {
        const updatedPlayer = { ...player, credits: 0 }; 
        store.put(updatedPlayer);

        setEligiblePlayers((prev) =>
          prev.map((p) =>
            p.id === playerID ? { ...p, credits: 0 } : p
          )
        );
        setFeedbackMessage(`🎉 Player ${playerID} has claimed their rewards!`);
      }
    } catch (error) {
      console.error('Error claiming reward:', error);
    }
  };

  return (
    <div className="rewards-container p-6 bg-gradient-to-b from-[#2963A2] to-[#72C2C9] min-h-screen text-white">
      <h1 className="text-4xl font-bold mb-6 text-center">🎁 Rewards Center</h1>
      {feedbackMessage && (
        <motion.div
          className="mb-4 text-center text-sm text-green-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {feedbackMessage}
        </motion.div>
      )}

      {/* Reward Highlights Section */}
      <div className="reward-highlights mb-10">
        <h2 className="text-2xl font-bold text-center mb-4">Why Earn Rewards?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            className="highlight-item p-6 bg-white text-black rounded-lg shadow-md text-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaTrophy className="text-yellow-500 text-5xl mx-auto mb-4" />
            <p className="text-lg font-bold">Exclusive Badge</p>
            <p className="text-sm text-gray-600">Earn a badge with 50 credits.</p>
          </motion.div>
          <motion.div
            className="highlight-item p-6 bg-white text-black rounded-lg shadow-md text-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaGift className="text-red-500 text-5xl mx-auto mb-4" />
            <p className="text-lg font-bold">₦10,000 Reward</p>
            <p className="text-sm text-gray-600">Redeem 100 credits for ₦10,000.</p>
          </motion.div>
          <motion.div
            className="highlight-item p-6 bg-white text-black rounded-lg shadow-md text-center"
            whileHover={{ scale: 1.05 }}
          >
            <FaStar className="text-blue-500 text-5xl mx-auto mb-4" />
            <p className="text-lg font-bold">Free Tuition</p>
            <p className="text-sm text-gray-600">500 credits earn you free tuition.</p>
          </motion.div>
        </div>
      </div>

      {/* Eligible Players List */}
      <h2 className="text-2xl font-bold text-center mb-6">Eligible Winners</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {eligiblePlayers.length > 0 ? (
          eligiblePlayers.map((player) => (
            <motion.div
              key={player.id}
              className="reward-item p-4 bg-white text-black rounded-lg shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <h3 className="text-lg font-bold text-center">ID: {player.id}</h3>
              <p className="text-center text-sm text-gray-600">Name: {player.name}</p>
              <p className="text-center text-sm text-gray-600">Credits: {player.credits}</p>
              <p className="text-center text-sm text-gray-600">Points: {player.points}</p>
            </motion.div>
          ))
        ) : (
          <p className="text-center text-lg">No eligible winners yet.</p>
        )}
      </div>
    </div>
  );
};

export default Rewards;