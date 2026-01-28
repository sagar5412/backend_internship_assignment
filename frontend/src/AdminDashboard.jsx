import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import api from "./services/api";
import TaskModal from "./components/TaskModal";
import "./Admin.css";

// Admin Components
import AdminSidebar from "./components/admin/AdminSidebar";
import UsersTable from "./components/admin/UsersTable";
import TasksTable from "./components/admin/TasksTable";
import TrashManager from "./components/admin/TrashManager";
import UserDetailsModal from "./components/admin/UserDetailsModal";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users"); // 'users', 'tasks', 'trash'
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]); // All active tasks
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [deletedTasks, setDeletedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null); // For Details Modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [activeUsersRes, activeTasksRes, deletedUsersRes, deletedTasksRes] =
        await Promise.all([
          api.get("/admin/users?isDeleted=false"),
          api.get("/admin/tasks"),
          api.get("/admin/users?isDeleted=true"),
          api.get("/admin/tasks/deleted"),
        ]);

      if (activeUsersRes.data.success) setUsers(activeUsersRes.data.data);
      if (activeTasksRes.data.success) setTasks(activeTasksRes.data.data);
      if (deletedUsersRes.data.success)
        setDeletedUsers(deletedUsersRes.data.data);
      if (deletedTasksRes.data.success)
        setDeletedTasks(deletedTasksRes.data.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // --- Handlers ---

  const handleSoftDeleteUser = async (user) => {
    if (
      window.confirm(
        `Are you sure you want to delete user ${user.name}? This will also delete their tasks.`,
      )
    ) {
      try {
        await api.delete(`/admin/user/${user.id}`);
        setUsers(users.filter((u) => u.id !== user.id));
        setDeletedUsers([user, ...deletedUsers]); // Optimistic update
        fetchAllData(); // proper refresh
        toast.success("User moved to trash");
      } catch (error) {
        toast.error("Failed to delete user");
      }
    }
  };

  const handleRestoreUser = async (id) => {
    try {
      await api.patch(`/admin/user/${id}/restore`);
      setDeletedUsers(deletedUsers.filter((u) => u.id !== id));
      fetchAllData();
      toast.success("User restored");
    } catch (error) {
      toast.error("Failed to restore user");
    }
  };

  const handlePermanentDeleteUser = async (id) => {
    if (window.confirm("This action is IRREVERSIBLE. Are you sure?")) {
      try {
        await api.delete(`/admin/user/${id}/permanent`);
        setDeletedUsers(deletedUsers.filter((u) => u.id !== id));
        toast.success("User permanently deleted");
      } catch (error) {
        toast.error("Failed to delete user permanently");
      }
    }
  };

  const handleRestoreTask = async (id) => {
    try {
      await api.patch(`/admin/task/${id}`);
      setDeletedTasks(deletedTasks.filter((t) => t.id !== id));
      toast.success("Task restored");
    } catch (error) {
      toast.error("Failed to restore task");
    }
  };

  const handlePermanentDeleteTask = async (id) => {
    if (window.confirm("Permanently delete this task?")) {
      try {
        await api.delete(`/admin/task/${id}`);
        setDeletedTasks(deletedTasks.filter((t) => t.id !== id));
        toast.success("Task permanently deleted");
      } catch (error) {
        toast.error("Failed to delete task completely");
      }
    }
  };

  const handleSoftDeleteTaskAdmin = async (task) => {
    if (window.confirm(`Delete task "${task.title}"?`)) {
      try {
        await api.delete(`/admin/task/${task.id}`); // Soft delete
        setTasks(tasks.filter((t) => t.id !== task.id));
        setDeletedTasks([task, ...deletedTasks]);
        fetchAllData();
        toast.success("Task moved to trash");
      } catch (error) {
        toast.error("Failed to delete task");
      }
    }
  };

  const openUserDetails = async (id) => {
    try {
      const res = await api.get(`/admin/user/${id}`);
      if (res.data.success) {
        setSelectedUser(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to fetch user details");
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const res = await api.post("/tasks", taskData); // Admins use same endpoint
      setTasks([res.data.data, ...tasks]);
      setIsModalOpen(false);
      toast.success("Task created successfully");
    } catch (error) {
      toast.error("Failed to create task");
    }
  };

  return (
    <div className="admin-container">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="admin-content">
        {activeTab === "users" && (
          <UsersTable
            users={users}
            openUserDetails={openUserDetails}
            handleSoftDeleteUser={handleSoftDeleteUser}
            fetchAllData={fetchAllData}
          />
        )}

        {activeTab === "tasks" && (
          <TasksTable
            tasks={tasks}
            fetchAllData={fetchAllData}
            handleSoftDeleteTaskAdmin={handleSoftDeleteTaskAdmin}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {activeTab === "trash" && (
          <TrashManager
            deletedUsers={deletedUsers}
            deletedTasks={deletedTasks}
            handleRestoreUser={handleRestoreUser}
            handlePermanentDeleteUser={handlePermanentDeleteUser}
            handleRestoreTask={handleRestoreTask}
            handlePermanentDeleteTask={handlePermanentDeleteTask}
            fetchAllData={fetchAllData}
          />
        )}
      </main>

      {/* User Details Modal */}
      <UserDetailsModal
        selectedUser={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      {/* Task Modal */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
};

export default AdminDashboard;
