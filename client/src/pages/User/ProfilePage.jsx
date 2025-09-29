// client/src/pages/User/ProfilePage.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const API_URL = "https://carbon-tracker-f11b.onrender.com/api/auth/me";

const ProfilePage = () => {
  // Use a state to hold the fetched profile data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { logout } = useAuth(); // Use logout if the session is invalid

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        // Axios is configured via AuthContext to automatically include the JWT
        const response = await axios.get(API_URL);
        setProfile(response.data.data);
      } catch (err) {
        // Handle common errors like token expiry (401 status)
        if (err.response && err.response.status === 401) {
          setError("Session expired. Please log in again.");
          logout(); // Force logout
        } else {
          setError("Failed to fetch profile data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [logout]);

  if (loading) {
    return <div className="p-6 text-green-700">Loading user profile...</div>;
  }

  if (error) {
    return (
      <div className="p-6 text-red-600 bg-red-100 rounded-lg">{error}</div>
    );
  }

  // Display the fetched profile information
  return (
    <div className="p-6 bg-white rounded-xl shadow-lg max-w-lg mx-auto">
      <h1 className="text-3xl font-bold text-green-700 mb-6 border-b pb-2">
        Your GreenTrack Profile
      </h1>

      {/* Profile Details Card */}
      <div className="space-y-4">
        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-500 font-medium">Username</span>
          <span className="text-gray-900 font-semibold">
            {profile.username}
          </span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-500 font-medium">Email</span>
          <span className="text-gray-900 font-semibold">{profile.email}</span>
        </div>

        <div className="flex justify-between items-center border-b border-gray-100 pb-2">
          <span className="text-gray-500 font-medium">Member Since</span>
          <span className="text-gray-900 font-semibold">
            {new Date(profile.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
