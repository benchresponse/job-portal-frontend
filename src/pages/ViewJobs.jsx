import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ViewJobs() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [filters, setFilters] = useState({
    company: "",
    role: "",
    jobId: "",
    location: "",
    date: "",
  });

  // ✅ Fetch jobs
  useEffect(() => {
    fetch("http://localhost:4000/api/jobs", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) {
          console.error("Invalid jobs data:", data);
          setJobs([]);
          setFilteredJobs([]);
          return;
        }

        const formatted = data.map((job) => ({
          job_id: job.job_id || job.id || "N/A",
          job_title: job.job_title || job.title || "N/A",
          company: job.company || job.organization || "N/A",
          date: job.date || job.postedAt || "",
          city: job.city || job.location?.split(",")[0] || "",
          state: job.state || job.location?.split(",")[1] || "",
          job_model: job.job_model || job.model || "",
          skills: job.skills || job.required_skills || "",
          description: job.description || job.details || "",
        }));

        setJobs(formatted);
        setFilteredJobs(formatted);
      })
      .catch((err) => console.error("❌ Error fetching jobs:", err));
  }, []);

  // 🔍 Handle filter change
  const handleFilterChange = (key, value) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  // 🔍 Search
  const handleSearch = () => {
    const filtered = jobs.filter((job) => {
      const matchesCompany = job.company
        .toLowerCase()
        .includes(filters.company.toLowerCase());
      const matchesRole = job.job_title
        .toLowerCase()
        .includes(filters.role.toLowerCase());
      const matchesJobId = job.job_id
        .toLowerCase()
        .includes(filters.jobId.toLowerCase());
      const matchesLocation =
        job.city.toLowerCase().includes(filters.location.toLowerCase()) ||
        job.state.toLowerCase().includes(filters.location.toLowerCase());
      const matchesDate = filters.date
        ? new Date(job.date).toISOString().slice(0, 10) === filters.date
        : true;

      return (
        matchesCompany &&
        matchesRole &&
        matchesJobId &&
        matchesLocation &&
        matchesDate
      );
    });
    setFilteredJobs(filtered);
  };

  // 🧹 Clear
  const handleClear = () => {
    setFilters({
      company: "",
      role: "",
      jobId: "",
      location: "",
      date: "",
    });
    setFilteredJobs(jobs);
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
        background: "#f3f6fb",
      }}
    >
      {/* 🔹 Header (Full Width) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 72,
          background: "#0b47a1",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          padding: "0 30px",
          fontSize: 20,
          fontWeight: 600,
          zIndex: 1000,
          boxShadow: "0 3px 8px rgba(0,0,0,0.25)",
        }}
      >
        Job Listings
      </div>

      {/* 🔹 Left Sidebar (Fixed) */}
      <div
        style={{
          width: 260,
          background: "#e9eff7",
          padding: "24px 18px",
          borderRight: "1px solid #d0d8e2",
          position: "fixed",
          top: 72,
          left: 0,
          bottom: 0,
          overflowY: "auto",
        }}
      >
        {/* 🔹 Filters */}
        {[
          ["Company", "company"],
          ["Role", "role"],
          ["Job ID", "jobId"],
          ["Location", "location"],
        ].map(([label, key]) => (
          <div key={key} style={{ marginBottom: 14 }}>
            <label
              style={{
                display: "block",
                color: "#0b47a1",
                marginBottom: 5,
                fontWeight: 400,
              }}
            >
              {label}
            </label>
            <input
              type="text"
              value={filters[key]}
              onChange={(e) => handleFilterChange(key, e.target.value)}
              style={{
                width: "100%",
                padding: "7px 9px",
                borderRadius: 6,
                border: "1px solid #c5d3e8",
                fontSize: 14,
              }}
            />
          </div>
        ))}

        {/* 🔹 Date Picker */}
        <div style={{ marginBottom: 0 }}>
          <label
            style={{
              display: "block",
              color: "#0b47a1",
              marginBottom: 5,
              fontWeight: 400,
            }}
          >
            Date
          </label>
          <input
            type="date"
            value={filters.date}
            onChange={(e) => handleFilterChange("date", e.target.value)}
            style={{
              width: "100%",
              padding: "7px 9px",
              borderRadius: 6,
              border: "1px solid #c5d3e8",
              fontSize: 14,
            }}
          />
        </div>

        {/* 🔹 Search & Clear Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            marginTop: 12,
          }}
        >
          <button
            onClick={handleSearch}
            style={{
              flex: 1,
              background: "#0b66c2",
              color: "#fff",
              border: "none",
              padding: "8px 0",
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Search
          </button>

          <button
            onClick={handleClear}
            style={{
              flex: 1,
              background: "#fff",
              color: "#0b47a1",
              border: "1px solid #c5d3e8",
              padding: "8px 0",
              borderRadius: 6,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* 🔹 Main Content */}
      <div
        style={{
          marginLeft: 260,
          flex: 1,
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            marginTop: 72,
            padding: "20px 30px",
            overflowY: "auto",
            height: "calc(100vh - 72px)",
          }}
        >
          {filteredJobs.length === 0 ? (
            <p style={{ color: "#555" }}>No jobs found.</p>
          ) : (
            filteredJobs.map((job, i) => (
              <div
                key={i}
                style={{
                  background: "#fff",
                  borderRadius: 10,
                  padding: "16px 20px",
                  marginBottom: 14,
                  boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
                  color: "#222",
                }}
              >
                {/* Job Info */}
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    rowGap: "3px",
                    columnGap: "40px",
                    fontSize: 14,
                    lineHeight: 1.25,
                    color: "#0b47a1",
                  }}
                >
                  {[
                    ["Job ID:", job.job_id],
                    ["Date:", job.date ? new Date(job.date).toLocaleDateString() : "N/A"],
                    ["Role:", job.job_title],
                    ["Location:", [job.city, job.state].filter(Boolean).join(", ")],
                    ["Company:", job.company],
                    ["Model:", job.job_model],
                  ].map(([label, value], idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        alignItems: "baseline",
                        justifyContent: "flex-start",
                        gap: "6px",
                        width: "95%",
                      }}
                    >
                      <strong style={{ width: 100, color: "#0b47a1" }}>{label}</strong>
                      <span style={{ color: "#0b47a1" }}>{value || "N/A"}</span>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                {job.skills && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "baseline",
                      justifyContent: "flex-start",
                      gap: "6px",
                      width: "95%",
                      paddingTop: 6,
                      fontSize: 14,
                      color: "#0b47a1",
                    }}
                  >
                    <strong style={{ width: 100, color: "#0b47a1" }}>Skills:</strong>
                    <span style={{ color: "#0b47a1" }}>{job.skills}</span>
                  </div>
                )}

                {/* Expandable JD */}
                <div style={{ marginTop: 8 }}>
                  {expandedJobId === job.job_id ? (
                    <>
                      <div
                        style={{
                          background: "#f8fafc",
                          borderRadius: 8,
                          padding: "12px 16px",
                          marginTop: 10,
                          maxHeight: "500px",
                          overflow: "hidden",
                          opacity: 1,
                          transform: "translateY(0)",
                          transition:
                            "max-height 0.4s ease, opacity 0.4s ease, transform 0.4s ease",
                        }}
                      >
                        <button
                          onClick={() => navigate(`/apply/${job.job_id}`)}
                          style={{
                            background: "#0b66c2",
                            color: "#fff",
                            border: "none",
                            padding: "7px 16px",
                            borderRadius: 6,
                            fontWeight: 600,
                            cursor: "pointer",
                            marginBottom: 10,
                          }}
                        >
                          Apply
                        </button>

                        <div
                          style={{
                            whiteSpace: "pre-wrap",
                            color: "#333",
                            fontSize: 14,
                            lineHeight: 1.5,
                          }}
                        >
                          {job.description || "No description provided."}
                        </div>
                      </div>

                      <div
                        style={{
                          color: "#0b47a1",
                          marginTop: 8,
                          fontSize: 14,
                          cursor: "pointer",
                          fontWeight: 600,
                        }}
                        onClick={() => setExpandedJobId(null)}
                      >
                        Less...
                      </div>
                    </>
                  ) : (
                    <div
                      style={{
                        color: "#0b47a1",
                        fontSize: 14,
                        cursor: "pointer",
                        fontWeight: 600,
                        marginTop: 6,
                      }}
                      onClick={() => setExpandedJobId(job.job_id)}
                    >
                      More...
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
