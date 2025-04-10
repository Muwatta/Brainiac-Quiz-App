import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getTopResults } from '../utils/indexedDB';

const Leaderboard = ({ refreshTrigger }) => {
  const [scores, setScores] = useState([]);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {

    const fetchLeaderboard = async () => {
      try {
        const results = await getTopResults();
        const validResults = results.filter(
          player =>
            player.score !== undefined &&
            !(player.score === 0 && player.timeUsed === 0)
        );

        const sortedResults = validResults.sort((a, b) => {
          if (b.score !== a.score) {
            return b.score - a.score;
          }
          return a.timeUsed - b.timeUsed;
        });

        setScores(sortedResults.slice(0, 10));
        setLoadingError(false);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setLoadingError(true);
      }
    };

    fetchLeaderboard();
  }, [refreshTrigger]);

  return (
    <div className="leaderboard p-6 bg-[#041d36af] rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-[#00ffff]">
        Leaderboard
      </h2>
      {loadingError && (
        <p className="text-red-500 text-center mb-4">
          Failed to load leaderboard. Please try refreshing the page.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scores.map((player, index) => (
          <motion.div
            key={`${player.id}-${index}`}
            className="p-4 border border-[#001428] rounded bg-[#001e3b] shadow-sm flex items-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            {player.profilePicture ? (
              <img
                src={player.profilePicture}
                alt="Profile"
                className="w-12 h-12 rounded-full mr-4 border-2 border-[#00ffff]"
                onError={e => {
                  e.target.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-12 h-12 rounded-full mr-4 border-2 border-[#00ffff] bg-gray-700" />
            )}
            <div>
              <h3 className="text-lg font-bold text-[#00ffff]">
                {player.name || 'Anonymous Player'}
              </h3>
              <p className="text-[#fff]">
                <strong>Class:</strong> {player.class || 'N/A'}
              </p>
              <p className="text-[#fff]">
                <strong>Score:</strong> {player.score ?? 0}
              </p>
              <p className="text-[#fff]">
                <strong>Time Used:</strong> {player.timeUsed ?? 0} seconds
              </p>
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
