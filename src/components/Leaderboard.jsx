import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTopResults } from '../utils/indexedDB';
import { FaStar, FaRegStar, FaTrophy, FaShareAlt, FaThumbsUp } from 'react-icons/fa'; // Import icons

const Leaderboard = ({ refreshTrigger }) => {
  const [scores, setScores] = useState([]);
  const [loadingError, setLoadingError] = useState(false);
  const [likes, setLikes] = useState({}); // Track likes for each player

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const results = await getTopResults();

        // Filter out invalid results
        const validResults = results.filter(
          (player) =>
            player.score !== undefined &&
            !(player.score === 0 && player.timeUsed === 0)
        );

        // Ensure unique players based on `name`, `school`, and `class`
        const uniqueResults = validResults.reduce((acc, current) => {
          const uniqueKey = `${current.name}-${current.school}-${current.class}`;
          const existingPlayer = acc.find(
            (player) =>
              `${player.name}-${player.school}-${player.class}` === uniqueKey
          );
          if (!existingPlayer) {
            acc.push(current);
          }
          return acc;
        }, []);


        // Sort the results by score and time
        const sortedResults = uniqueResults.sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return a.timeUsed - b.timeUsed;
        });

        setScores(sortedResults.slice(0, 10));
        setLoadingError(false);
      } catch (error) {
        setLoadingError(true);
      }
    };

    fetchLeaderboard();
  }, [refreshTrigger]);

  // Function to calculate star rating based on score and total questions
  const calculateStars = (score, totalQuestions) => {
    const rating = Math.round((score / totalQuestions) * 5); // Convert score to a 5-star rating
    return Math.min(rating, 5); // Ensure the rating does not exceed 5
  };

  const handleLike = (playerId) => {
    setLikes((prevLikes) => ({
      ...prevLikes,
      [playerId]: (prevLikes[playerId] || 0) + 1,
    }));
  };

  const handleShare = (player) => {
    const shareText = `Check out this amazing score by ${player.name || 'Anonymous Player'}: ${player.score} points!`;
    if (navigator.share) {
      navigator.share({
        title: 'Leaderboard Score',
        text: shareText,
        url: window.location.href,
      }).catch((error) => console.error('Error sharing:', error));
    } else {
      alert('Sharing is not supported on this browser.');
    }
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
            className={`p-4 border rounded shadow-sm flex flex-col items-center ${
              index === 0
                ? 'bg-yellow-400' // Gold for 1st place
                : index === 1
                ? 'bg-gray-400' // Silver for 2nd place
                : index === 2
                ? 'bg-orange-400' // Bronze for 3rd place
                : 'bg-[#001e3bfa]' // Default background for others
            }`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            {player.profilePicture ? (
              <img
                src={player.profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4 border-2 border-[#00ffff]"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full mr-4 border-2 border-[#00ffff] bg-gray-700" />
            )}
            <div className="text-center">
              <h3 className="text-lg font-bold text-[#00ffff]">
                {player.name || 'Anonymous Player'}
              </h3>
              <p className="text-[#fff]">
                <strong>Score:</strong> {player.score ?? 0}
              </p>
              <p className="text-[#fff]">
                <strong>Time:</strong> {player.timeUsed ?? 0} seconds
              </p>
              {/* Star Rating */}
              <div className="flex items-center justify-center mt-2">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <span key={starIndex}>
                    {starIndex < calculateStars(player.score, player.totalQuestions) ? (
                      <FaStar className="text-yellow-400" /> // Gold filled star
                    ) : (
                      <FaRegStar className="text-gray-400" /> // Gray empty star
                    )}
                  </span>
                ))}
              </div>
              {/* Like and Share Buttons */}
              <div className="flex items-center justify-center mt-4 space-x-4">
                <button
                  className="flex items-center text-white bg-blue-500 px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => handleLike(player.id)}
                >
                  <FaThumbsUp className="mr-2" /> Like ({likes[player.id] || 0})
                </button>
                <button
                  className="flex items-center text-white bg-green-500 px-3 py-1 rounded hover:bg-green-600"
                  onClick={() => handleShare(player)}
                >
                  <FaShareAlt className="mr-2" /> Share
                </button>
              </div>
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