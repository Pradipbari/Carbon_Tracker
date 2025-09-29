// server/index.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// Import Routes
const authRoutes = require("./routes/authRoutes");
const activityRoutes = require("./routes/activityRoutes");

const app = express();

// ----------------------------------------------------
// MIDDLEWARE SETUP
// ----------------------------------------------------
app.use(cors());
app.use(express.json()); // To parse incoming JSON data from requests

// ----------------------------------------------------
// DATABASE CONNECTION
// ----------------------------------------------------
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected successfully!"))
  .catch((err) => console.error("MongoDB connection error:", err));

// ----------------------------------------------------
// ROUTE HANDLING
// ----------------------------------------------------
// Authentication routes: /api/auth/register, /api/auth/login
app.use("/api/auth", authRoutes);

// Activity routes: /api/activities
app.use("/api/activities", activityRoutes);

// Fallback test route
app.get("/", (req, res) => {
  res.send("GreenTrack Backend API is running!");
});

// ----------------------------------------------------
// SERVER START
// ----------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
