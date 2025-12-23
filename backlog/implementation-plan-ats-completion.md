# Implementation Plan: ATS Completion & Public Features

This plan covers the remaining work to "Finish ATS", focusing on Public Job Publishing and the Approval Workflow.

## Phase 1: Public Job Publishing (Priority)

### 1.1 Backend: Public API Endpoints
We need endpoints that do NOT require authentication (or use a public client token) to fetch job data.

- [x] **Modifiy `JobController`**:
    - `GET /public/jobs`: List all `OPEN` jobs (Global Board). Supports filtering by `tenantId` (for Tenant Board).
    - `GET /public/jobs/:id`: Get details of a specific job (excluding sensitive Info like budget).
    - `POST /public/jobs/:id/apply`: Public endpoint for candidates to apply.
        - Accepts: Name, Email, Phone, Resume (File), Cover Letter.
        - Action: Creates a `Candidate` entity linked to the Job.
        - Validation: Basic captcha or rate limiting to prevent spam.

### 1.2 Frontend: Public Layout & Routing
Create a separate layout for public pages (no sidebar, no top bar with user profile).

- [x] **New Route Group**: `/careers/*` (Implemented as `/public/careers/...`)
- [x] **Public Layout Component**: Simple header (Acentra Logo) + Footer.
- [x] **Pages**:
    - `/careers`: Global Job Board (List of all jobs).
    - `/careers/:tenantId`: Tenant-specific Job Board.
    - `/careers/:tenantId/jobs/:jobId`: Job Details & Application Form.

### 1.3 Frontend: Application Form
- [x] **Apply Component**:
    - Form with basic fields.
    - File upload for Resume (reuse `FileStorage` service but ensure public upload permissions).
    - "Success" state showing "Application Received".

## Phase 2: Job Approval Workflow

### 2.1 Backend: Workflow Logic
- [x] **Update `Job` Entity**: Ensure `status` enum includes `PENDING_APPROVAL`, `APPROVED`, `REJECTED`, `CHANGES_REQUIRED`.
- [x] **Update `JobController`**:
    - `POST /jobs/:id/status`: Endpoint to transition status.
    - Logic:
        - Hiring Manager can only move `DRAFT` -> `PENDING_APPROVAL`.
        - Admin/HR can move `PENDING_APPROVAL` -> `APPROVED` or `REJECTED`.
        - `APPROVED` jobs automatically become visible on Public API.

### 2.2 Frontend: Approval UI
- [x] **Job Details Header**:
    - Dictionary-based status badges (Yellow for Pending, Green for Open).
    - Action Buttons based on Role:
        - HM: "Submit for Approval".
        - Admin/HR: "Approve", "Reject".
- [x] **My Jobs View**: Filter/Tab to show "Pending Approval" jobs for Admins.

## Phase 3: Infrastructure / Security
- [x] **Public Access Control**: Ensure `local-file-storage` or S3 buckets allow public reading of JD assets but restricted writing of Resumes.
- [x] **Rate Limiting**: Apply strictly to `/public/jobs/:id/apply`.

## Execution Order
1.  **Backend Public Endpoints** (Data availability).
2.  **Frontend Public Application** (Candidate experience).
3.  **Frontend Approval UI** (Internal workflow).
