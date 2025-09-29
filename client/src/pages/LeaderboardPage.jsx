// client/src/pages/LeaderboardPage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

// Get the base URL configured in your VITE environment variable
const API_BASE = "http://localhost:5000";
const LEADERBOARD_API_URL = `${API_BASE}/api/activities/leaderboard`;

const LeaderboardPage = () => {
  // State is initialized as an empty array []
  const [rankings, setRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get(LEADERBOARD_API_URL);
        // CRITICAL: Ensure correct data path
        setRankings(response.data.data);
      } catch (err) {
        setError("Failed to fetch the leaderboard. Check API status.");
        console.error("Leaderboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="p-6 text-green-700 text-center">
        Loading Global Rankings...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-100 rounded-lg">{error}</div>
    );
  }

  // Check if rankings loaded but are empty
  if (rankings.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-lg max-w-4xl mx-auto text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-4">
          No Rankings Available Yet
        </h1>
        <p className="text-gray-600">
          Start logging activities to appear on the leaderboard!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-green-800 mb-6 text-center">
        🌎 GreenTrack Leaderboard
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Ranked by lowest total lifetime carbon footprint (kg CO₂e).
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rank
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total Footprint (kg CO₂e)
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* FIX: Using the optional chaining operator (?.) for defensive rendering */}
            {rankings?.map((user, index) => (
              <tr
                key={user.username}
                className={
                  index < 3 ? "bg-green-100 font-bold" : "hover:bg-green-50"
                }
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.username}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-lg text-green-700">
                  {user.totalFootprint.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeaderboardPage;
