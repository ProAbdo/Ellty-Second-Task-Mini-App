import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import sequelize from "./config/database";
import logger from "./config/logger";
import authRoutes from "./routes/authRoutes";
import calculationRoutes from "./routes/calculationRoutes";
import { errorHandler } from "./middleware/errorHandler";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/calculations", calculationRoutes);

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

// Database connection and server startup
async function startServer() {
  try {
    await sequelize.authenticate();
    logger.info("Database connection established");

    // Sync models (in development, use migrations in production)
    if (process.env.NODE_ENV === "development") {
      await sequelize.sync({ alter: false });
      logger.info("Database models synchronized");
    }

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
      logger.info(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    logger.error("Unable to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
