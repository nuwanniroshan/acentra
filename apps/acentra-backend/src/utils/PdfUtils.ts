
import { logger } from "@acentra/logger";
import path from "path";
import fs from "fs";
import { S3FileUploadService } from "@acentra/file-storage";

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
   * Returns empty string if not a PDF or if extraction fails
   */
  static async extractTextFromBuffer(buffer: Buffer): Promise<string> {
    try {
        // Dynamic import for ESM module
        // @ts-ignore
        const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");

        const loadingTask = pdfjsLib.getDocument({
            data: new Uint8Array(buffer),
            useSystemFonts: true,
            disableFontFace: true,
        });

        const doc = await loadingTask.promise;
        let fullText = "";

        for (let i = 1; i <= doc.numPages; i++) {
            const page = await doc.getPage(i);
            const textContent = await page.getTextContent();
            
            const pageText = textContent.items
                .map((item: any) => item.str || "")
                .join(" ");
            
            fullText += pageText + "\n";
        }
        return fullText;
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
