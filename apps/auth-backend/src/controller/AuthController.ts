import { Request, Response } from "express";
import { ILike } from "typeorm";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { Tenant } from "@/entity/Tenant";
import * as bcrypt from "bcryptjs";
import { generateToken } from "@acentra/auth-utils";
import { UserRole, AuthResponse, LoginRequest, RegisterRequest } from "@acentra/shared-types";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@acentra/logger";

export class AuthController {
  /**
   * Register a new user
   * POST /auth/register
   */
  static async register(req: Request<Record<string, never>, object, RegisterRequest>, res: Response) {
    const { email, password, name, role, job_title, employee_number, manager_id, address, custom_fields } = req.body;
    const tenantName = req.headers['x-tenant-id'] as string | undefined;

    let finalPassword = password;
    let isGenerated = false;

    if (!finalPassword) {
      // Generate random password if not provided
      finalPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + "!";
      isGenerated = true;
    }

    /* 
    if (!email) {
       // Only email is strictly required now, pass logic above can be simplified
    }
    */
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const tenantRepository = AppDataSource.getRepository(Tenant);

    let tenantId = undefined;

    if (tenantName) {
      const tenant = await tenantRepository.findOne({ where: { name: ILike(tenantName) } });
      if (tenant) {
        tenantId = tenant.id;
      }
    }

    // Check if user already exists
    const whereClause: any = { email };
    if (tenantId) {
      whereClause.tenantId = tenantId;
    }

    const existingUser = await userRepository.findOne({ where: whereClause });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists"
      });
    }

    // Check if employee number is already taken in this tenant
    if (employee_number && tenantId) {
      const existingEmployee = await userRepository.findOne({ 
        where: { employee_number, tenantId } 
      });
      if (existingEmployee) {
        return res.status(409).json({
          success: false,
          message: "Employee number already exists in this tenant"
        });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(finalPassword, 10);

    // Create new user
    const user = new User();
    user.id = uuidv4(); // Generate UUID for the user
    user.email = email;
    user.password_hash = hashedPassword;
    user.role = role || UserRole.HIRING_MANAGER;
    if (name) user.name = name;
    if (job_title) user.job_title = job_title;
    if (employee_number) user.employee_number = employee_number;
    if (manager_id) user.manager_id = manager_id;
    if (address) user.address = address;
    if (custom_fields) user.custom_fields = custom_fields;
    
    if (tenantId) {
      user.tenantId = tenantId;
    }

    try {
      await userRepository.save(user);
      
      const responseData: any = {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name,
          job_title: user.job_title,
          employee_number: user.employee_number
      };

      if (isGenerated) {
        responseData.generatedPassword = finalPassword;
      }

      return res.status(201).json({ 
        success: true,
        message: "User created successfully",
        data: responseData
      });
    } catch (error) {
      logger.error("Error creating user:", error);
      return res.status(500).json({ 
        success: false,
        message: "Error creating user" 
      });
    }
  }

  /**
   * Login user
   * POST /auth/login
   */
  static async login(req: Request<Record<string, never>, object, LoginRequest>, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const tenantRepository = AppDataSource.getRepository(Tenant);
    const tenantName = req.headers["x-tenant-id"] as string | undefined;

    let tenantId = undefined;

    if (tenantName) {
      const tenant = await tenantRepository.findOne({ where: { name: ILike(tenantName) } });
      if (tenant) {
        tenantId = tenant.id;
      }
    }

    if (tenantName && !tenantId) {
      return res.status(400).json({
        success: false,
        message: "Tenant not found",
      });
    }

    const whereClause: any = { email, tenantId };
    const user = await userRepository.findOne({ where: whereClause });

    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    if (!user.is_active) {
      return res.status(403).json({ 
        success: false,
        message: "Account is inactive" 
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    // Generate JWT token
    const token = generateToken(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || "secret",
      "24h"
    );

    const response: AuthResponse = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || "",
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
        profile_picture: user.profile_picture,
        department: user.department,
        office_location: user.office_location,
        preferences: user.preferences || {}
      },
      token
    };

    return res.json({ 
      success: true,
      data: response 
    });
  }

  /**
   * Verify token
   * POST /auth/verify
   */
  static async verify(req: Request, res: Response) {
    // Token is already verified by authMiddleware
    // Just return the user info from the token
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid token" 
      });
    }

    return res.json({ 
      success: true,
      data: { valid: true, user } 
    });
  }

  /**
   * Get current user
   * GET /auth/me
   */
  static async me(req: Request, res: Response) {
    const tokenUser = req.user;
    
    if (!tokenUser) {
      return res.status(401).json({ 
        success: false,
        message: "Not authenticated" 
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: tokenUser.userId } });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    return res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        profile_picture: user.profile_picture,
        department: user.department,
        office_location: user.office_location,
        is_active: user.is_active,
        created_at: user.created_at,
        updated_at: user.updated_at,
        preferences: user.preferences || {}
      }
    });
  }

  /**
   * Refresh token
   * POST /auth/refresh
   */
  static async refresh(req: Request, res: Response) {
    const tokenUser = req.user;
    
    if (!tokenUser) {
      return res.status(401).json({ 
        success: false,
        message: "Not authenticated" 
      });
    }

    // Generate new token
    const token = generateToken(
      { 
        userId: tokenUser.userId, 
        email: tokenUser.email, 
        role: tokenUser.role 
      },
      process.env.JWT_SECRET || "secret",
      "24h"
    );

    return res.json({ 
      success: true,
      data: { token } 
    });
  }

  /**
   * Validate tenant existence
   * GET /auth/tenant/:slug
   */
  static async validateTenant(req: Request, res: Response) {
    const { slug } = req.params;

    if (!slug) {
      return res.status(400).json({
        success: false,
        message: "Tenant slug is required"
      });
    }

    try {
      const tenantRepository = AppDataSource.getRepository(Tenant);
      const tenant = await tenantRepository.findOne({ 
        where: { name: ILike(slug) } 
      });

      return res.json({
        success: true,
        exists: !!tenant,
        tenantId: tenant?.id
      });
    } catch (error) {
      logger.error("Error validating tenant:", error);
      return res.status(500).json({
        success: false,
        message: "Error validating tenant"
      });
    }
  }

  /**
   * Logout user
   * POST /auth/logout
   */
  static async logout(req: Request, res: Response) {
    // In a stateless JWT setup, the server doesn't need to do much.
    // If we had a token blacklist (e.g. Redis), we would add the token there.
    // For now, we just return success and let the client handle token removal.
    
    return res.json({
      success: true,
      message: "Logged out successfully"
    });
  }

  /**
   * Change password for logged in user
   * POST /auth/change-password
   */
  static async changePassword(req: Request, res: Response) {
    const { oldPassword, newPassword } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ success: false, message: "Old and new passwords are required" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password_hash);
    if (!isPasswordValid) {
      return res.status(400).json({ success: false, message: "Invalid old password" });
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await userRepository.save(user);

    return res.json({ success: true, message: "Password changed successfully" });
  }

  /**
   * Admin reset user password
   * POST /users/:id/reset-password
   */
  static async adminResetPassword(req: Request, res: Response) {
    const { id } = req.params;
    const { password } = req.body; // Admin can provide a password, or we generate one

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: id as string } }); // Admin is cross-tenant capable usually, or we check tenant

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Improve: Check if admin belongs to same tenant if not super admin. 
    // Assuming auth middleware + admin role check handles basic security, but multi-tenancy might require tenantId check.
    // req.tenantId is usually set by auth middleware if present in token/header.
    // For safety, let's enforce tenant check if req.tenantId is present.
    // (Wait, adminResetPassword is mostly used by tenant admins).
    if (req.tenantId && user.tenantId !== req.tenantId) {
         return res.status(404).json({ success: false, message: "User not found in this tenant" });
    }


    let newPassword = password;
    if (!newPassword) {
      // Generate random password
      newPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8).toUpperCase() + "!";
    }

    user.password_hash = await bcrypt.hash(newPassword, 10);
    await userRepository.save(user);

    return res.json({ 
      success: true, 
      message: "Password reset successfully",
      data: { password: newPassword } // Return the password so admin can see it
    });
  }
}
