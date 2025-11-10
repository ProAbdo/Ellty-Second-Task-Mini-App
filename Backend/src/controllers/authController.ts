import { Request, Response } from "express";
import User from "../models/User";
import { generateToken } from "../utils/jwt";
import logger from "../config/logger";
import { body, validationResult } from "express-validator";
import { AuthRequest } from "../middleware/auth";

export const register = [
  body("username")
    .isLength({ min: 3, max: 50 })
    .withMessage("Username must be between 3 and 50 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can only contain letters, numbers, and underscores"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),

  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, password } = req.body;

      const existingUser = await User.findOne({ where: { username } });
      if (existingUser) {
        res.status(400).json({ error: "Username already exists" });
        return;
      }

      const user = await User.create({ username, password });
      const token = generateToken(user.id);

      logger.info(`User registered: ${username}`);

      res.status(201).json({
        message: "User created successfully",
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error: any) {
      logger.error("Registration error:", error);
      res.status(500).json({ error: "Failed to create user" });
    }
  },
];

export const login = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),

  async (req: Request, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      const { username, password } = req.body;

      const user = await User.findOne({ where: { username } });
      if (!user) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const isValidPassword = await user.validatePassword(password);
      if (!isValidPassword) {
        res.status(401).json({ error: "Invalid credentials" });
        return;
      }

      const token = generateToken(user.id);

      logger.info(`User logged in: ${username}`);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (error: any) {
      logger.error("Login error:", error);
      res.status(500).json({ error: "Failed to login" });
    }
  },
];

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: "Authentication required" });
      return;
    }

    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
      },
    });
  } catch (error: any) {
    logger.error("Profile fetch error:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
};
