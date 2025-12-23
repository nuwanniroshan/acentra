# Product Requirements Document (PRD) - Acentra 2.0

## 1. Executive Summary
Acentra 2.0 aims to evolve the platform from a pure Applicant Tracking System (ATS) into a comprehensive Human Resource Information System (HRIS). This update introduces core HR management modules (Leave, Time, Payroll), enhances the ATS with public-facing features, implements a SaaS subscription model, and opens the platform via a Public API.

## 2. HRIS Module
The HRIS module serves as the central repository for employee data and lifecycle management.

### 2.1 People Management (Core)
*   **Goal**: extensive profile management for employees beyond basic contact info.
*   **Features**:
    *   **Employment History**: Track promotions, role changes, and salary history.
    *   **Document Management**: Store contracts, IDs, and certifications securely linked to the user profile.
    *   **Asset Management**: Track company assets assigned to employees (laptops, phones).
    *   **Emergency Contacts**: Manage multiple emergency contact details.
    *   **Onboarding/Offboarding**: Checklists and workflows for new hires and leavers.

### 2.2 Leave Management
*   **Goal**: Streamlined leave request and approval process with automated balance tracking.
*   **Features**:
    *   **Leave Policies**: Define rules based on employment type (e.g., Full-time gets 14 days AL, Interns get 5).
    *   **Accrual & Balances**: Automated calculation of available leave balances per year/period.
    *   **Request Workflow**: Employees request leave -> Manager gets notification -> Approve/Reject.
    *   **Calendar View**: Team view to see who is away.
    *   **Leave Types**: Support for Annual, Sick, Casual, Unpaid, and Maternity/Paternity leave.

### 2.3 Time Tracking
*   **Goal**: Weekly timesheet submission for project-based accounting.
*   **Features**:
    *   **Project Codes**: Admin-defined project codes/tasks.
    *   **Weekly Timesheets**: Grid view for employees to log hours against multiple projects for the week.
    *   **Approvals**: Managers review and approve timesheets at the end of the week.
    *   **Reporting**: Summary of hours per project/employee.

### 2.4 Performance Appraisal (High Level)
*   **Goal**: Structured feedback loops for employee growth.
*   **Features**:
    *   **Review Cycles**: Configurable periods (Quarterly, Annual).
    *   **Self-Assessment**: Employees submit their own review.
    *   **Manager Review**: Managers score and comment on performance.
    *   **KPI Tracking**: Simple goal setting and progress tracking.

### 2.5 Payroll (High Level)
*   **Goal**: Record-keeping and basic salary proccessing preparation.
*   **Features**:
    *   **Salary Structure**: Define basic pay, allowances, and deductions per employee.
    *   **Payroll Run**: Generate a monthly "Payroll Sheet" based on active employees and leave data (unpaid leave deduction).
    *   **Payslips**: Generate simple PDF payslips for employees (Non-statutory compliant initially).

## 3. ATS Enhancements
Expanding the reach of job postings and streamlining the application flow.

### 3.1 Public Job Publishing
*   **Global Board**: A centralized landing page featuring jobs from *all* active tenants (e.g., `jobs.acentra.com`).
*   **Tenant Career Page**: Dedicated, branded page for each tenant (e.g., `jobs.acentra.com/tech-corp` or `tech-corp.careers.acentra.com`).
*   **No-Login Application**:
    *   Candidates can view JD and apply directly without creating an account.
    *   Simple form: Resume upload, Name, Email, Phone, Cover Letter.
    *   "Magic Link" approach allows candidates to track status later if needed.

### 3.2 Job Approval Workflow
*   **Enhanced Flows**:
    *   **Multi-stage Approval**: Creation -> Finance Approval (Budget) -> HR Head Approval -> Published.
    *   **Notifications**: Email/In-app alerts to approvers.
    *   **Audit Log**: Track who approved/rejected and when.

## 4. SaaS & Subscription Management
*   **Goal**: Monetize the platform via tiered plans.
*   **Plans**:
    *   **Free/Starter**: Limited users, limited active jobs, basic ATS only.
    *   **Growth**: Unlimited jobs, HRIS Lite (Leave/Time), Email support.
    *   **Enterprise**: Full HRIS (Payroll/Performance), API Access, Custom SLAs.
*   **Features**:
    *   **Plan Limits**: Enforce limits on User count, Active Job count, or Storage.
    *   **Billing Cycle**: Monthly/Yearly subscriptions.
    *   **Invoicing**: Auto-generate invoices for tenants.

## 5. Public API & Integration
*   **Authentication**:
    *   **API Keys**: Tenant admins generate scoped API keys (Read-only, Read-Write).
    *   **Rate Limiting**: Throttling requests to prevent abuse (e.g., 1000 req/min).
*   **Endpoints**:
    *   **People API**:
        *   `GET /employees`: List all staff.
        *   `POST /employees`: Create new hire.
        *   `GET /employees/{id}`: Detailed profile.
    *   **Time API**:
        *   `GET /timesheets`: Retrieve approved hours for payroll integration.
        *   `POST /projects`: Sync project codes from external ERP.

## 6. Infrastructure & Non-Functional
*   **Scalability**: Maintain current Fargate/RDS architecture.
    *   **Read Replicas**: Prepare for creating RDS read replicas for reporting/analytics load if needed.
*   **Security**: Ensure public pages (Job Boards) are securely separated from internal tenant data.
*   **Growth Support**:
    *   Optimize database indexing for core HRIS tables (Timesheets/Leave can grow fast).
    *   Implement archiving strategy for old applications/timesheets.
