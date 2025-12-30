# Epic: Recruitment Workflow Efficiency

**Priority**: High
**Status**: Prioritized
**Reference**: `ux-feedback.md`

## Description
Streamline the core recruiting workflows to handle high-volume hiring and structured evaluation, moving the platform from "functional" to "efficient" for power users.

## User Stories

### Story 5.1: High-Volume Candidate Management
**As a** Recruiter
**I want** to perform actions on multiple candidates at once
**So that** I can process batches of applications quickly.

*   **Tasks**:
    *   [x] Implement multi-select checkboxes in the Candidate List view.
    *   [x] Build a "Bulk Actions" bar (Reject, Move Stage, Send Email).
    *   [x] Add advanced filtering (Job, Date, Status, Tag) and a specific Candidate Search bar.

### Story 5.2: AI-Powered Job Creation Refinements
**As a** Hiring Manager
**I want** a more flexible job creation experience
**So that** I don't feel blocked by missing templates or rigid steps.

*   **Tasks**:
    *   [x] Implement a visual Drag-and-Drop zone for JD files in Step 1.
    *   [x] Add a "Live Preview" panel to show parsed data immediately after upload.
    *   [ ] Allow "Skip for now" on template selection and provide a "Draft" saving option.

### Story 5.3: Structured Candidate Evaluation
**As an** Interviewer
**I want** a standardized way to provide feedback
**So that** candidate reviews are objective and consistent.

*   **Tasks**:
    *   [x] Create "Candidate Scorecards" with 1-5 ratings on custom criteria.
    *   [x] Add a "Status History" tooltip/timeline to candidates on the Kanban board.
    *   [x] Implement a unified "Evaluation" tab in the `CandidateDetailsDrawer`.

### Story 5.4: Integrated Interview Scheduling
**As a** Recruitment Coordinator
**I want** to schedule interviews directly from the ATS
**So that** I don't have to switch between the ATS and my calendar.

*   **Tasks**:
    *   [x] Build a "Schedule Interview" modal in the Candidate drawer.
    *   [x] Integrate with Google/Outlook calendars (or implement a basic internal view first).
    *   [ ] Add automated email invites for candidates and interviewers.


### Story 5.5: Recruiter Communication & Dashboard
**As a** Lead Recruiter
**I want** a personalized overview of my tasks
**So that** I can focus on the candidates and jobs that need immediate attention.

*   **Tasks**:
    *   [ ] Implement a "Recruiter Dashboard" with "My Active Jobs" and "Candidates to Review" widgets.
    *   [ ] Build a library of "Email Templates" for consistent candidate communication.
    *   [ ] Add "Auto-rejection" settings for specific pipeline stages.

### Story 5.6: Reusable Recruiter Selector Component
**As a** User (Recruiter/Admin/Hiring Manager)
**I want** a reusable recruiter selector component with search and multi-select capabilities
**So that** I can easily assign recruiters to jobs, candidates, or other entities with a consistent UX.

*   **Tasks**:
    *   [ ] Create backend API endpoint `/api/users/search` with role and department filtering.
    *   [ ] Build `RecruiterSelector` component with both modal and dropdown variants.
    *   [ ] Implement search functionality with debouncing and real-time results.
    *   [ ] Add chip-based display for selected recruiters with remove functionality.
    *   [ ] Support both single-select and multi-select modes.
    *   [ ] Integrate keyboard navigation and accessibility features.
    *   [ ] Write comprehensive tests (unit, integration, E2E).
    *   [ ] Document component API and usage examples.
