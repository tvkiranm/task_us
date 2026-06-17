// src/common/middleware/permission.middleware.js
const PERMISSIONS = require("../../config/permissions");

const checkPermission = (requiredPermission) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Token se nikala hua role (e.g., 'TEAM_LEADER')
    const userPermissions = PERMISSIONS[userRole] || [];

    // Check karo ki kya user ke paas wo required permission hai
    if (!userPermissions.includes(requiredPermission)) {
      return res.status(403).json({
        success: false,
        message:
          "Forbidden: You do not have permission to perform this action!",
      });
    }

    return next();
  };
};

module.exports = checkPermission;
