// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const stored = localStorage.getItem("user");
  const user = stored ? JSON.parse(stored) : null;

  if (!user) {
    // Not logged in → go to login page
    return <Navigate to="/" replace />;
  }

  if (role && user.accessLevel !== role) {
    // Logged in but wrong type (User vs Employer)
    return <Navigate to="/" replace />;
  }

  return children;
}
