const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper function to create JWT token
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "1d", // Token valid for 1 day
  });
};

// --- 1. USER REGISTRATION ---
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // Generate JWT token
    const token = signToken(newUser._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (err) {
    // Handle validation/duplicate key errors
    res.status(500).json({ success: false, error: err.message });
  }
};

// --- 2. USER LOGIN ---
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Please provide email and password" });
  }

  try {
    // Find user and explicitly include the password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid credentials" });
    }

    // Generate JWT token
    const token = signToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// server/controllers/authController.js

// ... (existing imports and register, login functions) ...

// --- 3. GET LOGGED-IN USER DETAILS ---
exports.getMe = async (req, res) => {
  // The 'protect' middleware ensures req.user is set
  // req.user already contains the user data (minus the password)
  // because of the .select('-password') in authMiddleware.js

  // We confirm the user exists and return their profile data
  if (req.user) {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  } else {
    res.status(404).json({
      success: false,
      error: "User not found",
    });
  }
};
