
import { logger } from "@acentra/logger";
import path from "path";
import fs from "fs";
import { S3FileUploadService } from "@acentra/file-storage";
import pdfParse from "pdf-parse";

export class PdfUtils {
  
  private static async streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on("data", (chunk: any) => chunks.push(chunk));
      stream.on("error", reject);
      stream.on("end", () => resolve(Buffer.concat(chunks)));
    });
  }

  /**
   * Extract text from a buffer (PDF specific)
   * Includes validation to ensure file is a valid PDF
   */
  static async extractTextFromBuffer(buffer: Buffer): Promise<string> {
    try {
        // Validate PDF Header
        // The PDF header is %PDF- followed by version number. e.g. %PDF-1.4
        // Check first 5 bytes.
        if (!buffer || buffer.length < 5 || !buffer.toString('utf-8', 0, 5).startsWith('%PDF-')) {
            logger.warn("File buffer does not start with %PDF- header. Rejecting.");
            throw new Error("Invalid PDF file: Missing or incorrect PDF header.");
        }

        const data = await pdfParse(buffer);
        return data.text;
    } catch (error) {
        logger.error("Error parsing PDF buffer:", error);
        throw error;
    }
  }

  /**
   * Helper to extract text from a file path (local or S3)
   */
  static async extractPdfText(filePath: string): Promise<string> {
      try {
        let dataBuffer: Buffer;
        const absolutePath = path.resolve(filePath);
  
        if (fs.existsSync(absolutePath)) {
          dataBuffer = fs.readFileSync(absolutePath);
        } else {
          // Try fetching from S3
          try {
            const fileUploadService = new S3FileUploadService();
            const fileStream = await fileUploadService.getFileStream(filePath);
            dataBuffer = await PdfUtils.streamToBuffer(fileStream);
          } catch (s3Error) {
            logger.error(`File not found locally (${absolutePath}) or in S3 (${filePath})`, s3Error);
            throw new Error(`File not found: ${filePath}`);
          }
        }
        
        return PdfUtils.extractTextFromBuffer(dataBuffer);

      } catch (error) {
          logger.error("Error extracting PDF text:", error);
          throw error;
      }
  }
}



