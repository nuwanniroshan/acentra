import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { EmailTemplate } from "@/entity/EmailTemplate";

export class EmailTemplateController {
  static async list(req: Request, res: Response) {
    const repository = AppDataSource.getRepository(EmailTemplate);
    try {
      const templates = await repository.find({
        where: { tenantId: req.tenantId },
        order: { name: "ASC" },
      });
      return res.json(templates);
    } catch (error) {
      return res.status(500).json({ message: "Error fetching templates", error });
    }
  }

  static async create(req: Request, res: Response) {
    const { name, subject, body } = req.body;
    if (!name || !subject || !body) {
      return res.status(400).json({ message: "Name, subject, and body are required" });
    }

    const repository = AppDataSource.getRepository(EmailTemplate);
    try {
      const template = repository.create({
        name,
        subject,
        body,
        tenantId: req.tenantId,
      });
      await repository.save(template);
      return res.status(201).json(template);
    } catch (error) {
      return res.status(500).json({ message: "Error creating template", error });
    }
  }

  static async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, subject, body } = req.body;

    const repository = AppDataSource.getRepository(EmailTemplate);
    try {
      const template = await repository.findOne({
        where: { id, tenantId: req.tenantId },
      });

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      if (name) template.name = name;
      if (subject) template.subject = subject;
      if (body) template.body = body;

      await repository.save(template);
      return res.json(template);
    } catch (error) {
      return res.status(500).json({ message: "Error updating template", error });
    }
  }

  static async delete(req: Request, res: Response) {
    const { id } = req.params;
    const repository = AppDataSource.getRepository(EmailTemplate);
    try {
      const template = await repository.findOne({
        where: { id, tenantId: req.tenantId },
      });

      if (!template) {
        return res.status(404).json({ message: "Template not found" });
      }

      await repository.remove(template);
      return res.json({ message: "Template deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Error deleting template", error });
    }
  }
}
