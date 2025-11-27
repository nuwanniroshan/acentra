# Complete Startup Guide

This guide shows you how to run the complete Acentra application stack with the federated authentication module.

## Quick Start (Recommended)

### Option 1: Run Everything with One Command

```bash
# Make sure you're in the project root directory
./start-dev.sh
```

This will start:
- PostgreSQL database
- Auth backend (port 3001)
- Acentra backend (port 3002)

Then in separate terminals:

```bash
# Terminal 2: Start federated frontends
./start.sh
```

This will start:
- Auth frontend (port 5174) - Remote module
- Acentra frontend (port 5173) - Host application

### Option 2: Manual Step-by-Step

Follow these steps in order:

#### Step 1: Start PostgreSQL Database

```bash
# Terminal 1
docker-compose up postgres
```

Wait until you see: `database system is ready to accept connections`

#### Step 2: Start Auth Backend

```bash
# Terminal 2
npm run dev --workspace=apps/auth-backend
```

Wait until you see: `Auth server running on port 3001`

#### Step 3: Start Acentra Backend

```bash
# Terminal 3
npm run dev --workspace=apps/acentra-backend
```

Wait until you see: `Server running on port 3002`

#### Step 4: Start Auth Frontend (Remote Module)

```bash
# Terminal 4
nx serve auth-frontend
```

Wait until you see: `Local: http://localhost:5174/`

**Important:** This must start before the main frontend!

#### Step 5: Start Acentra Frontend (Host Application)

```bash
# Terminal 5
nx serve acentra-frontend
```

Wait until you see: `Local: http://localhost:5173/`

## Access the Application

Once all services are running:

1. **Main Application**: http://localhost:5173
   - This is where you'll interact with the app
   - Login page is loaded from the federated auth module

2. **Auth Module (Standalone)**: http://localhost:5174
   - You can test the auth module independently here
   - Useful for development and testing

3. **Auth Backend API**: http://localhost:3001
   - Authentication endpoints

4. **Acentra Backend API**: http://localhost:3002
   - Main application endpoints

## Default Login Credentials

```
Email: superadmin@acentra.com
Password: Ok4Me2bhr!
```

## Service Overview

| Service | Port | Purpose | Required For |
|---------|------|---------|--------------|
| PostgreSQL | 5432 | Database | All backends |
| Auth Backend | 3001 | Authentication API | Login/Auth |
| Acentra Backend | 3002 | Main API | App features |
| Auth Frontend | 5174 | Federated auth module (remote) | Login UI |
| Acentra Frontend | 5173 | Main app (host) | Everything |

## Startup Order (Important!)

The services must start in this order:

1. **PostgreSQL** - Database must be ready first
2. **Auth Backend** - Authentication API
3. **Acentra Backend** - Main API
4. **Auth Frontend** - Remote module (must start before host!)
5. **Acentra Frontend** - Host application

## Troubleshooting

### "Failed to fetch dynamically imported module"

**Problem:** Main frontend can't load the auth module

**Solution:**
1. Ensure auth-frontend is running on port 5174
2. Check browser console for the exact error
3. Restart both frontends in the correct order:
   ```bash
   # Stop both frontends (Ctrl+C)
   # Start auth-frontend first
   nx serve auth-frontend
   # Wait for it to be ready, then start main frontend
   nx serve acentra-frontend
   ```

### "Port already in use"

**Problem:** A service can't start because the port is occupied

**Solution:**
```bash
# Find what's using the port (example for port 5173)
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or use a different port by modifying the project.json file
```

### "Database connection failed"

**Problem:** Backend can't connect to PostgreSQL

**Solution:**
1. Check if PostgreSQL is running:
   ```bash
   docker ps | grep postgres
   ```

2. If not running, start it:
   ```bash
   docker-compose up postgres
   ```

3. Verify database credentials in backend `.env` files match `docker-compose.yml`

### "Module not found" or TypeScript errors

**Problem:** Dependencies are missing or out of sync

**Solution:**
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Rebuild the project
nx reset
npm install
```

### CORS Errors

**Problem:** Frontend can't communicate with backend

**Solution:**
1. Check that all services are running
2. Verify API URLs in `.env` files:
   - `apps/acentra-frontend/.env`
   - `apps/auth-frontend/.env`
3. Restart the affected services

## Development Workflow

### Working on Authentication Features

1. Start only what you need:
   ```bash
   # Terminal 1: Database
   docker-compose up postgres
   
   # Terminal 2: Auth Backend
   npm run dev --workspace=apps/auth-backend
   
   # Terminal 3: Auth Frontend
   nx serve auth-frontend
   ```

2. Access auth module directly at http://localhost:5174
3. Make changes to `apps/auth-frontend/src/`
4. Hot reload will update automatically

### Working on Main Application

1. Start all services (use `./start-dev.sh` and `./start.sh`)
2. Access main app at http://localhost:5173
3. Make changes to `apps/acentra-frontend/src/`
4. Hot reload will update automatically

### Testing Module Federation

1. Ensure both frontends are running
2. Open browser DevTools (F12)
3. Go to Network tab
4. Navigate to http://localhost:5173
5. Look for `remoteEntry.js` being loaded from port 5174
6. Check Console for any federation errors

## Stopping Services

### Stop All Services

```bash
# In each terminal, press Ctrl+C

# Then clean up Docker containers
docker-compose down
```

### Stop Specific Services

```bash
# Stop a specific service with Ctrl+C in its terminal

# Or find and kill the process
lsof -i :<PORT>
kill -9 <PID>
```

## Environment Variables

### Auth Frontend (`.env`)

```env
VITE_AUTH_API_URL=http://localhost:3001
```

### Acentra Frontend (`.env`)

```env
VITE_API_URL=http://localhost:3002
VITE_AUTH_API_URL=http://localhost:3001
```

### Auth Backend (`.env`)

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=auth_db
JWT_SECRET=your-secret-key
```

### Acentra Backend (`.env`)

```env
PORT=3002
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=acentra
JWT_SECRET=your-secret-key
AUTH_SERVICE_URL=http://localhost:3001
```

## Useful Commands

### Check Running Services

```bash
# Check all Node processes
ps aux | grep node

# Check specific ports
lsof -i :5173  # Main frontend
lsof -i :5174  # Auth frontend
lsof -i :3001  # Auth backend
lsof -i :3002  # Acentra backend
lsof -i :5432  # PostgreSQL
```

### View Logs

```bash
# Docker logs
docker-compose logs -f postgres

# Backend logs are in the terminal where you started them
```

### Reset Everything

```bash
# Stop all services
docker-compose down -v

# Clean node modules
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules

# Reinstall
npm install

# Restart from Step 1
```

## Production Deployment

For production deployment, refer to:
- `infrastructure/` directory for AWS CDK stacks
- `FEDERATION_MIGRATION_GUIDE.md` for production considerations

## Need Help?

1. Check the troubleshooting section above
2. Review `FEDERATION_MIGRATION_GUIDE.md` for detailed architecture info
3. Check `apps/auth-frontend/README.md` for auth module specifics
4. Look at browser console and terminal logs for error messages