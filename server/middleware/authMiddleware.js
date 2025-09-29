const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  // 1. Check if token exists in the header (Standard: "Bearer TOKEN_STRING")
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    // Extract the token string
    token = req.headers.authorization.split(" ")[1];
  }

  // 2. Check if a token was received
  if (!token) {
    return res
      .status(401)
      .json({
        success: false,
        error: "Not authorized to access this route (No Token)",
      });
  }

  try {
    // 3. Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Attach the user ID to the request object
    req.user = await User.findById(decoded.id).select("-password");

    next(); // Move on to the controller function
  } catch (error) {
    console.error("Token verification failed:", error);
    return res
      .status(401)
      .json({
        success: false,
        error: "Not authorized to access this route (Invalid Token)",
      });
  }
};
