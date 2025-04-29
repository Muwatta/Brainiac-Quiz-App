import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaTrophy, FaThumbsUp, FaShareAlt } from 'react-icons/fa';
import { getTopResults, saveAllResults } from '../utils/indexedDB';

const Leaderboard = ({ refreshTrigger }) => {
  const [scores, setScores] = useState([]);
  const [loadingError, setLoadingError] = useState('');
  const [sharePreview, setSharePreview] = useState(null);

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
        setLoadingError('');
      } catch (error) {
        setLoadingError('Failed to load leaderboard. Please try again later.');
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

  const handleShare = (player) => {
    setSharePreview(player);
  };

  const closeSharePreview = () => {
    setSharePreview(null);
  };

  return (
    <div className="leaderboard p-4 bg-[#041d36af] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-[#00ffff] mb-6">
        Leaderboard
      </h2>

      {loadingError && (
        <div className="text-red-500 text-center mb-4">{loadingError}</div>
      )}

      {/* Top 3 Players Section */}
      <div className="top-players mb-6">
        <h3 className="text-xl font-bold text-center text-yellow-400 mb-4">
          Top 3 Players
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {scores.slice(0, 3).map((player, index) => (
            <motion.div
              key={player.id}
              className={`p-4 border rounded-lg shadow-md flex flex-col items-center ${
                index === 0
                  ? 'bg-yellow-400'
                  : index === 1
                  ? 'bg-gray-400'
                  : 'bg-orange-400'
              }`}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <img
                src={player.avatar || 'https://via.placeholder.com/100'}
                alt={`${player.name}'s avatar`}
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

              <div className="mt-4 flex justify-center items-center space-x-6">
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

                <motion.button
                  className="p-2 rounded-full text-white bg-blue-500 hover:bg-blue-600 transition-all duration-300"
                  onClick={() => handleShare(player)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <FaShareAlt size={24} />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Last 7 Players Section */}
      <div className="last-players">
        <h3 className="text-xl font-bold text-center text-[#00ffff] mb-4">
          Last 7 Players
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scores.slice(-7).map((player) => (
            <motion.div
              key={player.id}
              className="p-4 border rounded-lg shadow-md flex flex-col items-center bg-[#001e3bfa]"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <img
                src={player.avatar || 'https://via.placeholder.com/100'}
                alt={`${player.name}'s avatar`}
                className="w-16 h-16 rounded-full mb-2 shadow-lg border-2 border-white"
              />
              <h3 className="text-lg font-semibold text-white">{player.name}</h3>
              <p className="text-sm text-white">{player.school}</p>
              <p className="text-md text-white font-bold">{player.score} Points</p>
              <div className="text-md text-white flex items-center">
                {Array.from({ length: calculateStars(player.score) }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
                {Array.from({ length: 5 - calculateStars(player.score) }).map((_, i) => (
                  <FaRegStar key={i} className="text-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Share Preview Modal */}
      {sharePreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 text-center">Share Player Details</h2>
            <div className="flex flex-col items-center">
              <img
                src={sharePreview.avatar || 'https://via.placeholder.com/100'}
                alt={`${sharePreview.name}'s avatar`}
                className="w-24 h-24 rounded-full mb-4 shadow-lg border-2 border-gray-300"
              />
              <h3 className="text-lg font-semibold">{sharePreview.name}</h3>
              <p className="text-sm text-gray-600">{sharePreview.school}</p>
              <p className="text-lg font-bold">{sharePreview.score} Points</p>
              <div className="flex items-center mt-2">
                {Array.from({ length: calculateStars(sharePreview.score) }).map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
                {Array.from({ length: 5 - calculateStars(sharePreview.score) }).map((_, i) => (
                  <FaRegStar key={i} className="text-gray-300" />
                ))}
              </div>
            </div>
            <button
              onClick={closeSharePreview}
              className="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
