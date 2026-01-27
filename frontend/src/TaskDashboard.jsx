import React, { useState, useEffect } from "react";
import { Plus, Filter } from "lucide-react";
import api from "./services/api";
import TaskCard from "./components/TaskCard";
import TaskModal from "./components/TaskModal";
import "./Dashboard.css";

const TaskDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const fetchTasks = async () => {
    try {
      const response = await api.get("/tasks?limit=100"); // Simple fetch all for now
      if (response.data.success) {
        setTasks(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch tasks", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await api.delete(`/tasks/${taskId}`);
        setTasks(tasks.filter((t) => t.id !== taskId));
      } catch (error) {
        alert("Failed to delete task");
      }
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingTask) {
        // Update
        const response = await api.patch(`/tasks/${editingTask.id}`, formData);
        if (response.data.success) {
          setTasks(
            tasks.map((t) =>
              t.id === editingTask.id ? response.data.data : t,
            ),
          );
        }
      } else {
        // Create
        const response = await api.post("/tasks", formData);
        if (response.data.success) {
          setTasks([response.data.data, ...tasks]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "ALL") return true;
    return task.status === filter;
  });

  if (loading)
    return <div className="dashboard-container">Loading tasks...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Tasks</h1>
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{
                padding: "10px 30px 10px 12px",
                appearance: "none",
                background: "var(--background)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
            </select>
            <Filter
              size={14}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "var(--muted)",
              }}
            />
          </div>

          <button className="create-btn" onClick={handleCreate}>
            <Plus size={20} />
            New Task
          </button>
        </div>
      </div>

      {filteredTasks.length === 0 ? (
        <div className="empty-state">
          <h3>No tasks found</h3>
          <p>Get started by creating a new task.</p>
        </div>
      ) : (
        <div className="task-grid">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingTask}
      />
    </div>
  );
};

export default TaskDashboard;
