import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import * as bcrypt from "bcryptjs";
import { UserRole } from "@acentra/shared-types";

async function createSuperAdmin() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    const userRepository = AppDataSource.getRepository(User);

    // Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: "superadmin@acentra.com" }
    });

    if (existingUser) {
      console.log("Super admin user already exists");
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash("Ok4Me2bhr!", 10);

    // Create super admin user
    const user = new User();
    user.email = "superadmin@acentra.com";
    user.password_hash = hashedPassword;
    user.role = UserRole.ADMIN;
    user.name = "Super Admin";
    user.is_active = true;

    await userRepository.save(user);
    console.log("Super admin user created successfully");

  } catch (error) {
    console.error("Error creating super admin:", error);
  } finally {
    await AppDataSource.destroy();
  }
}

createSuperAdmin();