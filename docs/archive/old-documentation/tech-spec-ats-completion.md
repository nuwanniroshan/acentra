# Technical Specification: Public Job Publishing & ATS Workflow

## 1. Introduction
This detailed technical specification outlines the architecture and implementation details for enabling public job publishing and a structured job listing approval workflow in the Acentra-Backend and Acentra-Frontend applications.

## 2. Public Job Publishing (API)

### 2.1 API Design (`apps/acentra-backend`)
New public-facing endpoints will be exposed, likely under a `/public` prefix to bypass standard JWT authentication middleware.

#### 2.1.1 `GET /api/public/jobs`
*   **Purpose**: Fetch a list of published jobs.
*   **Query Params**:
    *   `tenantId` (optional): Filter jobs by a specific tenant.
    *   `page` / `limit`: Pagination.
*   **Logic**:
    *   Filter `status = 'open'` (mapped from `APPROVED` in workflow context).
    *   Select only public fields: `id`, `title`, `department`, `location`, `type`, `description` (short), `posted_at`.
*   **Security**: Rate-limited (e.g., 60 req/min).

#### 2.1.2 `GET /api/public/jobs/:id`
*   **Purpose**: Fetch full details for a single job including the Job Description (JD).
*   **Logic**:
    *   Find job by ID + `status = 'open'`.
    *   Return full fields + `jd` content (HTML) or signed URL to `jdFilePath`.
    *   **Exclusion**: NEVER return `budget`, `created_by`, `internal_notes`.

#### 2.1.3 `POST /api/public/jobs/:id/apply`
*   **Purpose**: Submit a candidate application.
*   **Body (Multipart/Form-Data)**:
    *   `firstName`, `lastName`, `email`, `phone`.
    *   `resume` (File).
    *   `coverLetter` (Text).
*   **Logic**:
    1.  Validate inputs.
    2.  Upload `resume` to S3/Local storage using `FileStorageService` (Public Write bucket/folder).
    3.  Create `Candidate` entity with `source = 'website'`.
    4.  Link Candidate to Job.
    5.  Trigger "New Applicant" notification to Hiring Manager.

### 2.2 Security Considerations
*   **Middleware Bypass**: modify `auth-backend` or `acentra-backend` gateway to allowing `/api/public/*` without a Bearer token.
*   **CORS**: Ensure strict CORS policy allows GET from any origin (if aiming for global board) or restricted to tenant domains.

## 3. Frontend Architecture (`apps/acentra-frontend`)

### 3.1 Public Layout
A new Layout component `PublicLayout.tsx` will be essential to strip away the authenticated application shell (Sidebar, etc.).

*   **Structure**:
    ```tsx
    <PublicContainer>
      <Header /> {/* Simple Logo + Login Link */}
      <Outlet /> {/* Renders Child Routes */}
      <Footer />
    </PublicContainer>
    ```

### 3.2 Routing
Update `App.tsx` router configuration:
```tsx
<Route path="/careers" element={<PublicLayout />}>
  <Route index element={<GlobalJobBoard />} />
  <Route path=":tenantId" element={<TenantJobBoard />} />
  <Route path=":tenantId/jobs/:jobId" element={<PublicJobDetails />} />
</Route>
```

### 3.3 Components
*   `JobCard.tsx`: Reusable card for job lists.
*   `ApplicationForm.tsx`: Standalone form component handling file upload and submission state.

## 4. Job Approval Workflow

### 4.1 Data Model Changes (`Job.ts`)
Update `JobStatus` enum:
```typescript
export enum JobStatus {
  DRAFT = "draft",
  PENDING_APPROVAL = "pending_approval",
  APPROVED = "open", // "open" is functionally "approved"
  REJECTED = "rejected",
  CHANGES_REQUIRED = "changes_required",
  CLOSED = "closed"
}
```

### 4.2 Backend Logic
*   **Service Layer**: Add `JobWorkflowService` (or methods in `JobService`).
    *   `submitForApproval(jobId)`: Validates mandatory fields. Sets `PENDING_APPROVAL`.
    *   `approveJob(jobId, approverId)`: Sets `APPROVED`.
    *   `rejectJob(jobId, reason)`: Sets `CHANGES_REQUIRED` or `REJECTED`.

### 4.3 Frontend UI
*   **Job Details**:
    *   **Status Banner**: Visual indicator of current state.
    *   **Action Bar**: Buttons conditioned by `user.role` + `job.status`.
        *   *Hiring Manager* sees "Submit" when `DRAFT`.
        *   *Admin/HR* sees "Approve/Reject" when `PENDING_APPROVAL`.

## 5. Deployment & Config
*   **Environment Variables**:
    *   `PUBLIC_CAREER_URL`: Base URL for sharing links (e.g., `https://acentra.pixel8.lk/careers`).
