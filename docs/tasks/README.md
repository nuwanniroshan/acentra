# Implementation Tasks - Template & UX Improvements

**Related PRD:** `.agent/prd-template-improvements.md`  
**Created:** December 25, 2025  
**Total Tasks:** 7

---

## Overview

This directory contains detailed implementation tasks for the Template & UX Improvements initiative. Each task is a standalone document with complete specifications, code examples, and acceptance criteria.

---

## Task List

### 🔴 Critical Priority

#### Task 003: Fix Feedback Template Edit Bug
**File:** `task-003-fix-feedback-template-edit.md`  
**Effort:** 1-2 days  
**Status:** Not Started

Fix critical bug where feedback template questions don't load when editing. Includes root cause analysis, debugging steps, and comprehensive testing plan.

**Key Deliverables:**
- Backend API fix to ensure questions are loaded
- Frontend state management improvements
- Loading states and error handling
- Comprehensive test coverage

---

### 🟡 High Priority

#### Task 001: Email Template Placeholder Guide
**File:** `task-001-email-placeholder-guide.md`  
**Effort:** 2-3 days  
**Status:** Not Started

Add comprehensive placeholder documentation to email template editor with click-to-copy functionality and categorized display.

**Key Deliverables:**
- PlaceholderGuide component with search
- PlaceholderChip component with copy functionality
- 12+ documented placeholders
- Integration with EmailTemplateManager

**Impact:** 80% reduction in support tickets about placeholders

---

### 🟢 Medium Priority

#### Task 002: Rich Text Editor for Email Templates
**File:** `task-002-rich-text-editor.md`  
**Effort:** 5-7 days  
**Status:** Not Started

Replace plain text email editor with rich text WYSIWYG editor (Lexical) while maintaining placeholder functionality.

**Key Deliverables:**
- RichTextEditor component with Lexical
- Custom placeholder plugin
- Email preview component
- Backend support for HTML emails
- Migration strategy for existing templates

**Impact:** 90% of new templates use rich text, 30% increase in email open rates

---

#### Task 004: Feedback Template UX Redesign
**File:** `task-004-feedback-template-ux-redesign.md`  
**Effort:** 5-7 days  
**Status:** Not Started

Redesign feedback template interface with slide-out panel, drag-and-drop question reordering, and inline editing.

**Key Deliverables:**
- TemplateBuilderPanel component (slide-out)
- Drag-and-drop question reordering (@dnd-kit)
- Collapsible question cards
- State management hook
- A/B testing framework

**Impact:** 50% reduction in clicks, 40% reduction in time to create template

---

#### Task 006: Reusable Recruiter Assignment Component
**File:** `task-006-reusable-recruiter-assignment.md`  
**Effort:** 3-4 days  
**Status:** Not Started

Create generic user assignment component with autocomplete and chip-based selection, reusable across jobs, candidates, and feedback.

**Key Deliverables:**
- UserAssignmentModal component
- UserAutocomplete with debounced search
- UserChip component
- useUserSearch hook
- Migration of existing job assignment

**Impact:** 30% reduction in code duplication, 40% faster user assignment

---

#### Task 007: Externalize AI Instructions to Markdown
**File:** `task-007-externalize-ai-instructions.md`  
**Effort:** 2-3 days  
**Status:** Not Started

Move all AI prompts from hardcoded strings to external markdown files with variable interpolation and metadata.

**Key Deliverables:**
- PromptLoader service
- 3 prompt markdown files (job parser, CV validator, candidate overview)
- Prompt testing utility
- Documentation and guidelines

**Impact:** 80% reduction in prompt iteration time, non-developers can update prompts

---

### 🔵 Low Priority

#### Task 005: Aurora Logo Integration
**File:** `task-005-aurora-logo-integration.md`  
**Effort:** 1 day  
**Status:** Not Started

Replace current logo with Aurora logo across all interfaces with light/dark theme variants.

**Key Deliverables:**
- AuroraLogo component
- 22 logo assets (SVG, PNG, favicons)
- Updates to Layout, Login, PublicLayout
- Logo usage guidelines

**Impact:** Consistent branding across 100% of interfaces

---

## Implementation Roadmap

### Phase 1: Critical Fixes (Week 1)
**Duration:** 3-5 days  
**Priority:** CRITICAL/HIGH

```
Day 1-2:  Task 003 - Fix Feedback Template Edit Bug
Day 3-5:  Task 001 - Email Template Placeholder Guide
```

**Rationale:** Fix broken functionality first, then add high-value UX improvements.

---

### Phase 2: UX Improvements (Week 2-3)
**Duration:** 10-14 days  
**Priority:** MEDIUM

```
Week 2:   Task 002 - Rich Text Editor (5-7 days)
Week 3:   Task 004 - Feedback Template UX Redesign (5-7 days)
          Task 006 - Reusable Assignment Component (3-4 days, parallel)
```

**Rationale:** Major UX improvements that will significantly enhance user experience.

---

### Phase 3: Developer Experience (Week 4)
**Duration:** 3-4 days  
**Priority:** MEDIUM/LOW

```
Day 1-3:  Task 007 - Externalize AI Instructions
Day 4:    Task 005 - Aurora Logo Integration
```

**Rationale:** Developer experience and branding improvements.

---

### Phase 4: Polish & Testing (Week 5)
**Duration:** 5 days  
**Priority:** ALL

```
Day 1-2:  User acceptance testing
Day 3:    Performance optimization
Day 4:    Documentation updates
Day 5:    Training materials
```

---

## Effort Summary

| Task | Priority | Effort | Complexity |
|------|----------|--------|------------|
| 001 - Email Placeholder Guide | HIGH | 2-3 days | 5/10 |
| 002 - Rich Text Editor | MEDIUM | 5-7 days | 7/10 |
| 003 - Fix Template Edit | CRITICAL | 1-2 days | 6/10 |
| 004 - Template UX Redesign | MEDIUM | 5-7 days | 8/10 |
| 005 - Aurora Logo | LOW | 1 day | 3/10 |
| 006 - Reusable Assignment | MEDIUM | 3-4 days | 7/10 |
| 007 - Externalize AI Prompts | MEDIUM | 2-3 days | 6/10 |
| **TOTAL** | | **19-27 days** | **6.0 avg** |

---

## Dependencies

### External Libraries

```bash
# Task 002 - Rich Text Editor
npm install lexical @lexical/react @lexical/html @lexical/list @lexical/link

# Task 004 - Feedback Template UX
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities

# Task 007 - AI Prompts
npm install gray-matter
```

### Internal Dependencies

- **Task 001** → No dependencies
- **Task 002** → Depends on Task 001 (placeholder guide)
- **Task 003** → No dependencies (critical fix)
- **Task 004** → Should wait for Task 003 to be fixed
- **Task 005** → No dependencies
- **Task 006** → No dependencies
- **Task 007** → No dependencies

---

## Success Metrics

### Overall Project
- [ ] All 7 tasks completed and deployed
- [ ] Zero critical bugs introduced
- [ ] User satisfaction score > 4.5/5
- [ ] Performance metrics maintained or improved

### Individual Tasks
- **Task 001:** 80% reduction in placeholder-related support tickets
- **Task 002:** 90% of new templates use rich text
- **Task 003:** 100% success rate for template edits
- **Task 004:** 50% reduction in clicks to create template
- **Task 005:** Consistent branding across 100% of interfaces
- **Task 006:** Component reused in 3+ features
- **Task 007:** 100% of AI prompts externalized

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Rich text editor breaks email rendering | High | Medium | Extensive testing, HTML sanitization |
| Template redesign confuses users | Medium | Low | A/B testing, gradual rollout |
| Prompt externalization breaks AI | High | Low | Comprehensive testing, fallbacks |
| Timeline overrun | Medium | Medium | Prioritize critical tasks first |

---

## Getting Started

### For Developers

1. **Read the PRD:** Start with `.agent/prd-template-improvements.md`
2. **Choose a task:** Pick based on priority and your expertise
3. **Read task details:** Review the specific task markdown file
4. **Set up environment:** Install dependencies listed in task
5. **Create feature branch:** `git checkout -b feature/task-00X-description`
6. **Implement:** Follow the implementation plan in task file
7. **Test:** Complete all items in testing checklist
8. **Submit PR:** Reference task file in PR description

### For Product Managers

1. **Review PRD:** Understand overall objectives
2. **Prioritize tasks:** Adjust based on business needs
3. **Track progress:** Use task files as tracking documents
4. **Gather feedback:** Coordinate user testing
5. **Measure success:** Track metrics defined in each task

### For Designers

1. **Review design specs:** Each task has design specifications
2. **Provide assets:** Especially for Task 005 (logo)
3. **Review implementations:** Ensure designs are followed
4. **Conduct UX testing:** Especially for Tasks 001, 002, 004

---

## Task Status Tracking

Update this section as tasks progress:

```
✅ = Completed
🚧 = In Progress
⏸️ = Blocked
❌ = Cancelled
⭕ = Not Started
```

| Task | Status | Assignee | Start Date | End Date | Notes |
|------|--------|----------|------------|----------|-------|
| 001 | ⭕ | TBD | - | - | - |
| 002 | ⭕ | TBD | - | - | - |
| 003 | ⭕ | TBD | - | - | Critical! |
| 004 | ⭕ | TBD | - | - | - |
| 005 | ⭕ | TBD | - | - | Need logo assets |
| 006 | ⭕ | TBD | - | - | - |
| 007 | ⭕ | TBD | - | - | - |

---

## Questions & Decisions

### Open Questions

1. **Task 002:** Should rich text editor support custom HTML/CSS?
2. **Task 002:** What email clients must be supported?
3. **Task 004:** Should we keep old UI as fallback?
4. **Task 005:** When will final logo assets be ready?
5. **Task 007:** Should prompt changes trigger notifications?

### Decisions Made

- Using Lexical for rich text editor (over Tiptap)
- Using @dnd-kit for drag-and-drop (over react-beautiful-dnd)
- Externalizing prompts to markdown (over JSON)
- Slide-out panel for template builder (over modal)

---

## Resources

### Documentation
- [PRD](.agent/prd-template-improvements.md)
- [Aurora Design System](../packages/aurora-design-system/README.md)
- [Lexical Documentation](https://lexical.dev/)
- [@dnd-kit Documentation](https://docs.dndkit.com/)

### Related Files
- `apps/acentra-frontend/src/components/settings/EmailTemplateManager.tsx`
- `apps/acentra-frontend/src/components/settings/FeedbackTemplatesPage.tsx`
- `apps/acentra-frontend/src/components/UserAssignmentModal.tsx`
- `apps/acentra-backend/src/service/AIService.ts`

---

## Change Log

| Date | Change | Author |
|------|--------|--------|
| 2025-12-25 | Initial task breakdown created | PM Team |

---

**Last Updated:** December 25, 2025  
**Next Review:** January 1, 2026
