import React, { useState, useEffect } from "react";

export default function ResetPassword() {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
    else setMessage("❌ Invalid or missing token");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return setMessage("❌ Passwords do not match");
    setMessage("Processing...");

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password reset successful. Redirecting to login...");
        setTimeout(() => (window.location.href = "/employer-login"), 2000);
      } else {
        setMessage("❌ " + (data.error || "Reset failed"));
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
          Reset Password
        </h2>
        <p style={{ textAlign: "center", color: "#555", marginBottom: 8 }}>
          {message}
        </p>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>New Password</label>
          <input
            style={inputStyle}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <label style={labelStyle}>Confirm Password</label>
          <input
            style={inputStyle}
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              background: "#0b66c2",
              color: "#fff",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: 16,
              marginTop: 10,
            }}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
