import { Request, Response } from "express";
import { logger } from "@acentra/logger";
import { AppDataSource } from "../data-source";
import {
  CandidateFeedbackTemplate,
  FeedbackStatus,
} from "../entity/CandidateFeedbackTemplate";
import { FeedbackResponse } from "../entity/FeedbackResponse";
import {
  FeedbackTemplate,
} from "../entity/FeedbackTemplate";
import { Candidate } from "../entity/Candidate";
import { Job } from "../entity/Job";
import { FeedbackDTO, FeedbackResponseDTO } from "../dto/FeedbackDTO";

export class FeedbackController {
  private candidateFeedbackRepository = AppDataSource.getRepository(
    CandidateFeedbackTemplate
  );
  private responseRepository = AppDataSource.getRepository(FeedbackResponse);
  private templateRepository = AppDataSource.getRepository(FeedbackTemplate);
  private candidateRepository = AppDataSource.getRepository(Candidate);
  private jobRepository = AppDataSource.getRepository(Job);

  // Get all feedback for a candidate
  async getCandidateFeedback(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { candidateId } = req.params;

      const feedback = await this.candidateFeedbackRepository.find({
        where: {
          candidate: { id: candidateId },
          tenantId,
        },
        relations: ["template", "template.questions"],
        order: { created_at: "DESC" },
      });

      logger.debug('Raw feedback from DB: ' + JSON.stringify(feedback, null, 2));

      // Get responses for each feedback
      const feedbackWithResponses = await Promise.all(
        feedback.map(async (feedback) => {
          const responses = await this.responseRepository.find({
            where: { candidateFeedback: { id: feedback.id } },
            relations: ["question"],
          });
          logger.debug('Feedback object: ' + JSON.stringify(feedback, null, 2));
          return { ...feedback, responses };
        })
      );

      // Convert to DTOs
      const feedbackDTOs = feedbackWithResponses.map(feedback => new FeedbackDTO(feedback));
      logger.debug('Feedback DTOs: ' + JSON.stringify(feedbackDTOs, null, 2));
      res.json(feedbackDTOs);
      res.json(feedbackDTOs);
    } catch (error) {
      logger.error("Error fetching candidate feedback:", error);
      res.status(500).json({ message: "Failed to fetch candidate feedback" });
    }
  }

  // Get specific feedback details with responses
  async getFeedbackDetails(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { feedbackId } = req.params;

      const feedback = await this.candidateFeedbackRepository.findOne({
        where: { id: feedbackId, tenantId },
        relations: ["template", "template.questions", "candidate"],
      });

      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }

      const responses = await this.responseRepository.find({
        where: { candidateFeedback: { id: feedbackId } },
        relations: ["question"],
      });

      // Convert to DTO
      const feedbackWithResponses = { ...feedback, responses };
      const feedbackDTO = new FeedbackDTO(feedbackWithResponses);
      res.json(feedbackDTO);
    } catch (error) {
      logger.error("Error fetching feedback details:", error);
      res.status(500).json({ message: "Failed to fetch feedback details" });
    }
  }

  // Attach template to candidate
  async attachTemplate(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { candidateId } = req.params;
      const { templateId } = req.body;

      if (!templateId) {
        return res.status(400).json({ message: "Template ID is required" });
      }

      // Verify candidate exists
      const candidate = await this.candidateRepository.findOne({
        where: { id: candidateId, tenantId },
        relations: ["job"],
      });

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      // Verify template exists and is active
      const template = await this.templateRepository.findOne({
        where: { id: templateId, tenantId, isActive: true },
        relations: ["questions"],
      });

      if (!template) {
        return res
          .status(404)
          .json({ message: "Template not found or inactive" });
      }

      // Check if template is already attached
      const existingFeedback = await this.candidateFeedbackRepository.findOne({
        where: {
          candidate: { id: candidateId },
          template: { id: templateId },
          tenantId,
        },
      });

      if (existingFeedback) {
        return res
          .status(400)
          .json({ message: "Template is already attached to this candidate" });
      }

      const user = (req as any).user;
      const assignedBy = user?.userId || null;

      const candidateFeedback = this.candidateFeedbackRepository.create({
        candidate,
        template,
        status: FeedbackStatus.NOT_STARTED,
        assignedBy,
        assignedAt: new Date(),
        isManuallyAssigned: true,
        tenantId,
      });

      const savedFeedback =
        await this.candidateFeedbackRepository.save(candidateFeedback);

      const fullFeedback = await this.candidateFeedbackRepository.findOne({
        where: { id: savedFeedback.id },
        relations: ["template", "template.questions", "candidate"],
      });

      // Convert to DTO
      const feedbackDTO = new FeedbackDTO(fullFeedback);
      res.status(201).json(feedbackDTO);
    } catch (error) {
      logger.error("Error attaching template:", error);
      res.status(500).json({ message: "Failed to attach template" });
    }
  }

  // Remove template from candidate
  async removeTemplate(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { feedbackId } = req.params;

      const feedback = await this.candidateFeedbackRepository.findOne({
        where: { id: feedbackId, tenantId },
      });

      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }

      await this.candidateFeedbackRepository.remove(feedback);

      res.json({ message: "Template removed successfully" });
    } catch (error) {
      logger.error("Error removing template:", error);
      res.status(500).json({ message: "Failed to remove template" });
    }
  }

  // Save/update response
  async saveResponse(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { feedbackId } = req.params;
      const {
        questionId,
        textAnswer,
        numericAnswer,
        booleanAnswer,
        selectedOption,
        comments,
      } = req.body;

      const user = (req as any).user;
      const answeredBy = user?.userId || null;

      // Verify feedback exists
      const feedback = await this.candidateFeedbackRepository.findOne({
        where: { id: feedbackId, tenantId },
      });

      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }

      // Check if response already exists
      let response = await this.responseRepository.findOne({
        where: {
          candidateFeedback: { id: feedbackId },
          question: { id: questionId },
          answeredBy,
        },
      });

      if (response) {
        // Update existing response
        response.textAnswer = textAnswer;
        response.numericAnswer = numericAnswer;
        response.booleanAnswer = booleanAnswer;
        response.selectedOption = selectedOption;
        response.comments = comments;
        response.answeredAt = new Date();
      } else {
        // Create new response
        response = this.responseRepository.create({
          candidateFeedback: { id: feedbackId } as any,
          question: { id: questionId } as any,
          textAnswer,
          numericAnswer,
          booleanAnswer,
          selectedOption,
          comments,
          answeredBy,
          tenantId,
        });
      }

      const savedResponse = await this.responseRepository.save(response);

      // Update feedback status if this was the first response
      if (feedback.status === FeedbackStatus.NOT_STARTED) {
        feedback.status = FeedbackStatus.IN_PROGRESS;
        await this.candidateFeedbackRepository.save(feedback);
      }

      const fullResponse = await this.responseRepository.findOne({
        where: { id: savedResponse.id },
        relations: ["question", "candidateFeedback"],
      });

      // Convert to DTO
      const responseDTO = new FeedbackResponseDTO(fullResponse);
      res.json(responseDTO);
    } catch (error) {
      logger.error("Error saving response:", error);
      res.status(500).json({ message: "Failed to save response" });
    }
  }

  // Complete feedback
  async completeFeedback(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { feedbackId } = req.params;
      const { generalComments } = req.body;

      const feedback = await this.candidateFeedbackRepository.findOne({
        where: { id: feedbackId, tenantId },
      });

      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }

      const user = (req as any).user;
      const completedBy = user?.userId || null;

      feedback.status = FeedbackStatus.COMPLETED;
      feedback.completedBy = completedBy;
      feedback.completedAt = new Date();
      if (generalComments) feedback.generalComments = generalComments;

      const savedFeedback =
        await this.candidateFeedbackRepository.save(feedback);

      const fullFeedback = await this.candidateFeedbackRepository.findOne({
        where: { id: savedFeedback.id },
        relations: ["template", "template.questions"],
      });

      // Convert to DTO
      const feedbackDTO = new FeedbackDTO(fullFeedback);
      res.json(feedbackDTO);
    } catch (error) {
      logger.error("Error completing feedback:", error);
      res.status(500).json({ message: "Failed to complete feedback" });
    }
  }

  // Auto-attach templates based on stage/job mapping
  async autoAttachTemplates(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { candidateId } = req.params;

      const candidate = await this.candidateRepository.findOne({
        where: { id: candidateId, tenantId },
        relations: ["job"],
      });

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      // Get all active templates
      const templates = await this.templateRepository.find({
        where: { tenantId, isActive: true },
        relations: ["questions"],
      });

      const user = (req as any).user;
      const assignedBy = user?.userId || null;

      const attachedTemplates = [];

      for (const template of templates) {
        // Check stage mapping
        const shouldAttachByStage =
          template.stageMappings?.includes(candidate.status) || false;

        // Check job type mapping
        const shouldAttachByJob =
          template.jobTypeMappings?.includes(candidate.job.title) || false;

        if (shouldAttachByStage || shouldAttachByJob) {
          // Check if already attached
          const existingFeedback =
            await this.candidateFeedbackRepository.findOne({
              where: {
                candidate: { id: candidateId },
                template: { id: template.id },
                tenantId,
              },
            });

          if (!existingFeedback) {
            const candidateFeedback = this.candidateFeedbackRepository.create({
              candidate,
              template,
              status: FeedbackStatus.NOT_STARTED,
              assignedBy,
              assignedAt: new Date(),
              isManuallyAssigned: false,
              tenantId,
            });

            const savedFeedback =
              await this.candidateFeedbackRepository.save(candidateFeedback);
            attachedTemplates.push(savedFeedback);
          }
        }
      }

      // Convert to DTOs
      const attachedTemplateDTOs = attachedTemplates.map(template => new FeedbackDTO(template));
      res.json({
        message: `${attachedTemplateDTOs.length} templates auto-attached`,
        attachedTemplates: attachedTemplateDTOs,
      });
    } catch (error) {
      logger.error("Error auto-attaching templates:", error);
      res.status(500).json({ message: "Failed to auto-attach templates" });
    }
  }

  // Get feedback statistics for admin dashboard
  async getFeedbackStats(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;

      const [totalFeedback, completedFeedback, inProgressFeedback] =
        await Promise.all([
          this.candidateFeedbackRepository.count({ where: { tenantId } }),
          this.candidateFeedbackRepository.count({
            where: { tenantId, status: FeedbackStatus.COMPLETED },
          }),
          this.candidateFeedbackRepository.count({
            where: { tenantId, status: FeedbackStatus.IN_PROGRESS },
          }),
        ]);

      const averageCompletionTime = await this.responseRepository
        .createQueryBuilder("response")
        .select(
          "AVG(EXTRACT(EPOCH FROM (response.answeredAt - response.created_at)))",
          "avgSeconds"
        )
        .where("response.tenantId = :tenantId", { tenantId })
        .getRawOne();

      res.json({
        total: totalFeedback,
        completed: completedFeedback,
        inProgress: inProgressFeedback,
        notStarted: totalFeedback - completedFeedback - inProgressFeedback,
        completionRate:
          totalFeedback > 0 ? (completedFeedback / totalFeedback) * 100 : 0,
        averageCompletionTime: averageCompletionTime?.avgSeconds || 0,
      });
    } catch (error) {
      logger.error("Error fetching feedback stats:", error);
      res.status(500).json({ message: "Failed to fetch feedback statistics" });
    }
  }
}
