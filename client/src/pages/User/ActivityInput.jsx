// client/src/pages/User/ActivityInput.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ACTIVITY_CATEGORIES,
  getUnitForCategory,
} from "../../constants/activityData";

const API_URL = "http://localhost:5000/api/activities";

const ActivityInput = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: ACTIVITY_CATEGORIES[0].name, // Default to first category
    type: ACTIVITY_CATEGORIES[0].types[0], // Default to first type
    value: 1,
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Update the unit and activity type when the category changes
  useEffect(() => {
    const selectedCategory = ACTIVITY_CATEGORIES.find(
      (c) => c.name === formData.category
    );
    if (selectedCategory) {
      setFormData((prev) => ({
        ...prev,
        type: selectedCategory.types[0] || "",
      }));
    }
  }, [formData.category]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  // Get the current unit for the input field display
  const currentUnit = getUnitForCategory(formData.category);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const payload = {
      ...formData,
      unit: currentUnit,
      value: Number(formData.value),
    };

    try {
      await axios.post(API_URL, payload);

      setSuccess("Activity logged successfully! Redirecting to Dashboard...");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        "Failed to log activity. Check server connection.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-12 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-green-700 mb-8 text-center">
        Log Your Carbon Activity 🌳
      </h1>

      {/* Status Messages */}
      {error && (
        <div className="p-4 mb-6 text-red-700 bg-red-100 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      {success && (
        <div className="p-4 mb-6 text-green-700 bg-green-100 rounded-lg border border-green-200">
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-10 rounded-2xl shadow-xl space-y-8"
      >
        {/* Date Input */}
        <label className="block">
          <span className="text-gray-700 font-medium">Date</span>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          />
        </label>

        {/* Category Select */}
        <label className="block">
          <span className="text-gray-700 font-medium">Category</span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 bg-white"
          >
            {ACTIVITY_CATEGORIES.map((cat) => (
              <option key={cat.name} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </label>

        {/* Type Select */}
        <label className="block">
          <span className="text-gray-700 font-medium">Specific Activity</span>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50 bg-white"
          >
            {ACTIVITY_CATEGORIES.find(
              (c) => c.name === formData.category
            )?.types.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        {/* Value Input */}
        <label className="block">
          <span className="text-gray-700 font-medium">
            Value ({currentUnit})
          </span>
          <input
            type="number"
            name="value"
            value={formData.value}
            onChange={handleChange}
            min="0.1"
            step="any"
            required
            className="mt-2 block w-full rounded-lg border border-gray-300 shadow-sm p-3 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
          />
        </label>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 px-6 text-lg font-medium rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
        >
          {loading ? "Calculating & Saving..." : "Log Activity"}
        </button>
      </form>
    </div>
  );
};

export default ActivityInput;
