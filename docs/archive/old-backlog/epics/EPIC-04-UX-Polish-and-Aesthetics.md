# Epic: UI/UX Polish and Visual Aesthetics

**Priority**: Medium
**Status**: Prioritized
**Reference**: `ux-feedback.md`

## Description
Elevate the Acentra ATS user experience by refining the visual design system, improving accessibility, and implementing delight-focused micro-interactions and onboarding flows.

## User Stories

### Story 4.1: Visual Depth and Elevation
**As a** User
**I want** a clearer visual hierarchy for floating elements
**So that** I can intuitively identify drawers, popovers, and active surfaces.

*   **Tasks**:
    *   [x] Update `auroraBlueTheme.ts` to include subtle elevation (shadows) for `MuiDrawer`, `MuiPopover`, and `MuiCard`.
    *   [x] Refine the `1px solid` border usage to complement elevation rather than replace it.
    *   [x] Standardize the "glassmorphism" effect for overlay elements.

### Story 4.2: Visual Empty States
**As a** User
**I want** helpful guidance when there is no data
**So that** I know exactly how to get started in a module.

*   **Tasks**:
    *   [x] Create a reusable `EmptyState` component with support for illustrations/icons.
    *   [x] Implement specific empty states for: Jobs Board, Candidates List, and Notifications.
    *   [x] Add prominent "Call to Action" (CTA) buttons in each empty state.

### Story 4.3: Button Hierarchy Standardization
**As a** User
**I want** a consistent pattern for primary and secondary actions
**So that** I can navigate the application more predictably.

*   **Tasks**:
    *   [x] Audit all screens for multiple primary buttons and resolve conflicts.
    *   [x] Define and implement `Primary`, `Secondary`, and `Ghost` variants in the design system.
    *   [x] Ensure "Danger" actions (e.g., Delete Candidate) have a distinct red-trio styling.

### Story 4.4: Interactive Onboarding & Sign-in
**As a** New User
**I want** a guided introduction to the platform
**So that** I can create my first job without confusion.

*   **Tasks**:
    *   [ ] Implement a "Guided Tour" (e.g., using `react-joyride`) for the dashboard and job creation stepper.
    *   [x] Add a "Find My Workspace" link to the Sign-in page.
    *   [ ] Allow login via Email to automatically suggest associated tenant slugs.

### Story 4.5: Micro-interactions and Polish
**As a** Recruiter
**I want** the interface to feel snappy and responsive
**So that** the application feels modern and premium.

*   **Tasks**:
    *   [x] Implement Skeleton Loading screens for the Candidates and Jobs tables.
    *   [x] Add hover animations (scale/y-offset) to Kanban cards in `JobDetails`.
    *   [x] Make the Active Navigation item more prominent with background highlights or accent bars.
