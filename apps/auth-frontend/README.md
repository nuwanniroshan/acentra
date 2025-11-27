# Auth Frontend - Federated Authentication Module

This is a federated authentication module built with Vite Module Federation. It provides login, password recovery, and password reset functionality that can be consumed by other applications.

## Features

- **Login Component**: User authentication with email and password
- **Forgot Password**: Password recovery flow with email verification
- **Reset Password**: Secure password reset with token validation
- **Auth Context**: Centralized authentication state management
- **Aurora Design System**: Consistent UI components across the application

## Architecture

This module uses Vite Module Federation to expose authentication components that can be consumed by the main application (acentra-frontend).

### Exposed Modules

- `./Login` - Login page component
- `./ForgotPassword` - Password recovery component
- `./ResetPassword` - Password reset component
- `./AuthProvider` - Authentication context provider

## Development

### Prerequisites

- Node.js 20.x or higher
- npm 11.x or higher

### Installation

```bash
npm install
```

### Running Locally

Start the development server:

```bash
nx serve auth-frontend
```

The application will be available at `http://localhost:5174`

### Building

Build the application:

```bash
nx build auth-frontend
```

## Integration with Host Application

The host application (acentra-frontend) consumes this module through Module Federation.

### Host Configuration

In the host's `vite.config.ts`:

```typescript
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'acentra_frontend',
      remotes: {
        auth_frontend: 'http://localhost:5174/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom', 'react-router-dom', '@acentra/aurora-design-system'],
    }),
  ],
});
```

### Usage in Host Application

```typescript
import { lazy, Suspense } from 'react';

const FederatedLogin = lazy(() => import('auth_frontend/Login'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FederatedLogin 
        onSuccess={() => {
          // Handle successful login
          window.location.href = '/dashboard';
        }}
        onForgotPassword={() => {
          // Handle forgot password navigation
        }}
      />
    </Suspense>
  );
}
```

## Components

### Login

```typescript
interface LoginProps {
  onSuccess?: () => void;
  onForgotPassword?: () => void;
  title?: string;
  subtitle?: string;
}
```

### ForgotPassword

```typescript
interface ForgotPasswordProps {
  onBack?: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}
```

### ResetPassword

```typescript
interface ResetPasswordProps {
  token: string;
  onSuccess?: () => void;
  onBack?: () => void;
  title?: string;
  subtitle?: string;
}
```

### AuthProvider

```typescript
interface AuthProviderProps {
  children: ReactNode;
  onLoginSuccess?: (user: User) => void;
  onLogout?: () => void;
}
```

## Environment Variables

Create a `.env` file in the root directory:

```env
VITE_AUTH_API_URL=http://localhost:3001
```

## API Integration

The module communicates with the auth backend at the configured API URL. Ensure the backend is running and accessible.

### API Endpoints

- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password with token

## Technology Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Module Federation** - Micro-frontend architecture
- **Aurora Design System** - UI component library
- **React Router** - Routing

## Project Structure

```
apps/auth-frontend/
├── src/
│   ├── components/        # Reusable components
│   ├── context/          # React context providers
│   │   └── AuthContext.tsx
│   ├── pages/            # Page components
│   │   ├── Login.tsx
│   │   ├── ForgotPassword.tsx
│   │   └── ResetPassword.tsx
│   ├── utils/            # Utility functions
│   │   └── api.ts
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Entry point
│   └── vite-env.d.ts     # Type definitions
├── index.html
├── package.json
├── project.json          # Nx configuration
├── tsconfig.json
├── tsconfig.app.json
└── vite.config.ts        # Vite + Module Federation config
```

## Best Practices

1. **Shared Dependencies**: Keep shared dependencies (React, React Router, Aurora Design System) in sync between host and remote
2. **Error Handling**: All API calls include proper error handling and user feedback
3. **Loading States**: Components show loading indicators during async operations
4. **Type Safety**: Full TypeScript support with proper type definitions
5. **Accessibility**: Components follow accessibility best practices

## Troubleshooting

### Module Federation Issues

If you encounter module loading issues:

1. Ensure both auth-frontend and acentra-frontend are running
2. Check that the remote URL in the host config matches the auth-frontend dev server
3. Clear browser cache and restart dev servers
4. Verify shared dependencies versions match

### CORS Issues

If you encounter CORS errors:

1. Ensure the auth backend has proper CORS configuration
2. Check that the API URL in `.env` is correct
3. Verify the backend is running and accessible

## License

MIT