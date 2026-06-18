// src/modules/tasks/task.service.js
const prisma = require("../../config/db");

const createNewProjectTask = async (projectData) => {
  try {
    const { name, description, status, projectId } = projectData;

    return await prisma.task.create({
      data: { name, description, status, projectId },
    });
  } catch (error) {
    console.error("Create new task operation failed execution pool:", error);
    throw error;
  }
};

const getAllProjectTask = async (filter = {}) => {
  try {
    const { projectId, page = 1, limit = 10 } = filter;

    // Calculate skip interval indexes for scaling queries
    const skip = (page - 1) * limit;

    // Base query initialization block
    let whereCondition = {};
    if (projectId && !Number.isNaN(projectId)) {
      whereCondition.projectId = projectId;
    }

    // Parallel processing optimization matrix execution using Promise.all
    const [tasks, totalCount] = await prisma.$transaction([
      prisma.task.findMany({
        where: whereCondition,
        skip: skip,
        take: limit,
        orderBy: { createdAt: "desc" }, // Always serve current state logs first
      }),
      prisma.task.count({ where: whereCondition }),
    ]);

    return {
      tasks,
      meta: {
        totalItems: totalCount,
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        itemsPerPage: limit,
      },
    };
  } catch (error) {
    console.error(
      "Fetching structural tasks failed within infrastructure adapter:",
      error,
    );
    throw error;
  }
};

module.exports = {
  createNewProjectTask,
  getAllProjectTask,
};
