# Product Requirements Document: Template & UX Improvements

**Version:** 1.0  
**Date:** December 25, 2025  
**Status:** Draft  
**Owner:** Product Management

---

## Executive Summary

This PRD outlines a series of improvements to the Acentra ATS platform focusing on enhancing template management, user experience, and developer experience. The improvements span email templates, feedback templates, recruiter assignment workflows, branding, and AI instruction management.

---

## 1. Email Template Placeholder Documentation

### 1.1 Problem Statement

Users creating email templates currently have no visibility into what placeholders are available for use. This leads to:
- Trial and error when creating templates
- Inconsistent placeholder usage
- Support requests for placeholder documentation
- Reduced template effectiveness

### 1.2 Objectives

- Provide clear, accessible documentation of available placeholders
- Enable users to discover placeholders without leaving the template editor
- Reduce support burden related to template creation

### 1.3 Requirements

#### 1.3.1 Functional Requirements

**FR-1.1: Placeholder Guide Component**
- Display a collapsible/expandable placeholder reference guide in the email template editor
- Show all available placeholders with descriptions and example outputs
- Position guide prominently but non-intrusively (e.g., sidebar or accordion above editor)

**FR-1.2: Placeholder Categories**
- Group placeholders by category:
  - **Candidate Placeholders**: `{{candidate_name}}`, `{{candidate_email}}`, `{{candidate_phone}}`
  - **Job Placeholders**: `{{job_title}}`, `{{job_department}}`, `{{job_location}}`
  - **Company Placeholders**: `{{company_name}}`, `{{recruiter_name}}`, `{{recruiter_email}}`
  - **System Placeholders**: `{{current_date}}`, `{{application_link}}`

**FR-1.3: Interactive Features**
- Click-to-copy functionality for each placeholder
- Visual feedback when placeholder is copied
- Optional: Inline insertion of placeholder at cursor position in editor

**FR-1.4: Contextual Help**
- Tooltip on hover showing example output
- Description of when each placeholder is available/applicable

#### 1.3.2 Non-Functional Requirements

**NFR-1.1: Performance**
- Placeholder guide should load instantly without API calls
- No impact on template editor performance

**NFR-1.2: Accessibility**
- Keyboard navigation support for placeholder selection
- Screen reader compatible

### 1.4 Design Specifications

**Location:** `apps/acentra-frontend/src/components/settings/EmailTemplateManager.tsx`

**Proposed UI Elements:**
1. **Expandable Panel** above the template body field
2. **Chip-based display** for each placeholder with copy icon
3. **Search/filter** capability for large placeholder lists
4. **Visual indicators** showing which placeholders are used in current template

### 1.5 Technical Approach

```typescript
// Create new component: PlaceholderGuide.tsx
interface Placeholder {
  key: string;
  description: string;
  category: 'candidate' | 'job' | 'company' | 'system';
  example: string;
}

const AVAILABLE_PLACEHOLDERS: Placeholder[] = [
  {
    key: '{{candidate_name}}',
    description: 'Full name of the candidate',
    category: 'candidate',
    example: 'John Doe'
  },
  // ... more placeholders
];
```

### 1.6 Success Metrics

- 80% reduction in support tickets related to template placeholders
- 100% of new templates use at least one placeholder
- User satisfaction score > 4.5/5 for template creation experience

---

## 2. Rich Text Editor for Email Templates

### 2.1 Problem Statement

The current email template editor uses a plain text field, limiting users' ability to:
- Format emails professionally (bold, italic, lists, links)
- Include branding elements (colors, logos)
- Create visually appealing candidate communications
- Preview how emails will appear to recipients

### 2.2 Objectives

- Enable rich text formatting in email templates
- Maintain placeholder functionality in rich text context
- Provide WYSIWYG editing experience
- Ensure HTML output is email-client compatible

### 2.3 Requirements

#### 2.3.1 Functional Requirements

**FR-2.1: Rich Text Editor Integration**
- Replace plain text field with rich text editor
- Support for:
  - Text formatting (bold, italic, underline, strikethrough)
  - Headings (H1-H6)
  - Lists (ordered, unordered)
  - Links
  - Text alignment
  - Font colors and background colors
  - Basic tables

**FR-2.2: Placeholder Preservation**
- Placeholders must remain functional in rich text mode
- Visual distinction for placeholders (e.g., highlighted, pill-style)
- Prevent accidental modification of placeholder syntax
- Support placeholder insertion via toolbar button

**FR-2.3: HTML Output**
- Generate clean, email-compatible HTML
- Inline CSS for maximum email client compatibility
- Sanitize output to prevent XSS vulnerabilities

**FR-2.4: Preview Mode**
- Live preview of rendered email with sample data
- Toggle between edit and preview modes
- Mobile preview option

#### 2.3.2 Non-Functional Requirements

**NFR-2.1: Library Selection**
- Recommended: **Lexical** (Meta's modern rich text framework) or **Tiptap** (ProseMirror-based)
- Must be React-compatible
- Active maintenance and community support
- Lightweight (<100kb gzipped)

**NFR-2.2: Performance**
- Editor initialization < 500ms
- No lag during typing
- Efficient re-rendering on content changes

**NFR-2.3: Compatibility**
- HTML output tested with major email clients (Gmail, Outlook, Apple Mail)
- Graceful degradation for unsupported features

### 2.4 Design Specifications

**Updated Component:** `apps/acentra-frontend/src/components/settings/EmailTemplateManager.tsx`

**Toolbar Layout:**
```
[B] [I] [U] [S] | [H1▼] | [•] [1.] | [🔗] | [{{}}] | [👁️ Preview]
```

**Editor Features:**
- Floating toolbar on text selection
- Sticky toolbar at top of editor
- Character/word count
- Undo/redo functionality

### 2.5 Technical Approach

**Option 1: Lexical (Recommended)**
```bash
npm install lexical @lexical/react @lexical/html
```

**Option 2: Tiptap**
```bash
npm install @tiptap/react @tiptap/starter-kit
```

**Implementation Steps:**
1. Install chosen rich text library
2. Create `RichTextEditor.tsx` component with placeholder support
3. Add custom plugin for placeholder handling
4. Implement HTML sanitization on save
5. Create email preview component
6. Update backend to handle HTML email bodies
7. Test email rendering across clients

### 2.6 Migration Strategy

**Backward Compatibility:**
- Existing plain text templates remain valid
- Auto-convert plain text to HTML on first edit
- Preserve line breaks and basic formatting

**Rollout Plan:**
1. Phase 1: Enable for new templates only
2. Phase 2: Offer opt-in migration for existing templates
3. Phase 3: Full rollout after 2 weeks of monitoring

### 2.7 Success Metrics

- 90% of new templates use rich text formatting
- Zero reports of email rendering issues
- 30% increase in email open rates (better formatting = more professional)
- User satisfaction score > 4.7/5

---

## 3. Feedback Template Edit Fix

### 3.1 Problem Statement

The feedback template edit functionality is broken - questions do not load when editing an existing template. This prevents users from:
- Updating existing feedback templates
- Fixing errors in templates
- Adapting templates to changing needs

### 3.2 Root Cause Analysis

**Location:** `apps/acentra-frontend/src/components/settings/FeedbackTemplatesPage.tsx`

**Suspected Issues:**
1. `handleEditTemplate` (line 98-109) may not be correctly fetching full template data
2. `feedbackService.getTemplateById()` might not return questions array
3. State update timing issue with `setCurrentQuestions`
4. Backend API may not be including questions in response

### 3.3 Requirements

#### 3.3.1 Functional Requirements

**FR-3.1: Load Complete Template Data**
- Fetch full template including all questions when edit is triggered
- Populate form fields with existing data
- Maintain question order

**FR-3.2: Error Handling**
- Display clear error message if template load fails
- Log detailed error information for debugging
- Provide retry mechanism

**FR-3.3: Data Validation**
- Verify questions array exists and is populated
- Handle edge cases (empty questions, malformed data)

#### 3.3.2 Technical Requirements

**TR-3.1: API Investigation**
- Verify `GET /feedback-templates/:id` returns complete data
- Check if questions are properly serialized
- Ensure proper eager loading of relationships in backend

**TR-3.2: Frontend State Management**
- Ensure `currentQuestions` state is properly initialized
- Verify `setCurrentQuestions` is called with correct data structure
- Check for race conditions in async operations

### 3.4 Technical Approach

**Step 1: Backend Verification**
```typescript
// apps/acentra-backend/src/controller/FeedbackTemplateController.ts
// Ensure questions are included in response
async getById(req: Request, res: Response) {
  const template = await this.repository.findOne({
    where: { id: req.params.id },
    relations: ['questions'], // Ensure this is present
    order: { questions: { order: 'ASC' } }
  });
  // ...
}
```

**Step 2: Frontend Fix**
```typescript
// apps/acentra-frontend/src/components/settings/FeedbackTemplatesPage.tsx
const handleEditTemplate = async (template: FeedbackTemplate) => {
  try {
    console.log('Loading template for edit:', template.id);
    const fullTemplate = await feedbackService.getTemplateById(template.id);
    console.log('Loaded template:', fullTemplate);
    console.log('Questions:', fullTemplate.questions);
    
    if (!fullTemplate.questions || fullTemplate.questions.length === 0) {
      console.warn('No questions found in template');
    }
    
    setSelectedTemplate(fullTemplate);
    setCurrentTemplate({ ...fullTemplate });
    setCurrentQuestions([...(fullTemplate.questions || [])]);
    setShowEditDialog(true);
  } catch (error) {
    console.error('Failed to load template for editing:', error);
    alert('Failed to load template. Please try again.');
  }
};
```

**Step 3: Add Loading State**
```typescript
const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);

// Update handleEditTemplate to use loading state
// Show loading indicator in dialog
```

### 3.5 Testing Requirements

**Test Cases:**
1. Edit template with 0 questions
2. Edit template with 1 question
3. Edit template with 10+ questions
4. Edit template with various question types
5. Edit template, modify questions, save
6. Edit template, cancel without saving
7. Network error during template load
8. Concurrent edits (if applicable)

### 3.6 Success Metrics

- 100% success rate for template edit operations
- Zero error reports related to template editing
- Average edit completion time < 2 minutes

---

## 4. Feedback Template UX Redesign

### 4.1 Problem Statement

The current feedback template interface requires too many clicks and lacks intuitive workflows. Users report:
- Confusion about how to add/edit questions
- Difficulty reordering questions
- Unclear distinction between template metadata and questions
- Too many modal dialogs

### 4.2 Objectives

- Reduce clicks required to create/edit templates
- Improve visual hierarchy and information architecture
- Streamline question management
- Provide inline editing capabilities

### 4.3 Requirements

#### 4.3.1 Functional Requirements

**FR-4.1: Streamlined Template Creation**
- Single-page template builder (no modal for creation)
- Inline question addition and editing
- Drag-and-drop question reordering
- Duplicate question functionality

**FR-4.2: Improved Question Management**
- Collapsible question cards
- Quick actions (edit, duplicate, delete) on hover
- Bulk operations (delete multiple, reorder)
- Question templates/presets

**FR-4.3: Better Visual Design**
- Clear separation between template settings and questions
- Progress indicator (e.g., "3 questions added")
- Visual feedback for all actions
- Consistent with Aurora design system

**FR-4.4: Reduced Modal Usage**
- Use modals only for destructive actions (delete confirmation)
- Inline editing for all non-destructive operations
- Slide-out panel for template creation/editing (instead of modal)

#### 4.3.2 UX Improvements

**Current Flow (Create Template):**
1. Click "Create Template" button
2. Modal opens
3. Fill template name, type, description
4. Click "Add Question" button
5. Fill question details in nested form
6. Repeat for each question
7. Click "Create"

**Clicks Required:** 10+ for template with 3 questions

**Proposed Flow (Create Template):**
1. Click "Create Template" button
2. Slide-out panel opens with template form
3. Inline question cards with "+" button
4. Click "+" to add question (expands inline)
5. Fill and collapse
6. Click "Save Template"

**Clicks Required:** 6-7 for template with 3 questions

### 4.4 Design Specifications

**Layout Structure:**
```
┌─────────────────────────────────────────────────────┐
│ Feedback Templates                    [+ Create]    │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────┐ │
│ │ Phone Screening Template          [Edit] [Del]  │ │
│ │ 5 questions • Active • Technical Interview      │ │
│ └─────────────────────────────────────────────────┘ │
│ ┌─────────────────────────────────────────────────┐ │
│ │ Manager Feedback                  [Edit] [Del]  │ │
│ │ 8 questions • Active • Manager Feedback         │ │
│ └─────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘
```

**Template Editor (Slide-out Panel):**
```
┌─────────────────────────────────────────┐
│ ← Create Feedback Template              │
├─────────────────────────────────────────┤
│ Template Details                        │
│ ┌─────────────────────────────────────┐ │
│ │ Name: [________________]            │ │
│ │ Type: [Phone Screening ▼]           │ │
│ │ Category: [__________]              │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Questions (3)                [+ Add]    │
│ ┌─────────────────────────────────────┐ │
│ │ ☰ Question 1              [Edit][×] │ │
│ │ How was the candidate's...          │ │
│ │ Type: Free Text • Required          │ │
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ ☰ Question 2              [Edit][×] │ │
│ │ Rate technical skills               │ │
│ │ Type: Rating (1-5) • Required       │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancel]                   [Save]       │
└─────────────────────────────────────────┘
```

### 4.5 Technical Approach

**New Components:**
1. `FeedbackTemplateBuilder.tsx` - Main builder interface
2. `QuestionCard.tsx` - Individual question component
3. `QuestionEditor.tsx` - Inline question editor
4. `TemplateMetadataForm.tsx` - Template settings form

**Libraries:**
- `@dnd-kit/core` - For drag-and-drop reordering
- `framer-motion` - For smooth animations

**Implementation Steps:**
1. Create new template builder page/component
2. Implement drag-and-drop for questions
3. Add inline editing for questions
4. Migrate existing modal-based flow
5. Update routing and navigation
6. Add animations and transitions
7. User testing and iteration

### 4.6 Migration Strategy

**Approach:**
- Build new interface alongside existing one
- Feature flag to toggle between old/new UI
- A/B test with subset of users
- Gather feedback and iterate
- Full rollout after validation

### 4.7 Success Metrics

- 50% reduction in clicks to create template
- 40% reduction in time to create template
- User satisfaction score > 4.5/5
- 90% of users prefer new interface (A/B test)

---

## 5. Aurora Logo Integration

### 5.1 Problem Statement

The application currently uses a placeholder or generic logo. Branding needs to be updated to reflect the Aurora design system and company identity.

### 5.2 Requirements

#### 5.2.1 Functional Requirements

**FR-5.1: Logo Replacement**
- Replace existing logo with Aurora logo across all interfaces
- Support both light and dark theme variants
- Maintain consistent sizing and positioning

**FR-5.2: Logo Locations**
- Login page
- Main navigation header
- Public job posting pages
- Email templates (if applicable)
- Favicon

**FR-5.3: Responsive Design**
- Full logo on desktop
- Icon-only logo on mobile/collapsed sidebar
- Appropriate sizing for all screen sizes

#### 5.2.2 Technical Requirements

**TR-5.1: Asset Management**
- SVG format for scalability
- PNG fallback for email compatibility
- Optimized file sizes (<50kb)
- Proper color variants (light/dark mode)

**TR-5.2: Implementation**
- Store logo assets in `apps/acentra-frontend/src/assets/`
- Update theme configuration to reference logo
- Ensure proper alt text for accessibility

### 5.3 Technical Approach

**File Locations to Update:**
- `apps/acentra-frontend/src/components/Layout.tsx`
- `apps/acentra-frontend/src/pages/Login.tsx`
- `apps/acentra-frontend/src/layouts/PublicLayout.tsx`
- `apps/acentra-frontend/public/favicon.ico`

**Implementation:**
```typescript
// Create logo component
// apps/acentra-frontend/src/components/AuroraLogo.tsx
import { useTheme } from '@/context/ThemeContext';
import LogoLight from '@/assets/aurora-logo-light.svg';
import LogoDark from '@/assets/aurora-logo-dark.svg';

export const AuroraLogo = ({ variant = 'full', size = 'medium' }) => {
  const { theme } = useTheme();
  const logo = theme === 'dark' ? LogoDark : LogoLight;
  
  return (
    <img 
      src={logo} 
      alt="Aurora ATS" 
      style={{ height: size === 'small' ? '32px' : '48px' }}
    />
  );
};
```

### 5.4 Deliverables

- [ ] Aurora logo assets (SVG, PNG) in light/dark variants
- [ ] Logo component implementation
- [ ] Updated all logo references
- [ ] Favicon updated
- [ ] Documentation on logo usage guidelines

### 5.5 Success Metrics

- Consistent branding across 100% of interfaces
- Logo loads in <100ms
- Positive feedback on visual identity

---

## 6. Reusable Recruiter Assignment Component

### 6.1 Problem Statement

The recruiter assignment modal (`UserAssignmentModal.tsx`) is currently tightly coupled to job assignment. Other features (candidates, feedback requests, etc.) need similar functionality but cannot reuse the component.

### 6.2 Objectives

- Create a generic, reusable user assignment component
- Support multiple use cases (jobs, candidates, feedback)
- Improve UX with autocomplete and chip-based selection
- Reduce code duplication

### 6.3 Requirements

#### 6.3.1 Functional Requirements

**FR-6.1: Generic Assignment Component**
- Accept any user role as filter (not just recruiters)
- Support single or multi-select modes
- Work with any entity type (job, candidate, etc.)
- Configurable title and labels

**FR-6.2: Enhanced UX**
- Autocomplete search with typeahead
- Selected users displayed as chips
- Remove users by clicking chip close button
- Show user avatar/initials in results
- Display user metadata (role, department)

**FR-6.3: Performance**
- Debounced search (300ms)
- Virtual scrolling for large user lists
- Cached user data

#### 6.3.2 Component API

```typescript
interface UserAssignmentProps {
  // Configuration
  mode: 'single' | 'multiple';
  roleFilter?: UserRole | UserRole[];
  title?: string;
  searchPlaceholder?: string;
  
  // Data
  selectedUserIds: string[];
  onSelectionChange: (userIds: string[]) => void;
  
  // Optional
  excludeUserIds?: string[];
  maxSelections?: number;
  
  // Display
  showUserRole?: boolean;
  showUserDepartment?: boolean;
  
  // Callbacks
  onClose: () => void;
  onSave?: (userIds: string[]) => Promise<void>;
}
```

### 6.4 Design Specifications

**Autocomplete Mode:**
```
┌─────────────────────────────────────────┐
│ Assign Recruiters                    [×]│
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ 🔍 Type to search...                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Selected (2):                           │
│ [John Doe ×] [Jane Smith ×]             │
│                                         │
│ Suggestions:                            │
│ ┌─────────────────────────────────────┐ │
│ │ 👤 Mike Johnson                     │ │
│ │    Recruiter • Engineering          │ │
│ ├─────────────────────────────────────┤ │
│ │ 👤 Sarah Williams                   │ │
│ │    Recruiter • Sales                │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ [Cancel]                   [Assign]     │
└─────────────────────────────────────────┘
```

### 6.5 Technical Approach

**New Component Structure:**
```
apps/acentra-frontend/src/components/
├── UserAssignment/
│   ├── UserAssignmentModal.tsx      (Main component)
│   ├── UserAutocomplete.tsx         (Autocomplete input)
│   ├── UserChip.tsx                 (Selected user chip)
│   ├── UserListItem.tsx             (Search result item)
│   └── useUserSearch.ts             (Search hook)
```

**Implementation:**
```typescript
// UserAssignmentModal.tsx
import { Autocomplete } from '@acentra/aurora-design-system';

export const UserAssignmentModal = ({
  mode = 'multiple',
  roleFilter,
  selectedUserIds,
  onSelectionChange,
  ...props
}: UserAssignmentProps) => {
  const { users, loading, search } = useUserSearch(roleFilter);
  
  const handleUserSelect = (user: User) => {
    if (mode === 'single') {
      onSelectionChange([user.id]);
    } else {
      onSelectionChange([...selectedUserIds, user.id]);
    }
  };
  
  const handleUserRemove = (userId: string) => {
    onSelectionChange(selectedUserIds.filter(id => id !== userId));
  };
  
  // ... component implementation
};
```

**Hook Implementation:**
```typescript
// useUserSearch.ts
export const useUserSearch = (roleFilter?: UserRole | UserRole[]) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const debouncedSearch = useMemo(
    () => debounce((term: string) => {
      // Perform search
    }, 300),
    []
  );
  
  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      loadAllUsers();
    }
  }, [searchTerm]);
  
  return { users, loading, search: setSearchTerm };
};
```

### 6.6 Migration Strategy

**Phase 1: Create New Component**
- Build generic component with all features
- Test in isolation with Storybook

**Phase 2: Migrate Existing Usage**
- Update job assignment to use new component
- Verify functionality parity
- Remove old `UserAssignmentModal.tsx`

**Phase 3: Expand Usage**
- Add to candidate assignment
- Add to feedback request assignment
- Add to any other relevant features

### 6.7 Usage Examples

```typescript
// Job assignment
<UserAssignmentModal
  mode="multiple"
  roleFilter={UserRole.RECRUITER}
  title="Assign Recruiters to Job"
  selectedUserIds={assignedRecruiterIds}
  onSelectionChange={setAssignedRecruiterIds}
  onSave={async (ids) => await jobsService.assignUsers(jobId, ids)}
  onClose={() => setShowModal(false)}
/>

// Candidate assignment (single recruiter)
<UserAssignmentModal
  mode="single"
  roleFilter={UserRole.RECRUITER}
  title="Assign Primary Recruiter"
  selectedUserIds={candidate.recruiterId ? [candidate.recruiterId] : []}
  onSelectionChange={(ids) => updateCandidate({ recruiterId: ids[0] })}
  onClose={() => setShowModal(false)}
/>

// Feedback request (multiple roles)
<UserAssignmentModal
  mode="multiple"
  roleFilter={[UserRole.RECRUITER, UserRole.HIRING_MANAGER]}
  title="Request Feedback From"
  selectedUserIds={feedbackRequestUserIds}
  onSelectionChange={setFeedbackRequestUserIds}
  showUserRole={true}
  onClose={() => setShowModal(false)}
/>
```

### 6.8 Success Metrics

- Component reused in 3+ different features
- 30% reduction in code duplication
- Improved user assignment time by 40%
- Zero regression bugs in existing functionality

---

## 7. Externalize AI Instructions to Markdown

### 7.1 Problem Statement

AI prompts and instructions are currently hardcoded in `AIService.ts`. This creates several issues:
- Developers must modify code to update prompts
- No version control for prompt changes
- Difficult to A/B test different prompts
- Non-technical stakeholders cannot contribute to prompt engineering
- Prompt changes require code deployment

### 7.2 Objectives

- Move all AI prompts to external markdown files
- Enable non-developers to modify prompts
- Support prompt versioning and A/B testing
- Improve prompt maintainability
- Separate concerns (code vs. content)

### 7.3 Requirements

#### 7.3.1 Functional Requirements

**FR-7.1: Markdown-based Prompts**
- Store each AI prompt in a separate `.md` file
- Support variable interpolation in markdown
- Organize prompts by feature/purpose
- Include metadata (version, author, date)

**FR-7.2: Prompt Loading**
- Load prompts at application startup
- Cache prompts in memory
- Support hot-reloading in development
- Fallback to default prompts if file missing

**FR-7.3: Variable Interpolation**
- Support template variables in markdown (e.g., `{{jobTitle}}`, `{{cvContent}}`)
- Type-safe variable replacement
- Validation of required variables

**FR-7.4: Prompt Versioning**
- Track prompt versions in git
- Support multiple prompt variants for A/B testing
- Document prompt change history

#### 7.3.2 Non-Functional Requirements

**NFR-7.1: Performance**
- Prompt loading adds <10ms to startup time
- Cached prompts accessed in <1ms
- No impact on AI service response time

**NFR-7.2: Developer Experience**
- Clear documentation on adding new prompts
- TypeScript types for prompt variables
- Validation errors if variables missing

### 7.4 Technical Approach

**Directory Structure:**
```
apps/acentra-backend/src/prompts/
├── README.md                          # Prompt documentation
├── job-description-parser.md          # Job parsing prompt
├── cv-validator.md                    # CV validation prompt
├── candidate-overview.md              # Candidate analysis prompt
└── templates/
    └── email-generation.md            # Future: email generation
```

**Prompt File Format:**
```markdown
---
version: 1.0.0
author: Product Team
date: 2025-12-25
description: Analyzes job descriptions and extracts structured data
variables:
  - content: string (required)
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
```

**Prompt Loader Service:**
```typescript
// apps/acentra-backend/src/service/PromptLoader.ts
import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';

interface PromptMetadata {
  version: string;
  author: string;
  date: string;
  description: string;
  variables: string[];
}

interface Prompt {
  metadata: PromptMetadata;
  template: string;
}

class PromptLoader {
  private prompts: Map<string, Prompt> = new Map();
  private promptsDir = path.join(__dirname, '../prompts');

  async loadPrompt(name: string): Promise<Prompt> {
    if (this.prompts.has(name)) {
      return this.prompts.get(name)!;
    }

    const filePath = path.join(this.promptsDir, `${name}.md`);
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const prompt: Prompt = {
      metadata: data as PromptMetadata,
      template: content.trim(),
    };

    this.prompts.set(name, prompt);
    return prompt;
  }

  interpolate(template: string, variables: Record<string, any>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
      if (!(key in variables)) {
        throw new Error(`Missing required variable: ${key}`);
      }
      return String(variables[key]);
    });
  }

  async getPrompt(name: string, variables: Record<string, any>): Promise<string> {
    const prompt = await this.loadPrompt(name);
    return this.interpolate(prompt.template, variables);
  }
}

export const promptLoader = new PromptLoader();
```

**Updated AIService:**
```typescript
// apps/acentra-backend/src/service/AIService.ts
import { promptLoader } from './PromptLoader';

export class AIService {
  async parseJobDescription(content: string): Promise<ParsedJobDescription> {
    try {
      const prompt = await promptLoader.getPrompt('job-description-parser', {
        content,
      });

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.3,
      });

      // ... rest of implementation
    } catch (error) {
      console.error('Error parsing job description with AI:', error);
      // ... error handling
    }
  }

  async validateCV(content: string): Promise<{ isValid: boolean; confidenceScore: number }> {
    const prompt = await promptLoader.getPrompt('cv-validator', {
      content: content.substring(0, 5000),
    });

    // ... rest of implementation
  }

  async generateCandidateOverview(
    cvContent: string,
    jobDescription: string,
    jobTitle: string
  ): Promise<AiOverviewResult> {
    const prompt = await promptLoader.getPrompt('candidate-overview', {
      cvContent,
      jobDescription,
      jobTitle,
    });

    // ... rest of implementation
  }
}
```

### 7.5 Migration Steps

1. **Create prompt directory structure**
   ```bash
   mkdir -p apps/acentra-backend/src/prompts
   ```

2. **Extract existing prompts to markdown files**
   - `job-description-parser.md`
   - `cv-validator.md`
   - `candidate-overview.md`

3. **Install dependencies**
   ```bash
   npm install gray-matter
   ```

4. **Implement PromptLoader service**

5. **Update AIService to use PromptLoader**

6. **Add tests for prompt loading and interpolation**

7. **Update documentation**

8. **Deploy and monitor**

### 7.6 Prompt Management Guidelines

**Documentation (`apps/acentra-backend/src/prompts/README.md`):**
```markdown
# AI Prompts

This directory contains all AI prompts used in the Acentra ATS system.

## Adding a New Prompt

1. Create a new `.md` file with a descriptive name
2. Add frontmatter with metadata
3. Write the prompt content
4. Use `{{variableName}}` for interpolation
5. Update AIService to use the new prompt

## Testing Prompts

Use the prompt testing utility:
\`\`\`bash
npm run test:prompt job-description-parser
\`\`\`

## Prompt Versioning

- Increment version number for significant changes
- Document changes in git commit messages
- Keep old versions in `archive/` for reference
```

### 7.7 Success Metrics

- 100% of AI prompts externalized
- Zero code changes required for prompt updates
- Prompt iteration time reduced by 80%
- Non-technical team members can update prompts
- Improved prompt quality through easier iteration

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Week 1)
**Priority: HIGH**
- [ ] Fix feedback template edit bug (Item 3)
- [ ] Add email template placeholder guide (Item 1)

### Phase 2: UX Improvements (Week 2-3)
**Priority: MEDIUM**
- [ ] Implement rich text editor for email templates (Item 2)
- [ ] Redesign feedback template interface (Item 4)
- [ ] Create reusable recruiter assignment component (Item 6)

### Phase 3: Developer Experience (Week 4)
**Priority: MEDIUM**
- [ ] Externalize AI instructions to markdown (Item 7)
- [ ] Update Aurora logo (Item 5)

### Phase 4: Polish & Testing (Week 5)
**Priority: LOW**
- [ ] User acceptance testing
- [ ] Performance optimization
- [ ] Documentation updates
- [ ] Training materials

---

## Dependencies

### External Libraries
- **Rich Text Editor**: Lexical or Tiptap (~100kb)
- **Drag & Drop**: @dnd-kit/core (~50kb)
- **Markdown Parser**: gray-matter (~10kb)
- **Autocomplete**: Already in Aurora Design System

### Internal Dependencies
- Aurora Design System (existing)
- Backend API updates for HTML email support
- Database schema (no changes required)

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Rich text editor breaks email rendering | High | Medium | Extensive email client testing; HTML sanitization |
| Feedback template redesign confuses users | Medium | Low | A/B testing; gradual rollout; user training |
| Prompt externalization breaks AI features | High | Low | Comprehensive testing; fallback to hardcoded prompts |
| Performance degradation with rich text | Medium | Low | Performance benchmarking; lazy loading |
| Reusable component doesn't fit all use cases | Low | Medium | Flexible API design; escape hatches for custom behavior |

---

## Success Criteria

### Overall Project Success
- [ ] All 7 items implemented and deployed
- [ ] Zero critical bugs introduced
- [ ] User satisfaction score > 4.5/5
- [ ] Performance metrics maintained or improved
- [ ] Documentation complete and accurate

### Individual Feature Success
Refer to success metrics in each section above.

---

## Appendix

### A. Related Documents
- Aurora Design System Documentation
- Email Template API Specification
- Feedback Template Data Model
- AI Service Architecture

### B. Glossary
- **Placeholder**: Variable in template replaced with actual data at runtime
- **Rich Text Editor**: WYSIWYG editor supporting formatted text
- **Feedback Template**: Structured questionnaire for candidate evaluation
- **Prompt**: Instructions sent to AI model for specific task

### C. Open Questions
1. Should rich text editor support custom HTML/CSS?
2. What email clients must be supported for HTML emails?
3. Should prompt changes trigger notifications to dev team?
4. Do we need audit logging for template changes?

---

**Document Status:** Draft  
**Next Review Date:** January 1, 2026  
**Approvers:** Product Manager, Engineering Lead, UX Designer
