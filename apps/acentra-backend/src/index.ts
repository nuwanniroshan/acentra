import "reflect-metadata";
import * as dotenv from "dotenv";
import path from "path";

// Load env vars before other imports
dotenv.config({ path: path.join(__dirname, "../.env") });

import express, { Request, Response } from "express";
import cors from "cors";
import { AppDataSource } from "./data-source";
import routes from "./routes";
import { logger } from "@acentra/logger";

const app = express();

// CORS configuration - allow frontend origins from environment variable
const corsOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['*'];
app.use(cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use("/uploads", express.static("uploads"));

logger.info("Registering routes...");

import { tenantMiddleware } from "./middleware/tenantMiddleware";

app.use("/api", tenantMiddleware, routes);
logger.info("Routes registered.");

const PORT = process.env.PORT || 3000;

// Health check endpoint for ALB
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Shortlist API is running");
});


import { PipelineStatus } from "./entity/PipelineStatus";
import { Tenant } from "./entity/Tenant";

AppDataSource.initialize()
  .then(async () => {
    logger.info("Data Source has been initialized!");

    // Seed default pipeline statuses
    const statusRepo = AppDataSource.getRepository(PipelineStatus);
    const count = await statusRepo.count();
    if (count === 0) {
      logger.info("Seeding default pipeline statuses...");
      const defaults = [
        { value: "new", label: "Applied", order: 0 },
        { value: "shortlisted", label: "Reviewed", order: 1 },
        { value: "interview_scheduled", label: "Mobile Screening", order: 2 },
        { value: "offer", label: "Interview", order: 3 },
        { value: "hired", label: "Hired", order: 4 },
        { value: "rejected", label: "Rejected", order: 5 },
      ];
      
      for (const s of defaults) {
        await statusRepo.save(statusRepo.create(s));
      }
      logger.info("Seeding complete.");
    }

    // Seed default tenant
    const tenantRepo = AppDataSource.getRepository(Tenant);
    const swivelTenant = await tenantRepo.findOne({ where: { name: "swivel" } });
    if (!swivelTenant) {
      logger.info("Seeding default tenant 'swivel'...");
      await tenantRepo.save(tenantRepo.create({ name: "swivel", isActive: true }));
      logger.info("Default tenant seeded.");
    }

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization", err);
    process.exit(1);
  });
