# Acentra Brownfield Enhancement Architecture: API Key Authentication

## 1. Introduction
This document outlines the architectural approach for integrating API Key Authentication into Acentra. It enables secure, machine-to-machine (M2M) communication for third-party integrations while preserving the existing multi-tenant isolation and security posture.

## 2. Existing Project Analysis
- **Primary Purpose:** Multi-tenant Applicant Tracking System (ATS).
- **Core Tech Stack:** Node.js (Express), TypeScript, TypeORM (PostgreSQL), MUI React, Nx Monorepo.
- **Architecture Style:** Service-oriented, with isolated Auth and Business backends.
- **Deployment:** AWS ECS Fargate + RDS.

## 3. Enhancement Scope & Integration
- **Type:** Additive Security Layer.
- **Integration Points:** New middleware in `acentra-backend`, new table in RDS, New Settings tab in `acentra-frontend`.
- **Boundaries:** All API key logic lives in `acentra-backend` to ensure low-latency validation during business API calls.

## 4. Data Models (RDS Schema)
### Table: `api_keys`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | UUID | Primary Key |
| `tenantId` | UUID | Foreign Key to Workspace |
| `hashedKey` | String | Bcrypt hash of the secret string (Indexed) |
| `maskedKey` | String | Last 4 chars for UI display (e.g. `ac_..._f9a2`) |
| `name` | String | User-defined label (e.g. "Zapier") |
| `lastUsedAt` | Timestamp | Updated on successful auth |
| `revokedAt` | Timestamp | Nullable; if set, key is invalid |
| `createdAt` | Timestamp | Auto-generated |

## 5. Component Architecture
### `ApiKeyAuthMiddleware` (Backend)
- Intercepts `X-API-KEY` header.
- Validates against `api_keys` table.
- Injects `tenantId` and `USER_ROLE.SYSTEM` into the request context.

### `ApiKeyService` (Backend)
- Handles `generate()`, `validate()`, and `revoke()` logic.
- Uses `crypto.randomBytes` for key generation and `bcrypt` for storage.

### `ApiKeyManager` (Frontend)
- Settings UI for CRUD operations.
- "View Once" Modal ensures secret is never shown again after initial generation.

## 6. API Design
- `POST /api/settings/api-keys`: Create (returns plain-text key once).
- `GET /api/settings/api-keys`: List metadata.
- `DELETE /api/settings/api-keys/:id`: Revoke.

## 7. Source Tree Organization
- **Backend:** `apps/acentra-backend/src/{middleware,controller,service,entity}/`
- **Frontend:** `apps/acentra-frontend/src/components/settings/ApiKeyManager.tsx`

## 8. Testing & Quality
- **Unit Tests:** 100% coverage on `ApiKeyService` and `ApiKeyAuthMiddleware`.
- **Integration Tests:** Verify `X-API-KEY` access to protected Job/Candidate endpoints.
- **Security:** Keys must never be logged or stored in plain text.

---

## Developer Handoff
> **Prompt for Implementation:**
> Implement Story 0.1 (API Key Management) based on `docs/architecture.md`. 
> 1. Start with the `ApiKey` entity and migration in `acentra-backend`.
> 2. Implement the `ApiKeyService` using `bcrypt` for hashing.
> 3. Add the `apiKeyAuthMiddleware` and register it in the global middleware stack.
> 4. Ensure the `tenantId` is correctly injected from the key's record into the request context.
> 5. Build the Frontend Settings tab using `libs/aurora-design-system` components.
