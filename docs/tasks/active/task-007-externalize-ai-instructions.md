# Task 007: Externalize AI Instructions to Markdown

**Priority:** MEDIUM  
**Estimated Effort:** 2-3 days  
**Status:** Not Started  
**Assignee:** TBD  
**Related PRD:** `.agent/prd-template-improvements.md` (Section 7)

---

## Objective

Move all AI prompts from hardcoded strings in `AIService.ts` to external markdown files, enabling non-developers to modify prompts and improving prompt maintainability.

---

## Current Problems

**File:** `apps/acentra-backend/src/service/AIService.ts`

- AI prompts are hardcoded in the service class
- Developers must modify code to update prompts
- No version control for prompt changes
- Difficult to A/B test different prompts
- Non-technical stakeholders cannot contribute to prompt engineering
- Prompt changes require code deployment

---

## Requirements

### Must Have
- [ ] All AI prompts in separate `.md` files
- [ ] Variable interpolation support (e.g., `{{jobTitle}}`)
- [ ] Frontmatter metadata (version, author, description)
- [ ] Prompt loader service
- [ ] Type-safe variable replacement
- [ ] Fallback to default prompts if file missing

### Nice to Have
- [ ] Hot-reloading in development
- [ ] Prompt versioning for A/B testing
- [ ] Prompt validation on startup
- [ ] CLI tool for testing prompts
- [ ] Prompt analytics/tracking

---

## Directory Structure

```
apps/acentra-backend/src/prompts/
├── README.md                          # Documentation
├── job-description-parser.md          # Job parsing prompt
├── cv-validator.md                    # CV validation prompt
├── candidate-overview.md              # Candidate analysis prompt
├── templates/                         # Future prompts
│   └── email-generation.md
└── archive/                           # Old prompt versions
    └── job-description-parser-v1.md
```

---

## Prompt File Format

### Frontmatter Structure

```yaml
---
version: 1.0.0
author: Product Team
date: 2025-12-25
description: Brief description of what this prompt does
model: gpt-3.5-turbo
temperature: 0.3
max_tokens: 1000
variables:
  - name: content
    type: string
    required: true
    description: The content to analyze
---
```

### Example Prompt File

Create `apps/acentra-backend/src/prompts/job-description-parser.md`:

```markdown
---
version: 1.0.0
author: Product Team
date: 2025-12-25
description: Analyzes job descriptions and extracts structured data
model: gpt-3.5-turbo
temperature: 0.3
max_tokens: 1000
variables:
  - name: content
    type: string
    required: true
    description: The job description text to analyze
---

# Job Description Parser

Analyze the following job description and extract the key information in JSON format.
Also determine if the provided text is actually a valid job description and provide a confidence score (0-100).

## Job Description:
{{content}}

## Output Format:
Return a JSON object with the following structure:
\`\`\`json
{
  "title": "Job title",
  "description": "Brief description of the job (2-3 sentences)",
  "tags": ["tag1", "tag2", "tag3"],
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "niceToHaveSkills": ["skill1", "skill2", "skill3"],
  "confidenceScore": 90
}
\`\`\`

## Instructions:
- Focus on extracting accurate information from the job description
- If certain information is not available, use reasonable defaults or empty arrays
- Confidence score should reflect certainty that this is a valid job description
- Be conservative with the confidence score - only score above 85 if you're very confident

## Examples:

### Good Job Description (High Confidence):
- Contains clear job title
- Lists specific responsibilities
- Mentions required skills and qualifications
- Includes company information
- Confidence: 90-100

### Questionable Content (Low Confidence):
- Vague or generic text
- Missing key elements
- Appears to be random text or code
- Confidence: 0-50
```

---

## Implementation Plan

### Step 1: Install Dependencies

```bash
cd apps/acentra-backend
npm install gray-matter
```

### Step 2: Create Prompt Loader Service

Create `apps/acentra-backend/src/service/PromptLoader.ts`:

```typescript
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface PromptMetadata {
  version: string;
  author: string;
  date: string;
  description: string;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  variables: Array<{
    name: string;
    type: string;
    required: boolean;
    description: string;
  }>;
}

interface Prompt {
  metadata: PromptMetadata;
  template: string;
}

class PromptLoader {
  private prompts: Map<string, Prompt> = new Map();
  private promptsDir: string;

  constructor() {
    this.promptsDir = path.join(__dirname, '../prompts');
  }

  /**
   * Load a prompt from a markdown file
   */
  async loadPrompt(name: string): Promise<Prompt> {
    // Check cache first
    if (this.prompts.has(name)) {
      return this.prompts.get(name)!;
    }

    const filePath = path.join(this.promptsDir, `${name}.md`);

    try {
      const fileContent = await fs.readFile(filePath, 'utf-8');
      const { data, content } = matter(fileContent);

      const prompt: Prompt = {
        metadata: data as PromptMetadata,
        template: content.trim(),
      };

      // Validate prompt
      this.validatePrompt(name, prompt);

      // Cache the prompt
      this.prompts.set(name, prompt);

      console.log(`Loaded prompt: ${name} (v${prompt.metadata.version})`);

      return prompt;
    } catch (error) {
      console.error(`Failed to load prompt: ${name}`, error);
      throw new Error(`Prompt not found: ${name}`);
    }
  }

  /**
   * Validate prompt structure
   */
  private validatePrompt(name: string, prompt: Prompt): void {
    if (!prompt.metadata.version) {
      throw new Error(`Prompt ${name}: Missing version in metadata`);
    }

    if (!prompt.metadata.variables || !Array.isArray(prompt.metadata.variables)) {
      throw new Error(`Prompt ${name}: Missing or invalid variables in metadata`);
    }

    if (!prompt.template) {
      throw new Error(`Prompt ${name}: Empty template content`);
    }
  }

  /**
   * Interpolate variables into template
   */
  interpolate(template: string, variables: Record<string, any>): string {
    let result = template;

    // Replace all {{variable}} patterns
    result = result.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (!(key in variables)) {
        throw new Error(`Missing required variable: ${key}`);
      }
      return String(variables[key]);
    });

    return result;
  }

  /**
   * Get a prompt with variables interpolated
   */
  async getPrompt(
    name: string,
    variables: Record<string, any>
  ): Promise<string> {
    const prompt = await this.loadPrompt(name);

    // Validate required variables
    const requiredVars = prompt.metadata.variables
      .filter((v) => v.required)
      .map((v) => v.name);

    const missingVars = requiredVars.filter((v) => !(v in variables));
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required variables for prompt ${name}: ${missingVars.join(', ')}`
      );
    }

    return this.interpolate(prompt.template, variables);
  }

  /**
   * Get prompt metadata (useful for getting model config)
   */
  async getMetadata(name: string): Promise<PromptMetadata> {
    const prompt = await this.loadPrompt(name);
    return prompt.metadata;
  }

  /**
   * Clear cache (useful for development/hot-reloading)
   */
  clearCache(): void {
    this.prompts.clear();
    console.log('Prompt cache cleared');
  }

  /**
   * Reload a specific prompt (useful for development)
   */
  async reloadPrompt(name: string): Promise<void> {
    this.prompts.delete(name);
    await this.loadPrompt(name);
  }

  /**
   * List all available prompts
   */
  async listPrompts(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.promptsDir);
      return files
        .filter((f) => f.endsWith('.md') && f !== 'README.md')
        .map((f) => f.replace('.md', ''));
    } catch (error) {
      console.error('Failed to list prompts:', error);
      return [];
    }
  }
}

// Export singleton instance
export const promptLoader = new PromptLoader();
```

### Step 3: Create Prompt Files

Create `apps/acentra-backend/src/prompts/cv-validator.md`:

```markdown
---
version: 1.0.0
author: Product Team
date: 2025-12-25
description: Validates if uploaded content is a valid CV/Resume
model: gpt-3.5-turbo
temperature: 0.1
max_tokens: 100
variables:
  - name: content
    type: string
    required: true
    description: Text content extracted from the uploaded file
---

# CV Validator

Analyze the following text and determine if it is a valid Curriculum Vitae (CV) or Resume.
Calculate a confidence score (0-100) representing the likelihood that this text is a valid professional CV/Resume.

## Text to analyze:
{{content}}

## Output Format:
Return ONLY a JSON object with the following structure:
\`\`\`json
{
  "isValid": true,
  "confidenceScore": 85
}
\`\`\`

## Validation Criteria:

A valid CV usually contains:
- Contact information (name, email, phone)
- Work experience/Employment history
- Education/Qualifications
- Skills section

## Scoring Guidelines:

- **90-100**: Clearly a professional CV with all standard sections
- **70-89**: Likely a CV but missing some sections or poorly formatted
- **50-69**: Questionable - might be a CV but very incomplete
- **0-49**: Not a CV - random text, code, or unrelated content

## Important:
- If the text contains random characters, code, or unrelated content, score it low (0-30)
- Be strict with scoring - only score above 85 if you're very confident it's a valid CV
- Return ONLY the JSON object, no additional text
```

Create `apps/acentra-backend/src/prompts/candidate-overview.md`:

```markdown
---
version: 1.0.0
author: Product Team
date: 2025-12-25
description: Generates AI-powered candidate analysis for job fit
model: gpt-4
temperature: 0.3
max_tokens: 2048
variables:
  - name: cvContent
    type: string
    required: true
    description: Text content of the candidate's CV
  - name: jobDescription
    type: string
    required: true
    description: The job description text
  - name: jobTitle
    type: string
    required: true
    description: The job title
---

# Candidate Overview Generator

You are an expert technical recruiter analyzing a candidate's fit for a position.

## Job Title
{{jobTitle}}

## Job Description
{{jobDescription}}

## Candidate CV
{{cvContent}}

## Task
Please analyze this candidate's qualifications against the job requirements and provide a structured assessment.

## Output Format
Return ONLY a JSON object with the following structure:

\`\`\`json
{
  "summary": "A 2-3 sentence executive summary of the candidate's fit for this role",
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "gaps": ["gap 1", "gap 2"],
  "matchScore": 85,
  "detailedAnalysis": "A detailed paragraph analyzing the candidate's experience, skills, and overall fit for the role"
}
\`\`\`

## Guidelines

### Match Score (0-100)
- **90-100**: Exceptional fit - candidate exceeds requirements
- **75-89**: Strong fit - candidate meets all key requirements
- **60-74**: Good fit - candidate meets most requirements with minor gaps
- **40-59**: Moderate fit - candidate has relevant experience but significant gaps
- **0-39**: Poor fit - candidate lacks key requirements

### Strengths
- Focus on technical skills that match job requirements
- Highlight relevant experience and achievements
- Note any standout qualifications or certifications
- Mention cultural fit indicators

### Gaps
- Be honest about missing skills or experience
- Note areas where candidate falls short of requirements
- Identify potential training needs
- Be constructive and specific

### Detailed Analysis
- Provide a comprehensive assessment (3-5 sentences)
- Balance strengths and gaps
- Consider career trajectory and growth potential
- Be objective and professional

## Important
- Return ONLY the JSON object, no additional text
- Be honest about both strengths and gaps
- Base assessment on concrete evidence from CV
- Consider both technical skills and soft skills
```

### Step 4: Update AIService

Modify `apps/acentra-backend/src/service/AIService.ts`:

```typescript
import OpenAI from 'openai';
import { promptLoader } from './PromptLoader';

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
      throw new Error('OPENAI_API_KEY is not set in environment variables');
    }

    this.openai = new OpenAI({
      apiKey: apiKey,
    });
  }

  async parseJobDescription(content: string): Promise<ParsedJobDescription> {
    try {
      // Load prompt from markdown file
      const prompt = await promptLoader.getPrompt('job-description-parser', {
        content,
      });

      // Get metadata for model configuration
      const metadata = await promptLoader.getMetadata('job-description-parser');

      const response = await this.openai.chat.completions.create({
        model: metadata.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: metadata.max_tokens || 1000,
        temperature: metadata.temperature || 0.3,
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response from OpenAI');
      }

      // Parse JSON response
      try {
        const parsed = JSON.parse(result);

        // Check confidence score
        if (parsed.confidenceScore !== undefined && parsed.confidenceScore < 85) {
          console.log('Confidence score too low:', parsed.confidenceScore);
          return {
            title: '',
            description: '',
            tags: [],
            requiredSkills: [],
            niceToHaveSkills: [],
          };
        }

        return {
          title: parsed.title || '',
          description: parsed.description || '',
          tags: Array.isArray(parsed.tags) ? parsed.tags : [],
          requiredSkills: Array.isArray(parsed.requiredSkills)
            ? parsed.requiredSkills
            : [],
          niceToHaveSkills: Array.isArray(parsed.niceToHaveSkills)
            ? parsed.niceToHaveSkills
            : [],
        };
      } catch {
        console.error('Failed to parse AI response as JSON:', result);
        return {
          title: '',
          description: '',
          tags: [],
          requiredSkills: [],
          niceToHaveSkills: [],
        };
      }
    } catch (error) {
      console.error('Error parsing job description with AI:', error);
      return {
        title: '',
        description: '',
        tags: [],
        requiredSkills: [],
        niceToHaveSkills: [],
      };
    }
  }

  async validateCV(content: string): Promise<{ isValid: boolean; confidenceScore: number }> {
    try {
      const prompt = await promptLoader.getPrompt('cv-validator', {
        content: content.substring(0, 5000),
      });

      const metadata = await promptLoader.getMetadata('cv-validator');

      const response = await this.openai.chat.completions.create({
        model: metadata.model || 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: metadata.max_tokens || 100,
        temperature: metadata.temperature || 0.1,
      });

      const result = response.choices[0]?.message?.content;
      if (!result) {
        throw new Error('No response from OpenAI');
      }

      const parsed = JSON.parse(result);
      const confidenceScore = parsed.confidenceScore || 0;
      const isValid = parsed.isValid && confidenceScore >= 85;

      return { isValid, confidenceScore };
    } catch (error) {
      console.error('Error validating CV with AI:', error);
      return { isValid: false, confidenceScore: 0 };
    }
  }

  async generateCandidateOverview(
    cvContent: string,
    jobDescription: string,
    jobTitle: string
  ): Promise<AiOverviewResult> {
    try {
      const prompt = await promptLoader.getPrompt('candidate-overview', {
        cvContent,
        jobDescription,
        jobTitle,
      });

      const metadata = await promptLoader.getMetadata('candidate-overview');

      const response = await this.openai.chat.completions.create({
        model: metadata.model || 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: metadata.max_tokens || 2048,
        temperature: metadata.temperature || 0.3,
      });

      const responseText = response.choices[0]?.message?.content || '';
      return this.parseOverviewResponse(responseText);
    } catch (error) {
      console.error('Error generating AI overview:', error);
      throw new Error('Failed to generate AI overview');
    }
  }

  private parseOverviewResponse(responseText: string): AiOverviewResult {
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      return {
        summary: parsed.summary || 'No summary available',
        strengths: parsed.strengths || [],
        gaps: parsed.gaps || [],
        matchScore: parsed.matchScore || 0,
        detailedAnalysis:
          parsed.detailedAnalysis || 'No detailed analysis available',
      };
    } catch (error) {
      console.error('Error parsing AI response:', error);
      return {
        summary: 'Unable to parse AI response',
        strengths: [],
        gaps: [],
        matchScore: 0,
        detailedAnalysis: responseText,
      };
    }
  }
}

export const aiService = new AIService();
```

### Step 5: Create Documentation

Create `apps/acentra-backend/src/prompts/README.md`:

```markdown
# AI Prompts

This directory contains all AI prompts used in the Acentra ATS system.

## Directory Structure

- `*.md` - Individual prompt files
- `templates/` - Template prompts for future features
- `archive/` - Old versions of prompts

## Prompt File Format

Each prompt file is a Markdown file with YAML frontmatter:

\`\`\`markdown
---
version: 1.0.0
author: Product Team
date: 2025-12-25
description: What this prompt does
model: gpt-3.5-turbo
temperature: 0.3
max_tokens: 1000
variables:
  - name: variableName
    type: string
    required: true
    description: What this variable is for
---

# Prompt Title

Your prompt content here with {{variableName}} placeholders.
\`\`\`

## Available Prompts

### job-description-parser.md
Analyzes job descriptions and extracts structured data (title, skills, etc.)

**Variables:**
- `content` (string, required): The job description text

**Model:** gpt-3.5-turbo

### cv-validator.md
Validates if uploaded content is a valid CV/Resume

**Variables:**
- `content` (string, required): Text extracted from uploaded file

**Model:** gpt-3.5-turbo

### candidate-overview.md
Generates AI-powered candidate analysis for job fit

**Variables:**
- `cvContent` (string, required): Candidate's CV text
- `jobDescription` (string, required): Job description
- `jobTitle` (string, required): Job title

**Model:** gpt-4

## Adding a New Prompt

1. Create a new `.md` file in this directory
2. Add frontmatter with metadata
3. Write your prompt with `{{variable}}` placeholders
4. Update this README with prompt details
5. Use in code:
   \`\`\`typescript
   const prompt = await promptLoader.getPrompt('your-prompt-name', {
     variable1: 'value1',
     variable2: 'value2',
   });
   \`\`\`

## Testing Prompts

Use the prompt testing utility:

\`\`\`bash
npm run test:prompt job-description-parser
\`\`\`

## Prompt Versioning

When making significant changes to a prompt:

1. Copy current version to `archive/prompt-name-v1.md`
2. Update version number in frontmatter
3. Document changes in git commit message

## Best Practices

- Be specific and clear in instructions
- Provide examples when helpful
- Use consistent formatting
- Test prompts thoroughly before deploying
- Document expected output format
- Include validation criteria
- Keep prompts focused on single task
```

### Step 6: Add Prompt Testing Utility

Create `apps/acentra-backend/src/scripts/test-prompt.ts`:

```typescript
import { promptLoader } from '../service/PromptLoader';

async function testPrompt() {
  const promptName = process.argv[2];
  
  if (!promptName) {
    console.error('Usage: npm run test:prompt <prompt-name>');
    process.exit(1);
  }

  try {
    console.log(`\n=== Testing Prompt: ${promptName} ===\n`);
    
    const metadata = await promptLoader.getMetadata(promptName);
    
    console.log('Metadata:');
    console.log(JSON.stringify(metadata, null, 2));
    
    console.log('\nRequired Variables:');
    metadata.variables
      .filter(v => v.required)
      .forEach(v => {
        console.log(`  - ${v.name} (${v.type}): ${v.description}`);
      });
    
    console.log('\n✅ Prompt loaded successfully!\n');
  } catch (error) {
    console.error('\n❌ Error loading prompt:', error.message);
    process.exit(1);
  }
}

testPrompt();
```

Add to `package.json`:
```json
{
  "scripts": {
    "test:prompt": "ts-node src/scripts/test-prompt.ts"
  }
}
```

---

## Testing Checklist

### Unit Tests
- [ ] PromptLoader loads prompts correctly
- [ ] Variable interpolation works
- [ ] Missing variables throw errors
- [ ] Invalid prompts are rejected
- [ ] Cache works correctly

### Integration Tests
- [ ] AIService uses prompts correctly
- [ ] All existing AI features still work
- [ ] Model configuration from metadata is used
- [ ] Fallback behavior works

### Manual Tests
- [ ] Test each prompt with sample data
- [ ] Verify output format is correct
- [ ] Check confidence scores are reasonable

---

## Migration Checklist

- [ ] Install gray-matter dependency
- [ ] Create prompts directory
- [ ] Create PromptLoader service
- [ ] Create all prompt markdown files
- [ ] Update AIService to use PromptLoader
- [ ] Create README documentation
- [ ] Add prompt testing utility
- [ ] Test all AI features
- [ ] Deploy to staging
- [ ] Monitor for issues
- [ ] Deploy to production

---

## Acceptance Criteria

- [ ] All AI prompts externalized to markdown files
- [ ] Variable interpolation works correctly
- [ ] No breaking changes to existing AI features
- [ ] Documentation complete
- [ ] Testing utility functional
- [ ] Non-developers can update prompts
- [ ] Prompt changes don't require code deployment

---

## Success Metrics

- **Target:** 100% of AI prompts externalized
- **Target:** Prompt iteration time reduced by 80%
- **Target:** Non-technical team members can update prompts
- **Target:** Zero regression bugs in AI features

---

## Notes

- Consider adding prompt analytics to track performance
- Future enhancement: A/B testing framework for prompts
- Future enhancement: Prompt versioning UI in admin panel
- Future enhancement: Prompt performance metrics dashboard
