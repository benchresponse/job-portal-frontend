// src/layouts/EmployerLayout.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import theme from "../theme";

// Import Employer pages
import EmployerDashboard from "../pages/Employer/EmployerDashboard";
import PostJob from "../pages/Employer/PostJob";
import ViewSubmissions from "../pages/Employer/ViewSubmissions";
import Profile from "../pages/Employer/Profile";
import SearchResumes from "../pages/Employer/SearchResumes";

export default function EmployerLayout() {
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState("home");

  const menuItems = [
    { key: "home", label: "Home" },
    { key: "searchResumes", label: "Search Resumes" },
    { key: "postJob", label: "Post Job" },
    { key: "applicants", label: "Applicants" },
    { key: "profile", label: "Profile" },
    { key: "logout", label: "Logout" },
  ];

  const handleMenuClick = (key) => {
    if (key === "logout") {
      navigate("/login");
    } else {
      setActivePage(key);
    }
  };

  const renderContent = () => {
    switch (activePage) {
      case "home":
        return <EmployerDashboard />;
      case "postJob":
        return <PostJob />;
      case "applicants":
        return <ViewSubmissions />;
      case "profile":
        return <Profile />;
      case "searchResumes":
        return <SearchResumes />;
      default:
        return <EmployerDashboard />;
    }
  };

  // === STYLES ===
  const containerStyle = {
    display: "flex",
    height: "100vh",
    overflow: "hidden",
    fontFamily: theme.font,
  };

  const sidebarStyle = {
    position: "fixed",
    left: 0,
    top: 0,
    bottom: 0,
    width: 220,
    backgroundColor: theme.colors.primary,
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    paddingTop: 30,
    overflow: "hidden", // prevent sidebar scroll
  };

  const menuItemStyle = (key) => ({
    padding: "12px 20px",
    cursor: "pointer",
    backgroundColor: activePage === key ? theme.colors.primaryHover : "transparent",
    transition: "0.2s",
    fontWeight: activePage === key ? 600 : 400,
    color: "#fff",
  });

  const contentStyle = {
    flex: 1,
    marginLeft: 220, // sidebar width offset
    backgroundColor: "#fff", // pure white background
    overflowY: "auto",
    padding: 30,
    minHeight: "100vh",
    boxSizing: "border-box",
  };

  return (
    <div style={containerStyle}>
      {/* Sidebar Menu */}
      <div style={sidebarStyle}>
        {menuItems.map((item) => (
          <div
            key={item.key}
            style={menuItemStyle(item.key)}
            onClick={() => handleMenuClick(item.key)}
          >
            {item.label}
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={contentStyle}>{renderContent()}</div>
    </div>
  );
}
