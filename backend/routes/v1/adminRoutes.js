import express from "express";
import { adminOnly, protect } from "../../middleware/auth.js";
import {
  idParamSchema,
  roleSchema,
  taskQuerySchema,
} from "../../validators/taskValidators.js";
import { validate, validateParams } from "../../middleware/validate.js";
import {
  getAllUsers,
  getUser,
  deleteUser,
  permanentDeleteUser,
  updateUserRole,
  permanentDeleteTask,
  restoreTask,
  getDeletedTasks,
} from "../../controllers/adminControllers.js";

const router = express.Router();

// Protect all Task Routes
router.use(protect);
router.use(adminOnly);

// User Management
router.get("/users", validate(taskQuerySchema), getAllUsers);
router.get("/user/:id", validateParams(idParamSchema), getUser);
router.delete("/user/:id", validateParams(idParamSchema), deleteUser);
router.delete(
  "/user/:id/permanent",
  validateParams(idParamSchema),
  permanentDeleteUser,
);
router.patch(
  "/user/:id/role",
  validateParams(idParamSchema),
  validate(roleSchema),
  updateUserRole,
);

// Task Management
router.get("/tasks/deleted", validate(taskQuerySchema), getDeletedTasks);
router.patch("/task/:id", validateParams(idParamSchema), restoreTask);
router.delete("/task/:id", validateParams(idParamSchema), permanentDeleteTask);

export default router;
