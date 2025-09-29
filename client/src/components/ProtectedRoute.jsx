// client/src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Show a loading spinner or message while checking auth status
    // Use Tailwind CSS classes for a simple loading screen
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
        <p className="ml-4 text-green-700">Loading...</p>
      </div>
    );
  }

  // If not authenticated, redirect to the login page
  if (!isAuthenticated) {
    // 'replace' prevents the user from going back to the protected route with the browser's back button
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the children (the actual page component)
  return children;
};

export default ProtectedRoute;
