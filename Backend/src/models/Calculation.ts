import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import User from "./User";

export enum OperationType {
  ADD = "add",
  SUBTRACT = "subtract",
  MULTIPLY = "multiply",
  DIVIDE = "divide",
}

interface CalculationAttributes {
  id: number;
  userId: number;
  parentId: number | null;
  startingNumber: number | null;
  operationType: OperationType | null;
  rightOperand: number | null;
  result: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CalculationCreationAttributes
  extends Optional<CalculationAttributes, "id" | "createdAt" | "updatedAt"> {}

class Calculation
  extends Model<CalculationAttributes, CalculationCreationAttributes>
  implements CalculationAttributes
{
  public id!: number;
  public userId!: number;
  public parentId!: number | null;
  public startingNumber!: number | null;
  public operationType!: OperationType | null;
  public rightOperand!: number | null;
  public result!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Calculation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "calculations",
        key: "id",
      },
    },
    startingNumber: {
      type: DataTypes.DECIMAL(20, 10),
      allowNull: true,
    },
    operationType: {
      type: DataTypes.ENUM(...Object.values(OperationType)),
      allowNull: true,
    },
    rightOperand: {
      type: DataTypes.DECIMAL(20, 10),
      allowNull: true,
    },
    result: {
      type: DataTypes.DECIMAL(20, 10),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "calculations",
    hooks: {
      beforeValidate: (calculation: Calculation) => {
        if (calculation.parentId === null) {
          // Starting number calculation
          if (calculation.startingNumber === null) {
            throw new Error(
              "Starting number is required for root calculations"
            );
          }
          calculation.result = calculation.startingNumber;
        } else {
          // Operation calculation
          if (
            calculation.operationType === null ||
            calculation.rightOperand === null
          ) {
            throw new Error(
              "Operation type and right operand are required for operation calculations"
            );
          }
        }
      },
      beforeSave: async (calculation: Calculation) => {
        if (calculation.parentId !== null) {
          // Calculate result based on parent
          const parent = await Calculation.findByPk(calculation.parentId);
          if (!parent) {
            throw new Error("Parent calculation not found");
          }

          const leftValue = parseFloat(parent.result.toString());
          const rightValue = parseFloat(calculation.rightOperand!.toString());

          switch (calculation.operationType) {
            case OperationType.ADD:
              calculation.result = leftValue + rightValue;
              break;
            case OperationType.SUBTRACT:
              calculation.result = leftValue - rightValue;
              break;
            case OperationType.MULTIPLY:
              calculation.result = leftValue * rightValue;
              break;
            case OperationType.DIVIDE:
              if (rightValue === 0) {
                throw new Error("Division by zero is not allowed");
              }
              calculation.result = leftValue / rightValue;
              break;
            default:
              throw new Error("Invalid operation type");
          }
        }
      },
    },
  }
);

// Define associations
Calculation.belongsTo(User, { foreignKey: "userId", as: "user" });
Calculation.belongsTo(Calculation, { foreignKey: "parentId", as: "parent" });
Calculation.hasMany(Calculation, { foreignKey: "parentId", as: "children" });

export default Calculation;
