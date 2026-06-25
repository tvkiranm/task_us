const logAudit = require("../../common/utils/auditLogger");
const {
  getAllProjects: fetchAllProjects,
  createNewProject,
  getProjectById,
  deleteProjectFromDb,
  updateProjectDetails,
} = require("./project.service");

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await fetchAllProjects();
    return res.status(200).json({
      success: true,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "Project name is required" });
    }
    const project = await createNewProject({ name, description });

    // 🔥 AUDIT PIPELINE TRIGGER
    await logAudit({
      userId: req.user.id, // Auth middleware se mila hua token user context
      userEmail: req.user.email,
      action: "CREATE_PROJECT",
      module: "PROJECT",
      recordId: project.id,
      newData: project,
      ipAddress: req.ip,
    });

    return res.status(201).json({ success: true, data: project });
  } catch (error) {
    console.error("createProject failed:", error);
    console.error("message:", error?.message);
    console.error("code:", error?.code);
    console.error("meta:", error?.meta);
    console.error("stack:", error?.stack);

    const status = error?.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error?.message || "Internal Server Error",
    });
  }
};

const getSingleProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await getProjectById(id);
    return res.status(200).json({ success: true, data: project });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

// UPDATE
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const updatedProject = await updateProjectDetails(id, {
      name,
      description,
    });
    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data: updatedProject,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

// DELETE
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteProjectFromDb(id);
    return res.status(200).json({ success: true, message: result.message });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({ success: false, message: error.message });
  }
};

exports.getSingleProject = getSingleProject;
exports.updateProject = updateProject;
exports.deleteProject = deleteProject;
