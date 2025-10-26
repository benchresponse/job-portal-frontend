import React, { useEffect, useState } from "react";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJobs, setSelectedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // ---------- Fetch Jobs ----------
  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/jobs");
      const data = await res.json();
      setJobs(data);
      setFilteredJobs(data);
      setLoading(false);
    } catch {
      setError("Failed to load jobs.");
      setLoading(false);
    }
  };

  // ---------- Search ----------
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = jobs.filter(
      (job) =>
        job.job_id?.toLowerCase().includes(term) ||
        job.job_title?.toLowerCase().includes(term)
    );
    setFilteredJobs(filtered);
  }, [searchTerm, jobs]);

  // ---------- Select ----------
  const toggleSelect = (jobId) => {
    setSelectedJobs((prev) =>
      prev.includes(jobId)
        ? prev.filter((id) => id !== jobId)
        : [...prev, jobId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedJobs.length === filteredJobs.length) {
      setSelectedJobs([]);
    } else {
      setSelectedJobs(filteredJobs.map((j) => j.job_id));
    }
  };

  // ---------- Delete ----------
  const deleteSelected = async () => {
    if (selectedJobs.length === 0) {
      setMessage("Please select at least one job to delete.");
      return;
    }

    if (!window.confirm(`Delete ${selectedJobs.length} selected job(s)?`)) return;

    try {
      const res = await fetch("http://localhost:4000/api/delete-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_ids: selectedJobs }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${selectedJobs.length} job(s) deleted successfully.`);
        setSelectedJobs([]);
        fetchJobs();
      } else {
        setMessage("❌ " + (data.error || "Failed to delete jobs."));
      }
    } catch {
      setMessage("❌ Server error while deleting jobs.");
    }
  };

  // ---------- Repost ----------
  const repostSelected = async () => {
    if (selectedJobs.length === 0) {
      setMessage("Please select at least one job to repost.");
      return;
    }

    if (!window.confirm(`Repost ${selectedJobs.length} selected job(s)?`)) return;

    try {
      const res = await fetch("http://localhost:4000/api/repost-jobs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job_ids: selectedJobs }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(`✅ ${selectedJobs.length} job(s) reposted successfully.`);
        setSelectedJobs([]);
        fetchJobs();
      } else {
        setMessage("❌ " + (data.error || "Failed to repost jobs."));
      }
    } catch {
      setMessage("❌ Server error while reposting jobs.");
    }
  };

  if (loading) return <p>Loading jobs...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div
      style={{
        padding: "5px 20px 0 20px",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
      }}
    >
      {/* ---------- Message ---------- */}
      {message && (
        <p
          style={{
            background: "#f5f5f5",
            padding: "10px",
            borderRadius: "6px",
            color: message.startsWith("✅") ? "green" : "red",
            marginBottom: "12px",
          }}
        >
          {message}
        </p>
      )}

      {/* ---------- Toolbar ---------- */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "8px",
            paddingLeft: "10px", // 👈 adds space to line up with checkbox column
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <input
              type="checkbox"
              checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
              onChange={toggleSelectAll}
            />
            <span>Select All</span>
          </label>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="🔍 Search by Job ID or Title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "7px 12px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              fontSize: "14px",
              width: "260px",
            }}
          />
          <button
            onClick={repostSelected}
            style={linkedinButton}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#004182")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#0A66C2")
            }
          >
            Repost Selected
          </button>
          <button
            onClick={deleteSelected}
            style={{
              ...linkedinButton,
              backgroundColor: "#d9534f",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#c9302c")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#d9534f")
            }
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* ---------- Jobs List ---------- */}
      <div style={{ maxHeight: "75vh", overflowY: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead style={{ position: "sticky", top: 0, zIndex: 3 }}>
            <tr style={{ background: "#f5f5f5", textAlign: "left" }}>
              <th style={thStyle}></th>
              <th style={thStyle}>Job ID</th>
              <th style={thStyle}>Title</th>
              <th style={thStyle}>Company</th>
              <th style={thStyle}>City</th>
              <th style={thStyle}>State</th>
              <th style={thStyle}>Rate</th>
              <th style={thStyle}>Posted</th>
            </tr>
          </thead>
          <tbody>
            {filteredJobs.map((job, i) => (
              <tr
                key={job.job_id}
                style={{
                  borderBottom: "1px solid #e5e5e5",
                  background: selectedJobs.includes(job.job_id)
                    ? "#eef6ff"
                    : i % 2 === 0
                    ? "#fff"
                    : "#fafafa",
                }}
              >
                <td style={tdStyle}>
                  <input
                    type="checkbox"
                    checked={selectedJobs.includes(job.job_id)}
                    onChange={() => toggleSelect(job.job_id)}
                  />
                </td>
                <td style={tdStyle}>{job.job_id}</td>
                <td style={tdStyle}>{job.job_title}</td>
                <td style={tdStyle}>{job.company || "—"}</td>
                <td style={tdStyle}>{job.city}</td>
                <td style={tdStyle}>{job.state}</td>
                <td style={tdStyle}>{job.rate}</td>
                <td style={tdStyle}>
                  {job.postedAt
                    ? new Date(job.postedAt).toLocaleDateString()
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Styles ---------- */
const thStyle = {
  padding: "8px 10px",
  color: "#0b47a1",
  fontWeight: "600",
  borderBottom: "1px solid #ddd",
  background: "#f5f5f5",
};

const tdStyle = {
  padding: "10px 12px",
  color: "#333",
  fontSize: "14px",
};

const linkedinButton = {
  backgroundColor: "#0A66C2",
  color: "#fff",
  border: "none",
  borderRadius: "24px",
  padding: "8px 18px",
  fontWeight: "600",
  cursor: "pointer",
  fontSize: "14px",
  transition: "background-color 0.3s ease",
};
