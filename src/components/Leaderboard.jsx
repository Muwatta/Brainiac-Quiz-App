import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaTrophy, FaThumbsUp, FaShareAlt, FaHeart } from 'react-icons/fa';
import { openDatabase, saveResult, getTopResults, saveAllResults } from '../utils/indexedDB';

const Leaderboard = ({ refreshTrigger }) => {
  const [scores, setScores] = useState([]);
  const [loadingError, setLoadingError] = useState(false);

  // Function to calculate the number of stars based on the score
  const calculateStars = (score) => {
    if (score >= 20) return 5;
    if (score >= 15) return 4;
    if (score >= 10) return 3;
    if (score >= 5) return 2;
    return 1;
  };

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const results = await getTopResults();
        setScores(results);
        setLoadingError(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoadingError(true);
      }
    };

    fetchLeaderboard();
  }, [refreshTrigger]);

  const handleLikeToggle = async (playerId, liked) => {
    const updatedScores = scores.map((player) =>
      player.id === playerId
        ? { ...player, liked: !liked, likes: player.likes + (liked ? -1 : 1) }
        : player
    );
    setScores(updatedScores);
    await saveAllResults(updatedScores);
  };

  const handleShare = (playerName) => {
    const url = `https://example.com/leaderboard?user=${playerName}`;
    if (navigator.share) {
      navigator.share({
        title: 'Leaderboard Share',
        text: `Check out ${playerName}'s score on the leaderboard!`,
        url: url,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      navigator.clipboard.writeText(url).then(() => {
        // Optionally, you could show a success message here
      }).catch(err => {
        console.error('Failed to copy the link:', err);
      });
    }
  };

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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {scores.slice(0, 3).map((player, index) => (
            <motion.div
              key={player.id}
              className={`p-4 border rounded-lg shadow-md flex flex-col items-center ${
                index === 0
                  ? 'bg-yellow-400'
                  : index === 1
                  ? 'bg-gray-400'
                  : index === 2
                  ? 'bg-orange-400'
                  : 'bg-[#001e3bfa]'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              {/* Card Content */}
              <img
                src={player.avatar || 'https://via.placeholder.com/100'}
                alt={`${player.name || 'Player'}'s avatar`}
                className="w-20 h-20 rounded-full mb-2 shadow-lg border-2 border-white"
              />
              <h3 className="text-xl font-semibold text-white">{player.name}</h3>
              <p className="text-sm text-white">{player.school}</p>
              <p className="text-lg text-white font-bold">{player.score} Points</p>
              <div className="text-lg text-white flex items-center">
                {Array.from({ length: calculateStars(player.score) }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
                {Array.from({ length: 5 - calculateStars(player.score) }).map((_, i) => (
                  <FaRegStar key={i} className="text-yellow-400" />
                ))}
              </div>

              {/* Action Icons */}
              <div className="mt-4 flex justify-center items-center space-x-6">
                {/* Like Button */}
                <motion.button
                  className={`p-2 rounded-full transition-all duration-300 ${player.liked ? 'text-blue-500' : 'text-silver-300'}`}
                  onClick={() => handleLikeToggle(player.id, player.liked)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaThumbsUp size={24} />
                </motion.button>

                {/* Share Button */}
                <motion.button
                  className="p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                  onClick={() => handleShare(player.name)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaShareAlt size={24} />
                </motion.button>

                {/* Love Button */}
                <motion.button
                  className="p-2 rounded-full transition-all duration-300 text-red-500"
                  onClick={() => alert('Love feature coming soon!')} // Handle love feature here
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaHeart size={24} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* All Players Section */}
      <div className="all-players">
        <motion.div
          className="flex justify-center items-center mb-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-bold text-center text-[#00ffff]">All Players</h2>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {scores.map((player, index) => (
            <motion.div
              key={player.id}
              className={`p-4 border rounded-lg shadow-md flex flex-col items-center ${
                index < 3
                  ? 'hidden' // Hide the top 3 players in this section
                  : 'bg-[#001e3bfa]'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {/* Player Avatar */}
              <img
                src={player.avatar || 'https://via.placeholder.com/100'}
                alt={`${player.name || 'Player'}'s avatar`}
                className="w-16 h-16 rounded-full mb-2 shadow-lg border-2 border-white"
              />

              {/* Player Name */}
              <h3 className="text-lg font-semibold text-[#a9d1d6]">{player.name}</h3>

              {/* Player School */}
              <p className="text-sm text-[#c5c7d0]">{player.school}</p>

              {/* Player Score */}
              <p className="text-lg font-bold text-[#a9d1d6]">{player.score} Points</p>

              {/* Action Icons */}
              <div className="mt-4 flex justify-center items-center space-x-4">
                {/* Like Button */}
                <motion.button
                  className={`p-2 rounded-full transition-all duration-300 ${
                    player.liked ? 'text-blue-500' : 'text-silver-300'
                  }`}
                  onClick={() => handleLikeToggle(player.id, player.liked)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaThumbsUp size={24} />
                </motion.button>

                {/* Share Button */}
                <motion.button
                  className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-all duration-300"
                  onClick={() => handleShare(player.name)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaShareAlt size={24} />
                </motion.button>

                {/* Love Button */}
                <motion.button
                  className="p-2 rounded-full transition-all duration-300 text-red-500"
                  onClick={() => alert('Love feature coming soon!')}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaHeart size={24} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
