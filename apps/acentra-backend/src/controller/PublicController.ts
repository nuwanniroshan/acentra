import { Request, Response } from "express";
import { EmailService } from "@acentra/email-service";
import { logger } from "@acentra/logger";

export class PublicController {
  static async requestDemo(req: Request, res: Response) {
    try {
      const { name, email, phone, meetingTime } = req.body;

      if (!name || !email || !phone) {
        return res
          .status(400)
          .json({ message: "Name, email, and phone are required." });
      }

      await EmailService.sendDemoRequestEmail({
        name,
        email,
        phone,
        meetingTime,
      });

      return res
        .status(200)
        .json({ message: "Demo request submitted successfully." });
    } catch (error) {
      logger.error("Error processing demo request:", error);
      return res
        .status(500)
        .json({ message: "Internal server error." });
    }
  }
}
