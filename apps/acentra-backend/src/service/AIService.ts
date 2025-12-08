import OpenAI from "openai";

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
  private openai: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY is not set in environment variables");
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async parseJobDescription(content: string): Promise<ParsedJobDescription> {
    try {
      const prompt = `
Analyze the following job description and extract the key information in JSON format.

Job Description:
${content}

Return a JSON object with the following structure:
{
  "title": "Job title",
  "description": "Brief description of the job (2-3 sentences)",
  "tags": ["tag1", "tag2", "tag3"] - relevant tags like "Remote", "Full-time", "Senior", etc.
  "requiredSkills": ["skill1", "skill2", "skill3"] - must-have skills
  "niceToHaveSkills": ["skill1", "skill2", "skill3"] - nice-to-have skills,
}

Focus on extracting accurate information from the job description. If certain information is not available, use reasonable defaults or empty arrays.
`;

      const response = await this.openai.chat.completions.create({
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
      } catch (parseError) {
        console.error("Failed to parse AI response as JSON:", result);
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
      console.error("Error parsing job description with AI:", error);
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
      // Create the prompt using the provided CV content
      const prompt = this.buildOverviewPrompt(
        cvContent,
        jobDescription,
        jobTitle
      );

      // Call OpenAI API
      const response = await this.openai.chat.completions.create({
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
      console.error("Error generating AI overview:", error);
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
      console.error("Error parsing AI response:", error);
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
