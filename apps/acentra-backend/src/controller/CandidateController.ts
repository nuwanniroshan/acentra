import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { Candidate, CandidateStatus } from "@/entity/Candidate";
import { Comment } from "@/entity/Comment";
import { Job } from "@/entity/Job";
import { User } from "@/entity/User";
import {
  CandidateFeedbackTemplate,
  FeedbackStatus,
} from "@/entity/CandidateFeedbackTemplate";
import { PipelineHistory } from "@/entity/PipelineHistory";
import { FeedbackTemplate } from "@/entity/FeedbackTemplate";
import multer from "multer";
import path from "path";
import sharp from "sharp";
import fs from "fs";
import { EmailService } from "@/service/EmailService";
import { Notification, NotificationType } from "@/entity/Notification";
import { CandidateDTO } from "@/dto/CandidateDTO";

// Configure Multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Extract tenantId from request headers
    const tenantId = req.headers["x-tenant-id"] as string;

    if (!tenantId) {
      return cb(new Error("Tenant ID is required for file upload"), "");
    }

    // Create tenant-specific upload directory
    const uploadDir = path.join("uploads", tenantId);

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

export const upload = multer({ storage });

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
      "admin",
      "hr",
      "engineering_manager",
      "recruiter",
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

    // Compress profile picture if uploaded
    let compressedProfilePicturePath = null;
    if (profilePictureFile) {
      try {
        const compressedFileName = `compressed-${Date.now()}.jpg`;
        compressedProfilePicturePath = path.join(
          "uploads",
          req.tenantId,
          compressedFileName
        );

        await sharp(profilePictureFile.path)
          .resize(128, 128, { fit: "cover" })
          .jpeg({ quality: 80 })
          .toFile(compressedProfilePicturePath);

        // Delete original file
        fs.unlinkSync(profilePictureFile.path);
      } catch (err) {
        console.error("Failed to compress profile picture:", err);
        compressedProfilePicturePath = profilePictureFile.path;
      }
    }

    const candidate = new Candidate();
    candidate.name = name;
    candidate.first_name = first_name;
    candidate.last_name = last_name;
    candidate.email = email;
    candidate.phone = phone;
    candidate.current_address = current_address;
    candidate.permanent_address = permanent_address;
    candidate.cv_file_path = cvFile.path;
    if (coverLetterFile) candidate.cover_letter_path = coverLetterFile.path;
    if (compressedProfilePicturePath)
      candidate.profile_picture = compressedProfilePicturePath;
    if (education) candidate.education = JSON.parse(education);
    if (experience) candidate.experience = JSON.parse(experience);
    if (desired_salary) candidate.desired_salary = parseFloat(desired_salary);
    if (referred_by) candidate.referred_by = referred_by;
    if (website) candidate.website = website;
    candidate.job = job;
    candidate.status = CandidateStatus.NEW;
    candidate.tenantId = req.tenantId;

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
        // If user doesn't exist in database, skip setting created_by (it will be null)
      } catch (error) {
        console.log(
          "Warning: Could not find creating user in database, setting created_by to null"
        );
        // Continue without setting created_by
      }
    }

    try {
      await candidateRepository.save(candidate);

      // Auto-attach feedback templates from the job to the candidate
      try {
        console.log("DEBUG: About to call autoAttachFeedbackTemplates");
        console.log("DEBUG: Candidate job feedbackTemplates:", candidate.job?.feedbackTemplates);
        await CandidateController.autoAttachFeedbackTemplates(
          candidate,
          req.tenantId,
          req
        );
      } catch (feedbackError) {
        console.error("Feedback template attachment failed:", feedbackError);
        // Continue without feedback templates
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
            console.error(
              `Error creating notification for user ${user.id}:`,
              notificationError
            );
            // Continue with other notifications even if one fails
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
      console.error("Error creating candidate:", error);

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

      // Check if user has access to this job
      const hasAccess =
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
    const skip = (page - 1) * limit;

    const candidateRepository = AppDataSource.getRepository(Candidate);

    // Get current user ID from JWT token
    const user = (req as any).user;
    if (!user || !user.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      // Use query builder to filter candidates that the current user can see:
      // 1. Candidates they created
      // 2. Candidates in jobs they created
      // 3. Candidates in jobs assigned to them
      const queryBuilder = candidateRepository
        .createQueryBuilder("candidate")
        .leftJoinAndSelect("candidate.job", "job")
        .leftJoinAndSelect("job.assignees", "assignee")
        .leftJoinAndSelect("candidate.created_by", "createdBy")
        .where("candidate.tenantId = :tenantId", { tenantId: req.tenantId })
        .andWhere(
          "(candidate.created_by = :userId OR job.created_by = :userId OR assignee.id = :userId)",
          { userId: user.userId }
        )
        .orderBy("candidate.created_at", "DESC")
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
      console.error("Error fetching candidates:", error);
      return res
        .status(500)
        .json({ message: "Error fetching candidates", error });
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
            console.error(
              "Error creating notification for user:",
              user.id,
              notificationError
            );
            // Continue with other notifications even if one fails
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

      const filePath = path.resolve(candidate.cv_file_path);
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).json({ message: "Error sending file" });
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Error fetching CV", error });
    }
  }

  static async getProfilePicture(req: Request, res: Response) {
    const { id } = req.params;
    const candidateRepository = AppDataSource.getRepository(Candidate);

    try {
      const candidate = await candidateRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });
      if (!candidate || !candidate.profile_picture) {
        return res.status(404).json({ message: "Profile picture not found" });
      }

      const filePath = path.resolve(candidate.profile_picture);

      // Set aggressive caching headers for faster subsequent loads
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.setHeader("Content-Type", "image/jpeg");

      res.sendFile(filePath, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).json({ message: "Error sending file" });
        }
      });
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
      // Delete uploaded file
      fs.unlinkSync(file.path);
      return res
        .status(400)
        .json({ message: "Only PDF, DOC, and DOCX files are allowed" });
    }

    // Validate file size (6MB max)
    if (file.size > 6 * 1024 * 1024) {
      // Delete uploaded file
      fs.unlinkSync(file.path);
      return res.status(400).json({ message: "File size must not exceed 6MB" });
    }

    const candidateRepository = AppDataSource.getRepository(Candidate);

    try {
      const candidate = await candidateRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });
      if (!candidate) {
        // Delete uploaded file
        fs.unlinkSync(file.path);
        return res.status(404).json({ message: "Candidate not found" });
      }

      // Delete old CV file if exists
      if (candidate.cv_file_path && fs.existsSync(candidate.cv_file_path)) {
        try {
          fs.unlinkSync(candidate.cv_file_path);
        } catch (err) {
          console.error("Failed to delete old CV file:", err);
        }
      }

      // Update candidate with new CV path
      candidate.cv_file_path = file.path;
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
      // Delete uploaded file on error
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
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
      console.log(
        "DEBUG: Starting autoAttachFeedbackTemplates for candidate:",
        candidate.id
      );
      console.log("DEBUG: Candidate job:", candidate.job);

      // If candidate doesn't have job relationship loaded, get it from the job repository
      let job = candidate.job;

      console.log("DEBUG: Initial job object:", job);
      console.log(
        "DEBUG: job.feedbackTemplates type:",
        typeof job?.feedbackTemplates
      );
      console.log(
        "DEBUG: job.feedbackTemplates value:",
        job?.feedbackTemplates
      );

      if (!job || !job.feedbackTemplates) {
        console.log(
          "DEBUG: Job or feedbackTemplates not loaded, fetching from repository"
        );
        const jobRepository = AppDataSource.getRepository(Job);
        job = await jobRepository.findOne({
          where: { id: candidate.job.id, tenantId },
          relations: ["feedbackTemplates", "feedbackTemplates.questions"],
        });
        console.log("DEBUG: Fetched job from repository:", job);
      }

      // Handle lazy loading - feedbackTemplates is a Promise
      let templatesToAttach: FeedbackTemplate[] = [];
      if (job?.feedbackTemplates) {
        if (job.feedbackTemplates instanceof Promise) {
          console.log("DEBUG: feedbackTemplates is a Promise, awaiting...");
          templatesToAttach = await job.feedbackTemplates;
        } else if (Array.isArray(job.feedbackTemplates)) {
          console.log("DEBUG: feedbackTemplates is already an array");
          templatesToAttach = job.feedbackTemplates;
        } else {
          console.log(
            "DEBUG: feedbackTemplates is neither Promise nor Array, skipping"
          );
        }
      }

      console.log(
        "DEBUG: Templates to attach:",
        templatesToAttach?.length || 0
      );

      if (!templatesToAttach || templatesToAttach.length === 0) {
        console.log("DEBUG: No templates to attach, returning");
        return; // No job or feedback templates to attach
      }

      const candidateFeedbackRepository = AppDataSource.getRepository(
        CandidateFeedbackTemplate
      );
      const user = (req as any).user;
      const assignedBy = user?.userId || null;

      for (const template of templatesToAttach) {
        console.log("DEBUG: Processing template:", template.id);
        // Check if template is already attached (safe check)
        const existingFeedback = await candidateFeedbackRepository.findOne({
          where: {
            candidate: { id: candidate.id },
            template: { id: template.id },
            tenantId: tenantId,
          },
        });

        if (!existingFeedback) {
          console.log(
            "DEBUG: Creating new CandidateFeedbackTemplate for template:",
            template.id
          );
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
          console.log("DEBUG: Successfully saved CandidateFeedbackTemplate");
        } else {
          console.log(
            "DEBUG: Template already attached, skipping:",
            template.id
          );
        }
      }
    } catch (error) {
      console.error("Error in auto-attach feedback templates:", error);
      // Don't throw the error to prevent candidate creation from failing
    }
  }
}
