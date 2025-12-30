import "reflect-metadata";
import express from "express";
import cors from "cors";
import * as dotenv from "dotenv";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import path from "path";
import { logger } from "@acentra/logger";
import { seedAdminUsers } from "./scripts/seed-admin-users";

// Load environment variables from the correct location
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-tenant-id', 'Cache-Control', 'Pragma', 'Expires']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api", routes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "auth-backend" });
});

// Initialize database and start server
AppDataSource.initialize()
  .then(async () => {
    logger.info("✅ Database connected successfully");
    
    // Seed admin users
    try {
      await seedAdminUsers();
      logger.info("✅ Admin users seeded successfully");
    } catch (err) {
      logger.error("❌ Failed to seed admin users:", err);
    }

    app.listen(PORT, () => {
      logger.info(`🚀 Auth backend server running on port ${PORT}`);
      logger.info(`📍 Health check: http://localhost:${PORT}/health`);
      logger.info(`📍 API endpoints: http://localhost:${PORT}/api`);
    });
  })
  .catch((error) => {
    logger.error("❌ Error connecting to database:", error);
    logger.error("❌ Full error details:", error);
    process.exit(1);
  });

export default app;
