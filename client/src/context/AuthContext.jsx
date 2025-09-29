// client/src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Set up Axios interceptor (remains the same)
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
    setLoading(false);
  }, [token]);

  // Login function (remains the same)
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    setToken(token);
    setUser(userData);
    navigate("/dashboard");
  };

  // Load User function (remains the same)
  const loadUser = (userData) => {
    setUser(userData);
  };

  // --- CRITICAL LOGOUT FIX ---
  const logout = () => {
    // 1. Immediately clear the token from storage
    localStorage.removeItem("token");

    // 2. Clear state variables
    setToken(null);
    setUser(null);

    // 3. Immediately remove the Authorization header globally
    delete axios.defaults.headers.common["Authorization"];

    // 4. Force navigation to the home page (most reliable redirection)
    // The 'replace: true' flag prevents going back to the protected page.
    navigate("/", { replace: true });
  };

  const value = {
    user,
    token,
    loading,
    login,
    loadUser,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
