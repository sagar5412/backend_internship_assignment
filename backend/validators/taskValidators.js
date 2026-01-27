import Joi from "joi";

export const taskQuerySchema = Joi.object({
  status: Joi.string().valid("PENDING", "IN_PROGRESS", "COMPLETED").optional(),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
});

export const idParamSchema = Joi.object({
  id: Joi.string().uuid().required(),
});

export const createTaskSchema = Joi.object({
  title: Joi.string().min(3).max(15).required().messages({
    "string.min": "Title must be at least 3 characters",
    "string.max": "Title cannot exceed 15 characters",
    "any.required": "Title is required",
  }),
  description: Joi.string().max(100).optional(),
  status: Joi.string()
    .valid("PENDING", "IN_PROGRESS", "COMPLETED")
    .default("PENDING"),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").default("MEDIUM"),
});

export const updateTaskSchema = Joi.object({
  title: Joi.string().min(3).max(15).optional(),
  description: Joi.string().max(100).optional(),
  status: Joi.string().valid("PENDING", "IN_PROGRESS", "COMPLETED").optional(),
  priority: Joi.string().valid("LOW", "MEDIUM", "HIGH").optional(),
}).min(1);

export const roleSchema = Joi.object({
  role: Joi.string().valid("USER", "ADMIN").required(),
});
