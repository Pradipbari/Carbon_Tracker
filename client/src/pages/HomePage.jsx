// client/src/pages/HomePage.jsx
import React from "react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/assets/forest-bg.png')", // <-- save the generated image as forest-bg.png in /public/assets
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay for readability */}
      <div className="bg-black bg-opacity-50 min-h-screen flex flex-col justify-center items-center p-6">
        {/* Hero Section */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-400 mb-4 text-center drop-shadow-lg">
          🌱 GreenTrack
        </h1>
        <p className="text-lg md:text-2xl text-gray-200 mb-8 text-center max-w-2xl">
          Track your personal carbon footprint, reduce emissions, and make a
          positive impact on the planet.
        </p>

        {/* CTA Buttons */}
        <div className="flex space-x-4 mb-12">
          <Link
            to="/login"
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition duration-300"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 border border-green-400 text-green-400 font-semibold rounded-lg shadow-md hover:bg-green-50 hover:text-green-700 transition duration-300 bg-white bg-opacity-10"
          >
            Register
          </Link>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
          <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-xl font-bold text-green-700 mb-2">
              Log Activities
            </h3>
            <p className="text-gray-700">
              Record daily actions like travel, food, and energy use to
              calculate your footprint.
            </p>
          </div>

          <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-xl font-bold text-green-700 mb-2">
              Track Progress
            </h3>
            <p className="text-gray-700">
              Visualize your carbon emissions over time with charts and
              insights.
            </p>
          </div>

          <div className="bg-white bg-opacity-90 p-6 rounded-xl shadow-lg text-center">
            <h3 className="text-xl font-bold text-green-700 mb-2">Go Green</h3>
            <p className="text-gray-700">
              Get personalized tips on reducing emissions and living
              sustainably.
            </p>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 text-gray-300 text-sm text-center">
          © {new Date().getFullYear()} GreenTrack. All rights reserved.
          <p className="py-2">Made with 💖 by Pradip Bari</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
