// prisma/seed.js
require("dotenv").config();

const bcrypt = require("bcrypt");
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

// 1. Direct Connection Pool & Adapter Setup
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("❌ DATABASE_URL is not set in your .env file!");
}

const adapter = new PrismaPg({ connectionString });
// Explicitly creating a clean client instance for the script
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database started...");

  // 2. Roles initialization
  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: { name: "ADMIN" },
  });

  await prisma.role.upsert({
    where: { name: "PMO" },
    update: {},
    create: { name: "PMO" },
  });
  await prisma.role.upsert({
    where: { name: "TEAM_LEADER" },
    update: {},
    create: { name: "TEAM_LEADER" },
  });
  await prisma.role.upsert({
    where: { name: "TEAM_MEMBER" },
    update: {},
    create: { name: "TEAM_MEMBER" },
  });

  console.log("✅ Master Corporate Roles initialized");

  // 3. Password hashing
  const hashedAdminPassword = await bcrypt.hash("Admin@Secure2026", 10);

  // 4. Admin User Insertion
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@fincaro.com" },
    update: {},
    create: {
      name: "Super Admin",
      email: "admin@fincaro.com",
      password: hashedAdminPassword,
      roleId: adminRole.id,
    },
  });

  console.log(`✅ Admin account initialized: ${adminUser.email}`);

  // 5. Default Project Setup
  const defaultProject = await prisma.project.upsert({
    where: { name: "Global Setup Project" },
    update: {},
    create: {
      name: "Global Setup Project",
      description: "Initial system workspace for management",
    },
  });

  console.log(`✅ Default Project verified with ID: ${defaultProject.id}`);
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
