import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { FeedbackTemplate, FeedbackTemplateType } from "../entity/FeedbackTemplate";
import { FeedbackQuestion } from "../entity/FeedbackQuestion";
import { FeedbackTemplateDTO } from "../dto/FeedbackTemplateDTO";

export class FeedbackTemplateController {
  private templateRepository = AppDataSource.getRepository(FeedbackTemplate);
  private questionRepository = AppDataSource.getRepository(FeedbackQuestion);

  // Get all templates
  async getAllTemplates(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const templates = await this.templateRepository.find({
        where: { tenantId },
        order: { created_at: "DESC" }
      });

      // Convert to DTOs for reduced payload
      const templateDTOs = await Promise.all(templates.map(async template => {
        // Load questions if they're lazy-loaded
        if (template.questions instanceof Promise) {
          const questions = await template.questions;
          template.questionsCount = questions.length;
        } else {
          template.questionsCount = template.questions ? template.questions.length : 0;
        }
        return new FeedbackTemplateDTO(template);
      }));

       res.json(templateDTOs);
    } catch (error) {
      console.error("Error fetching templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  }

  // Get template by ID
  async getTemplateById(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;

      const template = await this.templateRepository.findOne({
        where: { id, tenantId }
      });

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Load questions if they're lazy-loaded
      if (template.questions instanceof Promise) {
        const questions = await template.questions;
        template.questionsCount = questions.length;
      } else {
        template.questionsCount = template.questions ? template.questions.length : 0;
      }

      // Convert to DTO with questions included for editing
      const templateDTO = new FeedbackTemplateDTO(template, true);
      res.json(templateDTO);
    } catch (error) {
      console.error("Error fetching template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  }

  // Create new template
  async createTemplate(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { name, type, description, category, instructions, isActive = true, questions = [] } = req.body;

      if (!name || !type) {
        return res.status(400).json({ message: "Name and type are required" });
      }

      // Validate type
      if (!Object.values(FeedbackTemplateType).includes(type)) {
        return res.status(400).json({ message: "Invalid template type" });
      }

      const user = (req as any).user;
      const createdBy = user?.userId || null;

      const template = this.templateRepository.create({
        name,
        type,
        description,
        category,
        instructions,
        isActive,
        tenantId,
        createdBy,
        questions: questions.map((q: any, index: number) => 
          this.questionRepository.create({
            ...q,
            order: index,
            tenantId
          })
        )
      });

      const savedTemplate = await this.templateRepository.save(template);

      // Fetch without relations (using lazy loading)
      const fullTemplate = await this.templateRepository.findOne({
        where: { id: savedTemplate.id }
      });

      // Load questions if they're lazy-loaded
      if (fullTemplate && fullTemplate.questions instanceof Promise) {
        const questions = await fullTemplate.questions;
        fullTemplate.questionsCount = questions.length;
      } else if (fullTemplate) {
        fullTemplate.questionsCount = fullTemplate.questions ? fullTemplate.questions.length : 0;
      }

      // Convert to DTO for reduced payload
      const templateDTO = new FeedbackTemplateDTO(fullTemplate);
      res.status(201).json(templateDTO);
    } catch (error) {
      console.error("Error creating template:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  }

  // Update template
  async updateTemplate(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const updates = req.body;

      const template = await this.templateRepository.findOne({
        where: { id, tenantId },
        relations: ['questions']
      });

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Update template properties
      Object.assign(template, updates);

      // Handle questions update if provided
      if (updates.questions) {
        // Remove existing questions
        await this.questionRepository.delete({ template: { id } as any });
        
        // Add new questions
        template.questions = updates.questions.map((q: any, index: number) =>
          this.questionRepository.create({
            ...q,
            order: index,
            tenantId
          })
        );
      }

      const savedTemplate = await this.templateRepository.save(template);

      // Fetch without relations (using lazy loading)
      const fullTemplate = await this.templateRepository.findOne({
        where: { id: savedTemplate.id }
      });

      // Load questions if they're lazy-loaded
      if (fullTemplate && fullTemplate.questions instanceof Promise) {
        const questions = await fullTemplate.questions;
        fullTemplate.questionsCount = questions.length;
      } else if (fullTemplate) {
        fullTemplate.questionsCount = fullTemplate.questions ? fullTemplate.questions.length : 0;
      }

      // Convert to DTO for reduced payload
      const templateDTO = new FeedbackTemplateDTO(fullTemplate);
      res.json(templateDTO);
    } catch (error) {
      console.error("Error updating template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  }

  // Delete template
  async deleteTemplate(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;

      const template = await this.templateRepository.findOne({
        where: { id, tenantId }
      });

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      await this.templateRepository.remove(template);
      
      res.json({ message: "Template deleted successfully" });
    } catch (error) {
      console.error("Error deleting template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  }

  // Get templates by type
  async getTemplatesByType(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { type } = req.params;

      if (!Object.values(FeedbackTemplateType).includes(type as FeedbackTemplateType)) {
        return res.status(400).json({ message: "Invalid template type" });
      }

      const templates = await this.templateRepository.find({
        where: { tenantId, type: type as FeedbackTemplateType, isActive: true },
        order: { name: "ASC" }
      });
// Convert to DTOs for reduced payload
const templateDTOs = await Promise.all(templates.map(async template => {
  // Load questions if they're lazy-loaded
  if (template.questions instanceof Promise) {
    const questions = await template.questions;
    template.questionsCount = questions.length;
  } else {
    template.questionsCount = template.questions ? template.questions.length : 0;
  }
  return new FeedbackTemplateDTO(template);
}));

 res.json(templateDTOs);
    } catch (error) {
      console.error("Error fetching templates by type:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  }

  // Clone template
  async cloneTemplate(req: Request, res: Response) {
    try {
      const tenantId = req.tenantId;
      const { id } = req.params;
      const { name } = req.body;

      const originalTemplate = await this.templateRepository.findOne({
        where: { id, tenantId }
      });

      if (!originalTemplate) {
        return res.status(404).json({ message: "Template not found" });
      }

      // Create new template with cloned data
      const clonedTemplate = this.templateRepository.create({
        ...originalTemplate,
        id: undefined,
        name: name || `${originalTemplate.name} (Copy)`,
        version: 1,
        questions: originalTemplate.questions.map(q => 
          this.questionRepository.create({
            ...q,
            id: undefined
          })
        )
      });

      const savedTemplate = await this.templateRepository.save(clonedTemplate);

      const fullTemplate = await this.templateRepository.findOne({
        where: { id: savedTemplate.id }
      });

      // Load questions if they're lazy-loaded
      if (fullTemplate && fullTemplate.questions instanceof Promise) {
        const questions = await fullTemplate.questions;
        fullTemplate.questionsCount = questions.length;
      } else if (fullTemplate) {
        fullTemplate.questionsCount = fullTemplate.questions ? fullTemplate.questions.length : 0;
      }

      // Convert to DTO for reduced payload
      const templateDTO = new FeedbackTemplateDTO(fullTemplate);
      res.status(201).json(templateDTO);
    } catch (error) {
      console.error("Error cloning template:", error);
      res.status(500).json({ message: "Failed to clone template" });
    }
  }
}