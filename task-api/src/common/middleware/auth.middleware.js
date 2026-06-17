// src/common/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");

/**
 * Gate 1: Authentication Middleware (Token Checker)
 * Iska kaam hai sirf yeh dekhna ki user logged in hai ya nahi.
 */
const autherizedUser = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access Denied: No token provided!",
      });
    }

    // Token verify karna (Using your fallback 'amity')
    const verified = jwt.verify(token, process.env.JWT_SECRET || "amity");

    // CRITICAL UPDATE: Token se decoded data (id, email, aur ROLE) ko request me save karna
    req.user = verified;

    return next(); // Agle gatekeeper ya controller par bhejo
  } catch (error) {
    console.log("JWT Verification Error:", error);
    return res.status(403).json({
      success: false,
      message: "Invalid or Expired Token!",
    });
  }
};

/**
 * Gate 2: Authorization Middleware (Role Checker)
 * Iska kaam hai user ke ROLE ko check karna.
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Check karna ki kya Gate 1 ne req.user set kiya hai aur usme role hai
    if (!req.user || !req.user.role) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User identity or role not established.",
      });
    }

    // Check karna ki user ka role allowedRoles array me hai ya nahi
    // e.g., Agar allowedRoles = ['ADMIN', 'PROJECT_MANAGER'] aur user ka role 'TEAM_MEMBER' hai, toh fail hoga.
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access denied. Your role (${req.user.role}) does not have permission.`,
      });
    }

    return next(); // Agar role validation pass ho gaya, toh controller execute hoga
  };
};

// Dono ko export kar rahe hain taaki routes me direct use ho sakein
module.exports = {
  autherizedUser,
  authorizeRoles,
};
