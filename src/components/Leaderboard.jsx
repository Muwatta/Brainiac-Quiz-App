import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaRegStar, FaTrophy, FaThumbsUp, FaShareAlt } from 'react-icons/fa';
import { io } from 'socket.io-client'; 

const Leaderboard = ({ refreshTrigger }) => {
  const [scores, setScores] = useState([]);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://brainiac-quiz-app.onrender.com/leaderboard');
        if (!response.ok) {
          throw new Error('Failed to fetch leaderboard');
        }
        const data = await response.json();
        setScores(data); 
        setLoadingError(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoadingError(true);
      }
    };

    fetchLeaderboard();
  }, [refreshTrigger]);

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

  const handleLikeToggle = async (playerId, liked) => {
    try {
      const endpoint = liked
        ? 'https://brainiac-quiz-app.onrender.com/leaderboard/unlike'
        : 'https://brainiac-quiz-app.onrender.com/leaderboard/like';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: playerId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to ${liked ? 'unlike' : 'like'} the player`);
      }

      const data = await response.json();

      // Update the local state
      setScores((prevScores) =>
        prevScores.map((player) =>
          player.id === playerId
            ? { ...player, likes: data.player.likes, liked: !liked }
            : player
        )
      );
    } catch (error) {
      console.error(`Error ${liked ? 'unliking' : 'liking'} the player:`, error);
    }
  };

  // Handle Share
  const handleShare = (player) => {
    const shareText = `Check out ${player.name}'s amazing score of ${player.score} at Brainiac Quiz!`;
    if (navigator.share) {
      navigator.share({
        title: 'Brainiac Quiz Leaderboard',
        text: shareText,
        url: window.location.href,
      });
    } else {
      alert(`Share this: ${shareText}`);
    }
  };

  const calculateStars = (score) => {
    // Example logic to calculate stars based on score
    if (score >= 90) return 5;
    if (score >= 70) return 4;
    if (score >= 50) return 3;
    if (score >= 30) return 2;
    return 1;
  };

  return (
    <div className="leaderboard p-4 bg-[#041d36af] rounded-lg shadow-md">
      {/* Animated Trophy Icon and Title */}
      <motion.div
        className="flex justify-center items-center mb-4"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <FaTrophy className="text-yellow-400 text-4xl mr-2" /> {/* Trophy Icon */}
        <h2 className="text-2xl font-bold text-center text-[#00ffff]">
          Leaderboard
        </h2>
      </motion.div>

      {loadingError && (
        <p className="text-red-500 text-center mb-4">
          Failed to load leaderboard. Please try refreshing the page.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scores.map((player, index) => (
          <motion.div
            key={`${player.id}-${index}`}
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
            {/* Player Avatar */}
            <img
              src={player.avatar || 'https://via.placeholder.com/100'} 
              alt={`${player.name}'s avatar`}
              className="w-20 h-20 rounded-full mb-2 shadow-lg border-4 border-[#eef0f0] bg-[#001e3b]"/>

            {/* Player Name */}
            <h3 className="text-lg font-bold text-[#020c0c]">
              {player.name || 'Anonymous Player'}
            </h3>

            {/* Player Score */}
            <p className="text-[#fff]">
              <strong>Score:</strong> {player.score ?? 0}
            </p>

            {/* Player Time Used */}
            <p className="text-[#fff]">
              <strong>Time Used:</strong> {player.timeUsed ?? 0} seconds
            </p>

            {/* Player Rating */}
            <div className="flex items-center mt-2">
              {[...Array(5)].map((_, starIndex) => (
                <span key={starIndex}>
                  {starIndex < calculateStars(player.score) ? (
                    <FaStar className="text-yellow-400" />
                  ) : (
                    <FaRegStar className="text-gray-400" />
                  )}
                </span>
              ))}
            </div>

            {/* Like and Share Buttons */}
            <div className="flex justify-between mt-4 w-full">
              <button
                className={`flex items-center ${
                  player.liked ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                } text-white px-3 py-1 rounded`}
                onClick={() => handleLikeToggle(player.id, player.liked)}
              >
                <FaThumbsUp className="mr-2" />
                {player.liked ? 'Unlike' : 'Like'} ({player.likes || 0})
              </button>

              <button
                className="flex items-center bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                onClick={() => handleShare(player)}
              >
                <FaShareAlt className="mr-2" /> Share
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {!loadingError && scores.length === 0 && (
        <p className="text-[#00ffff] text-center">
          No scores yet! Be the first to play!
        </p>
      )}
    </div>
  );
};

export default Leaderboard;