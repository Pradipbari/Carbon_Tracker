const Activity = require("../models/Activity");
const carbonCoefficients = require("../config/carbonCoefficients"); // Import the coefficients

// Helper function to calculate CO2e
const calculateFootprint = (type, value) => {
  const coefficient = carbonCoefficients[type];
  if (!coefficient) {
    throw new Error(`Coefficient for activity type "${type}" not found.`);
  }
  // Formula: CO2e = user_input * emission_factor
  return value * coefficient.factor;
};

// --- 1. CREATE (Log a new activity) ---
exports.createActivity = async (req, res) => {
  // req.user.id is set by the authMiddleware (coming up next!)
  const userId = req.user.id;
  const { date, category, type, value, unit } = req.body;

  try {
    // 1. Calculate the carbon footprint
    const carbonFootprint = calculateFootprint(type, value);

    // 2. Create the new activity document
    const newActivity = await Activity.create({
      userId,
      date,
      category,
      type,
      value,
      unit,
      carbonFootprint,
    });

    res.status(201).json({
      success: true,
      data: newActivity,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// --- 2. READ (Get all activities for the logged-in user) ---
exports.getActivities = async (req, res) => {
  // Only fetch activities belonging to the authenticated user
  const userId = req.user.id;

  try {
    const activities = await Activity.find({ userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: activities.length,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

// --- 3. DELETE (Remove an activity) ---
exports.deleteActivity = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const activity = await Activity.findOneAndDelete({
      _id: id,
      userId: userId, // Crucial security check: ensures user can only delete *their* activity
    });

    if (!activity) {
      return res
        .status(404)
        .json({ success: false, error: "Activity not found or unauthorized" });
    }

    res.status(200).json({
      success: true,
      data: {}, // Empty data response for a successful deletion
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};
