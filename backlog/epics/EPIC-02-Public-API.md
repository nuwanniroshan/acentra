# Epic: Public API (People & Time)

**Priority**: Medium
**Status**: Planned

## Description
Expose core HR data via a secure Public API to allow integrations with external systems (e.g., ERP, Biometric devices).

## User Stories

### Story 2.1: API Authentication & Management
**As a** Developer
**I want** to authenticate using API Keys
**So that** I can securely access the system programmatically.

*   **Tasks**:
    *   [ ] Implement API Key validation middleware.
    *   [ ] Implement Rate Limiting (Throttle requests per minute).
    *   [ ] Add Scopes to API Keys (e.g., `read:people`, `write:time`).

### Story 2.2: People API
**As a** HR System Integrator
**I want** to sync employee data
**So that** our external systems are up to date.

*   **Tasks**:
    *   [ ] `GET /api/public/pepole`: List active employees (Pagination, Filtering).
    *   [ ] `GET /api/public/people/:id`: Get detailed employee profile.
    *   [ ] `POST /api/public/people`: Create new employee (Onboarding integration).

### Story 2.3: Time Tracking API
**As a** Project Manager / Finance System
**I want** to retrieve time logs
**So that** we can calculate project costs.

*   **Tasks**:
    *   [ ] `GET /api/public/time/entries`: Retrieve approved time entries for a date range.
    *   [ ] `POST /api/public/projects`: Sync external projects into Acentra.
