import React, { useEffect, useState } from "react";
import Mammoth from "mammoth"; // npm install mammoth

const SubmissionsTable = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  // ----------------- Helpers -----------------
  const formatDate = (isoDate) => {
    if (!isoDate) return "—";
    const d = new Date(isoDate);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}/${dd}/${yy}`;
  };

  const formatNumber = (num) => {
    if (!num) return "—";
    const digits = num.replace(/\D/g, "");
    if (digits.length !== 10) return num;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };

  const getScoreClass = (score) => {
    if (score >= 75) return { color: "green" };
    if (score >= 50) return { color: "orange" };
    return { color: "red" };
  };

  // ----------------- Fetch Submissions -----------------
  const fetchSubmissions = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/employer/submissions");
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const result = await response.json();
      if (!Array.isArray(result)) throw new Error("Invalid data format from API");

      const mappedData = result.map((item) => ({
        id: item.id,
        date: item.date,
        jobId: item.job_id || "—",
        name: item.fullName || "—",
        number: item.contactNumber || "—",
        email: item.email || "—",
        score: item.matchingScore != null ? item.matchingScore : "—",
        resumeUrl: item.resumeUrl,
        reportUrl: item.reportUrl,
        resumeType: item.resumeUrl?.endsWith(".pdf")
          ? "pdf"
          : item.resumeUrl?.endsWith(".docx")
          ? "docx"
          : "doc",
        reportType: "pdf",
      }));

      setData(mappedData);
      setFilteredData(mappedData);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch submissions:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  // ----------------- Search Filter -----------------
  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = data.filter(
      (row) =>
        row.name.toLowerCase().includes(term) ||
        row.jobId.toLowerCase().includes(term) ||
        formatDate(row.date).includes(term)
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // ----------------- Selection Logic -----------------
  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selected.length === filteredData.length) {
      setSelected([]);
    } else {
      setSelected(filteredData.map((x) => x.id));
    }
  };

  // ----------------- Delete Selected -----------------
  const deleteSelected = async () => {
    if (selected.length === 0) {
      setMessage("Please select at least one submission to delete.");
      return;
    }
    if (!window.confirm(`Delete ${selected.length} selected submission(s)?`)) return;

    try {
      const res = await fetch("http://localhost:4000/api/delete-submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });

      if (res.ok) {
        setMessage(`✅ ${selected.length} submission(s) deleted successfully.`);
        setSelected([]);
        fetchSubmissions();
      } else {
        const data = await res.json().catch(() => ({}));
        setMessage("❌ " + (data.error || "Failed to delete submissions."));
      }
    } catch (err) {
      setMessage("❌ Server error while deleting submissions.");
    }
  };

  // ----------------- Modal -----------------
  const openModal = async (fileUrl, fileType) => {
    setCurrentFile({ url: fileUrl, type: fileType });
    if (!fileUrl) {
      setModalContent(<p>No file available</p>);
      setModalVisible(true);
      return;
    }

    if (fileType === "pdf") {
      setModalContent(
        <iframe
          src={fileUrl}
          style={{ width: "100%", height: "80vh", border: "none" }}
          title="PDF Preview"
        />
      );
    } else if (fileType === "docx" || fileType === "doc") {
      try {
        const response = await fetch(fileUrl);
        const arrayBuffer = await response.arrayBuffer();
        const result = await Mammoth.extractRawText({ arrayBuffer });
        setModalContent(
          <div style={{ whiteSpace: "pre-wrap", fontSize: "14px" }}>
            {result.value}
          </div>
        );
      } catch {
        setModalContent(<p>Failed to load document.</p>);
      }
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalContent(null);
    setCurrentFile(null);
  };

  const downloadFile = () => {
    if (!currentFile || !currentFile.url) return;
    const link = document.createElement("a");
    link.href = currentFile.url;
    link.download = currentFile.url.split("/").pop();
    link.click();
  };

  // ----------------- Render -----------------
  if (loading) return <p>Loading submissions...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!data.length) return <p>No submissions found.</p>;

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
            padding: "8px",
            borderRadius: "6px",
            color: message.startsWith("✅") ? "green" : "red",
            marginBottom: "8px",
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
          marginBottom: "6px",
        }}
      >
        <label style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <input
            type="checkbox"
            checked={
              selected.length === filteredData.length && filteredData.length > 0
            }
            onChange={toggleSelectAll}
          />
          <span>Select All</span>
        </label>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <input
            type="text"
            placeholder="🔍 Search by name, job ID or date"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "6px 10px",
              border: "1px solid #ccc",
              borderRadius: "5px",
              fontSize: "14px",
              width: "250px",
            }}
          />
          <button
            onClick={deleteSelected}
            style={linkedinButton}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#004182")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#0A66C2")
            }
          >
            Delete Selected
          </button>
        </div>
      </div>

      {/* ---------- Table Container ---------- */}
      <div style={{ maxHeight: "75vh", overflowY: "auto" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "14px",
          }}
        >
          <thead style={{ position: "sticky", top: 0, zIndex: 3 }}>
            <tr style={{ backgroundColor: "#f5f5f5" }}>
              <th style={{ width: "3%" }}></th>
              <th style={{ width: "8%", padding: "8px" }}>Date</th>
              <th style={{ width: "13%", padding: "8px" }}>Job ID</th>
              <th style={{ width: "20%", padding: "8px" }}>Name</th>
              <th style={{ width: "13%", padding: "8px" }}>Number</th>
              <th style={{ width: "15%", padding: "8px" }}>Email</th>
              <th style={{ width: "7%", padding: "8px", textAlign: "center" }}>Score</th>
              <th style={{ width: "8%", padding: "8px", textAlign: "center" }}>Resume</th>
              <th style={{ width: "8%", padding: "8px", textAlign: "center" }}>Report</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: "1px solid #ddd",
                  background: selected.includes(row.id)
                    ? "#eef6ff"
                    : "transparent",
                }}
              >
                <td style={{ textAlign: "center" }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
                <td>{formatDate(row.date)}</td>
                <td>{row.jobId}</td>
                <td>{row.name}</td>
                <td>{formatNumber(row.number)}</td>
                <td>{row.email}</td>
                <td style={{ textAlign: "center", ...getScoreClass(row.score) }}>
                  {row.score !== "—" ? `${row.score}%` : "—"}
                </td>
                <td style={{ textAlign: "center", cursor: "pointer" }}>
                  <span onClick={() => openModal(row.resumeUrl, row.resumeType)}>👁</span>
                </td>
                <td style={{ textAlign: "center", cursor: "pointer" }}>
                  <span onClick={() => openModal(row.reportUrl, row.reportType)}>👁</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ---------- Modal ---------- */}
      {modalVisible && currentFile && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            zIndex: 999,
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              margin: "2% auto",
              padding: "20px",
              width: "90%",
              maxHeight: "90%",
              overflowY: "auto",
              borderRadius: "8px",
            }}
          >
            <div style={{ marginBottom: "15px" }}>
              <button
                onClick={downloadFile}
                style={linkedinButton}
              >
                Download
              </button>
              <button
                onClick={closeModal}
                style={{
                  ...linkedinButton,
                  backgroundColor: "#6c757d",
                  marginLeft: "8px",
                }}
              >
                Close
              </button>
            </div>
            <div style={{ borderTop: "1px solid #ddd", paddingTop: "10px" }}>
              {modalContent}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionsTable;

/* ---------- Styles ---------- */
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
