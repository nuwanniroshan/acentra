# Developer Implementation Story: Recruiter Dashboard & Communication (Story 5.5)

## 🛠 Technical Overview
This story aims to provide recruiters with a prioritized view of their tasks and streamline communication with candidates through templates.

## 💾 Proposed Changes

### 1. Recruiter Dashboard (Frontend)
*   **New Page**: `RecruiterDashboard.tsx`
*   **Widget: My Active Jobs**: Display jobs where the recruiter is an assignee.
*   **Widget: Candidates to Review**: Display candidates in initial stages (New, Shortlisted) for the recruiter's active jobs.
*   **Routing**: Update `DashboardRouter.tsx` to direct `RECRUITER` and `HR` roles to the `RecruiterDashboard`.

### 2. Email Templates (Backend)
*   **Entity**: `EmailTemplate`
    *   `id`: UUID
    *   `name`: string (e.g., "Interview Invite")
    *   `subject`: string
    *   `body`: text (supports placeholders like {{candidate_name}}, {{job_title}})
    *   `tenantId`: string
*   **API**: 
    *   `GET /api/email-templates`
    *   `POST /api/email-templates`
    *   `PATCH /api/email-templates/:id`

### 3. Email Templates (Frontend)
*   **Settings Page**: Add a "Email Templates" tab to Settings.
*   **UI**: Simple list of templates with an editor.

### 4. Communication Integration
*   **Candidate Details**: Add a "Send Email" action that opens a modal to select a template and send.

## ⚠️ Known Implementation Details
*   **Placeholders**: Basic string replacement for {{candidate_name}}, etc.
*   **Email Sending**: Re-use existing `EmailService`.

## 🧪 Verification Steps
1.  **Dashboard Test**: Log in as a Recruiter. Verify that "My Active Jobs" shows only assigned jobs.
2.  **Template Test**: Create an email template and use it to send an email to a candidate.
3.  **Review Test**: Verify the "Candidates to Review" widget correctly counts candidates needing attention.
