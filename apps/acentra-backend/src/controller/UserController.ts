import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { User } from "@/entity/User";
import { Tenant } from "@/entity/Tenant";
import { UserDTO } from "@/dto/UserDTO";
import multer from "multer";
import sharp from "sharp";
import { S3FileUploadService } from "@acentra/file-storage";
import { logger } from "@acentra/logger";

// Configure Multer for memory storage (S3 upload)
const storage = multer.memoryStorage();

export const uploadProfilePicture = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

const fileUploadService = new S3FileUploadService();

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
        select: [
          "id",
          "email",
          "role",
          "name",
          "profile_picture",
          "department",
          "office_location",
          "is_active",
          "job_title",
          "employee_number",
          "manager_id",
          "address",
          "custom_fields",
        ], // Don't return passwords
      });
      const userDTOs = users.map((user) => new UserDTO(user));
      return res.json(userDTOs);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching users", error });
    }
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        select: [
          "id",
          "email",
          "role",
          "name",
          "profile_picture",
          "department",
          "office_location",
          "is_active",
          "job_title",
          "employee_number",
          "manager_id",
          "address",
          "created_at",
          "updated_at",
          "custom_fields",
        ],
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const userDTO = new UserDTO(user);
      return res.json(userDTO);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching user", error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    try {
      const result = await userRepository.delete({
        id: id as string,
        tenantId: req.tenantId,
      });
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
      const user = await userRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.role = role;
      await userRepository.save(user);
      const userDTO = new UserDTO(user);
      return res.json(userDTO);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating user role", error });
    }
  }
  static async updateProfile(req: Request, res: Response) {
    const { id } = req.params;
    const { name, department, office_location, profile_picture, job_title, employee_number, manager_id, address, custom_fields } = req.body;
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if employee number is already taken in this tenant (if being changed)
      if (employee_number && employee_number !== user.employee_number) {
        const existingEmployee = await userRepository.findOne({ 
          where: { employee_number, tenantId: req.tenantId } 
        });
        if (existingEmployee) {
          return res.status(409).json({
            message: "Employee number already exists in this tenant"
          });
        }
      }

      if (name) user.name = name;
      if (department) user.department = department;
      if (office_location) user.office_location = office_location;
      if (profile_picture) user.profile_picture = profile_picture;
      if (job_title) user.job_title = job_title;
      if (employee_number) user.employee_number = employee_number;
      if (manager_id) user.manager_id = manager_id;
      if (address) user.address = address;
      if (custom_fields) user.custom_fields = custom_fields;

      await userRepository.save(user);
      const userDTO = new UserDTO(user);
      return res.json(userDTO);
    } catch (error) {
      return res.status(500).json({ message: "Error updating profile", error });
    }
  }

  static async toggleActive(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      user.is_active = !user.is_active;
      await userRepository.save(user);
      const userDTO = new UserDTO(user);
      return res.json(userDTO);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error toggling active status", error });
    }
  }

  static async getPreferences(req: Request, res: Response) {
    const { id } = req.params;
    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        select: ["id", "preferences"],
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.json({ preferences: user.preferences || {} });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching preferences", error });
    }
  }

  static async updatePreferences(req: Request, res: Response) {
    const { id } = req.params;
    const { preferences } = req.body;

    const userRepository = AppDataSource.getRepository(User);
    try {
      const user = await userRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.preferences = { ...user.preferences, ...preferences };
      await userRepository.save(user);

      return res.json({ preferences: user.preferences });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error updating preferences", error });
    }
  }

  static async uploadProfilePictureHandler(req: Request, res: Response) {
    const { id } = req.params;
    const file = req.file;
    const tenantId = req.tenantId || (req.headers["x-tenant-id"] as string);

    if (!file) {
      return res
        .status(400)
        .json({ message: "Profile picture file is required" });
    }

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const tenantRepository = AppDataSource.getRepository(Tenant);

    try {
      const user = await userRepository.findOne({
        where: { id: id as string, tenantId: tenantId },
      });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const tenant = await tenantRepository.findOne({
        where: { id: tenantId },
      });

      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      
      const tenantName = tenant.name;

      // Optimize image using sharp
      const optimizedBuffer = await sharp(file.buffer)
        .resize(256, 256, { fit: "cover" })
        .jpeg({ quality: 80 })
        .toBuffer();

      // Upload to S3
      // Path: tenants/{tenantName}/users/{userId}-profile.jpg
      const s3Path = `tenants/${tenantName}/users/${id}-profile.jpg`;

      // Use the generic upload service
      await fileUploadService.upload(
        {
          file: optimizedBuffer,
          contentType: "image/jpeg",
          contentLength: optimizedBuffer.length,
        },
        s3Path
      );

      // Update user with relative path to API endpoint
      // We keep using tenantId in the API URL for stability/lookup, 
      // but internally we map to the name-based S3 path.
      const apiPath = `public/${tenantId}/users/${id}/profile-picture`;
      user.profile_picture = apiPath;
      await userRepository.save(user);

      return res.json({
        message: "Profile picture uploaded successfully",
        user: new UserDTO(user),
        url: apiPath,
      });
    } catch (error) {
      logger.error("Profile upload error:", error);
      return res
        .status(500)
        .json({ message: "Error uploading profile picture", error });
    }
  }



  static async getPublicProfilePicture(req: Request, res: Response) {
    const { tenantId, id } = req.params;

    if (!tenantId || !id) {
      return res
        .status(400)
        .json({ message: "Tenant ID and User ID are required" });
    }

    try {
      const tenantRepository = AppDataSource.getRepository(Tenant);
      const tenant = await tenantRepository.findOne({ where: { id: tenantId } });
      
      if (!tenant) {
          return res.status(404).json({ message: "Tenant not found" });
      }

      const s3Path = `tenants/${tenant.name}/users/${id}-profile.jpg`;

      // Pipe the S3 stream to the response
      const fileStream = await fileUploadService.getFileStream(s3Path);

      res.setHeader("Content-Type", "image/jpeg");
      res.setHeader("Cache-Control", "public, max-age=3600");

      (fileStream as any).pipe(res);
    } catch (error) {
      logger.error("Error fetching public profile picture:", error);
      return res
        .status(404)
        .json({ message: "Profile picture not found or access denied" });
    }
  }
}
