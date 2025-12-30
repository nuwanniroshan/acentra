# Task 004: Feedback Template UX Redesign

**Priority:** MEDIUM  
**Estimated Effort:** 5-7 days  
**Status:** Not Started  
**Assignee:** TBD  
**Related PRD:** `.agent/prd-template-improvements.md` (Section 4)

---

## Objective

Redesign the feedback template interface to reduce clicks, improve usability, and provide a more intuitive workflow for creating and managing feedback templates.

---

## Current Problems

### User Pain Points
- Too many clicks required (10+ for a 3-question template)
- Modal-heavy interface feels cramped
- Difficult to reorder questions
- No visual feedback for actions
- Unclear distinction between template metadata and questions
- Cannot see template overview while editing questions

### Current Flow Analysis

**Creating a Template (Current):**
1. Click "Create Template" → Modal opens
2. Fill template name
3. Select type from dropdown
4. Fill category (optional)
5. Fill description (optional)
6. Click "Add Question" → Form expands
7. Fill question text
8. Select question type
9. Select required/optional
10. Repeat steps 6-9 for each question
11. Click "Create"

**Total Clicks:** 10+ for 3 questions  
**Total Modals:** 1 large modal

---

## Proposed Solution

### New Flow

**Creating a Template (Proposed):**
1. Click "Create Template" → Slide-out panel opens
2. Fill template details inline (name, type, category)
3. Click "+" to add question → Question card expands inline
4. Fill question details → Collapse card
5. Repeat for additional questions (drag to reorder)
6. Click "Save Template"

**Total Clicks:** 6-7 for 3 questions (40% reduction)  
**Total Modals:** 0 (slide-out panel instead)

---

## Design Specifications

### Main Template List View

```
┌─────────────────────────────────────────────────────────────────┐
│ Feedback Templates                              [+ Create]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 📋 Phone Screening Template                   [Edit] [⋮] │   │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│ │ 5 questions • Active • Technical Interview              │   │
│ │ Last modified: 2 days ago                               │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│ ┌──────────────────────────────────────────────────────────┐   │
│ │ 📋 Manager Feedback                           [Edit] [⋮] │   │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│ │ 8 questions • Active • Manager Feedback                 │   │
│ │ Last modified: 1 week ago                               │   │
│ └──────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Template Builder (Slide-out Panel)

```
┌──────────────────────────────────────────────────────────┐
│ ← Create Feedback Template                          [×] │
├──────────────────────────────────────────────────────────┤
│                                                          │
│ Template Details                                         │
│ ┌────────────────────────────────────────────────────┐  │
│ │ Name *                                             │  │
│ │ [Phone Screening Template_____________]            │  │
│ │                                                    │  │
│ │ Type *              Category                       │  │
│ │ [Phone Screening ▼] [Technical_____]              │  │
│ │                                                    │  │
│ │ Description                                        │  │
│ │ [Standard phone screening questions___________]   │  │
│ │ [________________________________________]         │  │
│ │                                                    │  │
│ │ ☑ Active                                          │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│ Questions (3)                              [+ Add]       │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ☰ 1. How was the candidate's communication?  [⋮]  │  │
│ │    Type: Free Text • Required                     │  │
│ │    ▼ Expand to edit                               │  │
│ └────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ☰ 2. Rate technical skills (1-5)             [⋮]  │  │
│ │    Type: Rating • Required                        │  │
│ │    ▼ Expand to edit                               │  │
│ └────────────────────────────────────────────────────┘  │
│ ┌────────────────────────────────────────────────────┐  │
│ │ ☰ 3. Would you recommend for next round?    [⋮]  │  │
│ │    Type: Yes/No • Required                        │  │
│ │    ▼ Expand to edit                               │  │
│ └────────────────────────────────────────────────────┘  │
│                                                          │
│                                                          │
│ [Cancel]                                      [Save]     │
└──────────────────────────────────────────────────────────┘
```

### Expanded Question Card

```
┌────────────────────────────────────────────────────┐
│ ☰ Question 1                         [Duplicate] [×]│
├────────────────────────────────────────────────────┤
│ Question Text *                                    │
│ [How was the candidate's communication?_______]    │
│ [____________________________________________]     │
│                                                    │
│ Question Type *          Required                  │
│ [Free Text      ▼]      [Required ▼]              │
│                                                    │
│ Help Text (Optional)                               │
│ [Assess clarity, professionalism, etc.______]     │
│                                                    │
│ [Collapse ▲]                                       │
└────────────────────────────────────────────────────┘
```

---

## Technical Implementation

### New Component Structure

```
apps/acentra-frontend/src/components/feedback/
├── FeedbackTemplateList.tsx          (Main list view)
├── TemplateCard.tsx                  (Individual template card)
├── TemplateBuilder/
│   ├── TemplateBuilderPanel.tsx      (Slide-out panel)
│   ├── TemplateMetadataForm.tsx      (Template details form)
│   ├── QuestionList.tsx              (List of questions with DnD)
│   ├── QuestionCard.tsx              (Collapsible question card)
│   ├── QuestionEditor.tsx            (Question edit form)
│   └── useTemplateBuilder.ts         (State management hook)
└── TemplateActions/
    ├── TemplateMenu.tsx              (Dropdown menu for actions)
    └── DeleteConfirmDialog.tsx       (Delete confirmation)
```

### Dependencies

```bash
cd apps/acentra-frontend
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## Implementation Details

### 1. Template Builder Panel

Create `TemplateBuilderPanel.tsx`:
```typescript
import { useState } from 'react';
import {
  AuroraDrawer,
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraIconButton,
  AuroraCloseIcon,
} from '@acentra/aurora-design-system';
import { TemplateMetadataForm } from './TemplateMetadataForm';
import { QuestionList } from './QuestionList';
import { useTemplateBuilder } from './useTemplateBuilder';

interface TemplateBuilderPanelProps {
  open: boolean;
  onClose: () => void;
  template?: FeedbackTemplate;
  onSave: (template: FeedbackTemplate) => Promise<void>;
}

export const TemplateBuilderPanel = ({
  open,
  onClose,
  template,
  onSave,
}: TemplateBuilderPanelProps) => {
  const {
    metadata,
    questions,
    updateMetadata,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
    validate,
    isDirty,
  } = useTemplateBuilder(template);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const errors = validate();
    if (errors.length > 0) {
      alert(errors.join('\n'));
      return;
    }

    setSaving(true);
    try {
      await onSave({
        ...metadata,
        questions,
      });
      onClose();
    } catch (error) {
      alert('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (isDirty && !confirm('You have unsaved changes. Are you sure you want to close?')) {
      return;
    }
    onClose();
  };

  return (
    <AuroraDrawer
      anchor="right"
      open={open}
      onClose={handleClose}
      PaperProps={{
        sx: { width: { xs: '100%', sm: 600, md: 700 } },
      }}
    >
      <AuroraBox sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header */}
        <AuroraBox
          sx={{
            p: 2,
            borderBottom: 1,
            borderColor: 'divider',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <AuroraBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AuroraIconButton onClick={handleClose}>
              <AuroraCloseIcon />
            </AuroraIconButton>
            <AuroraTypography variant="h6">
              {template ? 'Edit Template' : 'Create Template'}
            </AuroraTypography>
          </AuroraBox>
        </AuroraBox>

        {/* Content */}
        <AuroraBox sx={{ flex: 1, overflow: 'auto', p: 3 }}>
          <TemplateMetadataForm
            metadata={metadata}
            onChange={updateMetadata}
          />

          <AuroraBox sx={{ mt: 4 }}>
            <QuestionList
              questions={questions}
              onAdd={addQuestion}
              onUpdate={updateQuestion}
              onRemove={removeQuestion}
              onReorder={reorderQuestions}
            />
          </AuroraBox>
        </AuroraBox>

        {/* Footer */}
        <AuroraBox
          sx={{
            p: 2,
            borderTop: 1,
            borderColor: 'divider',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <AuroraButton onClick={handleClose} disabled={saving}>
            Cancel
          </AuroraButton>
          <AuroraButton
            variant="contained"
            onClick={handleSave}
            disabled={saving || !isDirty}
          >
            {saving ? 'Saving...' : 'Save Template'}
          </AuroraButton>
        </AuroraBox>
      </AuroraBox>
    </AuroraDrawer>
  );
};
```

### 2. Question List with Drag & Drop

Create `QuestionList.tsx`:
```typescript
import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  AuroraBox,
  AuroraTypography,
  AuroraButton,
  AuroraAddIcon,
} from '@acentra/aurora-design-system';
import { QuestionCard } from './QuestionCard';
import { FeedbackQuestion } from '@/services/feedbackService';

interface QuestionListProps {
  questions: Partial<FeedbackQuestion>[];
  onAdd: () => void;
  onUpdate: (index: number, updates: Partial<FeedbackQuestion>) => void;
  onRemove: (index: number) => void;
  onReorder: (questions: Partial<FeedbackQuestion>[]) => void;
}

export const QuestionList = ({
  questions,
  onAdd,
  onUpdate,
  onRemove,
  onReorder,
}: QuestionListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = questions.findIndex((_, i) => i === active.id);
      const newIndex = questions.findIndex((_, i) => i === over.id);
      const reordered = arrayMove(questions, oldIndex, newIndex);
      onReorder(reordered);
    }
  };

  return (
    <AuroraBox>
      <AuroraBox
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <AuroraTypography variant="h6">
          Questions ({questions.length})
        </AuroraTypography>
        <AuroraButton
          startIcon={<AuroraAddIcon />}
          onClick={onAdd}
          size="small"
        >
          Add Question
        </AuroraButton>
      </AuroraBox>

      {questions.length === 0 ? (
        <AuroraBox
          sx={{
            p: 4,
            textAlign: 'center',
            border: 2,
            borderStyle: 'dashed',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <AuroraTypography color="text.secondary">
            No questions yet. Click "Add Question" to get started.
          </AuroraTypography>
        </AuroraBox>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={questions.map((_, i) => i)}
            strategy={verticalListSortingStrategy}
          >
            {questions.map((question, index) => (
              <QuestionCard
                key={index}
                id={index}
                index={index}
                question={question}
                onUpdate={(updates) => onUpdate(index, updates)}
                onRemove={() => onRemove(index)}
              />
            ))}
          </SortableContext>
        </DndContext>
      )}
    </AuroraBox>
  );
};
```

### 3. Collapsible Question Card

Create `QuestionCard.tsx`:
```typescript
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  AuroraBox,
  AuroraTypography,
  AuroraIconButton,
  AuroraPaper,
  AuroraCollapse,
  AuroraDragIndicatorIcon,
  AuroraExpandMoreIcon,
  AuroraExpandLessIcon,
  AuroraDeleteIcon,
  AuroraContentCopyIcon,
} from '@acentra/aurora-design-system';
import { QuestionEditor } from './QuestionEditor';
import { FeedbackQuestion } from '@/services/feedbackService';

interface QuestionCardProps {
  id: number;
  index: number;
  question: Partial<FeedbackQuestion>;
  onUpdate: (updates: Partial<FeedbackQuestion>) => void;
  onRemove: () => void;
  onDuplicate?: () => void;
}

export const QuestionCard = ({
  id,
  index,
  question,
  onUpdate,
  onRemove,
  onDuplicate,
}: QuestionCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const questionTypeLabels = {
    free_text: 'Free Text',
    rating: 'Rating',
    yes_no: 'Yes/No',
    multiple_choice: 'Multiple Choice',
  };

  return (
    <AuroraPaper
      ref={setNodeRef}
      style={style}
      sx={{
        mb: 2,
        overflow: 'hidden',
        border: 1,
        borderColor: expanded ? 'primary.main' : 'divider',
        transition: 'border-color 0.2s',
      }}
    >
      {/* Header */}
      <AuroraBox
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <AuroraBox {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
          <AuroraDragIndicatorIcon color="action" />
        </AuroraBox>

        <AuroraTypography variant="body2" fontWeight="bold" sx={{ flex: 1 }}>
          {index + 1}. {question.question || 'New Question'}
        </AuroraTypography>

        <AuroraBox sx={{ display: 'flex', gap: 0.5 }}>
          {question.type && (
            <AuroraTypography variant="caption" color="text.secondary">
              {questionTypeLabels[question.type as keyof typeof questionTypeLabels]}
            </AuroraTypography>
          )}
          {question.required && (
            <AuroraTypography variant="caption" color="error">
              • Required
            </AuroraTypography>
          )}
        </AuroraBox>

        <AuroraIconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            setExpanded(!expanded);
          }}
        >
          {expanded ? <AuroraExpandLessIcon /> : <AuroraExpandMoreIcon />}
        </AuroraIconButton>
      </AuroraBox>

      {/* Expanded Content */}
      <AuroraCollapse in={expanded}>
        <AuroraBox sx={{ p: 2, pt: 0, borderTop: 1, borderColor: 'divider' }}>
          <QuestionEditor question={question} onChange={onUpdate} />

          <AuroraBox sx={{ display: 'flex', gap: 1, mt: 2 }}>
            {onDuplicate && (
              <AuroraButton
                size="small"
                startIcon={<AuroraContentCopyIcon />}
                onClick={onDuplicate}
              >
                Duplicate
              </AuroraButton>
            )}
            <AuroraButton
              size="small"
              color="error"
              startIcon={<AuroraDeleteIcon />}
              onClick={() => {
                if (confirm('Are you sure you want to delete this question?')) {
                  onRemove();
                }
              }}
            >
              Delete
            </AuroraButton>
          </AuroraBox>
        </AuroraBox>
      </AuroraCollapse>
    </AuroraPaper>
  );
};
```

### 4. State Management Hook

Create `useTemplateBuilder.ts`:
```typescript
import { useState, useEffect } from 'react';
import { FeedbackTemplate, FeedbackQuestion } from '@/services/feedbackService';

export const useTemplateBuilder = (initialTemplate?: FeedbackTemplate) => {
  const [metadata, setMetadata] = useState({
    name: initialTemplate?.name || '',
    type: initialTemplate?.type || 'phone_screening',
    category: initialTemplate?.category || '',
    description: initialTemplate?.description || '',
    instructions: initialTemplate?.instructions || '',
    isActive: initialTemplate?.isActive ?? true,
  });

  const [questions, setQuestions] = useState<Partial<FeedbackQuestion>[]>(
    initialTemplate?.questions || []
  );

  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setIsDirty(true);
  }, [metadata, questions]);

  const updateMetadata = (updates: Partial<typeof metadata>) => {
    setMetadata((prev) => ({ ...prev, ...updates }));
  };

  const addQuestion = () => {
    const newQuestion: Partial<FeedbackQuestion> = {
      question: '',
      type: 'free_text',
      required: 'optional',
      helpText: '',
      order: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (index: number, updates: Partial<FeedbackQuestion>) => {
    const updated = [...questions];
    updated[index] = { ...updated[index], ...updates };
    setQuestions(updated);
  };

  const removeQuestion = (index: number) => {
    const updated = questions.filter((_, i) => i !== index);
    // Update order
    updated.forEach((q, i) => {
      q.order = i;
    });
    setQuestions(updated);
  };

  const reorderQuestions = (reordered: Partial<FeedbackQuestion>[]) => {
    reordered.forEach((q, i) => {
      q.order = i;
    });
    setQuestions(reordered);
  };

  const validate = (): string[] => {
    const errors: string[] = [];

    if (!metadata.name) {
      errors.push('Template name is required');
    }

    if (!metadata.type) {
      errors.push('Template type is required');
    }

    if (questions.length === 0) {
      errors.push('At least one question is required');
    }

    questions.forEach((q, i) => {
      if (!q.question) {
        errors.push(`Question ${i + 1}: Question text is required`);
      }
      if (!q.type) {
        errors.push(`Question ${i + 1}: Question type is required`);
      }
    });

    return errors;
  };

  return {
    metadata,
    questions,
    updateMetadata,
    addQuestion,
    updateQuestion,
    removeQuestion,
    reorderQuestions,
    validate,
    isDirty,
  };
};
```

---

## Migration Plan

### Phase 1: Build New Interface (Week 1-2)
- [ ] Create all new components
- [ ] Implement drag-and-drop
- [ ] Add animations and transitions
- [ ] Test in isolation

### Phase 2: Feature Flag (Week 2)
- [ ] Add feature flag to toggle between old/new UI
- [ ] Deploy to staging
- [ ] Internal testing

### Phase 3: A/B Testing (Week 3)
- [ ] Enable for 25% of users
- [ ] Gather metrics and feedback
- [ ] Iterate based on feedback

### Phase 4: Full Rollout (Week 4)
- [ ] Enable for 100% of users
- [ ] Remove old UI code
- [ ] Update documentation

---

## Testing Checklist

### Functional Testing
- [ ] Create template with 0 questions (should show validation error)
- [ ] Create template with 1 question
- [ ] Create template with 10+ questions
- [ ] Edit existing template
- [ ] Reorder questions via drag-and-drop
- [ ] Duplicate question
- [ ] Delete question
- [ ] Expand/collapse question cards
- [ ] Save template
- [ ] Cancel without saving (should prompt if dirty)

### UX Testing
- [ ] Click count reduced by 40%+
- [ ] Time to create template reduced by 30%+
- [ ] Drag-and-drop feels smooth
- [ ] Animations are not jarring
- [ ] Responsive on mobile
- [ ] Keyboard navigation works
- [ ] Screen reader compatible

### Performance Testing
- [ ] Panel opens in <200ms
- [ ] Drag-and-drop has no lag
- [ ] Large templates (20+ questions) perform well

---

## Acceptance Criteria

- [ ] Slide-out panel replaces modal dialog
- [ ] Inline question editing works
- [ ] Drag-and-drop reordering functional
- [ ] Click count reduced by 40% minimum
- [ ] No regression in functionality
- [ ] Accessible (WCAG 2.1 AA)
- [ ] User satisfaction score > 4.5/5 in A/B test

---

## Success Metrics

- **Target:** 50% reduction in clicks to create template
- **Target:** 40% reduction in time to create template
- **Target:** 90% of users prefer new interface (A/B test)
- **Target:** User satisfaction score > 4.5/5

---

## Notes

- Consider adding keyboard shortcuts (e.g., Ctrl+Enter to save)
- Future enhancement: Template preview mode
- Future enhancement: Question library/presets
- Future enhancement: Bulk import questions from CSV
