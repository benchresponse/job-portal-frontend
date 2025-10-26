import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EmployerLogin() {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({});
  const [toast, setToast] = useState(null); // ✅ Replaces inline message
  const [linkShown, setLinkShown] = useState("");
  const navigate = useNavigate();

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // ✅ Toast helper
  const showToast = (type, text, duration = 3000) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), duration);
  };

  const onChange = (e) => {
    let { name, value } = e.target;
    if (name === "contactNumber") {
      value = value.replace(/\D/g, "");
      if (value.length > 3 && value.length <= 6)
        value = `(${value.slice(0, 3)}) ${value.slice(3)}`;
      else if (value.length > 6)
        value = `(${value.slice(0, 3)}) ${value.slice(3, 6)}-${value.slice(
          6,
          10
        )}`;
    }
    setForm({ ...form, [name]: value });
  };

  // ---------------- LOGIN ----------------
  const handleLogin = async (e) => {
    e.preventDefault();
    showToast("info", "Logging in...");
    setLinkShown("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      });

      const data = await res.json();
      if (!res.ok) return showToast("error", data.error || "Login failed");

      if (data.success && data.user) {
        const storedUser = {
          fullName: data.user.fullName,
          email: data.user.email,
          company: data.user.company || form.company || "",
          accessLevel: data.user.accessLevel || "Employer",
        };
        localStorage.setItem("user", JSON.stringify(storedUser));
        showToast("success", "Login successful!");
        setTimeout(() => {
          navigate(
            storedUser.accessLevel === "Employer"
              ? "/employer-dashboard"
              : "/user-dashboard"
          );
        }, 800);
      } else showToast("error", "Invalid login response");
    } catch (err) {
      console.error(err);
      showToast("error", "Server error. Please try again.");
    }
  };

  // ---------------- REGISTER ----------------
  const handleRegister = async (e) => {
    e.preventDefault();
    showToast("info", "Registering...");
    setLinkShown("");

    try {
      const res = await fetch(`${BACKEND_URL}/api/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        showToast("success", "Registered! Check your email to verify.");
        if (data.verifyUrl) setLinkShown(data.verifyUrl);
        setTimeout(() => setMode("login"), 3000);
      } else showToast("error", data.error || "Registration failed");
    } catch {
      showToast("error", "Server error during registration");
    }
  };

  // ---------------- FORGOT ----------------
  const handleForgot = async (e) => {
    e.preventDefault();
    showToast("info", "Contacting server...");
    setLinkShown("");
    try {
      const res = await fetch(`${BACKEND_URL}/api/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast("success", "Reset link sent to your email!");
        setLinkShown(data.resetLink || "");
      } else showToast("error", data.error || "Failed to send reset link");
    } catch {
      showToast("error", "Server error");
    }
  };

  const handleCancel = () => {
    setForm({});
    setLinkShown("");
    setMode("login");
    navigate("/");
  };

  // ---------------- Styles ----------------
  const labelStyle = { fontWeight: 600, color: "#0b47a1", marginBottom: 2, display: "block" };
  const inputStyle = {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #c5d3e8",
    borderRadius: "8px",
    fontSize: "15px",
    outlineColor: "#0b66c2",
  };
  const buttonBase = {
    color: "#fff",
    background: "#0b66c2",
    border: "none",
    borderRadius: 6,
    padding: "8px 18px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "background-color 0.2s ease",
  };
  const cancelButton = {
    background: "#fff",
    color: "#0b47a1",
    border: "1px solid #c5d3e8",
    borderRadius: 6,
    padding: "8px 18px",
    fontWeight: 600,
    cursor: "pointer",
  };

  const renderButtonBar = (text, onClick, type = "submit", showCancel = true) => (
    <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 8 }}>
      <button
        type={type}
        onClick={onClick}
        style={buttonBase}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#094d8c")}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0b66c2")}
      >
        {text}
      </button>
      {showCancel && (
        <button type="button" onClick={handleCancel} style={cancelButton}>
          Cancel
        </button>
      )}
    </div>
  );

  // ---------------- Render ----------------
  return (
    <div
      style={{
        height: "100vh",
        background: "#f3f6fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Segoe UI, sans-serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* ✅ Floating Toast Notification */}
      {toast && (
        <div
          style={{
            position: "absolute",
            top: 20,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "10px 20px",
            borderRadius: 6,
            color: "#fff",
            fontWeight: 500,
            background:
              toast.type === "success"
                ? "#28a745"
                : toast.type === "error"
                ? "#dc3545"
                : "#0b66c2",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            zIndex: 1000,
            minWidth: 280,
            textAlign: "center",
          }}
        >
          {toast.text}
        </div>
      )}

      {/* ✅ Main Frame */}
      <div
        style={{
          width: 500,
          background: "#fff",
          borderRadius: 10,
          boxShadow: "0 6px 18px rgba(11,70,162,0.08)",
          padding: "16px 22px 24px",
        }}
      >
        <h2 style={{ color: "#0b47a1", textAlign: "center", marginBottom: 6 }}>
          {mode === "login"
            ? "Login"
            : mode === "register"
            ? "Register New User"
            : "Forgot Password"}
        </h2>

        {linkShown && (
          <div
            style={{
              background: "#e9f2ff",
              padding: 8,
              borderRadius: 8,
              wordBreak: "break-all",
              marginBottom: 10,
              fontSize: 14,
            }}
          >
            <strong>Link:</strong> <br />
            <a href={linkShown}>{linkShown}</a>
          </div>
        )}

        {/* LOGIN */}
        {mode === "login" && (
          <form onSubmit={handleLogin}>
            <label style={labelStyle}>Email ID</label>
            <input style={inputStyle} name="email" type="email" onChange={onChange} required />
            <label style={labelStyle}>Password</label>
            <input style={inputStyle} name="password" type="password" onChange={onChange} required />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <input type="checkbox" name="remember" onChange={(e) => setForm({ ...form, remember: e.target.checked })} />
              <label style={{ margin: 0, fontSize: 15 }}>Remember Me</label>
            </div>
            {renderButtonBar("Login", handleLogin, "submit", false)}
            <div style={{ textAlign: "center", marginTop: 12 }}>
              <span
                style={{ color: "#0b47a1", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => {
                  setMode("register");
                  setLinkShown("");
                  setForm({});
                }}
              >
                Not Registered? Register Here
              </span>
              <span style={{ color: "#999", margin: "0 8px" }}>|</span>
              <span
                style={{ color: "#0b47a1", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => {
                  setMode("forgot");
                  setLinkShown("");
                  setForm({});
                }}
              >
                Forgot Password? Click Here
              </span>
            </div>
          </form>
        )}

        {/* REGISTER */}
        {mode === "register" && (
          <form onSubmit={handleRegister}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input style={inputStyle} name="fullName" onChange={onChange} required />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} name="email" type="email" onChange={onChange} required />
              </div>
              <div>
                <label style={labelStyle}>Contact Number</label>
                <input style={inputStyle} name="contactNumber" onChange={onChange} placeholder="(999) 999-9999" />
              </div>
              <div>
                <label style={labelStyle}>User Type</label>
                <select style={inputStyle} name="userType" onChange={onChange} required defaultValue="">
                  <option value="" disabled>Select Type</option>
                  <option value="Employer">Employer</option>
                  <option value="User">User</option>
                </select>
              </div>
              <div style={{ gridColumn: "1 / span 2" }}>
                <label style={labelStyle}>Company</label>
                <input style={inputStyle} name="company" onChange={onChange} />
              </div>
              <div>
                <label style={labelStyle}>Password</label>
                <input style={inputStyle} name="password" type="password" onChange={onChange} required />
              </div>
              <div>
                <label style={labelStyle}>Re-Type Password</label>
                <input style={inputStyle} name="confirm_password" type="password" onChange={onChange} required />
              </div>
            </div>
            {renderButtonBar("Register", handleRegister)}
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <span style={{ color: "#0b47a1", cursor: "pointer", textDecoration: "underline" }} onClick={() => setMode("login")}>
                Already Registered? Login Here
              </span>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD */}
        {mode === "forgot" && (
          <form onSubmit={handleForgot}>
            <label style={labelStyle}>Enter your email to reset password</label>
            <input style={inputStyle} name="email" type="email" onChange={onChange} required />
            {renderButtonBar("Send Reset Link", handleForgot)}
            <div style={{ textAlign: "center", marginTop: 10 }}>
              <span style={{ color: "#0b47a1", cursor: "pointer", textDecoration: "underline" }} onClick={() => setMode("login")}>
                Back to Login
              </span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
