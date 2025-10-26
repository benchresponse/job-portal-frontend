import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function UploadResume() {
  const navigate = useNavigate();
  const [form, setForm] = useState({});
  const [resume, setResume] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFile = (e) => setResume(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return setMessage("❌ Please select a resume to upload.");

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      formData.append("resume", resume);

      const res = await axios.post("http://localhost:4000/api/upload-resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        setMessage("✅ Resume uploaded successfully!");
        setForm({});
        setResume(null);
      } else {
        setMessage("❌ Upload failed.");
      }
    } catch (err) {
      console.error("❌ Error uploading resume:", err);
      setMessage("❌ Server error. Try again later.");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#f6f9fc",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "40px 0",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <div
        style={{
          width: "95%",
          maxWidth: 900,
          background: "#fff",
          borderRadius: 12,
          padding: "30px 40px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ textAlign: "center", color: "#0b47a1", marginBottom: 10 }}>
          Upload Resume
        </h2>
        <p style={{ textAlign: "center", color: "#555", marginBottom: 20 }}>
          Please fill out your details and upload your resume.
        </p>

        {message && (
          <div
            style={{
              background: message.startsWith("✅") ? "#e8f7e8" : "#fdeaea",
              color: message.startsWith("✅") ? "#0c7a0c" : "#b30d0d",
              padding: "10px 15px",
              borderRadius: 8,
              marginBottom: 15,
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <h4 style={sectionTitle}>Personal Information</h4>
          <div style={gridTwo}>
            <div>
              <label style={label}>Full Name *</label>
              <input name="full_name" value={form.full_name || ""} onChange={onChange} style={input} required />
            </div>
            <div>
              <label style={label}>Email *</label>
              <input name="email" type="email" value={form.email || ""} onChange={onChange} style={input} required />
            </div>
            <div>
              <label style={label}>Contact *</label>
              <input name="contact" value={form.contact || ""} onChange={onChange} style={input} required />
            </div>
            <div>
              <label style={label}>Visa Status</label>
              <input name="visa" value={form.visa || ""} onChange={onChange} style={input} />
            </div>
            <div>
              <label style={label}>Date of Birth</label>
              <input name="dob" type="date" value={form.dob || ""} onChange={onChange} style={input} />
            </div>
          </div>

          {/* Location */}
          <h4 style={sectionTitle}>Location</h4>
          <div style={gridThree}>
            <div>
              <label style={label}>City</label>
              <input name="location_city" value={form.location_city || ""} onChange={onChange} style={input} />
            </div>
            <div>
              <label style={label}>State</label>
              <input name="location_state" value={form.location_state || ""} onChange={onChange} style={input} />
            </div>
            <div>
              <label style={label}>ZIP</label>
              <input name="location_zip" value={form.location_zip || ""} onChange={onChange} style={input} />
            </div>
          </div>

          {/* Employer Info */}
          <h4 style={sectionTitle}>Current Employer</h4>
          <div style={gridTwo}>
            <div>
              <label style={label}>Company</label>
              <input name="employer_company" value={form.employer_company || ""} onChange={onChange} style={input} />
            </div>
            <div>
              <label style={label}>Employer Name</label>
              <input name="employer_name" value={form.employer_name || ""} onChange={onChange} style={input} />
            </div>
            <div>
              <label style={label}>Employer Email</label>
              <input name="employer_email" type="email" value={form.employer_email || ""} onChange={onChange} style={input} />
            </div>
            <div>
              <label style={label}>Employer Contact</label>
              <input name="employer_contact" value={form.employer_contact || ""} onChange={onChange} style={input} />
            </div>
            <div>
              <label style={label}>Alternate Contact</label>
              <input name="employer_alt_contact" value={form.employer_alt_contact || ""} onChange={onChange} style={input} />
            </div>
            <div>
              <label style={label}>Time Zone</label>
              <input name="employer_timezone" value={form.employer_timezone || ""} onChange={onChange} style={input} />
            </div>
          </div>

          {/* Resume Upload */}
          <h4 style={sectionTitle}>Resume Upload</h4>
          <div>
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFile} style={input} required />
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 25 }}>
            <button
              type="submit"
              style={{
                background: "#0b66c2",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "10px 30px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Upload
            </button>
            <button
              type="button"
              onClick={() => navigate("/")}
              style={{
                background: "#fff",
                color: "#0b47a1",
                border: "1px solid #0b66c2",
                borderRadius: 8,
                padding: "10px 30px",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Return to Home
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ---------- Styles ----------
const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
  border: "1px solid #ccc",
  borderRadius: 8,
  fontSize: 15,
};
const label = { fontWeight: 600, color: "#0b47a1", display: "block", marginBottom: 4 };
const gridTwo = { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 };
const gridThree = { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 };
const sectionTitle = { color: "#0b47a1", borderBottom: "2px solid #e0e0e0", paddingBottom: 4, marginTop: 25 };
