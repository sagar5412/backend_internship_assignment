import React from "react";
import { LogOut, CheckSquare } from "lucide-react";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        height: "64px",
        backgroundColor: "var(--background)",
        borderBottom: "1px solid var(--border)",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontWeight: 700,
          fontSize: "18px",
        }}
      >
        <CheckSquare size={24} />
        TaskManager
      </div>

      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ fontSize: "14px", fontWeight: 500 }}>
            {user.name}{" "}
            <span
              style={{
                fontSize: "10px",
                textTransform: "uppercase",
                padding: "2px 6px",
                background: "var(--secondary)",
                borderRadius: "4px",
                marginLeft: "4px",
                color: "var(--muted)",
              }}
            >
              {user.role}
            </span>
          </div>
          <button
            onClick={onLogout}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              background: "none",
              color: "var(--muted)",
              padding: "4px 8px",
              borderRadius: "4px",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--secondary)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
