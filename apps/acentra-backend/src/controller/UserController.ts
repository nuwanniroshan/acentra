import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";

// Configure Multer for user profile picture upload
const profilePictureStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Extract tenantId from request headers
    const tenantId = req.headers["x-tenant-id"] as string;

    if (!tenantId) {
      return cb(new Error("Tenant ID is required for file upload"), "");
    }

    // Create tenant-specific upload directory
    const uploadDir = path.join("uploads", tenantId, "users");

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Use user ID as filename since we compress to JPG
    const userId = req.params.id;
    cb(null, `${userId}.jpg`);
  },
});

export const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export class UserController {
  static async list(req: Request, res: Response) {
    const userRepository = AppDataSource.getRepository(User);
    try {
      const where: any = { tenantId: req.tenantId };
      if (req.query.role) {
        where.role = req.query.role;
      }
      const users = await userRepository.find({
        where,
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
        // Try to find by email if userEmail is available
        if (userEmail) {
          user = await userRepository.findOne({
            where: { email: userEmail, tenantId: req.tenantId },
            select: ["id", "preferences"]
          });
        }
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
        // Try to find by email if userEmail is available
        if (userEmail) {
          user = await userRepository.findOne({
            where: { email: userEmail, tenantId: req.tenantId }
          });
        }
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
      }

      user.preferences = { ...user.preferences, ...preferences };
      await userRepository.save(user);

      return res.json({ preferences: user.preferences });
    } catch (error) {
      return res.status(500).json({ message: "Error updating preferences", error });
    }
  }

  static async uploadProfilePicture(req: Request, res: Response) {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "Profile picture file is required" });
    }

    const userRepository = AppDataSource.getRepository(User);

    try {
      const user = await userRepository.findOne({ where: { id: id as string, tenantId: req.tenantId } });
      if (!user) {
        // Delete uploaded file
        fs.unlinkSync(file.path);
        return res.status(404).json({ message: "User not found" });
      }

      // Compress profile picture
      const userId = req.params.id;
      let compressedProfilePicturePath = path.join("uploads", req.tenantId, "users", `${userId}.jpg`);

      try {
        await sharp(file.path)
          .resize(128, 128, { fit: 'cover' })
          .jpeg({ quality: 80 })
          .toFile(compressedProfilePicturePath);

        // Delete original file
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error("Failed to compress profile picture:", err);
        // If compression fails, keep the original file but rename it
        compressedProfilePicturePath = file.path;
      }

      // Delete old profile picture if exists
      if (user.profile_picture && fs.existsSync(user.profile_picture)) {
        try {
          fs.unlinkSync(user.profile_picture);
        } catch (err) {
          console.error("Failed to delete old profile picture:", err);
        }
      }

      // Update user with new profile picture path
      user.profile_picture = compressedProfilePicturePath;
      await userRepository.save(user);

      return res.json({ message: "Profile picture uploaded successfully", user });
    } catch (error) {
      // Delete uploaded file on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
      return res.status(500).json({ message: "Error uploading profile picture", error });
    }
  }

  static async getProfilePicture(req: Request, res: Response) {
    const { id } = req.params;

    // Construct the expected file path: uploads/{tenantId}/users/{userId}.jpg
    const filePath = path.resolve("uploads", req.tenantId, "users", `${id}.jpg`);

    try {
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ message: "Profile picture not found" });
      }

      // Set aggressive caching headers for faster subsequent loads
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Content-Type', 'image/jpeg');

      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).json({ message: "Error sending file" });
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching profile picture", error });
    }
  }
}
