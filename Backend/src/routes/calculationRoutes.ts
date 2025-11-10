import { Router } from 'express';
import {
  createStartingNumber,
  addOperation,
  getAllCalculations,
  getCalculationById
} from '../controllers/calculationController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', getAllCalculations);
router.get('/:id', getCalculationById);

// Protected routes
router.post('/starting-number', authenticate, createStartingNumber);
router.post('/operation', authenticate, addOperation);

export default router;

