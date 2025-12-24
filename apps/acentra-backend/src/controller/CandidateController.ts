import { Request, Response } from "express";
import { In } from "typeorm";

import { AppDataSource } from "@/data-source";
import { UserRole, ActionPermission, ROLE_PERMISSIONS } from "@acentra/shared-types";
import { Candidate, CandidateStatus } from "@/entity/Candidate";
import { Comment } from "@/entity/Comment";
import { Job } from "@/entity/Job";
import { User } from "@/entity/User";
import {
  CandidateFeedbackTemplate,
  FeedbackStatus,
} from "@/entity/CandidateFeedbackTemplate";
import { PipelineHistory } from "@/entity/PipelineHistory";
import { PipelineStatus } from "@/entity/PipelineStatus";
import { FeedbackTemplate } from "@/entity/FeedbackTemplate";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { EmailService } from "@/service/EmailService";
import { Notification, NotificationType } from "@/entity/Notification";
import { Tenant } from "@/entity/Tenant";
import { CandidateDTO } from "@/dto/CandidateDTO";
import { S3FileUploadService } from "@acentra/file-storage";
import { logger } from "@acentra/logger";

// Configure Multer for memory storage (S3 upload)
const storage = multer.memoryStorage();
export const upload = multer({ storage });

const fileUploadService = new S3FileUploadService();

export class CandidateController {
  static async create(req: Request, res: Response) {
    const {
      name,
      first_name,
      last_name,
      email,
      phone,
      current_address,
      permanent_address,
      education,
      experience,
      desired_salary,
      referred_by,
      website,
      jobId,
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const cvFile = files?.cv?.[0];
    const coverLetterFile = files?.cover_letter?.[0];
    const profilePictureFile = files?.profile_picture?.[0];

    if (!name || !jobId || !cvFile) {
      return res
        .status(400)
        .json({ message: "Name, jobId, and CV file are required" });
    }

    const jobRepository = AppDataSource.getRepository(Job);
    const candidateRepository = AppDataSource.getRepository(Candidate);

    const job = await jobRepository.findOne({
      where: { id: jobId as string, tenantId: req.tenantId },
      relations: [
        "created_by",
        "assignees",
        "feedbackTemplates",
        "feedbackTemplates.questions",
      ],
    });
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check if user has permission to add candidates to this job
    const currentUser = (req as any).user;

    // Allow all recruitment-related roles to create candidates (they're responsible for sourcing)
    const recruitmentRoles = [
      UserRole.ADMIN,
      UserRole.HR,
      UserRole.HIRING_MANAGER,
      UserRole.RECRUITER,
    ];
    const hasAccess =
      recruitmentRoles.includes(currentUser.role?.toLowerCase()) ||
      job.created_by.id === currentUser.userId ||
      job.assignees.some((assignee) => assignee.id === currentUser.userId);

    if (!hasAccess) {
      return res
        .status(403)
        .json({
          message: "You don't have permission to add candidates to this job",
        });
    }

    const candidate = new Candidate();
    // Pre-save to get an ID for S3 paths
    // Wait, we need the ID for the S3 path.
    // Let's generate a UUID if we want, or save first. 
    // TypeORM doesn't support easy ID pre-generation without save unless we manually use UUID lib.
    // But entities usually have @PrimaryGeneratedColumn("uuid").
    // Let's save minimal candidate first.
    candidate.name = name;
    candidate.first_name = first_name;
    candidate.last_name = last_name;
    candidate.email = email;
    candidate.phone = phone;
    candidate.current_address = current_address;
    candidate.permanent_address = permanent_address;
    // Determine initial status based on tenant's pipeline
    const pipelineStatusRepository = AppDataSource.getRepository(PipelineStatus);
    const firstStatus = await pipelineStatusRepository.findOne({
      where: { tenantId: req.tenantId },
      order: { order: "ASC" },
    });
    candidate.status = firstStatus ? firstStatus.value : CandidateStatus.NEW;
    candidate.job = job;
    candidate.tenantId = req.tenantId;

    if (education) candidate.education = JSON.parse(education);
    if (experience) candidate.experience = JSON.parse(experience);
    if (desired_salary) candidate.desired_salary = parseFloat(desired_salary);
    if (referred_by) candidate.referred_by = referred_by;
    if (website) candidate.website = website;

     // Track who created the candidate (only if user exists in database)
    const user = (req as any).user;
    if (user && user.userId) {
      try {
        const userRepository = AppDataSource.getRepository(User);
        const dbUser = await userRepository.findOne({
          where: { id: user.userId, tenantId: req.tenantId },
        });

        if (dbUser) {
          candidate.created_by = dbUser;
        }
      } catch {
        logger.warn(
          "Warning: Could not find creating user in database, setting created_by to null"
        );
      }
    }

    // Save initial candidate to get ID
    try {
        await candidateRepository.save(candidate);
    } catch (saveError) {
        logger.error("Error saving initial candidate:", saveError);
        return res.status(500).json({ message: "Error creating candidate", error: saveError });
    }

    // Upload Files to S3
    try {
        // Fetch Tenant Name for S3 Path
        const tenantRepository = AppDataSource.getRepository(Tenant);
        const tenant = await tenantRepository.findOne({ where: { id: req.tenantId } });
        if (!tenant) throw new Error("Tenant not found");
        const tenantName = tenant.name;

        // CV Upload
        // Path: tenants/{tenantName}/candidates/{candidateId}/cv.{ext}
        const cvExt = path.extname(cvFile.originalname);
        const cvS3Path = `tenants/${tenantName}/candidates/${candidate.id}/cv${cvExt}`;
        
        await fileUploadService.upload({
            file: cvFile.buffer,
            contentType: cvFile.mimetype,
            contentLength: cvFile.size
        }, cvS3Path);
        candidate.cv_file_path = cvS3Path; // Store S3 Key

        // Cover Letter Upload
        if (coverLetterFile) {
            const clExt = path.extname(coverLetterFile.originalname);
            const clS3Path = `tenants/${tenantName}/candidates/${candidate.id}/cover_letter${clExt}`;
            await fileUploadService.upload({
                file: coverLetterFile.buffer,
                contentType: coverLetterFile.mimetype,
                contentLength: coverLetterFile.size
            }, clS3Path);
            candidate.cover_letter_path = clS3Path;
        }

        // Profile Picture Upload
        if (profilePictureFile) {
            const profileS3Path = `tenants/${tenantName}/candidates/${candidate.id}/profile.jpg`;
            
            // Compress
            const compressedBuffer = await sharp(profilePictureFile.buffer)
                .resize(128, 128, { fit: "cover" })
                .jpeg({ quality: 80 })
                .toBuffer();

            await fileUploadService.upload({
                file: compressedBuffer,
                contentType: "image/jpeg",
                contentLength: compressedBuffer.length
            }, profileS3Path);

            candidate.profile_picture = profileS3Path;
        }

        // Save candidate with file paths
        // Save candidate with file paths
        await candidateRepository.save(candidate);

        // Create initial pipeline history record
        try {
            const pipelineHistoryRepository = AppDataSource.getRepository(PipelineHistory);
            const pipelineHistory = new PipelineHistory();
            pipelineHistory.candidate = candidate;
            // old_status is null for new candidate
            pipelineHistory.new_status = candidate.status;
            pipelineHistory.tenantId = req.tenantId;
            if (candidate.created_by) {
                pipelineHistory.changed_by = candidate.created_by;
            }
            await pipelineHistoryRepository.save(pipelineHistory);
        } catch (historyError) {
            logger.warn("Failed to create initial pipeline history record:", historyError);
            // Non-blocking but logged
        }

    } catch (uploadError) {
        logger.error("Error uploading files for candidate:", uploadError);
        // Rollback? Currently we just fail. Ideally we should delete the candidate or mark as error.
        await candidateRepository.remove(candidate);
        return res.status(500).json({ message: "Error uploading candidate files", error: uploadError });
    }

    
    try {
      // Auto-attach feedback templates from the job to the candidate
      try {
        await CandidateController.autoAttachFeedbackTemplates(
          candidate,
          req.tenantId,
          req
        );
      } catch (feedbackError) {
        logger.error("Feedback template attachment failed:", feedbackError);
      }

      // Create notifications for job assignees
      const jobWithAssignees = await jobRepository.findOne({
        where: { id: jobId as string, tenantId: req.tenantId },
        relations: ["assignees"],
      });

      const notificationRepository = AppDataSource.getRepository(Notification);
      if (jobWithAssignees && jobWithAssignees.assignees.length > 0) {
        for (const user of jobWithAssignees.assignees) {
          try {
            EmailService.notifyCandidateUpload(
              user.email,
              candidate.name,
              job.title
            );

            // Create notification
            const notification = new Notification();
            notification.userId = user.id;
            notification.type = NotificationType.CANDIDATE_ADDED;
            notification.message = `New candidate ${candidate.name} added to ${job.title}`;
            notification.relatedEntityId =
              parseInt(candidate.id.toString()) || 0;
            notification.tenantId = req.tenantId;

            await notificationRepository.save(notification);
          } catch (notificationError) {
            logger.error(
              `Error creating notification for user ${user.id}:`,
              notificationError
            );
          }
        }
      }

      // Reload candidate with relations for DTO
      const savedCandidate = await candidateRepository.findOne({
        where: { id: candidate.id },
        relations: ["job", "created_by"],
      });

      return res.status(201).json(new CandidateDTO(savedCandidate));
    } catch (error) {
      logger.error("Error finalizing candidate creation:", error);
      return res.status(500).json({
        message: "Error creating candidate",
        error: error.message || "Unknown error occurred",
      });
    }
  }

  static async listByJob(req: Request, res: Response) {
    const { jobId } = req.params;
    const candidateRepository = AppDataSource.getRepository(Candidate);
    const jobRepository = AppDataSource.getRepository(Job);

    // Get current user ID from JWT token
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // First, verify the user has access to this job
      const job = await jobRepository.findOne({
        where: { id: jobId as string, tenantId: req.tenantId },
        relations: ["created_by", "assignees"],
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      // Check if user has access to this job via permissions
      const userPermissions = ROLE_PERMISSIONS[user.role] || [];
      const hasGlobalAccess = 
        userPermissions.includes(ActionPermission.VIEW_ALL_CANDIDATES) ||
        userPermissions.includes(ActionPermission.MANAGE_ALL_JOBS) ||
        userPermissions.includes(ActionPermission.VIEW_ALL_JOBS);

      const hasAccess =
        hasGlobalAccess ||
        job.created_by.id === user.userId ||
        job.assignees.some((assignee) => assignee.id === user.userId);

      if (!hasAccess) {
        return res
          .status(403)
          .json({ message: "Access denied to this job's candidates" });
      }

      // User has access, return candidates for this job
      const candidates = await candidateRepository.find({
        where: { job: { id: jobId as string }, tenantId: req.tenantId },
        relations: ["job", "created_by"],
      });
      return res.json(
        candidates.map((candidate) => new CandidateDTO(candidate))
      );
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching candidates", error });
    }
  }

  static async getAll(req: Request, res: Response) {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 25;
    const { search, status, jobId, createdBy } = req.query;
    const skip = (page - 1) * limit;

    const candidateRepository = AppDataSource.getRepository(Candidate);

    // Get current user ID from JWT token
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const queryBuilder = candidateRepository
        .createQueryBuilder("candidate")
        .leftJoinAndSelect("candidate.job", "job")
        .leftJoinAndSelect("job.assignees", "assignee")
        .leftJoinAndSelect("candidate.created_by", "createdByRel")
        .where("candidate.tenantId = :tenantId", { tenantId: req.tenantId });

      // Permission filtering
      const permissions = ROLE_PERMISSIONS[user.role] || [];
      const canViewAllCandidates = permissions.includes(ActionPermission.VIEW_ALL_CANDIDATES) ||
                                  permissions.includes(ActionPermission.MANAGE_CANDIDATES);

      if (!canViewAllCandidates) {
        queryBuilder.andWhere(
          "(candidate.created_by = :userId OR job.created_by = :userId OR assignee.id = :userId)",
          { userId: user.userId }
        );
      }

      // Advanced filters
      if (search) {
        queryBuilder.andWhere(
          "(LOWER(candidate.name) LIKE LOWER(:search) OR LOWER(candidate.email) LIKE LOWER(:search) OR LOWER(job.title) LIKE LOWER(:search))",
          { search: `%${search}%` }
        );
      }

      if (status) {
        queryBuilder.andWhere("candidate.status = :status", { status });
      }

      if (jobId) {
        queryBuilder.andWhere("job.id = :jobId", { jobId });
      }

      if (createdBy) {
        queryBuilder.andWhere("createdByRel.id = :createdBy", { createdBy });
      }

      queryBuilder.orderBy("candidate.created_at", "DESC")
        .skip(skip)
        .take(limit);

      const [candidates, total] = await queryBuilder.getManyAndCount();

      return res.json({
        data: candidates.map((candidate) => new CandidateDTO(candidate)),
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      });
    } catch (error) {
      logger.error("Error fetching candidates:", error);
      return res
        .status(500)
        .json({ message: "Error fetching candidates", error });
    }
  }

  static async getById(req: Request, res: Response) {
    const { id } = req.params;
    const candidateRepository = AppDataSource.getRepository(Candidate);

    try {
      const candidate = await candidateRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        relations: ["job", "job.assignees", "created_by"],
      });

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      // Permission check - reuse logic from getAll if needed, but for a single candidate
      // For now, if they found it within their tenant, we allow it (matching listByJob/getAll tenant constraint)
      // but ideally we should check if they are assigned to the job if they are not HR/Admin.
      
      return res.json(new CandidateDTO(candidate));
    } catch (error) {
      logger.error("Error fetching candidate:", error);
      return res
        .status(500)
        .json({ message: "Error fetching candidate", error });
    }
  }


  static async updateStatus(req: Request, res: Response) {
    const { id } = req.params;
    const { status, interview_date, interview_link } = req.body;

    const candidateRepository = AppDataSource.getRepository(Candidate);
    const pipelineHistoryRepository =
      AppDataSource.getRepository(PipelineHistory);
    const candidate = await candidateRepository.findOne({
      where: { id: id as string, tenantId: req.tenantId },
      relations: ["job", "job.assignees"],
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    // Store old status for history tracking
    const oldStatus = candidate.status;

    candidate.status = status;
    if (interview_date) candidate.interview_date = interview_date;
    if (interview_link) candidate.interview_link = interview_link;

    try {
      await candidateRepository.save(candidate);

      // Auto-attach feedback templates from the job to the candidate
      await CandidateController.autoAttachFeedbackTemplates(
        candidate,
        req.tenantId,
        req
      );

      // Create pipeline history record
      if (oldStatus !== status) {
        const pipelineHistory = new PipelineHistory();
        pipelineHistory.candidate = candidate;
        pipelineHistory.old_status = oldStatus;
        pipelineHistory.new_status = status;
        pipelineHistory.tenantId = req.tenantId;

        // Track who made the change
        const user = (req as any).user;
        if (user && user.userId) {
          // Map JWT payload userId to User entity id
          pipelineHistory.changed_by = { id: user.userId } as any;
        }

        await pipelineHistoryRepository.save(pipelineHistory);
      }

      // Notify assignees about status change
      const notificationRepository = AppDataSource.getRepository(Notification);
      if (candidate.job.assignees.length > 0) {
        for (const user of candidate.job.assignees) {
          try {
            EmailService.notifyStatusChange(
              user.email,
              candidate.name,
              status,
              candidate.job.title
            );

            // Create notification
            const notification = new Notification();
            notification.userId = user.id;
            notification.type = NotificationType.STATUS_CHANGE;
            notification.message = `Candidate ${candidate.name} status changed to ${status} in ${candidate.job.title}`;
            notification.relatedEntityId =
              parseInt(candidate.id.toString()) || 0;
            notification.tenantId = req.tenantId;
            await notificationRepository.save(notification);
          } catch (notificationError) {
            logger.error(
              "Error creating notification for user:",
              user.id,
              notificationError
            );
          }
        }
      }

      return res.json(new CandidateDTO(candidate));
    } catch (error) {
      return res.status(500).json({ message: "Error updating status", error });
    }
  }

  static async getCv(req: Request, res: Response) {
    const { id } = req.params;
    const candidateRepository = AppDataSource.getRepository(Candidate);

    try {
      const candidate = await candidateRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });
      if (!candidate || !candidate.cv_file_path) {
        return res.status(404).json({ message: "CV not found" });
      }

      // If streaming from S3
      try {
          // If stored path looks like an S3 Key (e.g. tenants/...) or a URL
          // Our stored path is the S3 Key.
          const fileStream = await fileUploadService.getFileStream(candidate.cv_file_path);
          
          // Determine content type based on extension
          const ext = path.extname(candidate.cv_file_path).toLowerCase();
          let contentType = 'application/octet-stream';
          if (ext === '.pdf') contentType = 'application/pdf';
          else if (ext === '.doc') contentType = 'application/msword';
          else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

          res.setHeader('Content-Type', contentType);
          // Optional: content-disposition
          // res.setHeader('Content-Disposition', `inline; filename="cv${ext}"`);

          (fileStream as any).pipe(res);
      } catch (s3Error) {
         logger.error("Error fetching CV from S3:", s3Error);
         // Fallback for legacy local files?
         if (fs.existsSync(candidate.cv_file_path)) {
             res.sendFile(path.resolve(candidate.cv_file_path));
         } else {
             res.status(404).json({ message: "CV file not found" });
         }
      }

    } catch (error) {
      return res.status(500).json({ message: "Error fetching CV", error });
    }
  }



  static async getPublicProfilePicture(req: Request, res: Response) {
    const { id, tenantId } = req.params;
    
    // Validate tenant
    const tenantRepository = AppDataSource.getRepository(Tenant);
    const tenant = await tenantRepository.findOne({ where: { name: tenantId } });
    
    if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
    }

    const candidateRepository = AppDataSource.getRepository(Candidate);

    try {
      const candidate = await candidateRepository.findOne({
        where: { id: id as string, tenantId: tenant.id },
      });
      
      if (!candidate || !candidate.profile_picture) {
        return res.status(404).json({ message: "Profile picture not found" });
      }

      try {
          const fileStream = await fileUploadService.getFileStream(candidate.profile_picture);
          res.setHeader("Content-Type", "image/jpeg");
          res.setHeader("Content-Type", "image/jpeg");
          // Mutable resource
          res.setHeader("Cache-Control", "public, max-age=0, must-revalidate");
          (fileStream as any).pipe(res);
      } catch (s3Error) {
          logger.error("Error fetching request profile picture from S3:", s3Error);
           if (fs.existsSync(candidate.profile_picture)) {
                res.sendFile(path.resolve(candidate.profile_picture));
           } else {
                res.status(404).json({ message: "Profile picture not found" });
           }
      }
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching profile picture", error });
    }
  }

  static async updateNotes(req: Request, res: Response) {
    const { id } = req.params;
    const { notes } = req.body;

    const candidateRepository = AppDataSource.getRepository(Candidate);
    const candidate = await candidateRepository.findOne({
      where: { id: id as string, tenantId: req.tenantId },
    });

    if (!candidate) {
      return res.status(404).json({ message: "Candidate not found" });
    }

    candidate.notes = notes;

    try {
      await candidateRepository.save(candidate);

      // Auto-attach feedback templates from the job to the candidate
      await CandidateController.autoAttachFeedbackTemplates(
        candidate,
        req.tenantId,
        req
      );

      // Reload candidate with relations for DTO
      const updatedCandidate = await candidateRepository.findOne({
        where: { id: candidate.id },
        relations: ["job", "created_by"],
      });

      return res.json(new CandidateDTO(updatedCandidate));
    } catch (error) {
      return res.status(500).json({ message: "Error updating notes", error });
    }
  }

  static async uploadCv(req: Request, res: Response) {
    const { id } = req.params;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "CV file is required" });
    }

    // Validate file type
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!validTypes.includes(file.mimetype)) {
      return res
        .status(400)
        .json({ message: "Only PDF, DOC, and DOCX files are allowed" });
    }

    // Validate file size (10MB max - matching S3 service default, previously 6MB)
    if (file.size > 10 * 1024 * 1024) {
      return res.status(400).json({ message: "File size must not exceed 10MB" });
    }

    const candidateRepository = AppDataSource.getRepository(Candidate);

    try {
      const candidate = await candidateRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      // Fetch Tenant Name for S3 Path
      const tenantRepository = AppDataSource.getRepository(Tenant);
      const tenant = await tenantRepository.findOne({ where: { id: req.tenantId } });
      if (!tenant) throw new Error("Tenant not found");
      const tenantName = tenant.name;

      // Upload to S3
      const cvExt = path.extname(file.originalname);
      const cvS3Path = `tenants/${tenantName}/candidates/${candidate.id}/cv${cvExt}`;

      await fileUploadService.upload({
          file: file.buffer,
          contentType: file.mimetype,
          contentLength: file.size
      }, cvS3Path);

      // Update candidate with new CV path
      candidate.cv_file_path = cvS3Path;
      await candidateRepository.save(candidate);

      // Reload candidate with relations for DTO
      const updatedCandidate = await candidateRepository.findOne({
        where: { id: candidate.id },
        relations: ["job", "created_by"],
      });

      return res.json({
        message: "CV uploaded successfully",
        candidate: new CandidateDTO(updatedCandidate),
      });
    } catch (error) {
      logger.error("Error uploading CV:", error);
      return res.status(500).json({ message: "Error uploading CV", error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const candidateRepository = AppDataSource.getRepository(Candidate);
    const commentRepository = AppDataSource.getRepository(Comment);

    try {
      const candidate = await candidateRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });
      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      // Delete all comments associated with this candidate first
      await commentRepository
        .createQueryBuilder()
        .delete()
        .from(Comment)
        .where("candidateId = :candidateId", { candidateId: id })
        .execute();

      // Now delete the candidate
      await candidateRepository.remove(candidate);
      return res.json({ message: "Candidate deleted successfully" });
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error deleting candidate", error });
    }
  }

  /**
   * Auto-attach feedback templates from the job to the candidate
   * This method creates CandidateFeedbackTemplate records for each template associated with the job
   */
  static async autoAttachFeedbackTemplates(
    candidate: Candidate,
    tenantId: string,
    req: Request
  ): Promise<void> {
    try {
      // Logic for auto-attaching feedback templates...
      let job = candidate.job;

      if (!job || !job.feedbackTemplates) {
        const jobRepository = AppDataSource.getRepository(Job);
        job = await jobRepository.findOne({
          where: { id: candidate.job.id, tenantId },
          relations: ["feedbackTemplates", "feedbackTemplates.questions"],
        });
      }

      // Handle lazy loading - feedbackTemplates is a Promise
      let templatesToAttach: FeedbackTemplate[] = [];
      if (job?.feedbackTemplates) {
        if (job.feedbackTemplates instanceof Promise) {
          templatesToAttach = await job.feedbackTemplates;
        } else if (Array.isArray(job.feedbackTemplates)) {
          templatesToAttach = job.feedbackTemplates;
        }
      }

      if (!templatesToAttach || templatesToAttach.length === 0) {
        return; // No job or feedback templates to attach
      }

      const candidateFeedbackRepository = AppDataSource.getRepository(
        CandidateFeedbackTemplate
      );
      const user = (req as any).user;
      const assignedBy = user?.userId || null;

      for (const template of templatesToAttach) {
        // Check if template is already attached (safe check)
        const existingFeedback = await candidateFeedbackRepository.findOne({
          where: {
            candidate: { id: candidate.id },
            template: { id: template.id },
            tenantId: tenantId,
          },
        });

        if (!existingFeedback) {
          const candidateFeedback = candidateFeedbackRepository.create({
            candidate: candidate,
            template: template,
            status: FeedbackStatus.NOT_STARTED,
            assignedBy,
            assignedAt: new Date(),
            isManuallyAssigned: false,
            tenantId: tenantId,
          });

          await candidateFeedbackRepository.save(candidateFeedback);
        }
      }
    } catch (error) {
      logger.error("Error in auto-attach feedback templates:", error);
      // Don't throw the error to prevent candidate creation from failing
    }
  }

  static async bulkAction(req: Request, res: Response) {
    const { candidateIds, action, payload } = req.body;

    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      return res.status(400).json({ message: "candidateIds array is required" });
    }

    if (!action) {
      return res.status(400).json({ message: "action is required" });
    }

    const candidateRepository = AppDataSource.getRepository(Candidate);
    const pipelineHistoryRepository = AppDataSource.getRepository(PipelineHistory);
    const notificationRepository = AppDataSource.getRepository(Notification);

    try {
      const dbCandidates = await candidateRepository.find({
        where: { id: In(candidateIds), tenantId: req.tenantId },
        relations: ["job", "job.assignees"],
      });


      if (dbCandidates.length === 0) {
        return res.status(404).json({ message: "No valid candidates found" });
      }

      const results = [];
      const user = (req as any).user;

      // Use a transaction for bulk updates
      await AppDataSource.transaction(async (transactionalEntityManager) => {
        for (const candidate of dbCandidates) {
          const oldStatus = candidate.status;
          
          if (action === "MOVE_STAGE") {
            const { stage } = payload;
            if (!stage) throw new Error("Stage is required for MOVE_STAGE action");
            candidate.status = stage;
          } else if (action === "REJECT") {
            candidate.status = CandidateStatus.REJECTED;
          } else {
            throw new Error(`Unsupported bulk action: ${action}`);
          }

          await transactionalEntityManager.save(candidate);

          // Track history
          if (oldStatus !== candidate.status) {
            const pipelineHistory = new PipelineHistory();
            pipelineHistory.candidate = candidate;
            pipelineHistory.old_status = oldStatus;
            pipelineHistory.new_status = candidate.status;
            pipelineHistory.tenantId = req.tenantId;
            if (user && user.userId) {
              pipelineHistory.changed_by = { id: user.userId } as any;
            }
            await transactionalEntityManager.save(pipelineHistory);

            // Notifications
            if (candidate.job.assignees.length > 0) {
              for (const assignee of candidate.job.assignees) {
                const notification = new Notification();
                notification.userId = assignee.id;
                notification.type = NotificationType.STATUS_CHANGE;
                notification.message = `[Bulk] ${candidate.name} status changed to ${candidate.status}`;
                notification.tenantId = req.tenantId;
                await transactionalEntityManager.save(notification);
              }
            }
          }
          results.push(new CandidateDTO(candidate));
        }
      });

      return res.json({
        message: `Successfully processed ${results.length} candidates`,
        data: results,
      });
    } catch (error) {
      logger.error("Bulk action failed:", error);
      return res.status(500).json({ message: "Bulk action failed", error: error.message });
    }
  }

  static async sendEmail(req: Request, res: Response) {
    const { id } = req.params;
    const { subject, body } = req.body;

    if (!subject || !body) {
      return res.status(400).json({ message: "Subject and body are required" });
    }

    const candidateRepository = AppDataSource.getRepository(Candidate);

    try {
      const candidate = await candidateRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      if (!candidate.email) {
        return res.status(400).json({ message: "Candidate does not have an email address" });
      }

      await EmailService.sendEmail(candidate.email, subject, body);

      return res.json({ message: "Email sent successfully" });
    } catch (error) {
      logger.error("Error sending email to candidate:", error);
      return res.status(500).json({ message: "Failed to send email", error });
    }
  }
}

