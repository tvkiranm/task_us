const express = require("express");
const cors = require("cors");
const appData = express();
const authRoutes = require("./modules/auth/auth.routes");
const projectRoutes = require("./modules/projects/project.routes");
const taskRoutes = require("./modules/tasks/task.routes");
const helmet = require("helmet");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
const rateLimit = require("express-rate-limit");

// Parse JSON bodies
appData.use(express.json());

//prevent from the attecter like its middleware ((XSS, Clickjacking, Headers Protection))
appData.use(helmet());
// Enable CORS for the frontend

// / 2. Base Rate Limiter Array setup (DDoS protection)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Ek IP address 15 min me max 100 requests hi maar sakega
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes.",
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

appData.use(
  cors({
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
// No explicit options route needed — global CORS middleware handles preflight

appData.use("/api", globalLimiter);
appData.use("/api/v1/auth", authRoutes);
appData.use("/api/v1/projects", projectRoutes);
appData.use("/api/v1/tasks", taskRoutes);

module.exports = appData;
