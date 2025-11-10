import sequelize from "../config/database";
import { up } from "./001-create-tables";
import logger from "../config/logger";

async function runMigrations() {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established");

    const queryInterface = sequelize.getQueryInterface();

    logger.info("Running migrations...");
    await up(queryInterface);
    logger.info("Migrations completed successfully");

    await sequelize.close();
  } catch (error) {
    logger.error("Migration error:", error);
    process.exit(1);
  }
}

runMigrations();
