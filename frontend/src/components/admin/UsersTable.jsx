import React from "react";
import { Eye, Trash } from "lucide-react";

const UsersTable = ({
  users,
  openUserDetails,
  handleSoftDeleteUser,
  fetchAllData,
}) => {
  return (
    <div className="users-section">
      <div className="section-header">
        <div className="section-title">
          <h2>All Users</h2>
          <p>Manage active users and their access.</p>
        </div>
        <button className="create-btn" onClick={fetchAllData}>
          Refresh
        </button>
      </div>

      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Tasks</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="user-row">
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <span
                  className="badge"
                  style={{ background: "#E5E7EB", color: "#1F2937" }}
                >
                  {user.role}
                </span>
              </td>
              <td>{user._count?.tasks || 0}</td>
              <td>{new Date(user.createdAt).toLocaleDateString()}</td>
              <td className="table-actions">
                <button
                  className="btn-icon info"
                  onClick={() => openUserDetails(user.id)}
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button
                  className="btn-icon delete"
                  onClick={() => handleSoftDeleteUser(user)}
                  title="Soft Delete"
                >
                  <Trash size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
