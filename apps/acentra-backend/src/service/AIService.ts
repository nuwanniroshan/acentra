import OpenAI from "openai";
import { logger } from "@acentra/logger";
import {
  SecretsManagerClient,
  GetSecretValueCommand,
} from "@aws-sdk/client-secrets-manager";

export interface ParsedJobDescription {
  title: string;
  description: string;
  tags: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
}

export interface AiOverviewResult {
  summary: string;
  strengths: string[];
  gaps: string[];
  matchScore: number;
  detailedAnalysis: string;
}

export class AIService {
  private _openai: OpenAI | null = null;
  private secretsManager: SecretsManagerClient;
  private readonly secretName: string;

  constructor() {
    this.secretsManager = new SecretsManagerClient({ region: "us-east-1" });
    const env = process.env.ENVIRONMENT_NAME || "dev";
    this.secretName = `acentra-openai-api-key-${env}`;
  }

  private async getOpenAI(): Promise<OpenAI> {
    if (this._openai) {
      return this._openai;
    }

    try {
      // First check environment variable as a fallback or override
      if (process.env.OPENAI_API_KEY) {
        this._openai = new OpenAI({
          apiKey: process.env.OPENAI_API_KEY,
        });
        return this._openai;
      }

      // If not in env, fetch from Secrets Manager
      const command = new GetSecretValueCommand({ SecretId: this.secretName });
      const response = await this.secretsManager.send(command);

      if (!response.SecretString) {
        throw new Error("SecretString is empty");
      }

      let apiKey = "";
      try {
        const secret = JSON.parse(response.SecretString);
        apiKey = secret.OPENAI_API_KEY || secret.openai_api_key || "";
      } catch (e) {
        // If not JSON, assume the entire string is the key
        apiKey = response.SecretString;
      }

      if (!apiKey) {
        throw new Error("Could not extract API key from secret");
      }

      this._openai = new OpenAI({
        apiKey: apiKey,
      });

      return this._openai;
    } catch (error) {
      logger.error("Failed to initialize OpenAI client:", error);
      throw error;
    }
  }

  async parseJobDescription(content: string): Promise<ParsedJobDescription> {
    try {
      const openai = await this.getOpenAI();
      const prompt = `
Analyze the following job description and extract the key information in JSON format.
Also determine if the provided text is actually a valid job description and provide a confidence score (0-100).

Job Description:
${content}

Return a JSON object with the following structure:
{
  "title": "Job title",
  "description": "Brief description of the job (2-3 sentences)",
  "tags": ["tag1", "tag2", "tag3"] - relevant tags like "Remote", "Full-time", "Senior", etc.
  "requiredSkills": ["skill1", "skill2", "skill3"] - must-have skills
  "niceToHaveSkills": ["skill1", "skill2", "skill3"] - nice-to-have skills,
  "confidenceScore": 90 - A number 0-100 indicating confidence that this is a valid job description and the data is accurate.
}

Focus on extracting accurate information from the job description. If certain information is not available, use reasonable defaults or empty arrays.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1000,
        temperature: 0.3,
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error("No response from OpenAI");
      }

      // Try to parse the JSON response
      try {
        const parsed = JSON.parse(result);

        // Check confidence score
        if (
          parsed.confidenceScore !== undefined &&
          parsed.confidenceScore < 85
        ) {
          logger.warn(`Confidence score too low: ${parsed.confidenceScore}`);
          return {
            title: "",
            description: "",
            tags: [],
            requiredSkills: [],
            niceToHaveSkills: [],
          };
        }

        return {
          title: parsed.title || "",
          description: parsed.description || "",
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          requiredSkills: Array.isArray(parsed.requiredSkills)
            ? parsed.requiredSkills
            : [],
          niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills)
            ? parsed.niceToHaveSkills
            : [],
        };
      } catch {
        logger.error("Failed to parse AI response as JSON:", result);
        // Fallback to empty values
        return {
          title: "",
          description: "",
          tags: [],
          requiredSkills: [],
          niceToHaveSkills: [],
        };
      }
    } catch (error) {
      logger.error("Error parsing job description with AI:", error);
      // Fallback to empty values
      return {
        title: "",
        description: "",
        tags: [],
        requiredSkills: [],
        niceToHaveSkills: [],
      };
    }
  }

  /**
   * Validate if the provided content is a valid CV/Resume
   * @param content - Text content extracted from the file
   * @returns Promise<{ isValid: boolean; confidenceScore: number }>
   */
  async validateCV(
    content: string
  ): Promise<{ isValid: boolean; confidenceScore: number }> {
    try {
      const openai = await this.getOpenAI();
      const prompt = `
Analyze the following text and determine if it is a valid Curriculum Vitae (CV) or Resume.
Calculate a confidence score (0-100) representing the likelihood that this text is a valid professional CV/Resume.

Text to analyze:
${content.substring(
  0,
  5000
)} // Truncate to avoid token limits, usually checking the first 5000 chars is enough

Return a JSON object with the following structure:
{
  "isValid": true/false,
  "confidenceScore": 85
}

A valid CV usually contains:
- Contact information
- Work experience/Employment history
- Education/Qualifications
- Skills

If the text contains random characters, code, or unrelated content, score it low.
Return ONLY the JSON object.
`;

      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 100,
        temperature: 0.1,
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error("No response from OpenAI");
      }

      const parsed = JSON.parse(result);
      // Enforce the 85% rule here as well, although the prompt asks for isValid
      const confidenceScore = parsed.confidenceScore || 0;
      const isValid = parsed.isValid && confidenceScore >= 85;

      return { isValid, confidenceScore };
    } catch (error) {
      logger.error("Error validating CV with AI:", error);
      // Fail safe - if AI fails, maybe allow it or block it?
      // Safest is to return false to prevent garbage, or true if we trust the system more.
      // Given the requirement is strict ("Other than that show you are unable to process"), return false on error/failure.
      return { isValid: false, confidenceScore: 0 };
    }
  }

  /**
   * Generate an AI overview for a candidate based on their CV content and the job description
   * @param cvContent - The text content of the candidate's CV
   * @param jobDescription - The job description text
   * @param jobTitle - The job title
   * @returns Promise<AiOverviewResult> - Structured AI analysis results
   */
  async generateCandidateOverview(
    cvContent: string,
    jobDescription: string,
    jobTitle: string
  ): Promise<AiOverviewResult> {
    try {
      const openai = await this.getOpenAI();
      // Create the prompt using the provided CV content
      const prompt = this.buildOverviewPrompt(
        cvContent,
        jobDescription,
        jobTitle
      );

      // Call OpenAI API
      const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 2048,
        temperature: 0.3,
      });

      // Parse the response
      const responseText = response.choices[0]?.message?.content || "";
      return this.parseOverviewResponse(responseText);
    } catch (error) {
      logger.error("Error generating AI overview:", error);
      throw new Error("Failed to generate AI overview");
    }
  }

  /**
   * Build the prompt for AI overview generation
   */
  private buildOverviewPrompt(
    cvContent: string,
    jobDescription: string,
    jobTitle: string
  ): string {
    return `You are an expert technical recruiter analyzing a candidate's fit for a position.

Job Title: ${jobTitle}

Job Description:
${jobDescription}

Candidate CV:
${cvContent}

Please analyze this candidate's qualifications against the job requirements and provide a structured assessment in the following JSON format:

{
  "summary": "A 2-3 sentence executive summary of the candidate's fit for this role",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2"],
  "matchScore": 85,
  "detailedAnalysis": "A detailed paragraph analyzing the candidate's experience, skills, and overall fit for the role"
}

The matchScore should be a number from 0-100 representing how well the candidate matches the job requirements.
Focus on technical skills, relevant experience, and cultural fit indicators.
Be honest about both strengths and gaps.

Return ONLY the JSON object, no additional text.`;
  }

  /**
   * Parse the AI response into structured data
   */
  private parseOverviewResponse(responseText: string): AiOverviewResult {
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        summary: parsed.summary || "No summary available",
        strengths: parsed.strengths || [],
        gaps: parsed.gaps || [],
        matchScore: parsed.matchScore || 0,
        detailedAnalysis:
          parsed.detailedAnalysis || "No detailed analysis available",
      };
    } catch (error) {
      logger.error("Error parsing AI response:", error);
      // Return a fallback response
      return {
        summary: "Unable to parse AI response",
        strengths: [],
        gaps: [],
        matchScore: 0,
        detailedAnalysis: responseText,
      };
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
