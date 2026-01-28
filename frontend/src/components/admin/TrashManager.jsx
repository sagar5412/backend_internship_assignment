import React from "react";
import { Users, Trash, RotateCcw, XOctagon } from "lucide-react";

const TrashManager = ({
  deletedUsers,
  deletedTasks,
  handleRestoreUser,
  handlePermanentDeleteUser,
  handleRestoreTask,
  handlePermanentDeleteTask,
  fetchAllData,
}) => {
  return (
    <div className="trash-section">
      <div className="section-header">
        <div className="section-title">
          <h2>Trash Manager</h2>
          <p>Restore or permanently delete items.</p>
        </div>
        <button className="create-btn" onClick={fetchAllData}>
          Refresh
        </button>
      </div>

      <div className="trash-container">
        {/* Deleted Users Column */}
        <div className="trash-column">
          <div className="trash-header">
            <Users size={18} />
            <span>Deleted Users ({deletedUsers.length})</span>
          </div>
          <div className="trash-list">
            {deletedUsers.map((user) => (
              <div key={user.id} className="trash-item">
                <div className="trash-info">
                  <p>{user.name}</p>
                  <span>{user.email}</span>
                </div>
                <div className="table-actions">
                  <button
                    className="btn-icon restore"
                    onClick={() => handleRestoreUser(user.id)}
                    title="Restore"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => handlePermanentDeleteUser(user.id)}
                    title="Permanent Delete"
                  >
                    <XOctagon size={16} />
                  </button>
                </div>
              </div>
            ))}
            {deletedUsers.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--muted)",
                  fontSize: "13px",
                }}
              >
                No deleted users
              </p>
            )}
          </div>
        </div>

        {/* Deleted Tasks Column */}
        <div className="trash-column">
          <div className="trash-header">
            <Trash size={18} />
            <span>Deleted Tasks ({deletedTasks.length})</span>
          </div>
          <div className="trash-list">
            {deletedTasks.map((task) => (
              <div key={task.id} className="trash-item">
                <div className="trash-info">
                  <p>{task.title}</p>
                  <span>by {task.user.name}</span>
                </div>
                <div className="table-actions">
                  <button
                    className="btn-icon restore"
                    onClick={() => handleRestoreTask(task.id)}
                    title="Restore"
                  >
                    <RotateCcw size={16} />
                  </button>
                  <button
                    className="btn-icon delete"
                    onClick={() => handlePermanentDeleteTask(task.id)}
                    title="Permanent Delete"
                  >
                    <XOctagon size={16} />
                  </button>
                </div>
              </div>
            ))}
            {deletedTasks.length === 0 && (
              <p
                style={{
                  textAlign: "center",
                  color: "var(--muted)",
                  fontSize: "13px",
                }}
              >
                No deleted tasks
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrashManager;
