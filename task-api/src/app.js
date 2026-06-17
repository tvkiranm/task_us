const express = require("express");
const appData = express();
const authRoutes = require("./modules/auth/auth.routes");
const projectRoutes = require("./modules/projects/project.routes");
const taskRoutes = require("./modules/tasks/task.routes");

appData.use(express.json());

appData.use("/api/v1/auth", authRoutes);
appData.use("/api/v1/projects", projectRoutes);
appData.use("/api/v1/tasks", taskRoutes);

module.exports = appData;
