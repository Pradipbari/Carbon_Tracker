// client/src/pages/Auth/RegisterPage.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext"; // <-- Import useAuth

// Get the base URL configured in your VITE environment variable
const API_BASE = "https://carbon-tracker-f11b.onrender.com";
const REGISTER_API_URL = `${API_BASE}/api/auth/register`;

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // <-- Get the centralized login function

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // 1. Send data to the backend API
      // The backend returns { token, user } on success.
      const response = await axios.post(REGISTER_API_URL, formData);

      // 2. CRITICAL FIX: Use the login function to handle state, storage, and navigation
      login(response.data.token, response.data.user);

      // The user is now logged in and redirected to /dashboard!
    } catch (err) {
      // 3. Handle errors
      const msg =
        err.response?.data?.error ||
        "Registration failed. Please check your inputs.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-green-700">
          Create a GreenTrack Account
        </h2>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Form Inputs */}
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <input
                id={key}
                name={key}
                type={key === "password" ? "password" : "text"}
                required
                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={formData[key]}
                onChange={handleChange}
              />
            </div>
          ))}

          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-600 text-center mt-4">{error}</p>
          )}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150 ease-in-out disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </div>
        </form>

        {/* Login Link */}
        <div className="text-center text-sm">
          Already have an account?
          <Link
            to="/login"
            className="font-medium text-green-600 hover:text-green-500 ml-1"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
