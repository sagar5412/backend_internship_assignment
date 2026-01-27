import React from "react";
import { Pencil, Trash2, Calendar } from "lucide-react";

const TaskCard = ({ task, onEdit, onDelete }) => {
  return (
    <div className="task-card">
      <div className="task-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button
            className="action-btn"
            onClick={() => onEdit(task)}
            title="Edit"
          >
            <Pencil size={16} />
          </button>
          <button
            className="action-btn delete"
            onClick={() => onDelete(task.id)}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      <div className="task-desc">
        {task.description || "No description provided."}
      </div>

      <div className="task-footer">
        <div className="task-meta">
          <span className={`badge status-${task.status}`}>
            {task.status.replace("_", " ")}
          </span>
          <span
            className={`badge priority-${task.priority}`}
            style={{ marginLeft: "8px" }}
          >
            {task.priority}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "4px",
            color: "var(--muted)",
          }}
        >
          <Calendar size={12} />
          <span>{new Date(task.createdAt).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
