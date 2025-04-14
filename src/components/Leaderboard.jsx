import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FaStar,
  FaRegStar,
  FaTrophy,
  FaThumbsUp,
  FaShareAlt,
} from 'react-icons/fa';
import { io } from 'socket.io-client';

const Leaderboard = ({ refreshTrigger }) => {
  const [scores, setScores] = useState([]);
  const [loadingError, setLoadingError] = useState(false);

  // Fetch leaderboard
  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://brainiac-quiz-app.onrender.com/leaderboard');
        if (!response.ok) throw new Error('Failed to fetch leaderboard');
        const data = await response.json();

        const normalized = data.map((player) => ({
          ...player,
          liked: player.liked ?? false,
          likes: player.likes ?? 0,
        }));

        setScores(normalized);
        setLoadingError(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoadingError(true);
      }
    };

    fetchLeaderboard();
  }, [refreshTrigger]);

  // Realtime like updates
  useEffect(() => {
    const socket = io('https://brainiac-quiz-app.onrender.com');

    socket.on('update_likes', ({ id, likes }) => {
      setScores((prevScores) =>
        prevScores.map((player) =>
          player.id === id ? { ...player, likes } : player
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  // Like/Unlike toggle
  const handleLikeToggle = async (playerId, liked) => {
    try {
      const response = await fetch(
        'https://brainiac-quiz-app.onrender.com/leaderboard/like', // Correct endpoint
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ playerId, liked: !liked }), // Toggle the like status
        }
      );

      if (!response.ok) throw new Error('Failed to update like status');

      const data = await response.json();

      setScores((prevScores) =>
        prevScores.map((player) =>
          player.id === playerId
            ? { ...player, likes: data.player.likes, liked: !liked }
            : player
        )
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const calculateStars = (score) => {
    if (score >= 90) return 5;
    if (score >= 70) return 4;
    if (score >= 50) return 3;
    if (score >= 30) return 2;
    return 1;
  };

  const filteredScores = scores.filter(player => player.name !== "John Doe"); // Exclude John Doe

  const topPlayers = filteredScores.slice(0, 3); // Top 3 players
  const remainingPlayers = filteredScores.slice(3); // Remaining players

  return (
    <div className="leaderboard p-4 bg-[#041d36af] rounded-lg shadow-md">
      {/* Top 3 Winners Section */}
      <div className="top-winners mb-6">
        <motion.div
          className="flex justify-center items-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FaTrophy className="text-yellow-400 text-4xl mr-2" />
          <h2 className="text-2xl font-bold text-center text-[#00ffff]">
            Top 3 Winners
          </h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              className={`p-4 border rounded-lg shadow-md flex flex-col items-center ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'}`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img
                src={player.avatar || 'https://via.placeholder.com/100'}
                alt={`${player.name || 'Player'}'s avatar`}
                className="w-20 h-20 rounded-full mb-2 shadow-lg border-4 border-[#eef0f0] bg-[#001e3b]"
              />

              <h3 className="text-lg font-bold text-[#020c0c]">
                {player.name || 'Anonymous'}
              </h3>

              <p className="text-white">
                <strong>Score:</strong> {player.score ?? 0}
              </p>
              <p className="text-white">
                <strong>Time Used:</strong> {player.timeUsed ?? 0} sec
              </p>

              <div className="flex items-center mt-2">
                {[...Array(5)].map((_, i) =>
                  i < calculateStars(player.score) ? (
                    <FaStar key={i} className="text-yellow-400" />
                  ) : (
                    <FaRegStar key={i} className="text-gray-400" />
                  )
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Leaderboard Section */}
      <motion.div
        className="flex justify-center items-center mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaTrophy className="text-yellow-400 text-4xl mr-2" />
        <h2 className="text-2xl font-bold text-center text-[#00ffff]">
          Full Leaderboard
        </h2>
      </motion.div>

      {loadingError && (
        <p className="text-red-500 text-center mb-4">
          Failed to load leaderboard. Please try again later.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {remainingPlayers.map((player, index) => (
          <motion.div
            key={player.id}
            className={`p-4 border rounded-lg shadow-md flex flex-col items-center ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : index === 2 ? 'bg-orange-400' : 'bg-[#001e3bfa]'}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <img
              src={player.avatar || 'https://via.placeholder.com/100'}
              alt={`${player.name || 'Player'}'s avatar`}
              className="w-20 h-20 rounded-full mb-2 shadow-lg border-4 border-[#eef0f0] bg-[#001e3b]"
            />

            <h3 className="text-lg font-bold text-[#020c0c]">
              {player.name || 'Anonymous'}
            </h3>

            <p className="text-white">
              <strong>Score:</strong> {player.score ?? 0}
            </p>
            <p className="text-white">
              <strong>Time Used:</strong> {player.timeUsed ?? 0} sec
            </p>

            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, i) =>
                i < calculateStars(player.score) ? (
                  <FaStar key={i} className="text-yellow-400" />
                ) : (
                  <FaRegStar key={i} className="text-gray-400" />
                )
              )}
            </div>

            <button
              className={`mt-2 px-4 py-2 rounded-full text-white ${
                player.liked ? 'bg-green-500' : 'bg-gray-400'
              }`}
              onClick={() => handleLikeToggle(player.id, player.liked)}
            >
              {player.liked ? 'Unlike' : 'Like'}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
