// client/src/pages/Auth/LoginPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // <-- Must be imported

const API_URL = "http://localhost:5000/api/auth";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // <-- Must use login function from context

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      // 1. Successful API call
      const response = await axios.post(`${API_URL}/login`, formData);

      // 2. CRITICAL FIX: Use context function to handle state and storage
      login(response.data.token, response.data.user);

      // The context function handles localStorage.setItem and navigation.
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Login failed. Check your email and password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-green-700">
          Sign In to GreenTrack
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Inputs remain the same */}
          <input
            id="email"
            name="email"
            type="email"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
          />
          <input
            id="password"
            name="password"
            type="password"
            required
            className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />

          {error && (
            <p className="text-sm text-red-600 text-center mt-4">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          Don't have an account?
          <Link
            to="/register"
            className="font-medium text-green-600 hover:text-green-500 ml-1"
          >
            Register here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
