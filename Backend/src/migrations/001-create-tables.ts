import { QueryInterface, DataTypes } from "sequelize";

type IndexField = {
  attribute?: string;
  column?: string;
};

type IndexInfo = {
  fields: IndexField[];
};

async function tableExists(
  queryInterface: QueryInterface,
  tableName: string
): Promise<boolean> {
  const tables = await queryInterface.showAllTables();

  const normalizedTables = tables.map((table) => {
    if (typeof table === "string") {
      return table;
    }

    // Different dialects return either camelCase or snake_case keys
    return (table as { tableName?: string; table_name?: string }).tableName
      ? (table as { tableName: string }).tableName
      : (table as { table_name?: string }).table_name ?? "";
  });

  return normalizedTables
    .filter(Boolean)
    .map((name) => name.toLowerCase())
    .includes(tableName.toLowerCase());
}

async function ensureIndex(
  queryInterface: QueryInterface,
  tableName: string,
  fields: string[]
): Promise<void> {
  const indexes = (await queryInterface.showIndex(tableName)) as IndexInfo[];
  const normalizedFields = fields.join(",");

  const exists = indexes.some((index) => {
    const fieldNames = index.fields
      .map((field) => field.attribute || field.column || "")
      .join(",");
    return fieldNames === normalizedFields;
  });

  if (!exists) {
    await queryInterface.addIndex(tableName, fields);
  }
}

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Ensure users table exists
  if (!(await tableExists(queryInterface, "users"))) {
    await queryInterface.createTable("users", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  }

  // Ensure calculations table exists
  if (!(await tableExists(queryInterface, "calculations"))) {
    await queryInterface.createTable("calculations", {
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
        onDelete: "CASCADE",
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "calculations",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      startingNumber: {
        type: DataTypes.DECIMAL(20, 10),
        allowNull: true,
      },
      operationType: {
        type: DataTypes.ENUM("add", "subtract", "multiply", "divide"),
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
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    });
  }

  // Ensure indexes exist
  await ensureIndex(queryInterface, "calculations", ["parentId"]);
  await ensureIndex(queryInterface, "calculations", ["userId"]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable("calculations");
  await queryInterface.dropTable("users");
}
