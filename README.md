# Acentra

An Nx monorepo project consisting of a React frontend, Node.js backends, and infrastructure for deployment.

## 🚀 Quick Start

### One-Command Development Environment

Start all services (database, backends, frontends) with a single command:

```bash
./start-all-dev.sh
```

This will automatically:
- ✅ Start PostgreSQL database
- ✅ Initialize databases if needed
- ✅ Start Auth Backend (port 3001)
- ✅ Start Acentra Backend (port 3000)
- ✅ Start Auth Frontend (port 5174)
- ✅ Start Acentra Frontend (port 5173)
- ✅ Create .env files if missing
- ✅ Install dependencies if needed
- ✅ Monitor all services

**Access the application**: http://localhost:5173

**Stop all services**: Press `Ctrl+C`

📖 **For detailed instructions**, see [Development Environment Guide](knowledge-base/DEV_ENVIRONMENT_GUIDE.md)

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- npm or yarn

### Default Credentials
- **Super Admin**: `superadmin@acentra.com` / `Ok4Me2bhr!`
- **Database**: user `postgres`, password `password`

## 📚 Documentation

- **[Development Environment Guide](knowledge-base/DEV_ENVIRONMENT_GUIDE.md)** - Complete guide for running and managing the dev environment
- **[Federated Auth Module Documentation](knowledge-base/FEDERATED_AUTH_MODULE_DOCUMENTATION.md)** - Architecture and implementation details
- **[Federation Migration Guide](knowledge-base/FEDERATION_MIGRATION_GUIDE.md)** - Migration from monolithic to federated architecture
- **[Startup Guide](knowledge-base/STARTUP_GUIDE.md)** - Initial setup and configuration
- **[User Preferences Implementation](knowledge-base/USER_PREFERENCES_IMPLEMENTATION.md)** - User preferences feature documentation

## 🤖 AI Agent Instructions

All project documentation is located in the `knowledge-base` directory.
- Please read files in `knowledge-base/` for relevant project information.
- When creating new documentation or markdown files, ALWAYS place them in the `knowledge-base/` directory, not the root directory.

## 🏗️ Manual Setup (Alternative)

If you prefer to run services individually:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start PostgreSQL
```bash
docker-compose up -d postgres
```

### 3. Start Backends
```bash
# Auth Backend (port 3001)
cd apps/auth-backend
npm run dev

# Acentra Backend (port 3000)
cd apps/acentra-backend
npm run dev
```

### 4. Start Frontends
```bash
# Auth Frontend (port 5174)
cd apps/auth-frontend
npm run dev

# Acentra Frontend (port 5173)
cd apps/acentra-frontend
npm run dev
```

## 🔧 Troubleshooting

### Quick Fixes

**Port already in use:**
```bash
lsof -i :5173  # Find process using port
kill -9 <PID>  # Kill the process
```

**Database connection errors:**
```bash
docker-compose down -v  # Remove volumes
./start-all-dev.sh      # Restart everything
```

**Module Federation errors:**
- Ensure auth-frontend is running on port 5174
- Clear browser cache
- Check http://localhost:5174/assets/remoteEntry.js is accessible

For more troubleshooting, see [Development Environment Guide](knowledge-base/DEV_ENVIRONMENT_GUIDE.md#troubleshooting)

## Project Structure
- `apps/acentra-frontend/`: React frontend application (host)
- `apps/auth-frontend/`: Federated authentication module (remote)
- `apps/acentra-backend/`: Main backend API
- `apps/auth-backend/`: Authentication backend
- `libs/`: Shared libraries
  - `libs/aurora-design-system/`: Shared UI component library
- `infrastructure/`: AWS CDK infrastructure as code

## Module Federation Architecture

This project uses Vite Module Federation to create a micro-frontend architecture:

- **Host Application** (`acentra-frontend`): The main application that consumes federated modules
- **Remote Module** (`auth-frontend`): A standalone authentication module that exposes login, password recovery, and authentication context

### Benefits
- **Independent Development**: Auth module can be developed and deployed independently
- **Code Sharing**: Shared dependencies (React, Aurora Design System) are loaded once
- **Scalability**: Easy to add more federated modules in the future
- **Separation of Concerns**: Authentication logic is isolated in its own module

### Running with Module Federation
Both applications must be running for the federation to work:
1. Start `auth-frontend` on port 5174 (remote)
2. Start `acentra-frontend` on port 5173 (host)

The host application will dynamically load the authentication components from the remote at runtime.