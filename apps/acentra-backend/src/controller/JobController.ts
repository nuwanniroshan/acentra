import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { Job, JobStatus } from "@/entity/Job";
import { User } from "@/entity/User";
import { UserRole } from "@acentra/shared-types";
import { Tenant } from "@/entity/Tenant";
import { FeedbackTemplate } from "@/entity/FeedbackTemplate";
import { CandidateAiOverview } from "@/entity/CandidateAiOverview";
import { EmailService } from "@/service/EmailService";
import { aiService } from "@/service/AIService";
import { Notification, NotificationType } from "@/entity/Notification";
import { JobDTO } from "@/dto/JobDTO";
import multer from "multer";
import path from "path";
import fs from "fs";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { S3FileUploadService } from "@acentra/file-storage";
import { S3Client, CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { logger } from "@acentra/logger";

// Configure Multer for memory storage (S3 upload)
const jdTempStorage = multer.memoryStorage();

export const uploadJdTemp = multer({
  storage: jdTempStorage,
  fileFilter: (req, file, cb) => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain"
    ];
    if (validTypes.includes(file.mimetype) || file.originalname.endsWith('.txt')) {
      cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX and TXT files are allowed"));
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max
  },
});

// Keep the old export for backward compatibility during transition
export const uploadJd = uploadJdTemp;

// Keep validTypes as is
// ...

// Lazy initialization for services to ensure env vars are loaded
let fileUploadService: S3FileUploadService;
let s3Client: S3Client;

function getFileUploadService() {
  if (!fileUploadService) {
      fileUploadService = new S3FileUploadService();
  }
  return fileUploadService;
}

function getS3Client() {
  if (!s3Client) {
      s3Client = new S3Client({
          region: process.env.AWS_REGION || "us-east-1",
          credentials: (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) ? {
              accessKeyId: process.env.AWS_ACCESS_KEY_ID,
              secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
          } : undefined
      });
  }
  return s3Client;
}

export class JobController {
  static async create(req: Request, res: Response) {
    // ...

    const {
      title,
      description,
      start_date,
      expected_closing_date,
      department,
      branch,
      tags,
      assigneeIds,
      feedbackTemplateIds,
      tempFileLocation,
      jdContent,
    } = req.body;
    const user = req.user;

    if (!title || !description || !expected_closing_date) {
      return res
        .status(400)
        .json({
          message: "Title, description, and expected closing date are required",
        });
    }

    if (
      !feedbackTemplateIds ||
      !Array.isArray(feedbackTemplateIds) ||
      feedbackTemplateIds.length === 0
    ) {
      return res
        .status(400)
        .json({ message: "At least one feedback template must be selected" });
    }

    const jobRepository = AppDataSource.getRepository(Job);
    const userRepository = AppDataSource.getRepository(User);
    const feedbackTemplateRepository = AppDataSource.getRepository(FeedbackTemplate);

    const creator = await userRepository.findOne({
      where: { id: user.userId, tenantId: req.tenantId },
    });
    if (!creator) {
      return res.status(404).json({ message: "User not found" });
    }

    // Only Admin, HR, and Engineering Manager can create jobs
    if (creator.role === UserRole.RECRUITER) {
      return res
        .status(403)
        .json({ message: "Recruiters are not allowed to create jobs" });
    }

    // Validate dates
    const startDate = start_date ? new Date(start_date) : new Date();
    const expectedClosingDate = new Date(expected_closing_date);

    if (expectedClosingDate <= startDate) {
      return res
        .status(400)
        .json({ message: "Expected closing date must be after start date" });
    }

    // Prepare assignees list
    let assignees = [creator]; // Creator is automatically assigned
    if (assigneeIds && Array.isArray(assigneeIds) && assigneeIds.length > 0) {
      const additionalAssignees = await userRepository.findByIds(assigneeIds);
      // Add additional assignees, avoiding duplicates
      const creatorId = creator.id;
      const uniqueAssignees = additionalAssignees.filter(
        (a) => a.id !== creatorId
      );
      assignees = [creator, ...uniqueAssignees];
    }

    // Validate feedback templates exist and belong to the same tenant
    const feedbackTemplates = await feedbackTemplateRepository.find({
      where: feedbackTemplateIds.map((id) => ({ id, tenantId: req.tenantId })),
    });

    if (feedbackTemplates.length !== feedbackTemplateIds.length) {
      return res
        .status(400)
        .json({
          message: "One or more feedback templates not found or invalid",
        });
    }

    try {
      // First create job to get ID
      const job = new Job();
      job.title = title;
      job.description = description;
      job.department = department;
      job.branch = branch;
      job.tags = tags || [];
      job.start_date = startDate;
      job.expected_closing_date = expectedClosingDate;
      job.created_by = creator;
      job.assignees = assignees;
      job.tenantId = req.tenantId;
      job.status = JobStatus.PENDING_APPROVAL; // Default to Pending Approval
      job.feedbackTemplates = Promise.resolve(feedbackTemplates);
      job.jd = jdContent || ""; // Store the extracted JD content

      // Save job to get ID
      await jobRepository.save(job);

      // Handle file movement if temp file location is provided
      if (tempFileLocation) {
        if (tempFileLocation.startsWith('https://')) {
             // Handle S3 file move
             try {
                // Extract key from URL
                // URL format: https://BUCKET.s3.REGION.amazonaws.com/KEY
                const urlObj = new URL(tempFileLocation);
                const sourceKey = urlObj.pathname.substring(1); // remove leading slash
                const bucketName = urlObj.hostname.split('.')[0];
                
                 const fileExtension = path.extname(sourceKey);

                 // Fetch Tenant Name
                 const tenantId = req.tenantId;
                 const tenantRepository = AppDataSource.getRepository(Tenant);
                 const tenant = await tenantRepository.findOne({ where: { id: tenantId } });
                 const tenantName = tenant ? tenant.name : 'default';

                 const destinationKey = `tenants/${tenantName}/jds/${job.id}${fileExtension}`;

                 logger.info(`Moving S3 file from ${sourceKey} to ${destinationKey}`);

                // Copy object
                await getS3Client().send(new CopyObjectCommand({
                    Bucket: bucketName,
                    CopySource: `${bucketName}/${sourceKey}`,
                    Key: destinationKey,
                    ContentType: 'application/pdf' // Ideally preserve original content type, but PDF is most common for JDs
                }));

                // Update job with new S3 URL
                job.jdFilePath = `https://${bucketName}.s3.${process.env.AWS_REGION || 'us-east-1'}.amazonaws.com/${destinationKey}`;
                await jobRepository.save(job);

                // Delete temp object
                await getS3Client().send(new DeleteObjectCommand({
                    Bucket: bucketName,
                    Key: sourceKey
                }));

             } catch (s3Error) {
                 logger.error("Error moving S3 file:", s3Error);
                 // Don't fail the job creation, but log the error. 
                 // The file remains in temp location as fallback or we can just keep the temp URL.
                 job.jdFilePath = tempFileLocation;
                 await jobRepository.save(job);
             }
        } else if (fs.existsSync(tempFileLocation)) {
            // Handle Local file move (Legacy/Fallback)
            const tenantId = req.tenantId;
            const fileExtension = path.extname(tempFileLocation);
            const newFileName = `${job.id}${fileExtension}`;
            const newFilePath = path.join(
              "uploads",
              tenantId,
              "jds",
              newFileName
            );
    
            // Create directory if it doesn't exist
            const newDir = path.dirname(newFilePath);
            if (!fs.existsSync(newDir)) {
              fs.mkdirSync(newDir, { recursive: true });
            }
    
            // Move the file from temp to final location
            fs.renameSync(tempFileLocation, newFilePath);
    
            // Update job with file path
            job.jdFilePath = newFilePath;
            await jobRepository.save(job);
        }
      }

      // Send email notifications to newly assigned recruiters (excluding creator)
      // Send email notifications to Admin and HR
      const adminAndHrUsers = await userRepository.find({
            where: [
                { role: UserRole.ADMIN, tenantId: req.tenantId },
                { role: UserRole.HR, tenantId: req.tenantId }
            ]
      });

      adminAndHrUsers.forEach(async (adminUser) => {
          EmailService.notifyJobPendingApproval(
              adminUser.email,
              job.title,
              creator.name || creator.email
          );
      });


      return res.status(201).json(new JobDTO(job));
    } catch (error) {
      return res.status(500).json({ message: "Error creating job", error });
    }
  }

  static async parseJd(req: Request, res: Response) {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "JD file is required" });
    }

    try {
      // Extract text content from the file
      let content: string;

      if (
        file.mimetype === "text/plain" ||
        file.originalname.endsWith(".txt")
      ) {
        // For text files, read buffer
        content = file.buffer.toString("utf-8");
      } else if (file.mimetype === "application/pdf") {
        // For PDF files, extract text using pdf-parse
        const pdfData = await pdfParse(file.buffer);
        content = pdfData.text;
      } else if (
        file.mimetype ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
        file.mimetype === "application/msword" ||
        file.originalname.endsWith(".docx") ||
        file.originalname.endsWith(".doc")
      ) {
        // For Word files, extract text using mammoth
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        content = result.value;
      } else {
        return res
          .status(400)
          .json({
            message:
              "Unsupported file type. Please upload a PDF, DOC, DOCX, or TXT file.",
          });
      }

      // Check if we got meaningful content
      if (!content || content.trim().length < 10) {
        return res
          .status(400)
          .json({
            message:
              "Could not extract sufficient text from the file. Please ensure the file contains readable text.",
          });
      }

      // Upload file to S3 temp location
      const uniqueId = Date.now() + "-" + Math.random().toString(36).substring(2, 15);
      const fileExtension = path.extname(file.originalname);
      const tenantId = req.tenantId || (req.headers["x-tenant-id"] as string);
      
      let tenantName = 'default';
      if (tenantId) {
          const tenantRepository = AppDataSource.getRepository(Tenant);
          // Simple UUID check
          const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(tenantId);
          
          let tenant;
          if (isUuid) {
              tenant = await tenantRepository.findOne({ where: { id: tenantId } });
          } else {
              // If not UUID, assume it might be the name
              tenant = await tenantRepository.findOne({ where: { name: tenantId } });
          }

          if (tenant) tenantName = tenant.name;
      }
      
      const s3Path = `tenants/${tenantName}/jds/temp/${uniqueId}${fileExtension}`;

      logger.info(`Uploading JD to S3 path: ${s3Path}. Bucket: ${process.env.S3_BUCKET_NAME}`);

      const uploadResult = await getFileUploadService().upload({
          file: file.buffer,
          contentType: file.mimetype,
          contentLength: file.size
      }, s3Path);

      // Use AI service to parse the job description
      const parsedData = await aiService.parseJobDescription(content);

      // Return only the parsed data, not creating a job yet
      const response = {
        title: parsedData.title || "",
        description: parsedData.description || "",
        tags: parsedData.tags || [],
        requiredSkills: parsedData.requiredSkills || [],
        niceToHaveSkills: parsedData.niceToHaveSkills || [],
        content: content,
        tempFileLocation: uploadResult.url
      };

      return res.status(200).json(response);
    } catch (error) {
      logger.error("Error parsing JD:", error);
      return res
        .status(500)
        .json({ 
            message: `JD Upload Failed: ${(error as any).message}`, 
            error: (error as any).message, 
            stack: (error as any).stack 
        });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const {
      title,
      description,
      expected_closing_date,
      department,
      branch,
      tags,
    } = req.body;

    const jobRepository = AppDataSource.getRepository(Job);

    try {
      const job = await jobRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        relations: ["created_by", "assignees", "candidates"],
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.status === JobStatus.CLOSED) {
        return res.status(400).json({ message: "Cannot update closed job" });
      }

      if (title) job.title = title;
      if (description) job.description = description;
      if (department) job.department = department;
      if (branch) job.branch = branch;
      if (tags) job.tags = tags;
      if (expected_closing_date) {
        const newExpectedClosingDate = new Date(expected_closing_date);
        const jobStartDate = job.start_date
          ? new Date(job.start_date)
          : new Date();
        if (newExpectedClosingDate <= jobStartDate) {
          return res
            .status(400)
            .json({
              message: "Expected closing date must be after start date",
            });
        }
        job.expected_closing_date = newExpectedClosingDate;
      }

      await jobRepository.save(job);
      return res.json(new JobDTO(job));
    } catch (error) {
      return res.status(500).json({ message: "Error updating job", error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const jobRepository = AppDataSource.getRepository(Job);
    const candidateAiOverviewRepository = AppDataSource.getRepository(CandidateAiOverview);

    try {
      const job = await jobRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.status === JobStatus.CLOSED) {
        return res.status(400).json({ message: "Cannot delete closed job" });
      }

      // Check for dependent AI overview records
      const dependentAiOverviews = await candidateAiOverviewRepository.find({
        where: { jobId: id, tenantId: req.tenantId }
      });

      logger.info(`🔍 Found ${dependentAiOverviews.length} dependent AI overview records for job ${id}`);

      if (dependentAiOverviews.length > 0) {
        logger.info('📋 Attempting to delete dependent AI overview records first...');
        try {
          await candidateAiOverviewRepository.remove(dependentAiOverviews);
          logger.info('✅ Successfully deleted dependent AI overview records');
        } catch (cleanupError) {
          logger.error('❌ Error cleaning up AI overview records:', cleanupError);
          return res.status(500).json({
            message: "Error deleting job - could not clean up dependent AI overview records",
            error: cleanupError
          });
        }
      }

      await jobRepository.remove(job);
      return res.status(204).send();
    } catch (error) {
      logger.error('❌ Error in JobController.delete():', error);
      return res.status(500).json({ message: "Error deleting job", error });
    }
  }

  static async close(req: Request, res: Response) {
    const { id } = req.params;
    const jobRepository = AppDataSource.getRepository(Job);

    try {
      const job = await jobRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        relations: ["created_by", "assignees", "candidates"],
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.status === JobStatus.CLOSED) {
        return res.status(400).json({ message: "Job is already closed" });
      }

      job.status = JobStatus.CLOSED;
      job.actual_closing_date = new Date();

      await jobRepository.save(job);
      return res.json(new JobDTO(job));
    } catch (error) {
      return res.status(500).json({ message: "Error closing job", error });
    }
  }

  static async assign(req: Request, res: Response) {
    const { id } = req.params;
    const { userIds } = req.body;

    if (!userIds || !Array.isArray(userIds)) {
      return res.status(400).json({ message: "User IDs array is required" });
    }

    const jobRepository = AppDataSource.getRepository(Job);
    const userRepository = AppDataSource.getRepository(User);

    try {
      const job = await jobRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        relations: ["assignees", "created_by"],
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      const users = await userRepository.findByIds(userIds);
      if (users.length !== userIds.length) {
        return res.status(404).json({ message: "One or more users not found" });
      }

      // Track newly assigned users for email notifications
      const previousAssigneeIds = job.assignees.map((a) => a.id);
      const newlyAssignedUsers = users.filter(
        (u) => !previousAssigneeIds.includes(u.id)
      );

      job.assignees = users;
      await jobRepository.save(job);

      // Send email notifications to newly assigned users
      const notificationRepository = AppDataSource.getRepository(Notification);
      // Send email notifications to newly assigned users
      newlyAssignedUsers.forEach(async (user) => {
        const startDate = job.start_date || new Date();
        const expectedClosingDate = job.expected_closing_date || new Date();
        EmailService.notifyJobAssignment(
          user.email,
          job.title,
          job.description,
          startDate,
          expectedClosingDate
        );

        // Create notification
        const notification = new Notification();
        notification.user = user;
        notification.type = NotificationType.JOB_ASSIGNED;
        notification.message = `You have been assigned to a new job: ${job.title}`;
        notification.relatedEntityId = parseInt(job.id as any) || 0;
        await notificationRepository.save(notification);
      });

      return res.json(new JobDTO(job));
    } catch (error) {
      return res.status(500).json({ message: "Error assigning users", error });
    }
  }

  static async approve(req: Request, res: Response) {
    const { id } = req.params;
    const { budget, assigneeIds } = req.body;
    const user = req.user;
    const jobRepository = AppDataSource.getRepository(Job);
    const userRepository = AppDataSource.getRepository(User);
    const notificationRepository = AppDataSource.getRepository(Notification);

    // Only Admin and HR can approve jobs
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.HR) {
      return res.status(403).json({ message: "Only Admin and HR can approve jobs" });
    }

    try {
      const job = await jobRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        relations: ["assignees", "created_by"]
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      if (job.status === JobStatus.OPEN) {
        return res.status(400).json({ message: "Job is already approved" });
      }

      job.status = JobStatus.OPEN;
      job.approved_by = await AppDataSource.getRepository(User).findOne({ where: { id: user.userId } });
      job.approved_at = new Date();
      if (req.body.comment) {
        job.approval_comment = req.body.comment;
      }

      if (budget) {
        job.budget = budget;
      }

      if (assigneeIds && Array.isArray(assigneeIds) && assigneeIds.length > 0) {
        const assignees = await userRepository.findBy({
           id: In(assigneeIds),
           tenantId: req.tenantId
        });
        job.assignees = assignees;
      }

      await jobRepository.save(job);

      // Notify Hiring Manager (Creator)
      if (job.created_by) {
        EmailService.notifyJobApproved(
          job.created_by.email,
          job.title,
          budget
        );
      }

      // Notify assignees (recruiters) now that it is approved
      const assignees = job.assignees || [];
      const creatorId = job.created_by?.id;
      
      const recruitersToNotify = assignees.filter((a) => a.id !== creatorId);
      
      recruitersToNotify.forEach(async (recruiter) => {
        const startDate = job.start_date ? new Date(job.start_date) : new Date();
        const expectedClosingDate = job.expected_closing_date ? new Date(job.expected_closing_date) : new Date(); // Fallback if null
        
        EmailService.notifyJobAssignment(
          recruiter.email,
          job.title,
          job.description,
          startDate,
          expectedClosingDate
        );

        // Create notification
        const notification = new Notification();
        notification.user = recruiter;
        notification.type = NotificationType.JOB_ASSIGNED;
        notification.message = `You have been assigned to a new job: ${job.title}`;
        notification.relatedEntityId = parseInt(job.id as any) || 0;
        await notificationRepository.save(notification);
      });

      return res.json(new JobDTO(job));
    } catch (error) {
      return res.status(500).json({ message: "Error approving job", error });
    }
  }

  static async reject(req: Request, res: Response) {
    const { id } = req.params;
    const { reason } = req.body;
    const user = req.user;
    const jobRepository = AppDataSource.getRepository(Job);

    // Only Admin and HR can reject jobs
    if (user.role !== UserRole.ADMIN && user.role !== UserRole.HR) {
      return res.status(403).json({ message: "Only Admin and HR can reject jobs" });
    }

    if (!reason) {
      return res.status(400).json({ message: "Rejection reason is required" });
    }

    try {
      const job = await jobRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        relations: ["created_by"]
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      job.status = JobStatus.REJECTED;
      job.rejectionReason = reason;
      job.rejected_by = await AppDataSource.getRepository(User).findOne({ where: { id: user.userId } });
      job.rejected_at = new Date();
      await jobRepository.save(job);

      // Notify Hiring Manager (Creator)
      if (job.created_by) {
        EmailService.notifyJobRejected(
          job.created_by.email,
          job.title,
          reason
        );
      }

      return res.json(new JobDTO(job));
    } catch (error) {
      return res.status(500).json({ message: "Error rejecting job", error });
    }
  }

  static async list(req: Request, res: Response) {
    const user = req.user;
    const { status } = req.query;
    const jobRepository = AppDataSource.getRepository(Job);
    const userRepository = AppDataSource.getRepository(User);

    logger.info('🚀 JobController.list() called', { user: user, statusFilter: status, tenantId: req.tenantId });

    try {
      logger.info('🔍 Starting job repository query...');
      let jobs;

      if (user.role === UserRole.ADMIN || user.role === UserRole.HR) {
        // Admin and HR can see all jobs
        const whereClause: any = { tenantId: req.tenantId };
        if (status === "active") {
          whereClause.status = JobStatus.OPEN;
        } else if (status === "closed") {
          whereClause.status = JobStatus.CLOSED;
        }

        jobs = await jobRepository.find({
          where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
          relations: ["created_by", "candidates", "assignees", "feedbackTemplates"],
        });

        logger.info('📊 Jobs found:', { count: jobs.length });
        if (jobs.length > 0) {
           logger.info('🔧 First job sample:', {
              id: jobs[0].id,
              title: jobs[0].title,
              feedbackTemplates: jobs[0].feedbackTemplates?.length
           });
        }
      } else if (user.role === UserRole.HIRING_MANAGER) {
        // EM can see jobs they created or are assigned to
        const whereClause: any = [
          { created_by: { id: user.userId }, tenantId: req.tenantId },
          { assignees: { id: user.userId }, tenantId: req.tenantId },
        ];

        if (status === "active") {
          whereClause[0].status = JobStatus.OPEN;
          whereClause[1].status = JobStatus.OPEN;
        } else if (status === "closed") {
          whereClause[0].status = JobStatus.CLOSED;
          whereClause[1].status = JobStatus.CLOSED;
        }

        jobs = await jobRepository.find({
          where: whereClause,
          relations: ["created_by", "candidates", "assignees", "feedbackTemplates"],
        });
      } else if (user.role === UserRole.RECRUITER) {
        // Recruiters can only see jobs assigned to them

        // Find the user in database by email (not JWT token ID)
        const dbUser = await userRepository.findOne({
          where: { email: user.email, tenantId: req.tenantId },
        });

        if (!dbUser) {
          return res.status(403).json({ message: "User not found" });
        }

        const whereClause: any = { tenantId: req.tenantId };

        if (status === "active") {
          whereClause.status = JobStatus.OPEN;
        } else if (status === "closed") {
          whereClause.status = JobStatus.CLOSED;
        }

        // Get all jobs for the tenant with relations
        const allJobs = await jobRepository.find({
          where: whereClause,
          relations: ["created_by", "candidates", "assignees", "feedbackTemplates"],
        });

        // Filter jobs assigned to the database user ID
        // Also filter out jobs that are not OPEN or CLOSED (Recruiters shouldn't see pending jobs)
        jobs = allJobs.filter((job) =>
          job.assignees?.some((assignee) => assignee.id === dbUser.id) && 
          (job.status === JobStatus.OPEN || job.status === JobStatus.CLOSED)
        );
      } else {
        return res.status(403).json({ message: "Forbidden" });
      }

      logger.info('📦 Preparing DTO response...');
      const jobDTOs = jobs.map(job => new JobDTO(job));
      logger.info('🎁 DTOs created:', { count: jobDTOs.length });
      if (jobDTOs.length > 0) {
          logger.info('📋 First DTO sample:', {
            id: jobDTOs[0].id,
            title: jobDTOs[0].title,
            feedbackTemplates: jobDTOs[0].feedbackTemplates?.length
          });
      }

      return res.json(jobDTOs);
    } catch (error) {
      logger.error('❌ Error in JobController.list():', error);
      return res.status(500).json({ message: "Error fetching jobs", error: error.message });
    }
  }

  static async getOne(req: Request, res: Response) {
    const { id } = req.params;
    const jobRepository = AppDataSource.getRepository(Job);
    try {
      const job = await jobRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        relations: ["created_by", "candidates", "assignees", "feedbackTemplates", "feedbackTemplates.questions", "approved_by", "rejected_by"],
      });
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      return res.json(new JobDTO(job));
    } catch (error) {
      return res.status(500).json({ message: "Error fetching job", error });
    }
  }


  static async getJd(req: Request, res: Response) {
    const { id } = req.params;
    const jobRepository = AppDataSource.getRepository(Job);

    try {
      const job = await jobRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
      });
      if (!job || !job.jdFilePath) {
        return res.status(404).json({ message: "Job Description not found" });
      }

      let fileKey = job.jdFilePath;
      // If the path is a full URL, extract the key
      if (job.jdFilePath.startsWith('http')) {
          try {
              const urlObj = new URL(job.jdFilePath);
              // pathname includes leading slash e.g. /tenants/..., so substring(1)
              fileKey = urlObj.pathname.substring(1);
          } catch (e) {
              logger.error("Error parsing JD URL:", e);
          }
      }

      // If streaming from S3
      try {
        const fileStream = await getFileUploadService().getFileStream(fileKey);
        
        // Determine content type based on extension
        const ext = path.extname(fileKey).toLowerCase();
        let contentType = 'application/octet-stream';
        if (ext === '.pdf') contentType = 'application/pdf';
        else if (ext === '.doc') contentType = 'application/msword';
        else if (ext === '.docx') contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        else if (ext === '.txt') contentType = 'text/plain';

        res.setHeader('Content-Type', contentType);
        res.setHeader('Content-Disposition', `inline; filename="job-description${ext}"`);
        (fileStream as any).pipe(res);
      } catch (s3Error) {
         logger.error("Error fetching JD from S3:", s3Error);
         // Fallback for legacy local files
         if (fs.existsSync(job.jdFilePath)) {
             res.sendFile(path.resolve(job.jdFilePath));
         } else {
             res.status(404).json({ message: "JD file not found" });
         }
      }

    } catch (error) {
      return res.status(500).json({ message: "Error fetching Job Description", error });
    }
  }


  static async getFeedbackTemplates(req: Request, res: Response) {
    const { id } = req.params;
    const jobRepository = AppDataSource.getRepository(Job);

    try {
      const job = await jobRepository.findOne({
        where: { id: id as string, tenantId: req.tenantId },
        relations: ["feedbackTemplates", "feedbackTemplates.questions"],
      });

      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }

      return res.json(job.feedbackTemplates);
    } catch (error) {
      return res
        .status(500)
        .json({ message: "Error fetching job feedback templates", error });
    }
  }
}
