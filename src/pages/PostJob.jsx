import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function generateJobID() {
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const rand = Math.floor(Math.random() * 90 + 10);
  return `JOB-${mm}${dd}${rand}`;
}

export default function PostJob() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};

  const [form, setForm] = useState({
    job_id: generateJobID(),
    job_title: "",
    client: "",
    city: "",
    state: "",
    zip_code: "",
    job_model: "Onsite",
    job_type: "Full-time",
    rate: "",
    skills: "",
    description: "",
    date: new Date().toISOString().slice(0, 10),
    company: user.company || "",
    posted_by: user.fullName || "",
    email: user.email || "",
  });

  useEffect(() => {
    setForm((f) => ({ ...f, job_id: generateJobID() }));
  }, []);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onClear = () => {
    setForm({
      job_id: generateJobID(),
      job_title: "",
      client: "",
      city: "",
      state: "",
      zip_code: "",
      job_model: "Onsite",
      job_type: "Full-time",
      rate: "",
      skills: "",
      description: "",
      date: new Date().toISOString().slice(0, 10),
      company: user.company || "",
      posted_by: user.fullName || "",
      email: user.email || "",
    });
  };

  const onCancel = () => navigate("/employer-dashboard/jobs");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:4000/api/post-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const more = window.confirm("✅ Job posted successfully!\n\nDo you want to post more jobs?");
        if (more) {
          onClear();
        } else {
          navigate("/employer-dashboard/jobs");
        }
      } else {
        const data = await res.json().catch(() => ({}));
        alert("❌ Failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      alert("❌ Request failed: " + err.message);
    }
  };

  const labelStyle = {
    fontWeight: 600,
    color: "#0b47a1",
    fontSize: "14px",
    marginBottom: 4,
    display: "block",
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 10px",
    border: "1px solid #c5d3e8",
    borderRadius: 6,
    fontSize: 14,
    outlineColor: "#0b66c2",
  };

  return (
    <div
      style={{
        padding: "10px 20px",
        background: "#fff",
        height: "100%",
        overflow: "hidden",
      }}
    >
{/* --- Top Buttons --- */}
<div
  style={{
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginBottom: "16px",
    paddingRight: "10px", // ✅ minimal right padding
  }}
>
  {["Post", "Clear", "Close"].map((label) => {
    const isPrimary = label === "Post";
    return (
      <button
        key={label}
        onClick={
          label === "Post"
            ? onSubmit
            : label === "Clear"
            ? onClear
            : onCancel
        }
        style={{
          background: isPrimary ? "#0b66c2" : "#f5f8ff",
          color: isPrimary ? "#fff" : "#0b47a1",
          border: isPrimary ? "none" : "1px solid #c5d3e8",
          borderRadius: "6px",
          padding: "8px 18px",
          fontWeight: 600,
          cursor: "pointer",
          minWidth: "90px", // ✅ same size buttons
          transition: "background-color 0.2s ease, color 0.2s ease",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.backgroundColor = isPrimary
            ? "#094d8c"
            : "#e6eefb")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.backgroundColor = isPrimary
            ? "#0b66c2"
            : "#f5f8ff")
        }
      >
        {label}
      </button>
    );
  })}
</div>

      {/* --- Job Form --- */}
      <form onSubmit={onSubmit}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "14px 20px",
          }}
        >
          <div>
            <label style={labelStyle}>Job ID</label>
            <input style={inputStyle} name="job_id" value={form.job_id} readOnly />
          </div>

          <div>
            <label style={labelStyle}>Title</label>
            <input
              style={inputStyle}
              name="job_title"
              value={form.job_title}
              onChange={onChange}
              required
            />
          </div>

          <div>
            <label style={labelStyle}>Client</label>
            <input
              style={inputStyle}
              name="client"
              value={form.client}
              onChange={onChange}
            />
          </div>

          <div>
            <label style={labelStyle}>City</label>
            <input
              style={inputStyle}
              name="city"
              value={form.city}
              onChange={onChange}
            />
          </div>

          <div>
            <label style={labelStyle}>State</label>
            <input
              style={inputStyle}
              name="state"
              value={form.state}
              onChange={onChange}
            />
          </div>

          <div>
            <label style={labelStyle}>ZIP</label>
            <input
              style={inputStyle}
              name="zip_code"
              value={form.zip_code}
              onChange={onChange}
            />
          </div>

          <div>
            <label style={labelStyle}>Job Model</label>
            <select
              style={inputStyle}
              name="job_model"
              value={form.job_model}
              onChange={onChange}
            >
              <option>Onsite</option>
              <option>Hybrid</option>
              <option>Remote</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Job Type</label>
            <select
              style={inputStyle}
              name="job_type"
              value={form.job_type}
              onChange={onChange}
            >
              <option>Full-time</option>
              <option>Part-time</option>
              <option>Contract</option>
              <option>Internship</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Rate</label>
            <input
              style={inputStyle}
              name="rate"
              value={form.rate}
              onChange={onChange}
            />
          </div>
        </div>

        {/* Skills */}
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>Skills</label>
          <textarea
            style={{ ...inputStyle, height: "60px", resize: "none" }}
            name="skills"
            value={form.skills}
            onChange={onChange}
            placeholder="List required skills..."
          />
        </div>

        {/* Description */}
        <div style={{ marginTop: 14 }}>
          <label style={labelStyle}>Description (max 7500 chars)</label>
          <textarea
            style={{ ...inputStyle, height: "100px", resize: "none" }}
            name="description"
            value={form.description}
            maxLength={7500}
            onChange={onChange}
            placeholder="Enter detailed job description..."
            required
          />
        </div>

        {/* Hidden fields */}
        <input type="hidden" name="date" value={form.date} />
        <input type="hidden" name="company" value={form.company} />
        <input type="hidden" name="posted_by" value={form.posted_by} />
        <input type="hidden" name="email" value={form.email} />
      </form>
    </div>
  );
}
