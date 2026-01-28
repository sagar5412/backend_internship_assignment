import express from "express";
import { adminOnly, protect } from "../../middleware/auth.js";
import {
  idParamSchema,
  roleSchema,
  taskQuerySchema,
  adminUserQuerySchema,
} from "../../validators/taskValidators.js";
import { validate, validateParams } from "../../middleware/validate.js";
import {
  getAllUsers,
  getUser,
  deleteUser,
  permanentDeleteUser,
  restoreUser,
  updateUserRole,
  permanentDeleteTask,
  restoreTask,
  getDeletedTasks,
} from "../../controllers/adminControllers.js";

import {
  getAllTasks,
  deleteTask as softDeleteTask,
} from "../../controllers/taskControllers.js";

const router = express.Router();

// Protect all Task Routes
router.use(protect);
router.use(adminOnly);

// User Management
// User Management
/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isDeleted
 *         schema: { type: boolean }
 *         description: Filter by deleted status
 *     responses:
 *       200:
 *         description: List of users
 */
router.get("/users", validate(adminUserQuerySchema), getAllUsers);

/**
 * @swagger
 * /api/v1/admin/user/{id}:
 *   get:
 *     summary: Get a specific user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User details
 */
router.get("/user/:id", validateParams(idParamSchema), getUser);

/**
 * @swagger
 * /api/v1/admin/user/{id}:
 *   delete:
 *     summary: Soft delete a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User deleted
 */
router.delete("/user/:id", validateParams(idParamSchema), deleteUser);

/**
 * @swagger
 * /api/v1/admin/user/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User permanently deleted
 */
router.delete(
  "/user/:id/permanent",
  validateParams(idParamSchema),
  permanentDeleteUser,
);

/**
 * @swagger
 * /api/v1/admin/user/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted user (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: User restored
 */
router.patch("/user/:id/restore", validateParams(idParamSchema), restoreUser);

/**
 * @swagger
 * /api/v1/admin/user/{id}/role:
 *   patch:
 *     summary: Update user role (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role: { type: string, enum: [USER, ADMIN] }
 *     responses:
 *       200:
 *         description: User role updated
 */
router.patch(
  "/user/:id/role",
  validateParams(idParamSchema),
  validate(roleSchema),
  updateUserRole,
);

// Task Management
/**
 * @swagger
 * /api/v1/admin/tasks:
 *   get:
 *     summary: Get all active tasks (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all active tasks
 */
router.get("/tasks", validate(taskQuerySchema), getAllTasks);

/**
 * @swagger
 * /api/v1/admin/tasks/deleted:
 *   get:
 *     summary: Get all deleted tasks (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of deleted tasks
 */
router.get("/tasks/deleted", validate(taskQuerySchema), getDeletedTasks);

/**
 * @swagger
 * /api/v1/admin/task/{id}:
 *   patch:
 *     summary: Restore a deleted task (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Task restored
 */
router.patch("/task/:id", validateParams(idParamSchema), restoreTask);

/**
 * @swagger
 * /api/v1/admin/task/{id}:
 *   delete:
 *     summary: Soft delete a task (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Task soft deleted
 */
router.delete("/task/:id", validateParams(idParamSchema), softDeleteTask);

/**
 * @swagger
 * /api/v1/admin/task/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a task (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Task permanently deleted
 */
router.delete(
  "/task/:id/permanent",
  validateParams(idParamSchema),
  permanentDeleteTask,
);

export default router;
