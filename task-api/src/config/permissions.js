// src/config/permissions.js

const PERMISSIONS = {
  ADMIN: [
    "project:create",
    "project:read",
    "project:edit",
    "project:delete",
    "task:create",
    "task:edit",
    "task:delete",
  ],
  PMO: [
    "project:create",
    "project:read",
    "project:edit",
    "task:create",
    "task:edit",
  ],
  TEAM_LEADER: ["project:read", "task:create", "task:edit"],
  TEAM_MEMBER: ["project:read", "task:edit"],
};

module.exports = PERMISSIONS;
