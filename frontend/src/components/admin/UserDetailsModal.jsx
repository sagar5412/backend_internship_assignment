import React from "react";
import { XOctagon } from "lucide-react";

const UserDetailsModal = ({ selectedUser, onClose }) => {
  if (!selectedUser) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>User Details</h2>
          <button className="close-btn" onClick={onClose}>
            <XOctagon size={20} />
          </button>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <div className="formGroup">
            <label>Name</label>
            <div
              style={{
                padding: "10px",
                background: "var(--secondary)",
                borderRadius: "8px",
              }}
            >
              {selectedUser.name}
            </div>
          </div>
          <div className="formGroup">
            <label>Email</label>
            <div
              style={{
                padding: "10px",
                background: "var(--secondary)",
                borderRadius: "8px",
              }}
            >
              {selectedUser.email}
            </div>
          </div>
          <div className="formGroup">
            <label>Role</label>
            <div
              style={{
                padding: "10px",
                background: "var(--secondary)",
                borderRadius: "8px",
              }}
            >
              {selectedUser.role}
            </div>
          </div>
          <div className="formGroup">
            <label>Recent Tasks (Active)</label>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                marginTop: "8px",
              }}
            >
              {selectedUser.tasks && selectedUser.tasks.length > 0 ? (
                selectedUser.tasks.map((t) => (
                  <div
                    key={t.id}
                    style={{
                      padding: "8px",
                      border: "1px solid var(--border)",
                      borderRadius: "6px",
                      fontSize: "13px",
                    }}
                  >
                    {t.title}{" "}
                    <span
                      className={`badge status-${t.status}`}
                      style={{ scale: "0.8" }}
                    >
                      {t.status}
                    </span>
                  </div>
                ))
              ) : (
                <p style={{ fontSize: "13px", color: "var(--muted)" }}>
                  No active tasks.
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="modal-actions">
          <button
            className="cancel-btn"
            onClick={onClose}
            style={{ width: "100%", padding: "10px", borderRadius: "8px" }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailsModal;
