# Task 003: Fix Feedback Template Edit Bug

**Priority:** CRITICAL 🔴  
**Estimated Effort:** 1-2 days  
**Status:** Not Started  
**Assignee:** TBD  
**Related PRD:** `.agent/prd-template-improvements.md` (Section 3)

---

## Objective

Fix the critical bug where feedback template questions do not load when editing an existing template, preventing users from updating templates.

---

## Problem Description

**Current Behavior:**
- User clicks "Edit" on a feedback template
- Edit dialog opens
- Template metadata loads correctly (name, type, description)
- Questions array is empty or undefined
- User cannot see or edit existing questions

**Expected Behavior:**
- User clicks "Edit" on a feedback template
- Edit dialog opens with all template data
- All questions load and display correctly
- User can modify questions and save changes

---

## Root Cause Investigation

### Suspected Issues

1. **Backend API not returning questions**
   - `GET /feedback-templates/:id` may not include questions in response
   - Missing `relations: ['questions']` in TypeORM query
   - Questions not being serialized properly

2. **Frontend state management**
   - `setCurrentQuestions` not being called with correct data
   - Race condition in async operations
   - Questions array not being spread correctly

3. **Data structure mismatch**
   - Questions might be nested differently than expected
   - Type mismatch between API response and frontend types

---

## Investigation Steps

### Step 1: Verify Backend API

**File:** `apps/acentra-backend/src/controller/FeedbackTemplateController.ts`

Check the `getById` method:

```typescript
// Current implementation (verify this exists)
async getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const template = await this.repository.findOne({
      where: { id },
      relations: ['questions'], // ← VERIFY THIS EXISTS
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Log for debugging
    console.log('Template loaded:', {
      id: template.id,
      name: template.name,
      questionCount: template.questions?.length || 0,
    });

    return res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return res.status(500).json({ message: 'Failed to fetch template' });
  }
}
```

**Action Items:**
- [ ] Verify `relations: ['questions']` is present
- [ ] Add `order: { questions: { order: 'ASC' } }` for proper ordering
- [ ] Add logging to verify questions are loaded
- [ ] Test API endpoint directly with curl/Postman

**Test Command:**
```bash
# Replace :id with actual template ID
curl -X GET http://localhost:3000/api/feedback-templates/:id \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 2: Check Entity Relationships

**File:** `apps/acentra-backend/src/entity/FeedbackTemplate.ts`

Verify the relationship is properly defined:

```typescript
@Entity()
export class FeedbackTemplate {
  // ... other fields

  @OneToMany(() => FeedbackQuestion, (question) => question.template, {
    cascade: true,
    eager: false, // Should be false to avoid circular loading
  })
  questions: FeedbackQuestion[];
}
```

**File:** `apps/acentra-backend/src/entity/FeedbackQuestion.ts`

```typescript
@Entity()
export class FeedbackQuestion {
  // ... other fields

  @ManyToOne(() => FeedbackTemplate, (template) => template.questions, {
    onDelete: 'CASCADE',
  })
  template: FeedbackTemplate;
}
```

**Action Items:**
- [ ] Verify relationship decorators are correct
- [ ] Ensure `cascade: true` is set on FeedbackTemplate
- [ ] Check that `onDelete: 'CASCADE'` is set on FeedbackQuestion

### Step 3: Verify Frontend Service

**File:** `apps/acentra-frontend/src/services/feedbackService.ts`

Check the `getTemplateById` method:

```typescript
async getTemplateById(id: string): Promise<FeedbackTemplate> {
  try {
    console.log('Fetching template:', id);
    const response = await apiClient.get(`/feedback-templates/${id}`);
    console.log('Template response:', response.data);
    console.log('Questions in response:', response.data.questions);
    return response.data;
  } catch (error) {
    console.error('Error fetching template:', error);
    throw error;
  }
}
```

**Action Items:**
- [ ] Add logging to track API response
- [ ] Verify response structure matches expected type
- [ ] Check for any response transformations

### Step 4: Fix Frontend Component

**File:** `apps/acentra-frontend/src/components/settings/FeedbackTemplatesPage.tsx`

**Current Implementation (lines 98-109):**
```typescript
const handleEditTemplate = async (template: FeedbackTemplate) => {
  try {
    const fullTemplate = await feedbackService.getTemplateById(template.id);
    setSelectedTemplate(fullTemplate);
    setCurrentTemplate({ ...fullTemplate });
    setCurrentQuestions([...(fullTemplate.questions || [])]);
    setShowEditDialog(true);
  } catch (error) {
    console.error('Failed to load template for editing:', error);
    alert('Failed to load template');
  }
};
```

**Enhanced Implementation with Debugging:**
```typescript
const handleEditTemplate = async (template: FeedbackTemplate) => {
  try {
    console.log('=== EDIT TEMPLATE DEBUG ===');
    console.log('1. Template ID:', template.id);
    console.log('2. Template from list:', template);
    
    setIsLoadingTemplate(true); // Add loading state
    
    const fullTemplate = await feedbackService.getTemplateById(template.id);
    
    console.log('3. Full template loaded:', fullTemplate);
    console.log('4. Questions array:', fullTemplate.questions);
    console.log('5. Questions length:', fullTemplate.questions?.length || 0);
    
    if (!fullTemplate) {
      throw new Error('Template not found');
    }
    
    if (!fullTemplate.questions) {
      console.warn('⚠️ No questions array in template');
      fullTemplate.questions = [];
    }
    
    if (fullTemplate.questions.length === 0) {
      console.warn('⚠️ Questions array is empty');
    }
    
    // Log each question
    fullTemplate.questions.forEach((q, index) => {
      console.log(`Question ${index + 1}:`, q);
    });
    
    setSelectedTemplate(fullTemplate);
    setCurrentTemplate({ ...fullTemplate });
    setCurrentQuestions([...(fullTemplate.questions || [])]);
    
    console.log('6. State updated, opening dialog');
    setShowEditDialog(true);
    
  } catch (error) {
    console.error('❌ Failed to load template for editing:', error);
    alert(`Failed to load template: ${error.message}`);
  } finally {
    setIsLoadingTemplate(false);
  }
};
```

---

## Implementation Plan

### Fix 1: Backend - Ensure Questions are Loaded

**File:** `apps/acentra-backend/src/controller/FeedbackTemplateController.ts`

```typescript
async getById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    
    const template = await this.repository.findOne({
      where: { id },
      relations: ['questions', 'createdBy'], // Include questions relation
      order: {
        questions: {
          order: 'ASC', // Order questions by their order field
        },
      },
    });

    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }

    // Ensure questions array exists
    if (!template.questions) {
      template.questions = [];
    }

    // Log for debugging (remove in production)
    console.log(`Template ${id} loaded with ${template.questions.length} questions`);

    return res.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch template',
      error: error.message 
    });
  }
}
```

### Fix 2: Frontend - Add Loading State and Better Error Handling

**File:** `apps/acentra-frontend/src/components/settings/FeedbackTemplatesPage.tsx`

Add loading state:
```typescript
const [isLoadingTemplate, setIsLoadingTemplate] = useState(false);
```

Update the edit handler:
```typescript
const handleEditTemplate = async (template: FeedbackTemplate) => {
  try {
    setIsLoadingTemplate(true);
    
    const fullTemplate = await feedbackService.getTemplateById(template.id);
    
    if (!fullTemplate) {
      throw new Error('Template not found');
    }
    
    // Ensure questions array exists
    if (!fullTemplate.questions) {
      console.warn('No questions found in template, initializing empty array');
      fullTemplate.questions = [];
    }
    
    setSelectedTemplate(fullTemplate);
    setCurrentTemplate({ ...fullTemplate });
    setCurrentQuestions([...(fullTemplate.questions || [])]);
    setShowEditDialog(true);
    
  } catch (error) {
    console.error('Failed to load template for editing:', error);
    alert('Failed to load template. Please try again.');
  } finally {
    setIsLoadingTemplate(false);
  }
};
```

Add loading indicator in dialog:
```typescript
<AuroraDialogContent>
  {isLoadingTemplate ? (
    <AuroraBox sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <AuroraCircularProgress />
    </AuroraBox>
  ) : (
    <AuroraBox sx={{ mt: 2 }}>
      {/* Existing form fields */}
    </AuroraBox>
  )}
</AuroraDialogContent>
```

### Fix 3: Add Validation and Debugging

**File:** `apps/acentra-frontend/src/services/feedbackService.ts`

```typescript
async getTemplateById(id: string): Promise<FeedbackTemplate> {
  try {
    const response = await apiClient.get(`/feedback-templates/${id}`);
    const template = response.data;
    
    // Validate response structure
    if (!template) {
      throw new Error('Empty response from server');
    }
    
    if (!template.id) {
      throw new Error('Invalid template structure: missing id');
    }
    
    // Ensure questions array exists
    if (!Array.isArray(template.questions)) {
      console.warn('Questions is not an array, initializing as empty array');
      template.questions = [];
    }
    
    return template;
  } catch (error) {
    console.error('Error fetching template by ID:', error);
    throw error;
  }
}
```

---

## Testing Plan

### Manual Testing

1. **Test Case 1: Edit Template with Questions**
   - Create a new template with 3 questions
   - Save the template
   - Click "Edit" on the template
   - Verify all 3 questions load correctly
   - Modify a question
   - Save changes
   - Verify changes persisted

2. **Test Case 2: Edit Template with No Questions**
   - Create a template with 0 questions (if possible)
   - Click "Edit"
   - Verify no errors occur
   - Add questions
   - Save

3. **Test Case 3: Edit Template with Many Questions**
   - Create a template with 10+ questions
   - Click "Edit"
   - Verify all questions load
   - Verify performance is acceptable

4. **Test Case 4: Network Error**
   - Simulate network error (disconnect internet)
   - Try to edit template
   - Verify error message is shown
   - Verify app doesn't crash

### Automated Testing

```typescript
// apps/acentra-frontend/src/components/settings/__tests__/FeedbackTemplatesPage.test.tsx

describe('FeedbackTemplatesPage - Edit Template', () => {
  it('should load template with questions when edit is clicked', async () => {
    const mockTemplate = {
      id: '123',
      name: 'Test Template',
      questions: [
        { id: '1', question: 'Question 1', type: 'free_text' },
        { id: '2', question: 'Question 2', type: 'rating' },
      ],
    };

    jest.spyOn(feedbackService, 'getTemplateById').mockResolvedValue(mockTemplate);

    render(<FeedbackTemplatesPage />);
    
    const editButton = screen.getByLabelText('Edit Test Template');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Question 1')).toBeInTheDocument();
      expect(screen.getByText('Question 2')).toBeInTheDocument();
    });
  });

  it('should handle template with no questions', async () => {
    const mockTemplate = {
      id: '123',
      name: 'Empty Template',
      questions: [],
    };

    jest.spyOn(feedbackService, 'getTemplateById').mockResolvedValue(mockTemplate);

    render(<FeedbackTemplatesPage />);
    
    const editButton = screen.getByLabelText('Edit Empty Template');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText('Questions (0)')).toBeInTheDocument();
    });
  });

  it('should show error message when template load fails', async () => {
    jest.spyOn(feedbackService, 'getTemplateById').mockRejectedValue(
      new Error('Network error')
    );

    render(<FeedbackTemplatesPage />);
    
    const editButton = screen.getByLabelText('Edit Test Template');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load template/i)).toBeInTheDocument();
    });
  });
});
```

---

## Debugging Checklist

If the issue persists after implementing fixes, check:

- [ ] Database: Verify questions exist in database for the template
  ```sql
  SELECT * FROM feedback_question WHERE template_id = 'YOUR_TEMPLATE_ID';
  ```

- [ ] Network: Check browser Network tab for API response
  - Verify 200 status code
  - Verify response body contains questions array
  - Check for any CORS or authentication issues

- [ ] Console: Check browser console for errors
  - JavaScript errors
  - TypeScript type errors
  - React warnings

- [ ] State: Use React DevTools to inspect component state
  - Check `currentQuestions` state value
  - Check `currentTemplate` state value
  - Verify state updates when edit is clicked

- [ ] TypeORM: Enable query logging
  ```typescript
  // In database config
  logging: true,
  logger: 'advanced-console',
  ```

---

## Acceptance Criteria

- [ ] Edit button loads template with all questions
- [ ] Questions display in correct order
- [ ] All question fields are editable
- [ ] Changes to questions persist when saved
- [ ] No console errors during edit operation
- [ ] Loading state shows while fetching template
- [ ] Error message shows if template load fails
- [ ] Works for templates with 0, 1, and 10+ questions

---

## Success Metrics

- **Target:** 100% success rate for template edit operations
- **Target:** Zero error reports related to template editing
- **Target:** Average edit completion time < 2 minutes

---

## Rollback Plan

If the fix introduces new issues:

1. Revert backend changes:
   ```bash
   git revert <commit-hash>
   ```

2. Revert frontend changes:
   ```bash
   git revert <commit-hash>
   ```

3. Deploy previous stable version

4. Investigate issue further in development environment

---

## Notes

- This is a critical bug affecting core functionality
- Should be prioritized over new features
- Consider adding integration tests to prevent regression
- May want to add Sentry or similar error tracking for production debugging
