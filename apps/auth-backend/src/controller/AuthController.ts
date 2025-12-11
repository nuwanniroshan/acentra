import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { Tenant } from "@/entity/Tenant";
import * as bcrypt from "bcryptjs";
import { generateToken } from "@acentra/auth-utils";
import { UserRole, AuthResponse, LoginRequest, RegisterRequest } from "@acentra/shared-types";
import { v4 as uuidv4 } from "uuid";

export class AuthController {
  /**
   * Register a new user
   * POST /auth/register
   */
  static async register(req: Request<{}, {}, RegisterRequest>, res: Response) {
    const { email, password, name, role } = req.body;
    const tenantName = req.headers['x-tenant-id'] as string | undefined;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const userRepository = AppDataSource.getRepository(User);
    const tenantRepository = AppDataSource.getRepository(Tenant);

    let tenantId = undefined;

    if (tenantName) {
      const tenant = await tenantRepository.findOne({ where: { name: tenantName } });
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

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User();
    user.id = uuidv4(); // Generate UUID for the user
    user.email = email;
    user.password_hash = hashedPassword;
    user.role = role || UserRole.ENGINEERING_MANAGER;
    if (name) user.name = name;
    if (tenantId) {
      user.tenantId = tenantId;
    }

    try {
      await userRepository.save(user);
      
      return res.status(201).json({ 
        success: true,
        message: "User created successfully",
        data: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        }
      });
    } catch (error) {
      console.error("Error creating user:", error);
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
  static async login(req: Request<{}, {}, LoginRequest>, res: Response) {
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
      const tenant = await tenantRepository.findOne({ where: { name: tenantName } });
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
}
