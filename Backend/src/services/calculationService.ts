import Calculation, { OperationType } from '../models/Calculation';
import User from '../models/User';
import logger from '../config/logger';

export interface CalculationTree {
  id: number;
  userId: number;
  username: string;
  startingNumber: number | null;
  operationType: OperationType | null;
  rightOperand: number | null;
  result: number;
  createdAt: Date;
  children: CalculationTree[];
}

class CalculationService {
  async createStartingNumber(userId: number, startingNumber: number): Promise<Calculation> {
    try {
      const calculation = await Calculation.create({
        userId,
        parentId: null,
        startingNumber,
        operationType: null,
        rightOperand: null,
        result: startingNumber
      });

      return calculation;
    } catch (error) {
      logger.error('Error creating starting number:', error);
      throw error;
    }
  }

  async addOperation(
    userId: number,
    parentId: number,
    operationType: OperationType,
    rightOperand: number
  ): Promise<Calculation> {
    try {
      const parent = await Calculation.findByPk(parentId);
      if (!parent) {
        throw new Error('Parent calculation not found');
      }

      const calculation = await Calculation.create({
        userId,
        parentId,
        startingNumber: null,
        operationType,
        rightOperand,
        result: 0 // Will be calculated in beforeSave hook
      });

      return calculation;
    } catch (error) {
      logger.error('Error adding operation:', error);
      throw error;
    }
  }

  async getAllCalculations(): Promise<CalculationTree[]> {
    try {
      const rootCalculations = await Calculation.findAll({
        where: { parentId: null },
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }
        ],
        order: [['createdAt', 'DESC']]
      });

      const trees: CalculationTree[] = [];

      for (const root of rootCalculations) {
        const tree = await this.buildTree(root.id);
        trees.push(tree);
      }

      return trees;
    } catch (error) {
      logger.error('Error getting all calculations:', error);
      throw error;
    }
  }

  async getCalculationById(id: number): Promise<CalculationTree | null> {
    try {
      const calculation = await Calculation.findByPk(id, {
        include: [
          {
            model: User,
            as: 'user',
            attributes: ['id', 'username']
          }
        ]
      });

      if (!calculation) {
        return null;
      }

      // Find root calculation
      let rootId = id;
      let current: Calculation | null = calculation;
      while (current && current.parentId) {
        rootId = current.parentId;
        current = await Calculation.findByPk(rootId);
        if (!current) break;
      }

      return this.buildTree(rootId);
    } catch (error) {
      logger.error('Error getting calculation by id:', error);
      throw error;
    }
  }

  private async buildTree(rootId: number): Promise<CalculationTree> {
    const root = await Calculation.findByPk(rootId, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ]
    });

    if (!root) {
      throw new Error('Root calculation not found');
    }

    const children = await Calculation.findAll({
      where: { parentId: rootId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username']
        }
      ],
      order: [['createdAt', 'ASC']]
    });

    const tree: CalculationTree = {
      id: root.id,
      userId: root.userId,
      username: (root as any).user?.username || 'Unknown',
      startingNumber: root.startingNumber ? parseFloat(root.startingNumber.toString()) : null,
      operationType: root.operationType,
      rightOperand: root.rightOperand ? parseFloat(root.rightOperand.toString()) : null,
      result: parseFloat(root.result.toString()),
      createdAt: root.createdAt,
      children: []
    };

    for (const child of children) {
      const childTree = await this.buildTree(child.id);
      tree.children.push(childTree);
    }

    return tree;
  }
}

export default new CalculationService();

