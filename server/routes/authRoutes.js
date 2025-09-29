const express = require("express");
const { register, login, getMe } = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

const { protect } = require("../middleware/authMiddleware"); // <-- Need protect middleware

// New Protected Route: Fetches the profile of the user whose token is in the header
router.get("/me", protect, getMe);

module.exports = router;

module.exports = router;
