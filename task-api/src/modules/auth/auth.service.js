// src/modules/auth/auth.service.js

const prisma = require("../../config/db"); // Hamara single Prisma 7 client instance
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "amity";

/**
 * Business Logic for User Registration
 */
const registerUser = async (userData) => {
  const { name, email, password } = userData;

  // 1. Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: email },
  });

  if (existingUser) {
    // Ek meaningful custom error throw karenge jo controller catch karega
    const error = new Error("Email is already registered!");
    error.statusCode = 400;
    throw error;
  }

  // 2. Encrypt/Hash the password (Security: Never store plain text passwords!)
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  // 3. Save to database using Prisma
  const newUser = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  // Security: Return karne se pehle password ko hide kar do
  delete newUser.password;
  return newUser;
};

/**
 * Business Logic for User Login & Token Generation
 */
const loginUser = async (loginData) => {
  const { email, password } = loginData;

  // 1. Find user by email
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    const error = new Error("Invalid Email or Password!");
    error.statusCode = 401;
    throw error;
  }

  // 2. Compare incoming password with hashed password in database
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    const error = new Error("Invalid Email or Password!");
    error.statusCode = 401;
    throw error;
  }

  // 3. Generate JWT Token (Identity Proof)
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "1d" }, // Token 1 din me expire ho jayega
  );

  delete user.password;
  return { user, token };
};

module.exports = {
  registerUser,
  loginUser,
};
