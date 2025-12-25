# Sprint Plan: Sprint 2 - Polished Experience & Core Efficiency

**Goal**: Transform the UI from "functional" to "delightful" and streamline high-volume candidate processing.
**Timeline**: 2 Weeks (Proposed)

## 📌 Sprint Goal
Deliver a visually premium experience with standardized design patterns (shadows, elevation, empty states) while empowering recruiters with bulk actions and AI-powered job creation flexibility.

## 📋 Scope & Backlog

### 1. UI/UX: Visual Aesthetics & Polish (EPIC-04)
*   [x] **Story 4.1: Visual Depth & Elevation**
    *   [x] Add elevation/shadows to Drawers, Popovers, and Cards in `auroraBlueTheme.ts`.
    *   [x] Standardize overlay glassmorphism.
*   [x] **Story 4.2: Visual Empty States**
    *   [x] Create reusable `EmptyState` component.
    *   [x] Implementation in Jobs Board, Candidates List, and Notifications.
*   [x] **Story 4.3: Button Hierarchy Standardization**
    *   [x] Audit and fix screens with multiple primary buttons.
    *   [x] Implement standardized Primary, Secondary, Ghost, and Danger variants.
*   [x] **Story 4.5: Micro-interactions & Snap**
    *   [x] Skeleton loaders for Candidates and Jobs lists.
    *   [x] Hover animations for Kanban cards.
    *   [x] Active navigation state highlighting.

### 2. Efficiency: Recruitment Workflow Speed (EPIC-05)
*   [x] **Story 5.1: High-Volume Candidate Management**
    *   [x] Bulk selection UI for candidates.
    *   [x] Bulk action bar (Reject, Move Stage).
    *   [x] Advanced filtering/Search bar in Candidate list.
*   [ ] **Story 5.2: AI-Powered Job Creation Refinements**
    *   [x] Visual Drag-and-Drop zone for files.
    *   [x] Live Preview panel for parsed data.
    *   "Save as Draft" and "Skip Template" options.
*   [x] **Story 5.3: Structured Candidate Evaluation**
    *   [x] Scorecards with 1-5 ratings.
    *   [ ] Status History timeline tooltip in Kanban.
    *   [x] Evaluation tab in Candidate Drawer.

## 🚀 Deliverables
1.  A visual overhaul that feels "Premium" and consistent.
2.  Zero-data states that guide the user rather than showing empty text.
3.  Ability for a recruiter to reject 10 candidates in 3 clicks.
4.  More forgiving AI Job creation flow with immediate feedback.

## ⚠️ Risks & Dependencies
*   **Design Consistency**: Ensuring the new elevation doesn't clash with the existing border-heavy design.
*   **Performance**: Bulk actions involving 50+ candidates need to be handled efficiently on the backend.
*   **Parsing Accuracy**: Live preview relies on fast response from the AI parsing service.
