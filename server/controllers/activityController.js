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
exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await Activity.aggregate([
      {
        // 1. Group all activities by the user who logged them
        $group: {
          _id: "$userId",
          totalFootprint: { $sum: "$carbonFootprint" }, // Sum all carbon footprints
        },
      },
      {
        // 2. Sort from lowest footprint to highest (-1 for descending, 1 for ascending)
        // We use 1 (ascending) because the LOWEST score is the best.
        $sort: { totalFootprint: 1 },
      },
      {
        // 3. Limit the leaderboard size (e.g., top 100)
        $limit: 100,
      },
      {
        // 4. Join the Users collection to get the username and email
        $lookup: {
          from: "users", // The name of the collection in MongoDB (usually pluralized model name)
          localField: "_id",
          foreignField: "_id",
          as: "userProfile",
        },
      },
      {
        // 5. Deconstruct the userProfile array (since $lookup returns an array)
        $unwind: "$userProfile",
      },
      {
        // 6. Reshape the output document
        $project: {
          _id: 0, // Exclude the generated _id field
          username: "$userProfile.username",
          email: "$userProfile.email",
          totalFootprint: { $round: ["$totalFootprint", 2] }, // Round to 2 decimal places
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: leaderboard,
    });
  } catch (error) {
    console.error("Leaderboard Aggregation Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate leaderboard.",
    });
  }
};

