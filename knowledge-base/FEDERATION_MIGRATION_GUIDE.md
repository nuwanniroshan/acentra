# Module Federation Migration Guide

This document describes the migration of the authentication module to a federated architecture using Vite Module Federation.

## Overview

The authentication functionality has been extracted from the main `acentra-frontend` application into a separate federated module called `auth-frontend`. This allows for:

- Independent development and deployment of authentication features
- Better code organization and separation of concerns
- Shared dependencies across micro-frontends
- Scalable architecture for future module additions

## Architecture Changes

### Before (Monolithic)
```
acentra-frontend/
├── src/
│   ├── pages/
│   │   └── Login.tsx (embedded in main app)
│   └── api.ts
```

### After (Federated)
```
auth-frontend/ (Remote Module - Port 5174)
├── src/
│   ├── pages/
│   │   ├── Login.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   ├── context/
│   │   └── AuthContext.tsx
│   └── utils/
│       └── api.ts

acentra-frontend/ (Host Application - Port 5173)
├── src/
│   ├── App.tsx (imports federated Login)
│   └── auth-frontend.d.ts (type definitions)
```

## What Was Created

### 1. New Auth Frontend Application (`apps/auth-frontend/`)

**Components:**
- [`Login.tsx`](apps/auth-frontend/src/pages/Login.tsx) - Refactored login page using Aurora Design System
- [`ForgotPassword.tsx`](apps/auth-frontend/src/pages/ForgotPassword.tsx) - Password recovery flow
- [`ResetPassword.tsx`](apps/auth-frontend/src/pages/ResetPassword.tsx) - Password reset with token validation

**Context:**
- [`AuthContext.tsx`](apps/auth-frontend/src/context/AuthContext.tsx) - Centralized authentication state management

**Configuration:**
- [`vite.config.ts`](apps/auth-frontend/vite.config.ts) - Module Federation configuration (remote)
- [`project.json`](apps/auth-frontend/project.json) - Nx project configuration
- [`package.json`](apps/auth-frontend/package.json) - Dependencies

### 2. Updated Host Application (`apps/acentra-frontend/`)

**Changes:**
- [`vite.config.ts`](apps/acentra-frontend/vite.config.ts) - Added Module Federation plugin (host)
- [`App.tsx`](apps/acentra-frontend/src/App.tsx) - Updated to lazy load federated Login component
- [`auth-frontend.d.ts`](apps/acentra-frontend/src/auth-frontend.d.ts) - TypeScript declarations for federated modules

### 3. Aurora Design System Updates

**Added Icons:**
- [`AuroraEmailIcon`](libs/aurora-design-system/src/components/AuroraIcon.tsx:41) - For email-related actions
- [`AuroraLockIcon`](libs/aurora-design-system/src/components/AuroraIcon.tsx:42) - For password/security actions

## Key Features

### 1. Login Component
- Email and password authentication
- Error handling with user-friendly messages
- Loading states during authentication
- Customizable title and subtitle
- Callback support for success and forgot password actions

### 2. Forgot Password Component
- Email-based password recovery
- Success confirmation screen
- Back to login navigation
- Email validation

### 3. Reset Password Component
- Token-based password reset
- Password confirmation validation
- Minimum password length requirement (8 characters)
- Success confirmation with auto-redirect

### 4. Auth Context
- Centralized authentication state
- User and token management
- Login/logout functionality
- Persistent authentication (localStorage)
- Loading states

## Running the Federated Setup

### Prerequisites
1. Install dependencies:
   ```bash
   npm install
   ```

2. Ensure PostgreSQL and backends are running:
   ```bash
   docker-compose up postgres
   npm run dev --workspace=apps/auth-backend
   npm run dev --workspace=apps/acentra-backend
   ```

### Starting the Applications

**Important:** Both applications must be running for Module Federation to work.

1. **Start the auth-frontend (remote) first:**
   ```bash
   nx serve auth-frontend
   ```
   - Runs on `http://localhost:5174`
   - Exposes authentication modules

2. **Start the acentra-frontend (host):**
   ```bash
   nx serve acentra-frontend
   ```
   - Runs on `http://localhost:5173`
   - Consumes federated auth modules

### Environment Configuration

**auth-frontend** (`.env`):
```env
VITE_AUTH_API_URL=http://localhost:3001
```

**acentra-frontend** (`.env`):
```env
VITE_API_URL=http://localhost:3001
VITE_AUTH_API_URL=http://localhost:3002
```

## Module Federation Configuration

### Remote Configuration (auth-frontend)

```typescript
// apps/auth-frontend/vite.config.ts
federation({
  name: 'auth_frontend',
  filename: 'remoteEntry.js',
  exposes: {
    './Login': './src/pages/Login',
    './ForgotPassword': './src/pages/ForgotPassword',
    './ResetPassword': './src/pages/ResetPassword',
    './AuthProvider': './src/context/AuthContext',
  },
  shared: ['react', 'react-dom', 'react-router-dom', '@acentra/aurora-design-system'],
})
```

### Host Configuration (acentra-frontend)

```typescript
// apps/acentra-frontend/vite.config.ts
federation({
  name: 'acentra_frontend',
  remotes: {
    auth_frontend: 'http://localhost:5174/assets/remoteEntry.js',
  },
  shared: ['react', 'react-dom', 'react-router-dom', '@acentra/aurora-design-system'],
})
```

## Usage in Host Application

### Importing Federated Components

```typescript
import { lazy, Suspense } from 'react';

// Lazy load the federated component
const FederatedLogin = lazy(() => import('auth_frontend/Login'));

function App() {
  return (
    <Suspense fallback={<CircularProgress />}>
      <FederatedLogin 
        onSuccess={() => {
          // Handle successful login
          window.location.href = '/dashboard';
        }}
        onForgotPassword={() => {
          // Navigate to forgot password
        }}
      />
    </Suspense>
  );
}
```

## Benefits of This Architecture

### 1. Independent Development
- Auth team can work on authentication features independently
- Separate deployment pipeline for auth module
- No need to rebuild main app for auth changes

### 2. Code Reusability
- Auth module can be consumed by multiple applications
- Shared dependencies loaded once (React, Aurora Design System)
- Consistent authentication experience across apps

### 3. Better Performance
- Lazy loading of authentication module
- Smaller initial bundle size for main app
- Parallel development and deployment

### 4. Scalability
- Easy to add more federated modules (e.g., admin panel, reporting)
- Clear boundaries between features
- Simplified testing and maintenance

## Troubleshooting

### Module Not Loading

**Problem:** "Failed to fetch dynamically imported module"

**Solutions:**
1. Ensure auth-frontend is running on port 5174
2. Check browser console for CORS errors
3. Verify the remote URL in host's vite.config.ts
4. Clear browser cache and restart dev servers

### Type Errors

**Problem:** TypeScript errors for federated imports

**Solutions:**
1. Ensure `auth-frontend.d.ts` is in the host's src directory
2. Restart TypeScript server in your IDE
3. Check that module names match in declarations and imports

### Shared Dependencies Mismatch

**Problem:** Multiple React instances or version conflicts

**Solutions:**
1. Ensure React versions match in both package.json files
2. Verify shared dependencies in both vite.config.ts files
3. Clear node_modules and reinstall: `rm -rf node_modules && npm install`

### CORS Issues

**Problem:** CORS errors when loading remote module

**Solutions:**
1. Both dev servers have CORS enabled by default
2. Check that ports are correct (5173 for host, 5174 for remote)
3. Verify no proxy or firewall is blocking requests

## Testing

### Unit Testing
Each module can be tested independently:

```bash
# Test auth-frontend
nx test auth-frontend

# Test acentra-frontend
nx test acentra-frontend
```

### Integration Testing
Test the federated setup:

1. Start both applications
2. Navigate to `http://localhost:5173`
3. Verify login component loads from remote
4. Test authentication flow
5. Check browser network tab for remoteEntry.js loading

## Future Enhancements

### Potential Additional Modules
- Admin panel module
- Reporting/analytics module
- User profile module
- Settings module

### Production Considerations
1. **CDN Deployment**: Deploy remote modules to CDN
2. **Versioning**: Implement version management for remotes
3. **Fallbacks**: Add fallback UI for failed module loads
4. **Monitoring**: Track module loading performance
5. **Caching**: Implement proper cache strategies

## Migration Checklist

- [x] Install Module Federation plugin
- [x] Create auth-frontend application
- [x] Implement Login component with Aurora Design System
- [x] Implement ForgotPassword component
- [x] Implement ResetPassword component
- [x] Create AuthContext for state management
- [x] Configure Module Federation in auth-frontend (remote)
- [x] Configure Module Federation in acentra-frontend (host)
- [x] Update host App.tsx to use federated Login
- [x] Add TypeScript declarations for federated modules
- [x] Update project documentation
- [x] Test federated setup locally

## References

- [Nx Module Federation Guide](https://nx.dev/docs/technologies/module-federation/guides/federate-a-module)
- [Vite Plugin Federation](https://github.com/originjs/vite-plugin-federation)
- [Module Federation Concepts](https://webpack.js.org/concepts/module-federation/)

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the auth-frontend README: [`apps/auth-frontend/README.md`](apps/auth-frontend/README.md)
3. Check Nx and Vite documentation
4. Review browser console for detailed error messages