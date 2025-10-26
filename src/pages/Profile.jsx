import React, { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({});
  const [message, setMessage] = useState("");
  const [passwords, setPasswords] = useState({ oldPassword: "", newPassword: "" });

  const email = JSON.parse(localStorage.getItem("user"))?.email;

  useEffect(() => {
    if (email) fetchProfile();
  }, [email]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:4000/api/get-profile?email=${email}`);
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setForm(data);
      } else {
        setMessage("❌ " + (data.error || "Failed to fetch profile"));
      }
    } catch {
      setMessage("❌ Server error");
    }
  };

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/update-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Profile updated successfully");
        setEditMode(false);
      } else setMessage("❌ " + (data.error || "Failed to update"));
    } catch {
      setMessage("❌ Server error");
    }
  };

  const changePassword = async () => {
    if (!passwords.oldPassword || !passwords.newPassword)
      return setMessage("⚠️ Please fill all password fields.");
    try {
      const res = await fetch("http://localhost:4000/api/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, ...passwords }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Password changed successfully");
        setPasswords({ oldPassword: "", newPassword: "" });
      } else setMessage("❌ " + (data.error || "Failed to change password"));
    } catch {
      setMessage("❌ Server error");
    }
  };

  const deleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      const res = await fetch("http://localhost:4000/api/delete-profile", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Profile deleted successfully.");
        localStorage.removeItem("user");
        window.location.href = "/";
      } else setMessage("❌ " + (data.error || "Failed to delete profile"));
    } catch {
      setMessage("❌ Server error");
    }
  };

  const labelStyle = {
    fontWeight: 600,
    color: "#0b47a1",
    marginBottom: 6,
    fontSize: "14px",
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    border: "1px solid #c5d3e8",
    borderRadius: 8,
    fontSize: 14,
    outlineColor: "#0b66c2",
  };

  const sectionCard = {
    background: "#fff",
    borderRadius: 10,
    padding: "18px 22px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    marginBottom: 14,
  };

  const buttonStyle = {
    background: "#0b66c2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    padding: "8px 18px",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    transition: "background 0.2s ease",
  };

  return (
    <div
      style={{
        background: "#f6f9fc",
        height: "100%",
        padding: "14px 20px",
        overflow: "hidden",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {message && (
        <div
          style={{
            background: "#e9f2ff",
            color: message.startsWith("✅") ? "#0a7b25" : "#b00020",
            padding: "8px 12px",
            borderRadius: 6,
            fontSize: "14px",
            marginBottom: 12,
          }}
        >
          {message}
        </div>
      )}

      {/* --- Profile Info --- */}
      <div style={sectionCard}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px 24px",
            alignItems: "center",
          }}
        >
          <div>
            <label style={labelStyle}>Full Name</label>
            <input
              style={inputStyle}
              name="fullName"
              value={form.fullName || ""}
              onChange={onChange}
              readOnly={!editMode}
            />
          </div>
          <div>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} value={form.email || ""} readOnly />
          </div>
          <div>
            <label style={labelStyle}>Company</label>
            <input
              style={inputStyle}
              name="company"
              value={form.company || ""}
              onChange={onChange}
              readOnly={!editMode}
            />
          </div>
          <div>
            <label style={labelStyle}>Contact Number</label>
            <input
              style={inputStyle}
              name="contactNumber"
              value={form.contactNumber || ""}
              onChange={onChange}
              readOnly={!editMode}
            />
          </div>
        </div>

        <div style={{ marginTop: "16px", display: "flex", gap: "10px" }}>
          {!editMode ? (
            <button
              onClick={() => setEditMode(true)}
              style={buttonStyle}
              onMouseEnter={(e) => (e.target.style.background = "#094d8c")}
              onMouseLeave={(e) => (e.target.style.background = "#0b66c2")}
            >
              Edit
            </button>
          ) : (
            <button
              onClick={saveProfile}
              style={buttonStyle}
              onMouseEnter={(e) => (e.target.style.background = "#094d8c")}
              onMouseLeave={(e) => (e.target.style.background = "#0b66c2")}
            >
              Save
            </button>
          )}
          <button
            onClick={deleteProfile}
            style={{
              ...buttonStyle,
              background: "#dc3545",
            }}
            onMouseEnter={(e) => (e.target.style.background = "#b02a37")}
            onMouseLeave={(e) => (e.target.style.background = "#dc3545")}
          >
            Delete
          </button>
        </div>
      </div>

      {/* --- Change Password Section --- */}
      <div style={sectionCard}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px 24px",
            alignItems: "center",
          }}
        >
          <div>
            <label style={labelStyle}>Old Password</label>
            <input
              type="password"
              style={inputStyle}
              value={passwords.oldPassword}
              onChange={(e) => setPasswords({ ...passwords, oldPassword: e.target.value })}
            />
          </div>
          <div>
            <label style={labelStyle}>New Password</label>
            <input
              type="password"
              style={inputStyle}
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
            />
          </div>
        </div>

        <div style={{ marginTop: "16px" }}>
          <button
            onClick={changePassword}
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.background = "#094d8c")}
            onMouseLeave={(e) => (e.target.style.background = "#0b66c2")}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
