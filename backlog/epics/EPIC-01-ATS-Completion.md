# Epic: ATS Completion & Public Features

**Priority**: High
**Status**: Planned

## Description
Unlock the full potential of the ATS by allowing public access to job listings and implementing a robust internal approval workflow for job creation.

## User Stories

### Story 1.1: Backend - Public Job APIs
**As a** Candidate / External System
**I want** to access job listings without logging in
**So that** I can view and apply for open positions.

*   **Tasks**:
    *   [ ] Implement `GET /public/jobs` (List all OPEN jobs, filter by Tenant).
    *   [ ] Implement `GET /public/jobs/:id` (Job Details, exclude sensitive info).
    *   [ ] Implement `POST /public/jobs/:id/apply` (Submit Application with resume).
    *   [ ] Configure middleware to bypass Auth for `/public/*`.

### Story 1.2: Frontend - Public Career Site
**As a** Candidate
**I want** a dedicated careers page
**So that** I can browse jobs in a branded environment.

*   **Tasks**:
    *   [ ] Create `PublicLayout` (Header/Footer only).
    *   [ ] Create `/careers` route (Global Board).
    *   [ ] Create `/careers/:tenantId` route (Tenant Board).
    *   [ ] Implement Job List UI (Cards with title, location, type).

### Story 1.3: Frontend - Job Application Flow
**As a** Candidate
**I want** to apply for a job easily
**So that** I can be considered for the role.

*   **Tasks**:
    *   [ ] Create Job Details Public View.
    *   [ ] Build Application Form (Name, Email, Resume Upload).
    *   [ ] Implement "Success" confirmation page.
    *   [ ] Handle file upload to public bucket/storage.

### Story 1.4: Job Approval Workflow (Internal)
**As a** Hiring Manager
**I want** to submit my job for approval
**So that** it can be reviewed before going public.

*   **Tasks**:
    *   [ ] Update `Job` entity with `PENDING_APPROVAL`, `CHANGES_REQUIRED` statuses.
    *   [ ] Add "Submit for Approval" button for Draft jobs.
    *   [ ] Add "Approve/Reject" buttons for Admin/HR.
    *   [ ] Filter "My Jobs" to show pending items.
