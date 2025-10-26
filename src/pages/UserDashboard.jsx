import React from "react";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f9f9f9",
        padding: "40px",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ color: "#0b47a1", fontWeight: "normal" }}>
        Welcome, {user?.fullName || "User"} 👋
      </h2>
      <p style={{ color: "#555", marginTop: "10px" }}>
        This is your User Dashboard. You’ll be able to apply for jobs and view your submissions here.
      </p>
    </div>
  );
}
