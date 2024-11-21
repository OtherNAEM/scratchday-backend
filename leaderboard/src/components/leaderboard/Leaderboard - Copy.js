import React, { useState, useEffect } from 'react';
import './Leaderboard.css'; // Import the CSS file
import { io } from 'socket.io-client'; // Import socket.io-client

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]); // State for leaderboard data
  const [error, setError] = useState(null); // State for error handling

  // Initialize socket.io client and set up listeners
  useEffect(() => {
    const socket = io('http://localhost:3000'); // Connect to the server

    // Listen for 'leaderboardUpdate' events to receive real-time updates
    socket.on('leaderboardUpdate', (data) => {
      setLeaderboard(data); // Update leaderboard with new data from the server
    });

    // Fetch the initial leaderboard data on mount
    fetchLeaderboard();

    // Cleanup the socket connection on component unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  // Fetch leaderboard data from the API
  const fetchLeaderboard = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/leaderboard');
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setLeaderboard(data); // Set the leaderboard state with fetched data
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to fetch leaderboard. Please try again later.');
    }
  };

  // Sort the leaderboard by score in descending order
  const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score);

  return (
    <div className="container">
      <h1>Leaderboard</h1>
      {error && <div className="error">{error}</div>} {/* Show error if any */}
      <div className="leaderboard">
        {sortedLeaderboard.length > 0 ? (
          sortedLeaderboard.map((team, index) => (
            <div
              key={team.id}
              className={`entry ${
                index === 0
                  ? 'gold'
                  : index === 1
                  ? 'silver'
                  : index === 2
                  ? 'bronze'
                  : ''
              }`}
            >
              <span className="medal">
                {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
              </span>
              <span className="name">{team.name}</span>
              <span className="score">{team.score}</span>
            </div>
          ))
        ) : (
          <div>No teams found in the leaderboard.</div>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
