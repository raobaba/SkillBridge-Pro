import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getToken } from "../services/utils";

const PrivateRoute = ({ children, screen }) => {
  // Get authentication state from Redux store
  const { isAuthenticated, user } = useSelector((state) => state.user);
  
  // Get JWT token from session storage
  const jwt_token = getToken();

  // Check if user is authenticated (both Redux state and token must be present)
  const isLoggedIn = isAuthenticated && jwt_token && user;

  if (!isLoggedIn) {
    // Store the current path to redirect back after login
    const currentPath = window.location.pathname;
    
    // Only add redirect_to if we're not already on the auth page
    if (currentPath === '/auth') {
      return <Navigate to="/auth" replace />;
    }
    
    const redirect_to = encodeURIComponent(currentPath);
    return <Navigate to={`/auth?redirect_to=${redirect_to}`} replace />;
  }

  // For now, allow access to all screens for authenticated users
  // You can implement role-based access control here later
  const hasMenuAccess = true;
  
  if (screen && !hasMenuAccess) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
