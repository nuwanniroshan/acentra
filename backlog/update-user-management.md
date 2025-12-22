# [STORY-105] Update User Management

## Metadata
- **Priority**: Medium 🟡
- **Story Points**: 3
- **Sprint**: Sprint 1
- **Status**: ✅ COMPLETED

## 📖 User Story
**As a** system administrator
**I want to** refine the User Management interface under People > Staff and remove redundant tabs from Settings
**So that** the user experience is cleaner and more aligned with the HRIS module structure.

---

## ✅ Definition of Ready (DoR)
- [x] Clear business value defined.
- [x] Acceptance criteria mapped out.
- [x] User management relocation already completed in previous story.

---

## 🛠 Scope & Requirements

### 1. Settings Cleanup
- **Redundancy**: Remove the "User Management" tab from the Settings page as it has been moved to People > Staff.

### 2. People > Staff Grid Enhancements
- **Role Display**: Change the Role column from a dropdown selection to a simple text display in the grid.
- **Actions**: Add "Edit" and "Delete" action buttons/icons to each row. (Note: Logic implementation is out of scope for this story).
- **Avatar**: Add a profile avatar as the first column in the grid.
- **Search**: Implement a search bar/option above the staff grid for easy filtering.
- **Navigation**: Remove the "Back" button from the Staff management view.

---

## 🎯 Acceptance Criteria (AC)
- [ ] **AC1**: User Management tab is no longer visible under Settings.
- [ ] **AC2**: Staff grid shows Role as text, not a dropdown.
- [ ] **AC3**: Edit and Delete icons are present in the Staff grid.
- [ ] **AC4**: Profile avatar is the first column in the Staff grid.
- [ ] **AC5**: A search input is available before the Staff grid.
- [ ] **AC6**: The Back button is removed from the People > Staff page.

---

## 🏁 Definition of Done (DoD)
- [ ] UI changes reflect the requirements accurately.
- [ ] Code follows project linting rules.
- [ ] Manual verification in Dev environment.
