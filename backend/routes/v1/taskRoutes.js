import express from "express";
import { protect } from "../../middleware/auth.js";
import {
  createTaskSchema,
  idParamSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "../../validators/taskValidators.js";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updateTask,
} from "../../controllers/taskControllers.js";
import { validate, validateParams } from "../../middleware/validate.js";

const router = express.Router();

// Protect all Task Routes
router.use(protect);

// Task Routes
/**
 * @swagger
 * /api/v1/tasks:
 *   get:
 *     summary: Get all tasks (User's own tasks, or all tasks if Admin)
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [PENDING, IN_PROGRESS, COMPLETED] }
 *       - in: query
 *         name: priority
 *         schema: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: List of tasks
 */
router.get("/", validate(taskQuerySchema), getAllTasks);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   get:
 *     summary: Get a single task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Task details
 *       404:
 *         description: Task not found
 */
router.get("/:id", validateParams(idParamSchema), getTask);

/**
 * @swagger
 * /api/v1/tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title]
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [PENDING, IN_PROGRESS, COMPLETED] }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *     responses:
 *       201:
 *         description: Task created
 */
router.post("/", validate(createTaskSchema), createTask);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   patch:
 *     summary: Update a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [PENDING, IN_PROGRESS, COMPLETED] }
 *               priority: { type: string, enum: [LOW, MEDIUM, HIGH] }
 *     responses:
 *       200:
 *         description: Task updated
 */
router.patch(
  "/:id",
  validateParams(idParamSchema),
  validate(updateTaskSchema),
  updateTask,
);

/**
 * @swagger
 * /api/v1/tasks/{id}:
 *   delete:
 *     summary: Soft delete a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Task deleted
 */
router.delete("/:id", validateParams(idParamSchema), deleteTask);

export default router;
