import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { UserRole, ActionPermission, ROLE_PERMISSIONS } from "@acentra/shared-types";
import { Comment } from "@/entity/Comment";
import { Candidate } from "@/entity/Candidate";
import { User } from "@/entity/User";
import { Tenant } from "@/entity/Tenant";
import { CommentDTO } from "@/dto/CommentDTO";
import { S3FileUploadService } from "@acentra/file-storage";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { logger } from "@acentra/logger";

const fileUploadService = new S3FileUploadService();

export class CommentController {
  static async create(req: Request, res: Response) {
    const { candidateId } = req.params;
    const { text } = req.body;
    const file = req.file;
    const user = (req as any).user;

    if (!text && !file) {
      return res.status(400).json({ message: "Text or attachment is required" });
    }

    if (file) {
        // Validate file size (6MB max)
        if (file.size > 6 * 1024 * 1024) {
            return res.status(400).json({ message: "File size must not exceed 6MB" });
        }

        // Validate file type
        const validTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "image/jpeg", "image/png", "image/gif"];
        if (!validTypes.includes(file.mimetype)) {
            return res.status(400).json({ message: "Only PDF, DOC, DOCX, and Images are allowed" });
        }
    }

    const commentRepository = AppDataSource.getRepository(Comment);
    const candidateRepository = AppDataSource.getRepository(Candidate);
    const userRepository = AppDataSource.getRepository(User);
    const tenantRepository = AppDataSource.getRepository(Tenant);

    try {
      const candidate = await candidateRepository.findOne({ where: { id: candidateId as string, tenantId: req.tenantId } });
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      const creator = await userRepository.findOne({ where: { id: user.userId, tenantId: req.tenantId } });
      if (!creator) {
          return res.status(404).json({ message: "User not found" });
      }

      const comment = new Comment();
      comment.text = text || "";
      comment.candidate = candidate;
      comment.created_by = creator;
      comment.tenantId = req.tenantId;
      
      if (file) {
          // Get Tenant Name
          const tenant = await tenantRepository.findOne({ where: { id: req.tenantId } });
          if (!tenant) throw new Error("Tenant not found");
          
          const fileExtension = path.extname(file.originalname);
          const fileUuid = uuidv4();
          const s3Path = `tenants/${tenant.name}/candidates/${candidateId}/${fileUuid}${fileExtension}`;

          await fileUploadService.upload({
              file: file.buffer,
              contentType: file.mimetype,
              contentLength: file.size
          }, s3Path);

          comment.attachment_path = s3Path;
          comment.attachment_original_name = file.originalname;
          comment.attachment_type = file.mimetype;
          comment.attachment_size = file.size;
      }

      await commentRepository.save(comment);
      const commentDTO = new CommentDTO(comment);
      return res.status(201).json(commentDTO);
    } catch (error) {
      logger.error("Error creating comment:", error);
      return res.status(500).json({ message: "Error creating comment", error });
    }
  }

  static async listByCandidate(req: Request, res: Response) {
    const { candidateId } = req.params;
    const commentRepository = AppDataSource.getRepository(Comment);

    try {
      const comments = await commentRepository.find({
        where: { candidate: { id: candidateId as string }, tenantId: req.tenantId },
        relations: ["created_by"],
        order: { created_at: "ASC" }
      });

      // Convert to DTOs
      const commentDTOs = comments.map(comment => new CommentDTO(comment));
      return res.json(commentDTOs);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching comments", error });
    }
  }



  static async deleteAttachment(req: Request, res: Response) {
      const { id } = req.params;
      const commentRepository = AppDataSource.getRepository(Comment);
      const user = (req as any).user;

      try {
          const comment = await commentRepository.findOne({ where: { id: id as string, tenantId: req.tenantId }, relations: ["created_by"] });
          if (!comment) {
              return res.status(404).json({ message: "Comment not found" });
          }

          const permissions = ROLE_PERMISSIONS[user.role] || [];
          const canDeleteAny = permissions.includes(ActionPermission.REMOVE_FEEDBACK); // Using REMOVE_FEEDBACK as proxy for deleting candidate attachments
          
          if (comment.created_by.id !== user.userId && !canDeleteAny) {
              return res.status(403).json({ message: "Not authorized to delete this attachment" });
          }

          // Note: We are strictly not deleting files from S3 to avoid accidental data loss issues or complexity.
          // But technically we could if we wanted to be clean.
          // For now, let's just nullify the record. 
          // Actually, let's try to delete it from S3 if possible, but S3FileUploadService doesn't expose delete yet.
          // Let's check S3FileUploadService.
          
          comment.attachment_path = null;
          comment.attachment_original_name = null;
          comment.attachment_type = null;
          comment.attachment_size = null;

          await commentRepository.save(comment);
          return res.json({ message: "Attachment deleted successfully", comment });
      } catch (error) {
          return res.status(500).json({ message: "Error deleting attachment", error });
      }
  }
  static async getPublicAttachment(req: Request, res: Response) {
      const { id, tenantId } = req.params;
      // Validate tenant
      const tenantRepository = AppDataSource.getRepository(Tenant);
      const tenant = await tenantRepository.findOne({ where: { name: tenantId } });
      
      if (!tenant) {
          return res.status(404).json({ message: "Tenant not found" });
      }

      const commentRepository = AppDataSource.getRepository(Comment);

      try {
          const comment = await commentRepository.findOne({ where: { id: id as string, tenantId: tenant.id } });
          if (!comment || !comment.attachment_path) {
              return res.status(404).json({ message: "Attachment not found" });
          }

          try {
              const fileStream = await fileUploadService.getFileStream(comment.attachment_path);
              
              res.setHeader('Content-Type', comment.attachment_type || 'application/octet-stream');
              res.setHeader('Content-Disposition', `attachment; filename="${comment.attachment_original_name}"`);
              
              (fileStream as any).pipe(res);
          } catch (s3Error) {
              logger.error("Error fetching attachment from S3:", s3Error);
              return res.status(404).json({ message: "File not found in storage" });
          }
      } catch (error) {
          return res.status(500).json({ message: "Error fetching attachment", error });
      }
  }
}
