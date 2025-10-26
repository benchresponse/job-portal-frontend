import React, { useState } from "react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [resetLink, setResetLink] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Contacting server...");
    setResetLink("");

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Reset link generated (see below).");
        setResetLink(data.resetLink || "");
      } else {
        setMessage("❌ " + (data.error || "Request failed"));
      }
    } catch {
      setMessage("❌ Server error");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "15px",
  };
  const labelStyle = { fontWeight: 600, color: "#0b47a1", marginBottom: 6 };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f3f6fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          width: 480,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 8px 24px rgba(11,70,162,0.08)",
          padding: 28,
        }}
      >
        <h2 style={{ color: "#0b47a1", textAlign: "center", marginBottom: 6 }}>
          Forgot Password
        </h2>

        <p style={{ textAlign: "center", color: "#555", marginBottom: 8 }}>
          {message}
        </p>

        {resetLink && (
          <div
            style={{
              background: "#e9f2ff",
              padding: 10,
              borderRadius: 8,
              wordBreak: "break-all",
              marginBottom: 10,
            }}
          >
            <strong>Reset Link:</strong> <br />
            <a href={resetLink} style={{ color: "#0b47a1" }}>
              {resetLink}
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Enter your registered Email ID</label>
          <input
            style={inputStyle}
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div style={{ textAlign: "right", marginTop: 16 }}>
            <button
              type="submit"
              style={{
                background: "#0b66c2",
                color: "#fff",
                border: "none",
                padding: "10px 18px",
                borderRadius: "8px",
                cursor: "pointer",
                fontSize: 16,
              }}
            >
              Send Reset Link
            </button>
          </div>
        </form>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: 12,
            marginTop: 16,
          }}
        >
          <span
            style={{
              color: "#0b47a1",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => (window.location.href = "/m2")}
          >
            Back to Login
          </span>
        </div>
      </div>
    </div>
  );
}
