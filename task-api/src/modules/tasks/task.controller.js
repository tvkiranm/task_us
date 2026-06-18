// src/modules/tasks/task.controller.js
const prisma = require("../../config/db");
const { createNewProjectTask, getAllProjectTask } = require("./task.service");
const { z } = require("zod");

// 1. Zod Validation Engine Strategy Matrix (Strict input checker)
const createTaskSchema = z.object({
  name: z
    .string()
    .min(3, "Task name must be at least 3 characters long")
    .max(100),
  description: z.string().max(500).optional().default(""),
  status: z
    .enum(["TODO", "IN_PROGRESS", "REVIEW", "TESTING", "DONE"])
    .default("TODO"),
  projectId: z.preprocess(
    (val) => Number(val),
    z.number().int().positive("Invalid project identification token"),
  ),
});

exports.getAllTasks = async (req, res) => {
  try {
    // 🔥 SCALING UPGRADE: Pagination filters handling
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const projectId = req.query.projectId
      ? parseInt(req.query.projectId, 10)
      : undefined;

    const result = await getAllProjectTask({ projectId, page, limit });

    return res.status(200).json({
      success: true,
      data: result.tasks,
      meta: result.meta, // Frontend pagination logic handle karne ke liye
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch workspace tasks",
    });
  }
};

exports.createTask = async (req, res) => {
  try {
    // 🔥 SECURITY UPGRADE: Safely parse req.body using Zod schema validation
    const validationResult = createTaskSchema.safeParse(req.body);

    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validationResult.error.errors.map((err) => ({
          field: err.path[0],
          message: err.message,
        })),
      });
    }

    const validatedData = validationResult.data; // Safe parsed dynamic data pipeline

    // Project authentication verification context
    const findProject = await prisma.project.findUnique({
      where: { id: validatedData.projectId },
    });

    if (!findProject) {
      return res.status(404).json({
        success: false,
        message: "Associated project sequence matrix not found",
      });
    }

    const created = await createNewProjectTask(validatedData);

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: created,
    });
  } catch (error) {
    console.error("createTask error context logging:", error);
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal Server Error Architecture Pipeline",
    });
  }
};
