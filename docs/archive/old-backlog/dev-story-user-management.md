# Developer Implementation Story: Move and Enhance User Management

## 🛠 Technical Overview
This story involved refactoring the User management system from a simple auth-based model to a comprehensive HRIS Staff module. The implementation spans across the shared monorepo types, two backends, and the React frontend.

## 💾 Core Changes

### 1. Database Schema (TypeORM Models)
We updated the `User` entity in both `auth-backend` and `acentra-backend`.
- **New Columns**:
  - `employee_number` (string): Added a unique partial index: `@Index(["employee_number", "tenantId"], { unique: true, where: '"employee_number" IS NOT NULL' })`.
  - `job_title` (string): Standardized field for professional designations.
  - `manager_id` (uuid): Self-referential FK.
  - `custom_fields` (jsonb): Optimized for tenant-specific dynamic data.
- **Relations**: 
  - `manager` (ManyToOne) → `direct_reports` (OneToMany).

### 2. API & Logic Revisions
- **User Registration**: `AuthController.register` now accepts the extended profile fields and performs a pre-save check for `employee_number` collisions within the tenant.
- **Profile Updates**: `UserController.updateProfile` in the main backend handles the new HRIS fields with similar uniqueness guards.
- **Data Transfer**: `UserDTO` was extended to ensure these fields are serialized properly for the frontend while keeping sensitive fields (like hashes) private.

### 3. Frontend Architecture
- **Routing**:
  - Old path: `/:tenant/admin/users`
  - New path: `/:tenant/people/staff`
  - **Fallback**: Implemented a `Navigate` redirect in `App.tsx` to handle legacy links.
- **Component Refactoring**: 
  - `AdminUsers.tsx` was converted into a more robust `Staff` management page.
  - The "Add Staff" dialog was redesigned using a Grid layout to accommodate 8+ input fields.
  - Implemented a "Reporting Manager" selector that dynamically populates from the existing user list.

## ⚠️ Known Implementation Details
- **Partial Indexes**: The `employee_number` unique index is partial (`WHERE NOT NULL`) to allow users to exist without an ID during initial setup or invitation phases.
- **Tenant Isolation**: All uniqueness checks are strictly scoped to the `tenantId`. A user can have the same "Emp-001" ID in Tenant A as another user in Tenant B.

## 🧪 Verification Steps
1. **Uniqueness Test**: Try creating a user with an existing `employee_number` in the same tenant (Expect 409 Conflict).
2. **Manager Loop**: Ensure the manager dropdown allows selecting existing staff (excluding the user themselves in future edit modes).
3. **Route Check**: Navigate to `/admin/users` and verify you arrive at `/people/staff`.
