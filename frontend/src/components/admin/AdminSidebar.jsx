import React from "react";
import { Users, CheckSquare, Trash } from "lucide-react";

const AdminSidebar = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-title">Admin Controls</div>
      <ul className="sidebar-menu">
        <li
          className={`menu-item ${activeTab === "users" ? "active" : ""}`}
          onClick={() => setActiveTab("users")}
        >
          <Users size={18} />
          Active Users
        </li>
        <li
          className={`menu-item ${activeTab === "tasks" ? "active" : ""}`}
          onClick={() => setActiveTab("tasks")}
        >
          <CheckSquare size={18} />
          All Tasks
        </li>
        <li
          className={`menu-item ${activeTab === "trash" ? "active" : ""}`}
          onClick={() => setActiveTab("trash")}
        >
          <Trash size={18} />
          Trash Manager
        </li>
      </ul>
    </aside>
  );
};

export default AdminSidebar;
