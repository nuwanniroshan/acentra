# Implementation Plan: Move and Enhance User Management

This document outlines the steps required to relocate user management to `People > Staff` and extend user profiles with HRIS-specific fields.

## Phase 1: Shared Models & Database Schema

### 1.1 Update Shared Types [DONE]
- File: `libs/shared-types/src/index.ts`
- Action: Update `IUser` interface and `RegisterRequest` to include:
  - `job_title?: string`
  - `employee_number?: string`
  - `manager_id?: string`
  - `address?: string`
  - `custom_fields?: Record<string, any>`

### 1.2 Update Backend Entities [DONE]
- Files: 
  - `apps/auth-backend/src/entity/User.ts`
  - `apps/acentra-backend/src/entity/User.ts`
- Action: Add the following columns:
  - `job_title` (varchar, nullable)
  - `employee_number` (varchar, nullable, unique per tenant)
  - `manager_id` (uuid, nullable) - self-referential
  - `address` (text, nullable)
  - `custom_fields` (jsonb, default {})
- Add Relation: `manager` (ManyToOne to User) and `direct_reports` (OneToMany from User).

## Phase 2: Backend Logic Updates

### 2.1 Auth Backend (User Creation) [DONE]
- File: `apps/auth-backend/src/controller/AuthController.ts`
- Action: Update `register` method to accept and save new fields.
- Validation: Ensure `employee_number` is unique within `tenantId`.

### 2.2 Acentra Backend (User Management) [DONE]
- File: `apps/acentra-backend/src/controller/UserController.ts`
- Action: 
  - Update `updateProfile` to include new fields.
  - Implement validation for `manager_id` (must exist in same tenant).
  - Update `list` to return new fields and support filtering.

## Phase 3: Frontend Navigation & Routing

### 3.1 Update Sidebar [DONE]
- File: `apps/acentra-frontend/src/components/Sidebar.tsx` (or similar)
- Action: 
  - Move "Users" from Settings/Admin to "People > Staff".
  - Change icon to reflect people/staff.

### 3.2 Update Routing [DONE]
- File: `apps/acentra-frontend/src/App.tsx`
- Action: 
  - Change route from `/:tenant/admin/users` to `/:tenant/people/staff`.
  - Ensure old route redirects or is removed.

## Phase 4: Frontend UI Components

### 4.1 Enhance User List [DONE]
- File: `apps/acentra-frontend/src/pages/AdminUsers.tsx` (Rename to `Staff.tsx`)
- Action: Add columns for Job Title and Employee Number.

### 4.2 Enhance User Forms (Add/Edit) [DONE]
- File: `apps/acentra-frontend/src/components/UserForm.tsx` (or similar)
- Action:
  - Add inputs for Job Title, Employee Number, Manager (Select/Autocomplete), and Address.
  - Add section for Dynamic Custom Fields.

### 4.3 Custom Fields Management
- Action: (Optional/Phase 2) UI in Tenant Settings to define which custom fields are available.

## Phase 5: Testing & Verification
- [x] Verify `employee_number` uniqueness validation.
- [x] Verify `manager` reference integrity.
- [x] Verify new navigation flow.
- [x] Verify Admin/HR only access to user creation/deactivation.
