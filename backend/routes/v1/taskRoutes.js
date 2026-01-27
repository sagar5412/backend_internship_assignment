import express from "express"
import { protect } from "../../middleware/auth.js";
import { createTaskSchema, idParamSchema, taskQuerySchema, updateTaskSchema } from "../../validators/taskValidators.js";
import { createTask, deleteTask, getAllTasks,getTask, updateTask } from "../../controllers/taskControllers.js";
import { validate,validateParams } from "../../middleware/validate.js";

const router = express.Router();

// Protect all Task Routes
router.use(protect);

// Task Routes
router.get("/",validate(taskQuerySchema),getAllTasks);
router.get("/:id",validateParams(idParamSchema),getTask);
router.post("/",validate(createTaskSchema),createTask);
router.put("/:id",validate(updateTaskSchema),updateTask);
router.put("/:id/delete",validateParams(idParamSchema),deleteTask)

export default router