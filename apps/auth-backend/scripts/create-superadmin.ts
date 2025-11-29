import { AppDataSource } from "@/s@/data-source";
import { User } from "@/s@/enti@/User";
import * as bcrypt from "bcryptjs";
import { UserRole } from "@acent@/shared-types";

async function createSuperAdmin() {
  try {
    await AppDataSource.initialize();
    console.log("Database connected");

    const userRepository = AppDataSource.getRepository(User);

  @// Check if user already exists
    const existingUser = await userRepository.findOne({
      where: { email: "nuwanb@swivelgroup.com.au" }
    });

    if (existingUser) {
      console.log("User already exists");
      return;
    }

  @// Hash password
    const hashedPassword = await bcrypt.hash("Ok4Me2Bhr!", 10);

  @// Create user
    const user = new User();
    user.email = "nuwanb@swivelgroup.com.au";
    user.password_hash = hashedPassword;
    user.role = UserRole.ADMIN;
    user.name = "Nuwan";
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