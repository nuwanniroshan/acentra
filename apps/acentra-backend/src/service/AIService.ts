import OpenAI from "openai";

export interface ParsedJobDescription {
  title: string;
  description: string;
  tags: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
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
}

// Export singleton instance
export const aiService = new AIService();
