import React from "react";
import { Trash, Plus } from "lucide-react";

const TasksTable = ({
  tasks,
  fetchAllData,
  handleSoftDeleteTaskAdmin,
  setIsModalOpen,
}) => {
  return (
    <div className="tasks-section">
      <div className="section-header">
        <div className="section-title">
          <h2>All Active Tasks</h2>
          <p>View and manage tasks from all users.</p>
        </div>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            className="create-btn"
            onClick={() => setIsModalOpen(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              background: "var(--foreground)",
              color: "var(--background)",
            }}
          >
            <Plus size={16} /> New Task
          </button>
          <button className="create-btn" onClick={fetchAllData}>
            Refresh
          </button>
        </div>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Task</th>
            <th>User</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id} className="user-row">
              <td>
                <div style={{ fontWeight: "500" }}>{task.title}</div>
                {task.description && (
                  <div
                    style={{
                      fontSize: "12px",
                      color: "var(--muted)",
                      maxWidth: "200px",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {task.description}
                  </div>
                )}
              </td>
              <td>{task.user?.name || "Unknown"}</td>
              <td>
                <span className={`badge status-${task.status}`}>
                  {task.status}
                </span>
              </td>
              <td>
                <span className={`badge priority-${task.priority}`}>
                  {task.priority}
                </span>
              </td>
              <td>{new Date(task.createdAt).toLocaleDateString()}</td>
              <td className="table-actions">
                <button
                  className="btn-icon delete"
                  onClick={() => handleSoftDeleteTaskAdmin(task)}
                  title="Soft Delete"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
          {tasks.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No active tasks found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TasksTable;
