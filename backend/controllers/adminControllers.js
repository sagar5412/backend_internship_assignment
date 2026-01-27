import prisma from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// GET ALL USERS
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isDeleted: true,
        createdAt: true,
        updatedAt: true,
        _count: { select: { tasks: true } },
      },
    }),
    prisma.user.count(),
  ]);
  return res.status(200).json({
    success: true,
    data: users,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// GET SINGLE USER
export const getUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      tasks: {
        where: { isDeleted: false },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    data: user,
  });
});

// SOFT DELETE USER
export const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  // Prevent self-deletion
  if (userId === req.user.id) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete your own account",
    });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  // Soft delete all user's tasks, then delete user
  await prisma.$transaction([
    prisma.task.updateMany({
      where: { userId },
      data: { isDeleted: true },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { isDeleted: true },
    }),
  ]);
  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// PERMANENT DELETE USER
export const permanentDeleteUser = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  if (userId === req.user.id) {
    return res.status(400).json({
      success: false,
      message: "Cannot delete your own account",
    });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  // Delete user (cascade will delete tasks if set in schema)
  await prisma.user.delete({
    where: { id: userId },
  });
  return res.status(200).json({
    success: true,
    message: "User permanently deleted",
  });
});

// UPDATE USER ROLE
export const updateUserRole = asyncHandler(async (req, res) => {
  const userId = req.params.id;
  const { role } = req.body;
  if (userId === req.user.id) {
    return res.status(400).json({
      success: false,
      message: "Cannot change your own role",
    });
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { role },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });
  return res.status(200).json({
    success: true,
    message: `User role updated to ${role}`,
    data: updatedUser,
  });
});

// GET DELETED TASKS
export const getDeletedTasks = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const where = {
    isDeleted: true,
  };

  if (
    status &&
    ["PENDING", "IN_PROGRESS", "COMPLETED"].includes(status.toUpperCase())
  ) {
    where.status = status.toUpperCase();
  }

  if (priority && ["LOW", "MEDIUM", "HIGH"].includes(priority.toUpperCase())) {
    where.priority = priority.toUpperCase();
  }

  const [tasks, total] = await Promise.all([
    prisma.task.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.task.count({ where }),
  ]);

  return res.status(200).json({
    success: true,
    data: tasks,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

// PERMANENT DELETE Tasks
export const permanentDeleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  const existingTask = await prisma.task.findUnique({
    where: { id: taskId },
  });

  if (!existingTask) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  await prisma.task.delete({
    where: { id: taskId },
  });

  return res.status(200).json({
    success: true,
    message: "Task permanently deleted",
  });
});

// RESTORE DELETED TASK (Admin Only)
export const restoreTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      isDeleted: true, // Must be deleted to restore
    },
  });

  if (!existingTask) {
    return res.status(404).json({
      success: false,
      message: "Deleted task not found",
    });
  }

  const task = await prisma.task.update({
    where: { id: taskId },
    data: { isDeleted: false },
  });

  return res.status(200).json({
    success: true,
    message: "Task restored",
    data: task,
  });
});
