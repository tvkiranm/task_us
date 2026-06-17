const prisma = require("../../config/db"); // Hamara central Prisma client instance

const createNewProject = async (projectData) => {
  try {
    const { name, description } = projectData;
    return await prisma.project.create({
      data: { name, description },
    });
  } catch (error) {
    console.error("createNewProject failed:", {
      message: error?.message,
      code: error?.code,
      meta: error?.meta,
      stack: error?.stack,
      input: projectData,
    });
    throw error;
  }
};

const getAllProjects = async () => {
  return await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { tasks: true },
      },
    },
  });
};

const getProjectById = async (id) => {
  const project = await prisma.project.findUnique({
    where: { id: parseInt(id) },
    include: { tasks: true }, // Project ke saare tasks bhi response me fetch ho jayenge
  });

  if (!project) {
    const error = new Error("Project not found!");
    error.statusCode = 404;
    throw error;
  }
  return project;
};

const updateProjectDetails = async (id, updateData) => {
  const { name, description } = updateData;

  // Validation: Check if project exists before updating
  const existingProject = await prisma.project.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingProject) {
    const error = new Error("Project not found to update!");
    error.statusCode = 404;
    throw error;
  }

  return await prisma.project.update({
    where: { id: parseInt(id) },
    data: { name, description },
  });
};

const deleteProjectFromDb = async (id) => {
  // Validation: Check if project exists before deleting
  const existingProject = await prisma.project.findUnique({
    where: { id: parseInt(id) },
  });

  if (!existingProject) {
    const error = new Error("Project not found to delete!");
    error.statusCode = 404;
    throw error;
  }

  // Delete query (Prisma schema me 'onDelete: Cascade' laga hai, toh tasks automatic delete ho jayenge)
  await prisma.project.delete({
    where: { id: parseInt(id) },
  });

  return { message: "Project and its associated tasks deleted successfully" };
};

module.exports = {
  createNewProject,
  getAllProjects,
  getProjectById,
  updateProjectDetails,
  deleteProjectFromDb,
};
