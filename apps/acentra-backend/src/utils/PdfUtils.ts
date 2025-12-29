
import { logger } from "@acentra/logger";
import path from "path";
import fs from "fs";
import { S3FileUploadService } from "@acentra/file-storage";
// @ts-ignore
import PDFParser from "pdf2json";

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
   * Extract text from a buffer using pdf2json
   */
  static async extractTextFromBuffer(buffer: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const pdfParser = new PDFParser(this, true);

      pdfParser.on("pdfParser_dataError", (errData: any) => {
          logger.error("pdf2json dataError:", errData);
          reject(new Error("PDF Parsing Error"));
      });
      
      pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
          try {
            // parsing pdfData to get text
            // pdf2json "text mode" (constructor arg 1) extracts text content specifically
            // The raw text content is accessible via getRawTextContent() usually using the txt file output but here we have the JSON data.
            // With '1' (text mode), pdfData.formImage.Pages[].Texts[].R[].T is encoded text.
            
            // Actually, pdf2json returns a JSON representation. 
            // We need to iterate over pages and texts.
            const rawText = pdfParser.getRawTextContent();
            
            // If raw text is empty (sometimes happens), we might need to manually extract from JSON structure.
            if (rawText) {
                resolve(rawText);
            } else {
                // Fallback: manual extraction from JSON
                 let extractedText = "";
                 if (pdfData && pdfData.Pages) {
                     for (const page of pdfData.Pages) {
                         if (page.Texts) {
                             for (const text of page.Texts) {
                                 if (text.R) {
                                     for (const r of text.R) {
                                         // Text is URL encoded
                                         extractedText += decodeURIComponent(r.T) + " ";
                                     }
                                 }
                             }
                         }
                         extractedText += "\n";
                     }
                 }
                 resolve(extractedText);
            }
          } catch (e) {
              reject(e);
          }
      });

      try {
          pdfParser.parseBuffer(buffer);
      } catch (e) {
          reject(e);
      }
    });
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
