# Dev Story: Reusable Recruiter Selector Component

**Epic**: EPIC-05 - Recruitment Workflow Efficiency  
**Story**: 5.6 - Reusable Recruiter Selector Component  
**Priority**: Medium  
**Status**: Backlog  
**Created**: 2025-12-26  
**Assignee**: @dev

---

## User Story

**As a** User (Recruiter/Admin/Hiring Manager)  
**I want** a reusable recruiter selector component with search and multi-select capabilities  
**So that** I can easily assign recruiters to jobs, candidates, or other entities with a consistent UX across the application.

---

## Acceptance Criteria

### Functional Requirements

1. **Search Functionality**
   - [ ] User can type a few letters to search for recruiters by name or email
   - [ ] Search should be case-insensitive and support partial matching
   - [ ] Search results should update in real-time as the user types
   - [ ] Minimum 2 characters required to trigger search (configurable)

2. **Selection & Display**
   - [ ] Selected recruiters should appear as chips/badges in the input field
   - [ ] Each chip should display the recruiter's name
   - [ ] Each chip should have a remove (×) button
   - [ ] Support both single-select and multi-select modes

3. **Component Variants**
   - [ ] **Modal variant**: Full-screen or dialog-based selector
   - [ ] **Dropdown variant**: Inline autocomplete dropdown
   - [ ] Both variants should share the same core logic and styling

4. **User Experience**
   - [ ] Keyboard navigation support (arrow keys, Enter to select, Escape to close)
   - [ ] Clear visual feedback for hover, focus, and selected states
   - [ ] Loading state while fetching recruiters
   - [ ] Empty state when no results found
   - [ ] Error state for failed API calls

5. **Reusability**
   - [ ] Component should accept props for customization (placeholder, label, max selections, etc.)
   - [ ] Should integrate seamlessly with form libraries (React Hook Form, Formik)
   - [ ] Should be theme-aware and follow Aurora Design System patterns

---

## Technical Requirements

### Component API

```typescript
interface RecruiterSelectorProps {
  // Selection
  value?: string | string[]; // Selected recruiter ID(s)
  onChange: (value: string | string[]) => void;
  
  // Behavior
  mode?: 'single' | 'multiple'; // Default: 'multiple'
  variant?: 'modal' | 'dropdown'; // Default: 'dropdown'
  
  // Customization
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  maxSelections?: number;
  
  // Filtering
  excludeIds?: string[]; // Exclude specific recruiter IDs
  filterByRole?: string[]; // Filter by user roles
  filterByDepartment?: string[]; // Filter by department
  
  // Styling
  fullWidth?: boolean;
  size?: 'small' | 'medium' | 'large';
}
```

### Implementation Details

1. **Backend API**
   - [ ] Create or enhance `/api/users/search` endpoint to support:
     - Query parameter for search term
     - Role filtering (e.g., `role=RECRUITER`)
     - Department filtering
     - Pagination support
   - [ ] Response should include: `id`, `name`, `email`, `avatar`, `department`

2. **Frontend Component Structure**
   ```
   components/
   └── common/
       └── RecruiterSelector/
           ├── RecruiterSelector.tsx          # Main component
           ├── RecruiterSelectorModal.tsx     # Modal variant
           ├── RecruiterSelectorDropdown.tsx  # Dropdown variant
           ├── RecruiterChip.tsx              # Chip display component
           └── useRecruiterSearch.ts          # Custom hook for search logic
   ```

3. **State Management**
   - [ ] Use debounced search (300ms) to avoid excessive API calls
   - [ ] Cache search results to improve performance
   - [ ] Handle loading, error, and empty states

4. **Accessibility**
   - [ ] ARIA labels for screen readers
   - [ ] Proper focus management
   - [ ] Keyboard shortcuts documented

---

## Design Considerations

### Visual Design
- Follow Aurora Design System chip component patterns
- Use consistent spacing and typography
- Support both light and dark themes
- Smooth animations for chip add/remove

### UX Patterns
- Similar to Material-UI Autocomplete with chips
- Reference: Gmail's recipient selector
- Clear visual distinction between selected and available recruiters

---

## Usage Examples

### Example 1: Job Assignment (Multi-select)
```tsx
<RecruiterSelector
  label="Assign Recruiters"
  placeholder="Search recruiters..."
  mode="multiple"
  value={selectedRecruiterIds}
  onChange={setSelectedRecruiterIds}
  filterByRole={['RECRUITER', 'LEAD_RECRUITER']}
/>
```

### Example 2: Primary Owner (Single-select)
```tsx
<RecruiterSelector
  label="Job Owner"
  placeholder="Select primary recruiter..."
  mode="single"
  value={ownerId}
  onChange={setOwnerId}
  required
/>
```

### Example 3: Modal Variant
```tsx
<RecruiterSelector
  variant="modal"
  label="Add Team Members"
  mode="multiple"
  value={teamMemberIds}
  onChange={setTeamMemberIds}
  maxSelections={5}
/>
```

---

## Testing Requirements

### Unit Tests
- [ ] Search functionality with various inputs
- [ ] Selection and deselection logic
- [ ] Keyboard navigation
- [ ] Error handling

### Integration Tests
- [ ] API integration for fetching recruiters
- [ ] Form integration (React Hook Form)
- [ ] Theme switching

### E2E Tests
- [ ] Complete user flow: search → select → remove
- [ ] Modal and dropdown variants
- [ ] Accessibility compliance

---

## Dependencies

- Aurora Design System components (AuroraAutocomplete, AuroraChip, AuroraTextField)
- Backend API endpoint for user search
- Debounce utility (lodash.debounce or custom)

---

## Integration Points

This component should be integrated into:
1. **Job Creation/Edit**: Assign recruiters to jobs
2. **Candidate Assignment**: Assign candidates to specific recruiters
3. **Team Management**: Add team members to departments/projects
4. **Bulk Actions**: Reassign multiple candidates to a recruiter
5. **Settings**: Configure default recruiters for workflows

---

## Success Metrics

- Component is reused in at least 3 different features
- Search response time < 500ms
- Zero accessibility violations
- Positive user feedback on ease of use

---

## Notes

- Consider adding avatar images to chips for better visual identification
- Future enhancement: Group recruiters by department in dropdown
- Future enhancement: Show recruiter availability/workload in search results
- Ensure component works well on mobile devices (touch-friendly chip removal)

---

## Related Stories

- Story 5.1: High-Volume Candidate Management (bulk assignment)
- Story 5.5: Recruiter Communication & Dashboard
- Future: Team collaboration features
