# Federated Authentication Module Documentation

## Overview

This document describes the architecture and implementation of the separate federated authentication module created for the Acentra project. The auth module is designed as a standalone, reusable microservice that can be integrated into any application using Module Federation.

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────┐
│                    Acentra Application                       │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Acentra Frontend (Host Application)            │ │
│  │  - Port: 5173                                          │ │
│  │  - Consumes federated auth components                  │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓ Module Federation               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │         Auth Frontend (Remote Application)             │ │
│  │  - Port: 5174                                          │ │
│  │  - Exposes: Login, ForgotPassword, ResetPassword,     │ │
│  │             AuthProvider                               │ │
│  └────────────────────────────────────────────────────────┘ │
│                           ↓ HTTP/REST API                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Auth Backend (API Service)                │ │
│  │  - Port: 3001                                          │ │
│  │  - Handles: Authentication, User Management            │ │
│  │  - Database: acentra (PostgreSQL)                      │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Shared Libraries                          │
│  ┌──────────────────┐  ┌──────────────────┐                │
│  │  @acentra/       │  │  @acentra/       │                │
│  │  shared-types    │  │  auth-utils      │                │
│  │  - UserRole      │  │  - JWT utils     │                │
│  │  - Interfaces    │  │  - Middleware    │                │
│  └──────────────────┘  └──────────────────┘                │
└─────────────────────────────────────────────────────────────┘
```

## Components

### 1. Auth Backend (`apps/auth-backend`)

**Purpose**: Centralized authentication and authorization service

**Technology Stack**:
- Node.js + Express
- TypeScript
- TypeORM
- PostgreSQL
- JWT (jsonwebtoken)
- bcryptjs for password hashing

**Key Files**:

#### [`apps/auth-backend/src/index.ts`](apps/auth-backend/src/index.ts:1)
Main entry point that:
- Initializes Express server on port 3001
- Configures CORS for cross-origin requests
- Sets up middleware (JSON parsing, URL encoding)
- Mounts API routes under `/api`
- Connects to PostgreSQL database

#### [`apps/auth-backend/src/controller/AuthController.ts`](apps/auth-backend/src/controller/AuthController.ts:1)
Handles all authentication operations:
- **`register()`** - Creates new user accounts with hashed passwords
- **`login()`** - Validates credentials and issues JWT tokens
- **`verify()`** - Validates JWT tokens
- **`me()`** - Returns current user information
- **`refresh()`** - Issues new JWT tokens
- **`logout()`** - Handles logout (client-side token removal)

#### [`apps/auth-backend/src/routes/index.ts`](apps/auth-backend/src/routes/index.ts:1)
Defines API endpoints:
```typescript
// Public routes
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

// Protected routes (require JWT)
POST /api/auth/verify
POST /api/auth/refresh
GET  /api/auth/me

// Admin routes (require admin role)
GET    /api/users
DELETE /api/users/:id
PATCH  /api/users/:id/role
PATCH  /api/users/:id/toggle-active
```

#### [`apps/auth-backend/src/entity/User.ts`](apps/auth-backend/src/entity/User.ts:1)
User entity with fields:
- `id`, `email`, `password_hash`
- `role` (super_admin, admin, hr, engineering_manager, recruiter)
- `name`, `profile_picture`, `department`, `office_location`
- `is_active`, `created_at`, `updated_at`

**Database Configuration**:
- Database: `acentra`
- Connection configured in [`apps/auth-backend/src/data-source.ts`](apps/auth-backend/src/data-source.ts:1)
- Separate database from main application for isolation

**Environment Variables** (`.env`):
```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=acentra
JWT_SECRET=your-secret-key
```

### 2. Auth Frontend (`apps/auth-frontend`)

**Purpose**: Reusable authentication UI components exposed via Module Federation

**Technology Stack**:
- React 19
- TypeScript
- Vite
- Module Federation (@originjs/vite-plugin-federation)
- Material-UI (via @acentra/aurora-design-system)

**Key Files**:

#### [`apps/auth-frontend/vite.config.ts`](apps/auth-frontend/vite.config.ts:1)
Module Federation configuration:
```typescript
federation({
  name: 'auth_frontend',
  filename: 'remoteEntry.js',
  exposes: {
    './Login': './src/pages/Login.tsx',
    './ForgotPassword': './src/pages/ForgotPassword.tsx',
    './ResetPassword': './src/pages/ResetPassword.tsx',
    './AuthProvider': './src/context/AuthContext.tsx',
  },
  shared: ['react', 'react-dom', 'react-router-dom', '@acentra/aurora-design-system'],
})
```

#### [`apps/auth-frontend/src/context/AuthContext.tsx`](apps/auth-frontend/src/context/AuthContext.tsx:1)
Authentication context provider:
- Manages authentication state (user, token)
- Provides `login()` and `logout()` functions
- Persists auth state to localStorage
- Supports callbacks: `onLoginSuccess`, `onLogout`

**Exposed Components**:

1. **Login Component** - Full-featured login page with:
   - Email/password form
   - Form validation
   - Error handling
   - "Forgot Password" link
   - Success callback support

2. **ForgotPassword Component** - Password reset request page

3. **ResetPassword Component** - Password reset confirmation page

4. **AuthProvider** - Context provider for authentication state

**API Communication**:
- Uses [`apps/auth-frontend/src/utils/api.ts`](apps/auth-frontend/src/utils/api.ts:1)
- Communicates with auth backend at `http://localhost:3001`

### 3. Shared Libraries

#### [`libs/shared-types`](libs/shared-types/package.json:1)

**Purpose**: Common TypeScript types and interfaces

**Key Exports**:
```typescript
// User types
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  HR = 'hr',
  ENGINEERING_MANAGER = 'engineering_manager',
  RECRUITER = 'recruiter',
}

export interface IUser { ... }

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}
```

#### [`libs/auth-utils`](libs/auth-utils/package.json:1)

**Purpose**: Shared authentication utilities

**Key Exports**:
- **JWT utilities** (`jwt.ts`):
  - `generateToken()` - Creates JWT tokens
  - `verifyToken()` - Validates JWT tokens
  
- **Middleware** (`middleware.ts`):
  - `authMiddleware()` - Express middleware for JWT validation
  - `requireRole()` - Express middleware for role-based access control

### 4. Host Application Integration

#### [`apps/acentra-frontend/vite.config.ts`](apps/acentra-frontend/vite.config.ts:1)
Configures Module Federation to consume auth components:
```typescript
federation({
  name: 'acentra_frontend',
  remotes: {
    auth_frontend: 'http://localhost:5174/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom', '@acentra/aurora-design-system'],
})
```

#### [`apps/acentra-frontend/src/App.tsx`](apps/acentra-frontend/src/App.tsx:1)
Lazy loads and uses federated components:
```typescript
// Lazy load federated components
const FederatedLogin = lazy(() => import("auth_frontend/Login"));
const FederatedAuthProvider = lazy(() => 
  import("auth_frontend/AuthProvider").then(module => ({ 
    default: module.AuthProvider 
  }))
);

// Usage in component tree
<FederatedAuthProvider>
  <SnackbarProvider>
    <NotificationProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <FederatedLogin
              onSuccess={() => window.location.href = '/dashboard'}
            />
          } />
          {/* Other routes */}
        </Routes>
      </BrowserRouter>
    </NotificationProvider>
  </SnackbarProvider>
</FederatedAuthProvider>
```

## Database Setup

### PostgreSQL Configuration

The system uses a single PostgreSQL instance with two separate databases:

1. **`acentra`** - Authentication service database
2. **`acentra`** - Main application database

#### [`docker-compose.yml`](docker-compose.yml:1)
```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: acentra
      POSTGRES_MULTIPLE_DATABASES: acentra
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
```

#### [`init-db.sql`](init-db.sql:1)
Initialization script that:
- Creates both databases
- Sets up proper permissions
- Runs on container startup

## Security Features

### 1. Password Security
- Passwords hashed using bcryptjs with salt rounds
- Never stored in plain text
- Compared using constant-time comparison

### 2. JWT Token Security
- Tokens signed with secret key
- 24-hour expiration by default
- Payload includes: userId, email, role
- Verified on every protected route

### 3. Role-Based Access Control (RBAC)
- Five role levels: super_admin, admin, hr, engineering_manager, recruiter
- Middleware enforces role requirements
- Admin routes protected with `requireRole(UserRole.ADMIN)`

### 4. CORS Configuration
- Configured for cross-origin requests
- Allows credentials
- Supports all standard HTTP methods

### 5. Account Status
- `is_active` flag for user accounts
- Inactive accounts cannot log in
- Admin can toggle account status

## API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Create a new user account.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe",
  "role": "engineering_manager"
}
```

**Response** (201):
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "engineering_manager",
    "name": "John Doe"
  }
}
```

#### POST `/api/auth/login`
Authenticate user and receive JWT token.

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "role": "engineering_manager",
      "name": "John Doe",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/api/auth/verify`
Verify JWT token validity.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "valid": true,
    "user": {
      "userId": "uuid",
      "email": "user@example.com",
      "role": "engineering_manager"
    }
  }
}
```

#### GET `/api/auth/me`
Get current user information.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "engineering_manager",
    "name": "John Doe",
    "profile_picture": null,
    "department": null,
    "office_location": null,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

#### POST `/api/auth/refresh`
Refresh JWT token.

**Headers**:
```
Authorization: Bearer <token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### POST `/api/auth/logout`
Logout user (client handles token removal).

**Response** (200):
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

### User Management Endpoints (Admin Only)

#### GET `/api/users`
List all users.

**Headers**:
```
Authorization: Bearer <admin-token>
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "role": "engineering_manager",
      "name": "John Doe",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

#### DELETE `/api/users/:id`
Delete a user.

#### PATCH `/api/users/:id/role`
Update user role.

**Request Body**:
```json
{
  "role": "admin"
}
```

#### PATCH `/api/users/:id/toggle-active`
Toggle user active status.

## Development Setup

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm or yarn

### Installation Steps

1. **Install dependencies**:
```bash
npm install
```

2. **Start PostgreSQL**:
```bash
docker-compose up -d
```

3. **Create superadmin user**:
```bash
cd apps/auth-backend
npm run create-superadmin
```

4. **Start auth backend**:
```bash
cd apps/auth-backend
npm run dev
```

5. **Start auth frontend**:
```bash
cd apps/auth-frontend
npm run dev
```

6. **Start main application**:
```bash
cd apps/acentra-frontend
npm run dev
```

### Port Configuration
- Auth Backend: `http://localhost:3001`
- Auth Frontend: `http://localhost:5174`
- Main Frontend: `http://localhost:5173`
- PostgreSQL: `localhost:5432`

## Module Federation Benefits

### 1. **Independent Development**
- Auth module can be developed, tested, and deployed separately
- No need to rebuild main application when auth changes
- Different teams can work on different modules

### 2. **Code Reusability**
- Auth components can be used in multiple applications
- Single source of truth for authentication logic
- Consistent UI/UX across applications

### 3. **Runtime Integration**
- Components loaded at runtime, not build time
- Smaller bundle sizes for host application
- Lazy loading improves initial load performance

### 4. **Version Management**
- Auth module can be versioned independently
- Easy to roll back to previous versions
- A/B testing different auth implementations

### 5. **Technology Independence**
- Auth module can use different React version
- Can upgrade dependencies independently
- Isolated dependency conflicts

## Integration Guide for New Applications

To integrate this auth module into a new application:

### 1. Configure Module Federation

In your `vite.config.ts`:
```typescript
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'your_app',
      remotes: {
        auth_frontend: 'http://localhost:5174/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom'],
    }),
  ],
});
```

### 2. Lazy Load Components

In your `App.tsx`:
```typescript
import { lazy, Suspense } from 'react';

const FederatedLogin = lazy(() => import("auth_frontend/Login"));
const FederatedAuthProvider = lazy(() => 
  import("auth_frontend/AuthProvider").then(module => ({ 
    default: module.AuthProvider 
  }))
);
```

### 3. Use AuthProvider

Wrap your app with the AuthProvider:
```typescript
<Suspense fallback={<Loading />}>
  <FederatedAuthProvider
    onLoginSuccess={(user) => {
      // Handle successful login
      navigate('/dashboard');
    }}
    onLogout={() => {
      // Handle logout
      navigate('/login');
    }}
  >
    <YourApp />
  </FederatedAuthProvider>
</Suspense>
```

### 4. Use Login Component

```typescript
<Route path="/login" element={
  <FederatedLogin
    onSuccess={() => window.location.href = '/dashboard'}
  />
} />
```

### 5. Configure Backend Connection

Update auth frontend's API URL to point to your auth backend:
```typescript
// In auth-frontend/src/utils/api.ts
const API_URL = process.env.VITE_AUTH_API_URL || 'http://localhost:3001';
```

## Best Practices

### 1. **Token Management**
- Store tokens in localStorage (or httpOnly cookies for better security)
- Include token in Authorization header: `Bearer <token>`
- Implement token refresh before expiration
- Clear tokens on logout

### 2. **Error Handling**
- Handle 401 (Unauthorized) by redirecting to login
- Handle 403 (Forbidden) by showing access denied message
- Provide user-friendly error messages
- Log errors for debugging

### 3. **Security**
- Use HTTPS in production
- Implement rate limiting on auth endpoints
- Add CSRF protection for state-changing operations
- Validate all inputs on both client and server
- Use environment variables for secrets

### 4. **Performance**
- Lazy load auth components
- Cache user information
- Minimize API calls with token verification
- Use connection pooling for database

### 5. **Monitoring**
- Log authentication attempts
- Track failed login attempts
- Monitor token expiration issues
- Set up alerts for suspicious activity

## Troubleshooting

### Common Issues

#### 1. Module Federation Loading Errors
**Problem**: "Failed to fetch dynamically imported module"

**Solution**:
- Ensure auth frontend is running on port 5174
- Check CORS configuration
- Verify remoteEntry.js is accessible
- Clear browser cache

#### 2. Database Connection Errors
**Problem**: "Connection refused" or "Database does not exist"

**Solution**:
- Verify PostgreSQL is running: `docker-compose ps`
- Check database exists: `psql -U postgres -l`
- Verify connection credentials in `.env`
- Run init-db.sql if databases missing

#### 3. JWT Token Errors
**Problem**: "Invalid token" or "Token expired"

**Solution**:
- Verify JWT_SECRET matches between services
- Check token expiration time
- Ensure token format: `Bearer <token>`
- Clear localStorage and re-login

#### 4. CORS Errors
**Problem**: "CORS policy blocked"

**Solution**:
- Check CORS configuration in auth backend
- Verify origin URLs match
- Enable credentials if needed
- Check preflight OPTIONS requests

## Future Enhancements

### Planned Features

1. **OAuth Integration**
   - Google Sign-In
   - GitHub OAuth
   - Microsoft Azure AD

2. **Two-Factor Authentication (2FA)**
   - TOTP (Time-based One-Time Password)
   - SMS verification
   - Email verification codes

3. **Password Policies**
   - Minimum length requirements
   - Complexity requirements
   - Password history
   - Expiration policies

4. **Session Management**
   - Multiple device tracking
   - Session revocation
   - Concurrent session limits
   - Device fingerprinting

5. **Audit Logging**
   - Login/logout events
   - Failed authentication attempts
   - Role changes
   - Account modifications

6. **Advanced Security**
   - Rate limiting
   - IP whitelisting/blacklisting
   - Brute force protection
   - Account lockout policies

## Conclusion

This federated authentication module provides a robust, scalable, and reusable solution for authentication and authorization. By leveraging Module Federation, it can be easily integrated into multiple applications while maintaining a single source of truth for authentication logic.

The architecture separates concerns effectively:
- **Backend**: Handles authentication logic and data persistence
- **Frontend**: Provides reusable UI components
- **Shared Libraries**: Ensure type safety and code reuse
- **Host Application**: Consumes auth components seamlessly

This design enables independent development, deployment, and scaling of the authentication service while providing a consistent user experience across all applications.