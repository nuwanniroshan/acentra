import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { UserRole } from "@acentra/shared-types";
import { logger } from "@acentra/logger";

export class UserController {
  /**
   * List all users
   * GET /users
   */
  static async list(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(User);
    
    try {
      const users = await userRepository.find({
        select: ["id", "email", "role", "name", "profile_picture", "department", "office_location", "is_active", "created_at", "updated_at", "preferences"]
      });

      return res.json({ 
        success: true,
        data: users 
      });
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ 
        success: false,
        message: "Error fetching users" 
      });
    }
  }

  /**
   * Delete a user (admin only)
   * DELETE /users/:id
   */
  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { id } });
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }

      await userRepository.remove(user);

      return res.json({ 
        success: true,
        message: "User deleted successfully" 
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ 
        success: false,
        message: "Error deleting user" 
      });
    }
  }

  /**
   * Update user role (admin only)
   * PATCH /users/:id/role
   */
  static async updateRole(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !Object.values(UserRole).includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: "Invalid role" 
      });
    }

    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { id } });
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }

      user.role = role;
      await userRepository.save(user);

      return res.json({ 
        success: true,
        message: "User role updated successfully",
        data: user 
      });
    } catch (error) {
      console.error("Error updating user role:", error);
      return res.status(500).json({ 
        success: false,
        message: "Error updating user role" 
      });
    }
  }

  /**
   * Toggle user active status (admin only)
   * PATCH /users/:id/toggle-active
   */
  static async toggleActive(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { id } });
      
      if (!user) {
        return res.status(404).json({ 
          success: false,
          message: "User not found" 
        });
      }

      user.is_active = !user.is_active;
      await userRepository.save(user);

      return res.json({ 
        success: true,
        message: `User ${user.is_active ? 'activated' : 'deactivated'} successfully`,
        data: user 
      });
    } catch (error) {
      console.error("Error toggling user status:", error);
      return res.status(500).json({ 
        success: false,
        message: "Error toggling user status" 
      });
    }
  }
}
