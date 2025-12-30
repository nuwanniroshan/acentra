# Implementation Plan: Update User Management

This document outlines the steps taken to refine the User Management interface and clean up legacy navigation.

## Phase 1: Navigation Cleanup [DONE]
- **Settings Page**: Remove the "User Management" tab and its corresponding `TabPanel`.
- **Re-indexing**: Update the `value` indices for the remaining tabs in `Settings.tsx` to maintain correct routing logic.

## Phase 2: Staff Grid Enhancements [DONE]
- **Avatar Integration**: Add `AuroraAvatar` column as the first column in the staff grid.
- **Search Functionality**: 
  - Implementation of a search bar above the grid.
  - Integration of client-side filtering for name, email, and job title.
- **Role Display**:
  - Replace `AuroraSelect` with a simple `AuroraTypography` for the Role column.
  - Standardize role name formatting (e.g., "HIRING_MANAGER" -> "hiring manager").
- **Action Icons**:
  - Add `AuroraEditIcon` (Implementation out of scope).
  - Standardize icon button sizes to 32px for better density.
- **UI Cleanup**:
  - Remove the "Back" button from the top of the page as requested.
  - Adjust table headers and skeletons to accommodate the new Avatar column.

## Phase 3: Testing & Verification [DONE]
- [x] Verify that the User Management tab is no longer visible in Settings.
- [x] Verify that the Staff Grid shows avatars.
- [x] Verify that the Search bar correctly filters results.
- [x] Verify that Roles are non-editable (text-only) in the grid.
- [x] Verify that Edit and Delete icons are present.
