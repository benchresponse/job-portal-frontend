import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function JobApply() {
  const { id } = useParams(); // coming from /apply/:id
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    visa: "",
    ssn_last4: "",
    dob: "",
    location_city: "",
    location_state: "",
    location_zip: "",
    employer_company: "",
    employer_name: "",
    employer_email: "",
    employer_contact: "",
    employer_alt_contact: "",
    employer_timezone: "",
    employer_visa_holder: "",
    resume: null,
  });
  const [message, setMessage] = useState("");

  // ✅ Fetch job details from backend (single job)
  useEffect(() => {
    if (!id) return;

    setLoading(true);
    fetch(`http://localhost:4000/api/jobs/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch job");
        return res.json();
      })
      .then((data) => {
        if (data && !data.error) setJob(data);
        else setJob(null);
      })
      .catch((err) => {
        console.error("❌ Error loading job:", err);
        setJob(null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ✅ Handle Field Change
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "resume") setForm({ ...form, resume: files[0] });
    else setForm({ ...form, [name]: value });
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Submitting...");

    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append("job_id", id);

    try {
      const res = await fetch("http://localhost:4000/api/apply", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setMessage(`✅ Submitted successfully! Submission ID: ${data.submission_id}`);
      } else {
        setMessage("❌ Submission failed. Please check your inputs.");
      }
    } catch (err) {
      console.error("❌ Error submitting form:", err);
      setMessage("❌ Server error during submission.");
    }
  };

  // ✅ Handle Reset
  const handleReset = () => {
    setForm({
      fullName: "",
      email: "",
      contactNumber: "",
      visa: "",
      ssn_last4: "",
      dob: "",
      location_city: "",
      location_state: "",
      location_zip: "",
      employer_company: "",
      employer_name: "",
      employer_email: "",
      employer_contact: "",
      employer_alt_contact: "",
      employer_timezone: "",
      employer_visa_holder: "",
      resume: null,
    });
    setMessage("");
  };

  // ---------- UI ----------
  if (loading) {
    return <p style={{ textAlign: "center", marginTop: 50 }}>Loading job details...</p>;
  }

  if (!job) {
    return <p style={{ textAlign: "center", marginTop: 50, color: "red" }}>Job not found.</p>;
  }

  return (
    <div style={{ padding: "30px 40px", background: "#f4f7fb", minHeight: "100vh" }}>
      <form
        onSubmit={handleSubmit}
        onReset={handleReset}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: "15px 25px",
          background: "#fff",
          padding: 25,
          borderRadius: 10,
          boxShadow: "0 3px 8px rgba(0,0,0,0.1)",
          alignItems: "center",
        }}
      >
        {/* ---------- SECTION HEADERS ---------- */}
        <div>
          <h3 style={sectionTitle}>Consultant Details</h3>
        </div>
        <div>
          <h3 style={sectionTitle}>Employer Details</h3>
        </div>
        <div>
          <h3 style={sectionTitle}>Job / Upload / Actions</h3>
        </div>

        {/* ---------- ROW 1 ---------- */}
        <FormRow label="Full Name*" name="fullName" onChange={handleChange} />
        <FormRow label="Company Name*" name="employer_company" onChange={handleChange} />
        <StaticRow label="Job ID" value={job?.job_id || id || "N/A"} />

        {/* ---------- ROW 2 ---------- */}
        <FormRow label="Email*" name="email" type="email" onChange={handleChange} />
        <FormRow label="Full Name*" name="employer_name" onChange={handleChange} />
        <StaticRow label="Role" value={job?.job_title || "N/A"} />

        {/* ---------- ROW 3 ---------- */}
        <FormRow
          label="Contact*"
          name="contactNumber"
          placeholder="(999) 999-9999"
          onChange={handleChange}
        />
        <FormRow label="Email ID*" name="employer_email" type="email" onChange={handleChange} />
        <FormRow
          label="Resume*"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleChange}
        />

        {/* ---------- ROW 4 ---------- */}
        <FormRow
          label="Visa*"
          name="visa"
          type="select"
          options={[
            "US Citizen",
            "Green Card",
            "H1B",
            "H4-EAD",
            "OPT",
            "CPT",
            "L2-EAD",
            "TN",
          ]}
          onChange={handleChange}
        />
        <FormRow
          label="Contact Number*"
          name="employer_contact"
          placeholder="(999) 999-9999"
          onChange={handleChange}
        />
        <ButtonRow type="submit" text="Submit" color="#0b47a1" />

        {/* ---------- ROW 5 ---------- */}
        <FormRow
          label="Last 4 SSN*"
          name="ssn_last4"
          maxLength="4"
          pattern="\d{4}"
          placeholder="1234"
          onChange={handleChange}
        />
        <FormRow
          label="Alternate Number"
          name="employer_alt_contact"
          placeholder="(999) 999-9999"
          onChange={handleChange}
        />
        <ButtonRow type="reset" text="Clear" color="#999" />

        {/* ---------- ROW 6 ---------- */}
        <FormRow
          label="Date of Birth (MM/DD)*"
          name="dob"
          placeholder="MM/DD"
          onChange={handleChange}
        />
        <FormRow label="Time Zone" name="employer_timezone" onChange={handleChange} />
        <ButtonRow
          type="button"
          text="Close"
          color="#e63946"
          onClick={() => navigate("/jobs")}
        />

        {/* ---------- ROW 7 ---------- */}
        <div>
          <label>Location*</label>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "5px",
            }}
          >
            <input
              placeholder="City"
              name="location_city"
              className="input"
              onChange={handleChange}
            />
            <input
              placeholder="State"
              name="location_state"
              className="input"
              onChange={handleChange}
            />
            <input
              placeholder="ZIP"
              name="location_zip"
              className="input"
              onChange={handleChange}
            />
          </div>
        </div>
        <FormRow
          label="Visa Holder"
          name="employer_visa_holder"
          onChange={handleChange}
        />
        <div></div>
      </form>

      {/* ---------- STATUS MESSAGE ---------- */}
      {message && (
        <p
          style={{
            textAlign: "center",
            marginTop: 25,
            fontWeight: 600,
            color: "#0b47a1",
          }}
        >
          {message}
        </p>
      )}

      {/* ---------- INLINE STYLES ---------- */}
      <style>{`
        label {
          display: block;
          font-weight: 600;
          color: #0b47a1;
          margin-bottom: 4px;
        }
        .input {
          width: 100%;
          padding: 7px 8px;
          border: 1px solid #ccc;
          border-radius: 5px;
          font-size: 14px;
        }
        .btn {
          width: 50%;
          padding: 7px 10px;
          border: none;
          border-radius: 5px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          color: #fff;
          transition: background 0.3s ease;
        }
        .btn:hover {
          filter: brightness(0.9);
        }
      `}</style>
    </div>
  );
}

// ---------- Helper Components ----------
function FormRow({ label, name, type = "text", placeholder, options = [], onChange, ...rest }) {
  return (
    <div>
      <label>{label}</label>
      {type === "select" ? (
        <select name={name} onChange={onChange} required className="input">
          <option value="">Select</option>
          {options.map((opt) => (
            <option key={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder || ""}
          className="input"
          onChange={onChange}
          {...rest}
        />
      )}
    </div>
  );
}

function StaticRow({ label, value }) {
  return (
    <div>
      <label>{label}</label>
      <input className="input" value={value} readOnly />
    </div>
  );
}

function ButtonRow({ type, text, color, onClick }) {
  return (
    <div style={{ textAlign: "right" }}>
      <button
        type={type}
        onClick={onClick}
        className="btn"
        style={{ background: color }}
      >
        {text}
      </button>
    </div>
  );
}

const sectionTitle = {
  color: "#0b47a1",
  marginBottom: 10,
  borderBottom: "2px solid #0b47a1",
  paddingBottom: 4,
};
