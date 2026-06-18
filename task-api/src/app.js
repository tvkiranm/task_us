const express = require("express");
const cors = require("cors");
const appData = express();
const authRoutes = require("./modules/auth/auth.routes");
const projectRoutes = require("./modules/projects/project.routes");
const taskRoutes = require("./modules/tasks/task.routes");

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// Parse JSON bodies
appData.use(express.json());

// Enable CORS for the frontend
appData.use(
	cors({
		origin: FRONTEND_URL,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		credentials: true,
	}),
);
// No explicit options route needed — global CORS middleware handles preflight

appData.use("/api/v1/auth", authRoutes);
appData.use("/api/v1/projects", projectRoutes);
appData.use("/api/v1/tasks", taskRoutes);

module.exports = appData;
