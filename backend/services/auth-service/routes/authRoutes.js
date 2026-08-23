const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const loginLimiter = require("../middleware/authRateLimiter");

const {
  validateRegister,
  validateLogin,
} = require("../middleware/authValidation");

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User registration, login and profile APIs
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *                 example: User A
 *
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usera@example.com
 *
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: Password@123
 *
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 *       400:
 *         description: Validation failed or user already exists
 */
router.post(
  "/register",
  validateRegister,
  authController.register
);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     description: Authenticates a user and returns a JWT token.
 *     tags:
 *       - Authentication
 *
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: usera@example.com
 *
 *               password:
 *                 type: string
 *                 example: Password@123
 *
 *     responses:
 *       200:
 *         description: Login successful
 *
 *       400:
 *         description: Validation failed
 *
 *       401:
 *         description: Invalid email or password
 *
 *       429:
 *         description: Too many login attempts
 */
router.post(
  "/login",
  validateLogin,
  loginLimiter,
  authController.login
);

/**
 * @swagger
 * /api/auth/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     description: Returns information about the currently authenticated user.
 *     tags:
 *       - Authentication
 *     security:
 *       - bearerAuth: []
 *
 *     responses:
 *       200:
 *         description: Profile fetched successfully
 *
 *       401:
 *         description: Authorization token is missing, invalid or expired
 */
router.get(
  "/profile",
  authMiddleware,
  authController.getProfile
);

module.exports = router;