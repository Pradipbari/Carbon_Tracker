// client/src/components/Layout.jsx (UPDATED)
import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";
import axios from "axios"; // <-- Import axios for fetching

const API_URL = "http://localhost:5000/api/auth/me"; // <-- API Endpoint

const Layout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Destructure required auth state and a new function (loadUser)
  const { user, isAuthenticated, loadUser, logout } = useAuth();
  const [loadingProfile, setLoadingProfile] = useState(true);

  // --- New useEffect to Fetch Full User Data ---
  useEffect(() => {
    // Only attempt to fetch if the user is authenticated and the user object is minimal/null
    if (isAuthenticated && !user?.username) {
      const fetchProfile = async () => {
        try {
          const response = await axios.get(API_URL);
          // Call the new function in AuthContext to store the detailed user object
          loadUser(response.data.data);
        } catch (err) {
          console.error("Failed to load user profile in layout:", err);
          // If the token fails here, assume a bad session
          logout();
        } finally {
          setLoadingProfile(false);
        }
      };
      fetchProfile();
    } else {
      setLoadingProfile(false);
    }
  }, [isAuthenticated, user?.username, loadUser, logout]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Display loading state until profile fetch is complete
  if (loadingProfile && isAuthenticated) {
    return (
      <div className="p-10 text-green-700 text-center">
        Loading Application...
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* 1. Sidebar Component (Desktop and Mobile Logic) */}

      {/* Desktop Sidebar: Fixed, always visible, set width */}
      <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
        <Sidebar isMobile={false} toggleSidebar={() => {}} />
      </div>

      {/* Mobile Sidebar: Fixed, high z-index, controlled by transform */}
      <div
        className={`
          md:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <Sidebar isMobile={true} toggleSidebar={toggleSidebar} />
      </div>

      {/* Mobile Menu Toggle Button (Container for just the hamburger icon) */}
      <div className="md:hidden">
        {/* Note: Icon is rendered by the header logic below */}
      </div>

      {/* Overlay for Mobile */}
      {isSidebarOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 bg-black opacity-50 z-40 md:hidden"
        ></div>
      )}

      {/* 2. Main Content Area */}
      <div className="flex flex-col flex-1 overflow-y-auto md:ml-64 md:pl-0">
        {/* Fixed Top Header/Navbar */}
        <header className="flex justify-between items-center h-16 bg-white shadow p-4 md:pl-8">
          {/* --- MOBILE HEADER GROUP (Hamburger + Title) --- */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleSidebar}
              className="text-gray-700 focus:outline-none p-1"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                ></path>
              </svg>
            </button>
            <h1 className="text-xl font-semibold text-green-700">GreenTrack</h1>
          </div>
          {/* --- END MOBILE HEADER GROUP --- */}

          {/* Welcome Message (Desktop Only) */}
          <p className="hidden md:block text-gray-600 text-center">
            Hello,{" "}
            <span className="font-bold text-green-700">
              {/* Use the actual username from the loaded user object */}
              {user?.username || "User"}{" "}
            </span>
            Welecome to GreenTrack
          </p>

          {/* Logout Button on Right Side (Desktop and Tablet) */}
          <button
            onClick={logout}
            className="hidden md:block px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150"
          >
            Logout
          </button>
        </header>

        {/* Page Content */}
        <main className="p-4 flex-1">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
