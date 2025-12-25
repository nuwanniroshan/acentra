# [STORY-101] Move and Enhance User Management

## Metadata
- **Priority**: High 🔴
- **Story Points**: 8
- **Sprint**: Sprint 1
- **Status**: ✅ COMPLETED

## 📖 User Story
**As a** system administrator / developer
**I want to** move the User management section from Settings to People > Staff and extend the user profile details
**So that** the system can properly manage comprehensive employee information as a core HRIS module.

---

## ✅ Definition of Ready (DoR)
- [x] Clear business value defined.
- [x] Acceptance criteria mapped out.
- [x] Dependencies identified (Auth Backend vs. Acentra Backend).
- [x] Technical feasibility confirmed (TypeORM supports self-referencing and jsonb).

---

## 🛠 Scope & Requirements

### 1. Navigation & UI Refactoring
- **Relocation**: Move module from `Settings` to `People > Staff`.
- **Sidebar**: Implement a "People" category with a "Staff" sub-item.
- **Routing**: Update paths to `/:tenant/people/staff`.

### 2. Access Control
- **Permissions**: CRUD limited to `Admin` and `HR` roles.
- **Middleware**: Backend validation must enforce these roles for the new endpoints.

### 3. Extended Profile Schema
Extend `User` entity with:
- `job_title`: String
- `employee_number`: String (Unique per tenant)
- `manager_id`: UUID (Self-reference)
- `address`: Text
- `custom_fields`: JSONB

### 4. Custom Fields (Tenant-Specific)
- Support dynamic key-value pairs per tenant.
- UI must allow rendering these without hardcoding field names.

---

## 🏗 Technical Notes
- **Database**: Use `@Index(["employee_number", "tenantId"], { unique: true })`.
- **Relations**: Implement `ManyToOne` (manager) and `OneToMany` (reports) in the User entity.
- **DTOs**: Update `UserDTO` to include new fields to avoid data leakage in other responses.

---

## 🎯 Acceptance Criteria (AC)
- [x] **AC1**: Navigation path updated and sidebar reflects the new hierarchy.
- [x] **AC2**: Only Admin/HR roles can access the 'Add Staff' button and API.
- [x] **AC3**: New fields (Job Title, Emp#, etc.) are editable in the UI.
- [x] **AC4**: System rejects duplicate `employee_number` within the same tenant.
- [x] **AC5**: Self-referencing manager logic works without circular reference issues in JSON serialization.
- [x] **AC6**: Inactive users are unable to authenticate but their history remains.

---

## 🏁 Definition of Done (DoD)
- [x] Code follows project linting rules.
- [x] Unit tests for uniqueness validation completed (Verified via E2E Suite).
- [x] Manual verification in Dev environment.
- [x] Pull Request reviewed and merged (Direct implementation).
- [x] Documentation updated in knowledge-base (Implemented via Backlog & Dev Story).
