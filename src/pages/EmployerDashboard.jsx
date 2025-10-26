import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

export default function EmployerDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* ---------- Sidebar ---------- */}
      <aside
        style={{
          width: "250px",
          backgroundColor: "#03A9F4",
          color: "#000",
          padding: "40px 25px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexShrink: 0,
        }}
      >
        <nav style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <SidebarLink to="/employer-dashboard/post-job" label="Post Job" />
          <SidebarLink to="/employer-dashboard/jobs" label="View Jobs" />
          <SidebarLink to="/employer-dashboard/search-resumes" label="Search Resumes" />
          <SidebarLink to="/employer-dashboard/submissions" label="Submissions" />
          <SidebarLink to="/employer-dashboard/reports" label="Reports" />
          <SidebarLink to="/employer-dashboard/profile" label="Profile" /> {/* ✅ Added Profile */}
        </nav>

        {/* ✅ Logout aligned left */}
        <button
          onClick={handleLogout}
          style={{
            background: "transparent",
            border: "none",
            color: "#fff",
            fontSize: "17px",
            textAlign: "left",
            cursor: "pointer",
            padding: 0,
            opacity: 0.9,
            transition: "color 0.3s ease, transform 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#00264d";
            e.currentTarget.style.opacity = 1;
            e.currentTarget.style.transform = "translateX(4px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#fff";
            e.currentTarget.style.opacity = 0.9;
            e.currentTarget.style.transform = "translateX(0)";
          }}
        >
          Logout
        </button>
      </aside>

      {/* ---------- Right Panel ---------- */}
      <main
        style={{
          flex: 1,
          background: "#fff",
          padding: "40px 40px 40px 0px", // top right bottom left
          overflow: "hidden",
        }}
      >
        <Outlet />
      </main>
    </div>
  );
}

/* ----------- Sidebar Link Component ----------- */
function SidebarLink({ to, label }) {
  return (
    <Link
      to={to}
      style={{
        textDecoration: "none",
        color: "#fff",
        fontSize: "17px",
        transition: "color 0.3s ease, transform 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.color = "#00264d";
        e.currentTarget.style.transform = "translateX(4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "#fff";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      {label}
    </Link>
  );
}
