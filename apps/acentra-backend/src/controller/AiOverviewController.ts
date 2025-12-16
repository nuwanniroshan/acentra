import { Request, Response } from "express";
/// <reference path="../types/express/index.d.ts" />
import { AppDataSource } from "@/data-source";
import { CandidateAiOverview } from "@/entity/CandidateAiOverview";
import { Candidate } from "@/entity/Candidate";
import { aiService } from "@/service/AIService";
import { CandidateAiOverviewDTO } from "@/dto/CandidateAiOverviewDTO";
import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";

import { S3FileUploadService } from "@acentra/file-storage";

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
      let dataBuffer: Buffer;
      const fileExtension = path.extname(cvFilePath).toLowerCase();
      const absolutePath = path.resolve(cvFilePath);

      // Check if file exists locally (Legacy)
      if (fs.existsSync(absolutePath)) {
        dataBuffer = fs.readFileSync(absolutePath);
      } else {
        // Try fetching from S3
        try {
          const fileUploadService = new S3FileUploadService();
          const fileStream = await fileUploadService.getFileStream(cvFilePath);
          dataBuffer = await AiOverviewController.streamToBuffer(fileStream);
        } catch (s3Error) {
          console.error(`File not found locally (${absolutePath}) or in S3 (${cvFilePath})`, s3Error);
          throw new Error(`CV file not found: ${cvFilePath}`);
        }
      }

      if (fileExtension === ".pdf") {
        // Extract text from PDF using pdf-parse
        const pdfData = await pdfParse(dataBuffer);
        return pdfData.text;
      } else if (fileExtension === ".doc" || fileExtension === ".docx") {
        // Extract text from Word documents using mammoth
        const result = await mammoth.extractRawText({ buffer: dataBuffer });
        return result.value;
      } else {
        // Try reading as text
        return dataBuffer.toString("utf-8");
      }
    } catch (error) {
      console.error("Error extracting CV content:", error);
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
      console.error("Error fetching AI overview:", error);
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

      return res.json(new CandidateAiOverviewDTO(overview));
    } catch (error) {
      console.error("Error generating AI overview:", error);
      return res.status(500).json({
        message: "Failed to generate overview. Please try again.",
        error: error.message,
      });
    }
  }
}
