import { AppDataSource } from "../src/data-source";
import { logger } from "@acentra/logger";
import { User } from "../src/entity/User";
import { Tenant } from "../src/entity/Tenant";
import * as bcrypt from "bcryptjs";
import { UserRole } from "@acentra/shared-types";
import { v4 as uuidv4 } from "uuid";

async function createAdminUser() {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected");

    const userRepository = AppDataSource.getRepository(User);
    const tenantRepository = AppDataSource.getRepository(Tenant);

    // Find the tenant
    const tenant = await tenantRepository.findOne({ where: { name: "demo" } });

    if (!tenant) {
      logger.info("Tenant 'demo' does not exist");
      return;
    }

    console.log(`Tenant 'demo' found with ID: ${tenant.id}`);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: "admin@acentra.com", tenantId: tenant.id }
    });

    if (existingUser) {
      logger.info("User already exists, updating password");
      // Hash password
      const hashedPassword = await bcrypt.hash("Ok4Me2bhr!", 10);
      existingUser.password_hash = hashedPassword;
      await userRepository.save(existingUser);
      logger.info("Password updated for existing user");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Ok4Me2bhr!", 10);

    // Create user
    const user = new User();
    user.id = uuidv4();
    user.email = "admin@acentra.com";
    user.password_hash = hashedPassword;
    user.role = UserRole.ADMIN;
    user.name = "Admin";
    user.is_active = true;
    user.tenantId = tenant.id;

    await userRepository.save(user);
    logger.info("Admin user created successfully for demo tenant");

  } catch (error) {
    logger.error("Error creating admin user:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

createAdminUser();