import React, { useEffect, useState } from "react";

export default function ViewSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/api/submissions")
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return setSubmissions([]);

        const processed = data.map((s) => ({
          ...s,
          short_id:
            s.submission_id?.replace(/[^A-Z0-9]/gi, "").substring(0, 6).toUpperCase() || "UNK001",
          location: `${s.location_city || ""}, ${s.location_state || ""} ${s.location_zip || ""}`.trim(),
          key_skills_matched: Array.isArray(s.key_skills_matched)
            ? s.key_skills_matched
            : JSON.parse(s.key_skills_matched || "[]"),
          key_gaps: Array.isArray(s.key_gaps)
            ? s.key_gaps
            : JSON.parse(s.key_gaps || "[]"),
        }));

        setSubmissions(processed);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching submissions:", err);
        setLoading(false);
      });
  }, []);


  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Loading submissions...</p>;
  }

  return (
    <div
      style={{
        padding: "30px 50px",
        background: "#f9fbfd",
        minHeight: "100vh",
        fontFamily: "Segoe UI, sans-serif",
      }}
    >
      <h2 style={{ color: "#0b47a1", marginBottom: 20 }}>Job Application Submissions</h2>

      {submissions.length === 0 ? (
        <p>No submissions found.</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "#fff",
              borderRadius: "10px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              fontSize: "14px",
            }}
          >
            <thead>
              <tr style={{ background: "#0b47a1", color: "#fff" }}>
                <th style={thLeft}>Date</th>
                <th style={thLeft}>Job ID</th>
                <th style={thLeft}>Submission ID</th>
                <th style={thLeft}>Applicant Name</th>
                <th style={thLeft}>Email</th>
                <th style={thLeft}>Contact</th>
                <th style={thLeft}>Visa</th>
                <th style={thLeft}>Location</th>
                <th style={thCenter}>Matching</th>
                <th style={thCenter}>View Resume</th>
                <th style={thCenter}>View Report</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map((sub, i) => (
                <tr
                  key={sub.submission_id || i}
                  style={{
                    background: i % 2 === 0 ? "#fdfdfd" : "#f4f7fb",
                    textAlign: "left",
                  }}
                >
                  <td style={tdLeft}>
                    {sub.createdAt
                      ? new Date(sub.createdAt).toLocaleDateString("en-GB")
                      : "-"}
                  </td>
                  <td style={tdLeft}>{sub.job_id || "-"}</td>
                  <td style={tdLeft}>{sub.short_id}</td>
                  <td style={tdLeft}>{sub.full_name || "-"}</td>
                  <td style={tdLeft}>{sub.email || "-"}</td>
                  <td style={tdLeft}>{formatPhone(sub.contact)}</td>
                  <td style={tdLeft}>{sub.visa || "-"}</td>
                  <td style={tdLeft}>{sub.location || "-"}</td>
                  <td
                    style={{
                      ...tdCenter,
                      fontWeight: 600,
                      color: getScoreColor(sub.match_score),
                    }}
                  >
                    {sub.match_score ? `${sub.match_score}%` : "N/A"}
                  </td>

                  {/* ✅ Inline Resume View */}
                  <td style={tdCenter}>
                    {sub.submission_id ? (
                    <a
                      href={`http://localhost:4000/api/resume/${sub.submission_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      👁️ View
                    </a>
                    ) : (
                      "-"
                    )}
                  </td>

                  {/* ✅ Report View / Download */}
                  <td style={tdCenter}>
                    {sub.submission_id ? (
                      <a
                        href={`http://localhost:4000/api/report/${sub.submission_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          color: "#0b66c2",
                          textDecoration: "none",
                          fontWeight: 600,
                        }}
                      >
                        📊 View Report
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ---------- Styles ----------
const thLeft = {
  padding: "10px 8px",
  borderBottom: "2px solid #ddd",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const thCenter = { ...thLeft, textAlign: "center" };
const tdLeft = {
  padding: "10px 8px",
  borderBottom: "1px solid #e0e0e0",
  whiteSpace: "nowrap",
  color: "#333",
  textAlign: "left",
};
const tdCenter = { ...tdLeft, textAlign: "center" };

// ---------- Helper for score color ----------
function getScoreColor(score) {
  if (score >= 80) return "green";
  if (score >= 50) return "orange";
  return "red";
}

// ---------- Helper for phone number ----------
function formatPhone(phone) {
  if (!phone) return "-";
  const digits = phone.replace(/\D/g, "").substring(0, 10);
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  return phone;
}
