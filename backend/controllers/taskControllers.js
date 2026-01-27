import prisma from "../lib/prisma.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

// Verify User
function verifyUser(req, res, task) {
  if (req.user.role !== "ADMIN" && task.userId !== req.user.id) {
    return res.status(403).json({
      success: false,
      message: "Not authorized to access this task",
    });
  }
}

// GET ALL TASKS
export const getAllTasks = asyncHandler(async (req, res) => {
  const { status, priority } = req.query;

  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const where = {
    isDeleted: false,
  };

  if (req.user.role !== "ADMIN") {
    where.userId = req.user.id;
  }

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

// GET SINGLE TASK
export const getTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  const task = await prisma.task.findFirst({
    where: {
      id: taskId,
      isDeleted: false,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!task) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Check ownership
  verifyUser(req, res, task);

  return res.status(200).json({
    success: true,
    data: task,
  });
});

// CREATE TASK
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority } = req.body;

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: status || "PENDING",
      priority: priority || "MEDIUM",
      userId: req.user.id,
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return res.status(201).json({
    success: true,
    message: "Task created successfully",
    data: task,
  });
});

// UPDATE TASK
export const updateTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;
  const { title, description, status, priority } = req.body;

  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      isDeleted: false,
    },
  });

  if (!existingTask) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Check ownership
  verifyUser(req, res, existingTask);

  const task = await prisma.task.update({
    where: { id: taskId },
    data: {
      ...(title && { title }),
      ...(description !== undefined && { description }),
      ...(status && { status }),
      ...(priority && { priority }),
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return res.status(200).json({
    success: true,
    message: "Task updated",
    data: task,
  });
});

// SOFT DELETE TASK (User or Admin)
export const deleteTask = asyncHandler(async (req, res) => {
  const taskId = req.params.id;

  const existingTask = await prisma.task.findFirst({
    where: {
      id: taskId,
      isDeleted: false,
    },
  });

  if (!existingTask) {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  // Check ownership
  verifyUser(req, res, existingTask);

  await prisma.task.update({
    where: { id: taskId },
    data: { isDeleted: true },
  });

  return res.status(200).json({
    success: true,
    message: "Task deleted",
  });
});
