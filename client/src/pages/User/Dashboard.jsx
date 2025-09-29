// client/src/pages/User/Dashboard.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { Pie, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement
);

const API_URL = "https://carbon-tracker-f11b.onrender.com/api/activities";

// Helper function to aggregate daily totals (Remains the same)
const aggregateDailyFootprint = (activities) => {
  const dailyTotals = {};
  activities.forEach((activity) => {
    const dateKey = new Date(activity.date).toISOString().split("T")[0];
    dailyTotals[dateKey] =
      (dailyTotals[dateKey] || 0) + activity.carbonFootprint;
  });

  const sortedDates = Object.keys(dailyTotals).sort();

  return {
    labels: sortedDates,
    data: sortedDates.map((date) => dailyTotals[date]),
  };
};

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchActivities = async () => {
    try {
      const response = await axios.get(API_URL);
      setActivities(response.data.data);
      setError("");
    } catch (err) {
      setError("Failed to load activities. Please try logging in again.");
    } finally {
      setLoading(false);
    }
  };

  // Delete Handler (Remains the same)
  const handleDelete = async (activityId) => {
    console.warn("Deleting activity:", activityId);
    try {
      await axios.delete(`${API_URL}/${activityId}`);
      setActivities((prev) => prev.filter((act) => act._id !== activityId));
    } catch (err) {
      setError("Failed to delete activity.");
      console.error("Deletion error:", err);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [navigate]);

  // Data Aggregation and Calculation (Memoized, remains the same)
  const { totalFootprint, categoryBreakdown, dailyData } = useMemo(() => {
    let total = 0;
    const breakdown = {};

    activities.forEach((activity) => {
      total += activity.carbonFootprint;
      const category = activity.category;
      breakdown[category] =
        (breakdown[category] || 0) + activity.carbonFootprint;
    });

    const dailyData = aggregateDailyFootprint(activities);

    return { totalFootprint: total, categoryBreakdown: breakdown, dailyData };
  }, [activities]);

  // Chart Data Preparation (Remains the same)
  const chartData = useMemo(() => {
    const labels = Object.keys(categoryBreakdown);
    const data = Object.values(categoryBreakdown);

    const colors = [
      "#4cbb17",
      "#3CB371",
      "#90EE90",
      "#2E8B57",
      "#8FBC8F",
      "#6B8E23",
      "#228B22",
      "#7CFC00",
    ];

    return {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: labels.map(
            (_, index) => colors[index % colors.length]
          ),
          borderColor: "#ffffff",
          borderWidth: 1,
        },
      ],
    };
  }, [categoryBreakdown]);

  // Line Chart Data Preparation (Remains the same)
  const lineChartData = {
    labels: dailyData.labels,
    datasets: [
      {
        label: "Daily Carbon Footprint (kg CO₂e)",
        data: dailyData.data,
        fill: true,
        backgroundColor: "rgba(76, 187, 23, 0.2)",
        borderColor: "#4cbb17",
        tension: 0.2,
      },
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-green-600">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      {/* Header and Controls (Remains the same) */}
      <header className="mb-8 pb-4 border-b border-gray-300 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-green-800">
          Welcome, {user?.username || "Eco User"}!
        </h1>
      </header>

      {error && (
        <div className="p-3 mb-4 text-red-700 bg-red-100 rounded-lg">
          {error}
        </div>
      )}

      {/* --- NEW: EMPTY STATE CHECK --- */}
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-10 bg-white rounded-xl shadow-lg border-2 border-dashed border-green-300">
          <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
            🌱 Start Your Nature friendly Journey!
          </h2>
          <p className="text-lg text-gray-500 mb-6 text-center">
            It looks like you haven't logged any carbon activities yet.
          </p>
          <Link
            to="/log-activity"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-xl hover:bg-green-700 transition duration-150"
          >
            Add Your First Activity Now
          </Link>
        </div>
      ) : (
        <>
          {/* --- FULL DASHBOARD CONTENT (Rendered only if activities exist) --- */}

          {/* Main Stats and Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Total Footprint Card */}
            <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg border-l-4 border-green-500">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                Total Footprint
              </h2>
              <p className="text-4xl font-extrabold text-green-700">
                {totalFootprint.toFixed(2)} kg{" "}
                <span className="align-text-bottom text-2xl">CO₂e</span>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Since your first entry.
              </p>
            </div>

            {/* Pie Chart Visualization */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg flex justify-center">
              <div className="w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-600 mb-4 text-center">
                  Breakdown by Category
                </h2>
                <Pie
                  data={chartData}
                  options={{ responsive: true, maintainAspectRatio: true }}
                />
              </div>
            </div>
          </div>

          {/* Daily Trend Line Chart */}
          <div className="bg-white p-6 rounded-xl shadow-lg mb-10">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Daily Footprint Trend
            </h2>
            {dailyData.labels.length > 1 ? (
              <div className="relative h-96 w-full">
                <Line
                  data={lineChartData}
                  options={{ responsive: true, maintainAspectRatio: false }}
                />
              </div>
            ) : (
              <p className="text-gray-500">
                Log more activities over multiple days to see your trend line!
              </p>
            )}
          </div>

          {/* Recent Activities List */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Recent Activities
            </h2>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Activity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Footprint (kg{" "}
                      <span className="align-text-bottom text-xs">CO₂e</span>)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {activities.slice(0, 10).map((activity) => (
                    <tr key={activity._id} className="hover:bg-green-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(activity.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {activity.value} {activity.unit}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-700">
                        {activity.carbonFootprint.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleDelete(activity._id)}
                          className="text-red-600 hover:text-red-900 transition"
                          title="Delete Activity"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
