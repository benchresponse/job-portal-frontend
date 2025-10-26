import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Landing() {
  const starsRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const container = starsRef.current;
    if (!container) return;
    container.innerHTML = "";
    const starCount = 100;
    for (let i = 0; i < starCount; i++) {
      const star = document.createElement("div");
      star.className = "star";
      star.style.top = Math.random() * 100 + "vh";
      star.style.left = Math.random() * 100 + "vw";
      star.style.animationDuration = 0.5 + Math.random() + "s";
      star.style.animationDelay = Math.random() * 2 + "s";
      container.appendChild(star);
    }
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: "#fff",
        backgroundColor: "#000d1a",
        backgroundImage: 'url("/index_image.webp")', // ✅ works with Vite public folder
        backgroundPosition: "center",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Twinkling stars */}
      <div
        ref={starsRef}
        className="stars"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          pointerEvents: "none",
          zIndex: 0,
        }}
      ></div>

      <style>{`
        .star {
          position: absolute;
          width: 2px;
          height: 2px;
          background: white;
          border-radius: 50%;
          opacity: 0;
          animation: twinkle 1.5s infinite ease-in-out;
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* ✅ Menu Bar */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          padding: "20px 80px 20px 40px",
          display: "flex",
          justifyContent: "flex-end",
          gap: 20,
        }}
      >
      <nav>
        <Link style={menuLink} to="/upload-resume">Upload Resume</Link>
        <Link style={menuLink} to="/login">Employer Login</Link>
        <Link style={menuLink} to="/post-job">Post Job</Link>
        <Link style={menuLink} to="/jobs">View Jobs</Link>
        <Link style={menuLink} to="/contact">Contact</Link>
      </nav>
  </div>

      {/* Hero Text + Button */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 80,
          transform: "translateY(-50%)",
          zIndex: 2,
          maxWidth: 600,
          textAlign: "left",
          fontSize: 38,
          lineHeight: 1.4,
          fontWeight: 600,
          textShadow: "0 2px 10px rgba(0,0,0,0.6)",
        }}
      >
        <div style={{ lineHeight: 1.3 }}>
          <span style={{ fontWeight: 600, fontSize: 36 }}>
            <strong style={{ color: "#82b8f1", fontWeight: 800 }}>
              Connecting talent
            </strong>{" "}
            with limitless opportunities.
          </span>
          <br />
          <span style={{ fontWeight: 500, fontSize: 30, opacity: 0.95 }}>
            Empowering every career for lasting success.
          </span>
        </div>
        <button
          onClick={() => navigate("/post-job")}
          style={{
            display: "inline-block",
            marginTop: 25,
            padding: "15px 35px",
            backgroundColor: "#82b8f1",
            color: "#fff",
            fontSize: 20,
            fontWeight: "bold",
            border: "none",
            borderRadius: 10,
            cursor: "pointer",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

const menuLink = {
  color: "#ffffff",
  textDecoration: "none",
  padding: "6px 10px",
  borderRadius: 4,
  marginLeft: 10,
  display: "inline-block",
  transition: "background 0.3s ease",
};
