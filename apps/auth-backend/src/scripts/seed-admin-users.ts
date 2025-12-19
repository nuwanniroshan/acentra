
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Tenant } from "../entity/Tenant";
import { UserRole } from "@acentra/shared-types";
import * as bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { logger } from "@acentra/logger";

export const seedAdminUsers = async () => {
    try {
        logger.info("Starting admin user seeding...");
        
        const tenantsToCreate = ["Demo", "Swivel"];
        const adminEmail = "admin@acentra.com";
        const adminPassword = "Ok4Me2bhr!";

        const tenantRepo = AppDataSource.getRepository(Tenant);
        const userRepo = AppDataSource.getRepository(User);

        for (const tenantName of tenantsToCreate) {
            let tenant = await tenantRepo.findOne({ where: { name: tenantName } });

            if (!tenant) {
                logger.info(`Tenant '${tenantName}' not found. Creating...`);
                tenant = tenantRepo.create({
                    name: tenantName,
                    isActive: true
                });
                await tenantRepo.save(tenant);
                logger.info(`Created tenant '${tenantName}' with ID: ${tenant.id}`);
            } else {
                logger.info(`Tenant '${tenantName}' already exists with ID: ${tenant.id}`);
            }

            // Check for admin user
            let user = await userRepo.findOne({ where: { email: adminEmail, tenantId: tenant.id } });

            const hashedPassword = await bcrypt.hash(adminPassword, 10);

            if (!user) {
                logger.info(`Admin user '${adminEmail}' not found in '${tenantName}'. Creating...`);
                user = userRepo.create({
                    id: randomUUID(),
                    email: adminEmail,
                    tenantId: tenant.id,
                    password_hash: hashedPassword,
                    role: UserRole.ADMIN,
                    name: "Admin User",
                    is_active: true
                });
                await userRepo.save(user);
                logger.info(`Created admin user '${adminEmail}' in '${tenantName}'.`);
            } else {
                logger.info(`Admin user '${adminEmail}' already exists in '${tenantName}'. Updating password...`);
                user.password_hash = hashedPassword;
                user.role = UserRole.ADMIN; // Ensure role is admin
                await userRepo.save(user);
                logger.info(`Updated admin user '${adminEmail}' in '${tenantName}'.`);
            }
        }
        logger.info("Admin user seeding completed.");

    } catch (error) {
        logger.error("Error seeding users:", error);
        // We don't exit process here so app can continue if seeding fails, or we could throw. 
        // Throwing is better to alert failure.
        throw error;
    }
};


