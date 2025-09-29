const express = require("express");
const {
  createActivity,
  getActivities,
  deleteActivity,
} = require("../controllers/activityController");
const { protect } = require("../middleware/authMiddleware"); // Import the protect middleware

const router = express.Router();

// ALL routes below are protected by the 'protect' middleware
router
  .route("/")
  .post(protect, createActivity) // POST /api/activities (Log new activity)
  .get(protect, getActivities); // GET /api/activities (Get user's activities)

router.route("/:id").delete(protect, deleteActivity); // DELETE /api/activities/:id

module.exports = router;
