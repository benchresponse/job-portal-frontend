import React from "react";
import theme from "../theme";
export default function GlobalMessage({ show = false, message, type = "info", onClose, onAction }) {
  if (!show) return null;

  // Color logic
  const colorMap = {
    success: "#2ecc71",
    error: "#e74c3c",
    info: theme.colors.primary,
    warning: "#f39c12",
  };

  const bgColor = "#fff";
  const borderColor = colorMap[type] || theme.colors.primary;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0,0,0,0.35)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        fontFamily: theme.font,
      }}
    >
      <div
        style={{
          backgroundColor: bgColor,
          borderLeft: `6px solid ${borderColor}`,
          borderRadius: theme.radius.card,
          boxShadow: theme.shadow.card,
          width: "90%",
          maxWidth: 420,
          padding: "28px 24px",
          textAlign: "center",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <h3
          style={{
            margin: 0,
            marginBottom: 10,
            color: borderColor,
            fontWeight: 600,
            fontSize: 18,
          }}
        >
          {type === "success"
            ? "Success"
            : type === "error"
            ? "Error"
            : type === "warning"
            ? "Attention"
            : "Message"}
        </h3>

        <p
          style={{
            fontSize: 15,
            color: theme.colors.textDark,
            marginBottom: 20,
            lineHeight: 1.5,
          }}
        >
          {message}
        </p>

        <div style={{ display: "flex", justifyContent: "center", gap: 15 }}>
          {onAction && (
            <button
              onClick={onAction}
              style={{
                backgroundColor: theme.colors.primary,
                color: "#fff",
                border: "none",
                borderRadius: theme.radius.input,
                padding: "8px 16px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = theme.colors.primaryHover)}
              onMouseLeave={(e) => (e.target.style.backgroundColor = theme.colors.primary)}
            >
              Proceed
            </button>
          )}

          <button
            onClick={onClose}
            style={{
              backgroundColor: "#aaa",
              color: "#fff",
              border: "none",
              borderRadius: theme.radius.input,
              padding: "8px 16px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#888")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#aaa")}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
