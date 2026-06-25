// src/common/utils/auditLogger.js
const prisma = require("../../config/db"); // Aapka central prisma client path

const logAudit = async ({
  userId,
  userEmail,
  action,
  module,
  recordId,
  oldData = null,
  newData = null,
  ipAddress = "0.0.0.0"
}) => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        userEmail,
        action,
        module,
        recordId: String(recordId),
        oldData: oldData ? JSON.parse(JSON.stringify(oldData)) : null,
        newData: newData ? JSON.parse(JSON.stringify(newData)) : null,
        ipAddress
      }
    });
  } catch (error) {
    // Fail safe pipeline: Audit system crash hone par main API block nahi honi chahiye
    console.error("🚨 System Audit Log Pipeline Anomaly:", error.message);
  }
};

module.exports = logAudit;