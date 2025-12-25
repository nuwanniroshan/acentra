# Epic: Leave Management System

**Priority**: Medium
**Status**: Planned

## Description
Implement a complete Leave Management module to handle requests, approvals, and balance tracking.

## User Stories

### Story 3.1: Leave Configuration
**As an** Admin
**I want** to define leave policies
**So that** employees receive the correct entitlements.

*   **Tasks**:
    *   [ ] Create `LeaveType` entity (Annual, Sick, Casual).
    *   [ ] Create `LeavePolicy` entity (Days per year, Accrual frequency).
    *   [ ] Assign policies to Employment Types.

### Story 3.2: Leave Requests
**As an** Employee
**I want** to request leave
**So that** I can take time off.

*   **Tasks**:
    *   [ ] Create `LeaveRequest` entity.
    *   [ ] Frontend "Request Leave" form with Date Picker.
    *   [ ] Validate request against available balance.

### Story 3.3: Leave Approvals
**As a** Manager
**I want** to approve or reject leave requests
**So that** I can manage team availability.

*   **Tasks**:
    *   [ ] Notification system for new requests.
    *   [ ] "Team Requests" dashboard for Managers.
    *   [ ] Approve/Reject actions with optional comments.

### Story 3.4: Balance & Accruals
**As a** System
**I want** to automatically calculate balances
**So that** manual intervention is minimized.

*   **Tasks**:
    *   [ ] Implement cron job for monthly/yearly accruals.
    *   [ ] "My Balance" view for Employees.
