import { AppDataSource } from "../src/data-source";
import { logger } from "@acentra/logger";
import { User } from "../src/entity/User";
import { Tenant } from "../src/entity/Tenant";
import * as bcrypt from "bcryptjs";
import { UserRole } from "@acentra/shared-types";
import { v4 as uuidv4 } from "uuid";

async function createSuperAdmin() {
  try {
    await AppDataSource.initialize();
    logger.info("Database connected");

    const userRepository = AppDataSource.getRepository(User);
    const tenantRepository = AppDataSource.getRepository(Tenant);

    // Check or create a default tenant for superadmin
    let tenant = await tenantRepository.findOne({ where: { name: "acentra" } });
    logger.info('TENANT FOUND', tenant);

    if (!tenant) {
      tenant = new Tenant();
      tenant.id = uuidv4();
      tenant.name = "acentra";
      tenant.isActive = true;
      await tenantRepository.save(tenant);
    }

    // Check if user already exists for this tenant
    const existingUser = await userRepository.findOne({
      where: { email: "superadmin@acentra.com", tenantId: tenant.id }
    });

    if (existingUser) {
      logger.info("User already exists");
      return;
    }

  // Hash password
    const hashedPassword = await bcrypt.hash("Ok4Me2bhr!", 10);

  // Create user
  const user = new User();
  user.id = uuidv4(); // Generate UUID for the user
  user.email = "superadmin@acentra.com";
  user.password_hash = hashedPassword;
  user.role = UserRole.ADMIN;
  user.name = "Super Admin";
  user.is_active = true;
  user.tenantId = tenant.id;

    await userRepository.save(user);
    logger.info("Super admin user created successfully");

  } catch (error) {
    logger.error("Error creating super admin:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

createSuperAdmin();