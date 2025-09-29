const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
  // Link the activity to the specific user who logged it
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the 'User' model
    required: true,
  },

  // The date the activity took place (for time series tracking)
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },

  // Category of the activity (used for filtering/visualization)
  category: {
    type: String,
    required: true,
    enum: ["Transport", "Food", "Home Energy", "Waste"], // Restricts input to valid categories
  },

  // Specific type of activity, used to look up the coefficient
  type: {
    type: String,
    required: true,
  },

  // The user's input value (e.g., 50 for miles, 1 for a meat meal)
  value: {
    type: Number,
    required: true,
    min: 0.1, // Ensure a positive, non-zero input
  },

  // The unit of the user's input (e.g., 'Miles', 'Meals', 'kWh')
  unit: {
    type: String,
    required: true,
  },

  // The calculated carbon footprint (in kg CO2e)
  carbonFootprint: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Activity", ActivitySchema);
