// src/modules/auth/auth.controller.js

const authService = require("./auth.service");

/**
 * Handling Registration HTTP Request
 */
const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Basic Controller Validation (Gatekeeper)
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields: name, email, password",
      });
    }

    // Service layer ko call karna
    const user = await authService.registerUser({ name, email, password });

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error) {
    // Agar service ne koi error throw ki, toh use catch karke status code apply karo
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

/**
 * Handling Login HTTP Request
 */
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Service se data mangwana
    const result = await authService.loginUser({ email, password });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token: result.token,
      user: result.user,
    });
  } catch (error) {
    const status = error.statusCode || 500;
    return res.status(status).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

module.exports = {
  register,
  login,
};
