const express = require("express");
const {
  getAllProjects,
  createProject,
  getSingleProject,
  updateProject,
  deleteProject,
} = require("./project.controller");

const router = express.Router();

// src/modules/projects/projects.routes.js
const { autherizedUser } = require("../../common/middleware/auth.middleware");
const checkPermission = require("../../common/middleware/permission.middleware");

router.post(
  "/",
  autherizedUser,
  checkPermission("project:create"),
  createProject,
);

// Project edit karne ke liye
router.put(
  "/:id",
  autherizedUser,
  checkPermission("project:edit"),
  updateProject,
);

module.exports = router;
