import { Request, Response } from "express";
import { logger } from "@acentra/logger";
/// <reference path="../types/express/index.d.ts" />
import { AppDataSource } from "@/data-source";
import { CandidateAiOverview } from "@/entity/CandidateAiOverview";
import { Candidate } from "@/entity/Candidate";
import { aiService } from "@/service/AIService";
import { CandidateAiOverviewDTO } from "@/dto/CandidateAiOverviewDTO";
import fs from "fs";
import path from "path";

import mammoth from "mammoth";

import { S3FileUploadService } from "@acentra/file-storage";
import { PdfUtils } from "@/utils/PdfUtils";

export class AiOverviewController {
  /**
   * Helper to convert stream to buffer
   */
  private static streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on("data", (chunk: any) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  /**
   * Extract text content from CV file
   */
  private static async extractCvContent(cvFilePath: string): Promise<string> {
    try {
      const fileExtension = path.extname(cvFilePath).toLowerCase();

      if (fileExtension === ".pdf") {
         return PdfUtils.extractPdfText(cvFilePath);
      } 
      
      // For other formats we still need the buffer logic or use PdfUtils helper if expanded. 
      // But PdfUtils handles reading file into buffer too. 
      // Reuse PdfUtils logic to get buffer? 
      // The original code handled local vs S3. PdfUtils.extractPdfText does that too.
      // But for docx we need buffer for mammoth.
      
      // Let's reuse the logic from original code or refactor strictly for now:
      // Since PdfUtils.extractPdfText returns string, we use it for PDF.
      // For others we still need to read file.
      
      let dataBuffer: Buffer;
      const absolutePath = path.resolve(cvFilePath);
      if (fs.existsSync(absolutePath)) {
        dataBuffer = fs.readFileSync(absolutePath);
      } else {
        const fileUploadService = new S3FileUploadService();
        const fileStream = await fileUploadService.getFileStream(cvFilePath);
        dataBuffer = await AiOverviewController.streamToBuffer(fileStream);
      }

      if (fileExtension === ".doc" || fileExtension === ".docx") {
        // Extract text from Word documents using mammoth
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        return result.value;
      } else {
        // Try reading as text
        return dataBuffer.toString("utf-8");
      }
    } catch (error) {
      logger.error("Error extracting CV content:", error);
      throw new Error("Failed to extract CV content");
    }
  }
  /**
   * GET /candidates/:id/ai-overview
   * Retrieve existing AI overview for a candidate
   */
  static async getOverview(req: Request, res: Response) {
    const { id } = req.params;
    const overviewRepository = AppDataSource.getRepository(CandidateAiOverview);

    try {
      const overview = await overviewRepository.findOne({
        where: {
          candidateId: id,
          tenantId: req.tenantId,
        },
      });

      if (!overview) {
        return res.status(404).json({ message: "No overview found" });
      }

      return res.json(new CandidateAiOverviewDTO(overview));
    } catch (error) {
      logger.error("Error fetching AI overview:", error);
      return res
        .status(500)
        .json({ message: "Error fetching AI overview", error });
    }
  }

  /**
   * POST /candidates/:id/ai-overview/generate
   * Generate a new AI overview for a candidate
   */
  static async generateOverview(req: Request, res: Response) {
    const { id } = req.params;
    const candidateRepository = AppDataSource.getRepository(Candidate);
    const overviewRepository = AppDataSource.getRepository(CandidateAiOverview);

    try {
      // Fetch candidate with job details
      const candidate = await candidateRepository.findOne({
        where: { id, tenantId: req.tenantId },
        relations: ["job"],
      });

      if (!candidate) {
        return res.status(404).json({ message: "Candidate not found" });
      }

      // Validate CV exists
      if (!candidate.cv_file_path) {
        return res.status(400).json({
          message: "Candidate CV is required to generate overview",
        });
      }

      // Validate job description exists
      if (!candidate.job || (!candidate.job.description && !candidate.job.jd)) {
        return res.status(400).json({
          message: "Job description is required to generate overview",
        });
      }

      // Extract CV content from file
      const cvContent = await AiOverviewController.extractCvContent(
        candidate.cv_file_path
      );

      // Generate AI overview
      const jobDescription = candidate.job.jd || candidate.job.description;
      const aiResult = await aiService.generateCandidateOverview(
        cvContent,
        jobDescription,
        candidate.job.title
      );

      // Check if overview already exists
      let overview = await overviewRepository.findOne({
        where: {
          candidateId: id,
          tenantId: req.tenantId,
        },
      });

      if (overview) {
        // Update existing overview
        overview.overviewText = aiResult.detailedAnalysis;
        overview.structuredData = {
          summary: aiResult.summary,
          strengths: aiResult.strengths,
          gaps: aiResult.gaps,
          matchScore: aiResult.matchScore,
        };
        overview.updatedAt = new Date();
      } else {
        // Create new overview
        overview = new CandidateAiOverview();
        overview.candidate = candidate;
        overview.candidateId = candidate.id;
        overview.job = candidate.job;
        overview.jobId = candidate.job.id;
        overview.overviewText = aiResult.detailedAnalysis;
        overview.structuredData = {
          summary: aiResult.summary,
          strengths: aiResult.strengths,
          gaps: aiResult.gaps,
          matchScore: aiResult.matchScore,
        };
        overview.generatedBy = "AI";
        overview.tenantId = req.tenantId;
      }

      await overviewRepository.save(overview);

      // Denormalize score into candidate for fast access in lists
      candidate.ai_match_score = aiResult.matchScore;
      await candidateRepository.save(candidate);

      return res.json(new CandidateAiOverviewDTO(overview));
    } catch (error) {
      logger.error("Error generating AI overview:", error);
      
      // Handle known errors with specific status codes
      if (error.message.includes("Invalid PDF file")) {
        return res.status(400).json({
          message: error.message,
          error: "InvalidFileFormat"
        });
      }
      
      return res.status(500).json({
        message: "Failed to generate overview. Please try again.",
        error: error.message,
      });
    }
  }
}
