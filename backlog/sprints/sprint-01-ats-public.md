# Sprint Plan: Sprint 1 - ATS Public Launch

**Goal**: Enable public access to job listings and applications, and establish the internal approval workflow.
**Timeline**: 2 Weeks (Proposed)

## 📌 Sprint Goal
Deliver a fully functional **Public Career Site** where candidates can view and apply for jobs, supported by an internal **Job Approval Workflow** to ensure quality control.

## 📋 Scope & Backlog

### 1. Backend: Core ATS API Updates (Estimated: 2 Days)
*   [ ] **Feature**: Public Job Endpoints
    *   `GET /api/public/jobs` (List)
    *   `GET /api/public/jobs/:id` (Details)
    *   `POST /api/public/jobs/:id/apply` (Application Submission)
*   [ ] **Feature**: Job Approval Logic
    *   Update `JobStatus` Enum (`DRAFT`, `PENDING`, `APPROVED`, `REJECTED`).
    *   Implement Workflow Controller `POST /api/jobs/:id/status`.

### 2. Frontend: Public Candidate Experience (Estimated: 3 Days)
*   [ ] **UI**: Public Layout (`/careers` route group).
*   [ ] **Page**: Global Job Board (List of all jobs).
*   [ ] **Page**: Job Details & Application Form.
    *   Resume Upload integration.
    *   Success/Thank You Page.

### 3. Frontend: Internal Workflow UI (Estimated: 2 Days)
*   [ ] **UI**: Update Job Details for Recruiters/Admins.
    *   Add Status Badges.
    *   Add Approval Action Buttons (Approve/Reject).
*   [ ] **UI**: My Jobs Dashboard filter for "Pending Approval".

### 4. Infrastructure & Testing (Estimated: 1 Day)
*   [ ] **Security**: Verify S3 permissions for public resume upload.
*   [ ] **QA**: Test "Guest" application flow (No Login required).
*   [ ] **QA**: Test Approval permissions (Hiring Manager vs Admin).

## 🚀 Deliverables
1.  Working `/careers` URL accessible without login.
2.  Candidates can apply and appear in the ATS pipeline.
3.  Jobs in `DRAFT` do not appear on `/careers`.

## ⚠️ Risks & Dependencies
*   **Resume Storage**: Need to ensure file uploads are secure but accessible to internal staff.
*   **Spam**: Public forms may attract spam. (Mitigation: Basic Rate Limiting for now).
