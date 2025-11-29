import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

export class UserController {
  static async list(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(User);
    try {
      const users = await userRepository.find({
        where: { tenantId: req.tenantId },
        select: ["id", "email", "role", "name", "profile_picture", "department", "office_location", "is_active"] // Don't return passwords
      });
      return res.json(users);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching users", error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    try {
      const result = await userRepository.delete({ id: id as string, tenantId: req.tenantId });
      if (result.affected === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ message: "Error deleting user", error });
    }
  }

  static async updateRole(req: Request, res: Response) {
    const { id } = req.params;
    const { role } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOne({ where: { id: id as string, tenantId: req.tenantId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.role = role;
      await userRepository.save(user);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Error updating user role", error });
    }
  }
  static async updateProfile(req: Request, res: Response) {
    const { id } = req.params;
    const { name, department, office_location, profile_picture } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOne({ where: { id: id as string, tenantId: req.tenantId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (name) user.name = name;
      if (department) user.department = department;
      if (office_location) user.office_location = office_location;
      if (profile_picture) user.profile_picture = profile_picture;
      await userRepository.save(user);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Error updating profile", error });
    }
  }

  static async toggleActive(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOne({ where: { id: id as string, tenantId: req.tenantId } });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.is_active = !user.is_active;
      await userRepository.save(user);
      return res.json(user);
    } catch (error) {
      return res.status(500).json({ message: "Error toggling active status", error });
    }
  }

  static async getPreferences(req: Request, res: Response) {
    const { id } = req.params;
    const userEmail = (req as any).user?.email;
    const userRepository = AppDataSource.getRepository(User);
    try {
      let user = await userRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        select: ["id", "preferences"]
      });
      
      if (!user) {
        // Create user if not found (lazy creation)
        if (userEmail) {
            user = userRepository.create({
                id: id as string,
                email: userEmail,
                preferences: {},
                tenantId: req.tenantId
            });
            await userRepository.save(user);
        } else {
            return res.status(404).json({ message: "User not found" });
        }
      }
      return res.json({ preferences: user.preferences || {} });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching preferences", error });
    }
  }

  static async updatePreferences(req: Request, res: Response) {
    const { id } = req.params;
    const { preferences } = req.body;
    const userEmail = (req as any).user?.email;
    
    const userRepository = AppDataSource.getRepository(User);
    try {
      let user = await userRepository.findOne({ where: { id: id as string, tenantId: req.tenantId } });
      
      if (!user) {
        if (userEmail) {
             user = userRepository.create({
                 id: id as string,
                 email: userEmail,
                 preferences: {},
                 tenantId: req.tenantId
             });
             // Save the new user first
             await userRepository.save(user);
        } else {
             return res.status(404).json({ message: "User not found" });
        }
      }
      
      user.preferences = { ...user.preferences, ...preferences };
      await userRepository.save(user);
      
      return res.json({ preferences: user.preferences });
    } catch (error) {
      return res.status(500).json({ message: "Error updating preferences", error });
    }
  }
}
