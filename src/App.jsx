// app.jsx //
import React from "react";
import { Routes, Route } from "react-router-dom";
import EmployerLogin from "./pages/EmployerLogin";
import EmployerDashboard from "./pages/EmployerDashboard";
import PostJob from "./pages/PostJob";
import JobsList from "./pages/JobsList";
import UserDashboard from "./pages/UserDashboard";
import JobApply from "./pages/JobApply";
import PrivateRoute from "./components/PrivateRoute";
import Submissions from "./pages/Submissions";
import Profile from "./pages/Profile";

function App() {
  return (
    <Routes>
      {/* ---------- Default Login ---------- */}
      <Route path="/" element={<EmployerLogin />} />

      {/* ---------- Employer Dashboard ---------- */}
      <Route
        path="/employer-dashboard/*"
        element={
          <PrivateRoute role="Employer">
            <EmployerDashboard />
          </PrivateRoute>
        }
      >
        <Route path="profile" element={<Profile />} />
        <Route path="post-job" element={<PostJob />} />
        <Route path="jobs" element={<JobsList />} />
        <Route path="submissions" element={<Submissions />} />
        <Route
          index
          element={
            <div style={{ color: "#333", fontSize: "18px", padding: "20px" }}>
              Welcome to your Employer Dashboard!
            </div>
          }
        />
      </Route>

      {/* ---------- User Dashboard ---------- */}
      <Route
        path="/user-dashboard"
        element={
          <PrivateRoute role="User">
            <UserDashboard />
          </PrivateRoute>
        }
      />

      {/* ---------- Apply Page ---------- */}
      <Route path="/apply/:id" element={<JobApply />} />
    </Routes>
  );
}

export default App;
