import { Request, Response } from "express";
import { AuthRequest } from "../middleware/auth";
import calculationService from "../services/calculationService";
import { OperationType } from "../models/Calculation";
import logger from "../config/logger";
import { body, validationResult } from "express-validator";

export const createStartingNumber = [
  body("startingNumber")
    .isNumeric()
    .withMessage("Starting number must be a valid number"),

  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const { startingNumber } = req.body;
      const calculation = await calculationService.createStartingNumber(
        req.user.id,
        parseFloat(startingNumber)
      );

      logger.info(
        `Starting number created: ${calculation.id} by user ${req.user.id}`
      );

      res.status(201).json({
        message: "Starting number created successfully",
        calculation: {
          id: calculation.id,
          startingNumber: parseFloat(
            calculation.startingNumber?.toString() || "0"
          ),
          result: parseFloat(calculation.result.toString()),
          createdAt: calculation.createdAt,
        },
      });
    } catch (error: any) {
      logger.error("Error creating starting number:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to create starting number" });
    }
  },
];

export const addOperation = [
  body("parentId").isInt().withMessage("Parent ID must be a valid integer"),
  body("operationType")
    .isIn(["add", "subtract", "multiply", "divide"])
    .withMessage(
      "Operation type must be one of: add, subtract, multiply, divide"
    ),
  body("rightOperand")
    .isNumeric()
    .withMessage("Right operand must be a valid number"),

  async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: "Authentication required" });
        return;
      }

      const { parentId, operationType, rightOperand } = req.body;

      const calculation = await calculationService.addOperation(
        req.user.id,
        parseInt(parentId),
        operationType as OperationType,
        parseFloat(rightOperand)
      );

      logger.info(`Operation added: ${calculation.id} by user ${req.user.id}`);

      res.status(201).json({
        message: "Operation added successfully",
        calculation: {
          id: calculation.id,
          parentId: calculation.parentId,
          operationType: calculation.operationType,
          rightOperand: parseFloat(calculation.rightOperand?.toString() || "0"),
          result: parseFloat(calculation.result.toString()),
          createdAt: calculation.createdAt,
        },
      });
    } catch (error: any) {
      logger.error("Error adding operation:", error);
      res
        .status(500)
        .json({ error: error.message || "Failed to add operation" });
    }
  },
];

export const getAllCalculations = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const trees = await calculationService.getAllCalculations();
    res.json({ calculations: trees });
  } catch (error: any) {
    logger.error("Error getting all calculations:", error);
    res.status(500).json({ error: "Failed to get calculations" });
  }
};

export const getCalculationById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = req.params.id as string;
    const tree = await calculationService.getCalculationById(parseInt(id));

    if (!tree) {
      res.status(404).json({ error: "Calculation not found" });
      return;
    }

    res.json({ calculation: tree });
  } catch (error: any) {
    logger.error("Error getting calculation by id:", error);
    res.status(500).json({ error: "Failed to get calculation" });
  }
};
