// client/src/components/Sidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Navigation links configuration
const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Profile", path: "/profile" },
  { name: "Activities", path: "/log-activity" },
];

const Sidebar = ({ isMobile, toggleSidebar }) => {
  const { logout } = useAuth();
  const location = useLocation();

  // Base classes for links
  const baseLinkClass =
    "flex items-center p-3 text-white rounded-lg hover:bg-green-700 transition duration-150";

  const handleLogout = () => {
    logout();
    if (isMobile) {
      toggleSidebar();
    }
  };

  return (
    // Simpler classes: Positioning is handled by the Layout component
    <div
      className={`
            bg-green-800 flex-shrink-0 h-full overflow-y-auto w-64
            ${isMobile ? "shadow-2xl" : ""} 
        `}
    >
      <div className="flex items-center justify-center h-20 bg-green-900 shadow-md">
        <h2 className="text-2xl font-extrabold text-white">GreenTrack</h2>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navLinks.map((link) => {
          const isActive = location.pathname === link.path;
          const activeClass = isActive
            ? "bg-green-700 font-semibold"
            : "font-medium";

          return (
            <Link
              key={link.name}
              to={link.path}
              onClick={isMobile ? toggleSidebar : null}
              className={`${baseLinkClass} ${activeClass}`}
            >
              <span className="w-5 h-5 mr-3">
                {link.name === "Dashboard" && "📊"}
                {link.name === "Activities" && "✍️"}
                {link.name === "Profile" && "👤"}
              </span>
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button on Left Side (within the sidebar) */}
      <div className="p-4 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full py-2 px-4 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition duration-150"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
