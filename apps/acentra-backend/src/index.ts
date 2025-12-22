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
import * as bcrypt from "bcryptjs";

const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-tenant-id", "x-api-key"],
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use("/uploads", express.static("uploads"));

logger.info("Registering routes...");

import { tenantMiddleware } from "./middleware/tenantMiddleware";
import { apiKeyAuthMiddleware } from "./middleware/apiKeyAuth";

app.use("/api", apiKeyAuthMiddleware, tenantMiddleware, routes);
logger.info("Routes registered.");

const PORT = process.env.PORT || 3000;

// Health check endpoint for ALB
app.get("/health", (req: Request, res: Response) => {
  res
    .status(200)
    .json({ status: "healthy", timestamp: new Date().toISOString() });
});

app.get("/", (req: Request, res: Response) => {
  res.send("Shortlist API is running");
});

import { Tenant } from "./entity/Tenant";
import { randomUUID } from "crypto";
import { ILike } from "typeorm";
import { User } from "./entity/User";
import { UserRole } from "@acentra/shared-types";

AppDataSource.initialize()
  .then(async () => {
    try {
      logger.info("Starting admin user seeding...");

      const tenantsToCreate = ["demo", "swivel"];
      const adminEmail = "admin@acentra.com";
      const adminPassword = "Ok4Me2bhr!"; //@todo: Move this to env

      const tenantRepo = AppDataSource.getRepository(Tenant);
      const userRepo = AppDataSource.getRepository(User);

      for (const tenantName of tenantsToCreate) {
        let tenant = await tenantRepo.findOne({
          where: { name: ILike(tenantName) },
        });

        if (!tenant) {
          logger.info(`Tenant '${tenantName}' not found. Creating...`);
          tenant = tenantRepo.create({
            name: tenantName,
            isActive: true,
          });
          await tenantRepo.save(tenant);
          logger.info(`Created tenant '${tenantName}' with ID: ${tenant.id}`);
        } else {
          logger.info(
            `Tenant '${tenantName}' already exists with ID: ${tenant.id}`
          );
        }

        // Check for admin user
        let user = await userRepo.findOne({
          where: { email: adminEmail, tenantId: tenant.id },
        });

        const hashedPassword = await bcrypt.hash(adminPassword, 10);

        if (!user) {
          logger.info(
            `Admin user '${adminEmail}' not found in '${tenantName}'. Creating...`
          );
          user = userRepo.create({
            id: randomUUID(),
            email: adminEmail,
            tenantId: tenant.id,
            password_hash: hashedPassword,
            role: UserRole.ADMIN,
            name: "Admin User",
            is_active: true,
          });
          await userRepo.save(user);
          logger.info(`Created admin user '${adminEmail}' in '${tenantName}'.`);
        } else {
          logger.info(
            `Admin user '${adminEmail}' already exists in '${tenantName}'. Updating password...`
          );
          user.password_hash = hashedPassword;
          user.role = UserRole.ADMIN; // Ensure role is admin
          await userRepo.save(user);
          logger.info(`Updated admin user '${adminEmail}' in '${tenantName}'.`);
        }
      }
      logger.info("Admin user seeding completed.");

      // Log tenants and default users
      const allTenants = await tenantRepo.find();
      const allUsers = await userRepo.find();
      logger.info("Tenants:", allTenants.map(t => ({ id: t.id, name: t.name })));
      logger.info("Default Users:", allUsers.map(u => ({ id: u.id, email: u.email, tenantId: u.tenantId, role: u.role })));
    } catch (error) {
      logger.error("Error seeding users:", error);
      throw error;
    }

    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    logger.error("Error during Data Source initialization", err);
    process.exit(1);
  });
