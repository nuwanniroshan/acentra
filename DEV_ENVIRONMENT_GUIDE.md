# Development Environment Guide

## Quick Start

### One-Command Startup

Start all services (database, backends, frontends) with a single command:

```bash
./start-all-dev.sh
```

This script will:
1. ✅ Start PostgreSQL database (Docker)
2. ✅ Initialize databases if needed
3. ✅ Start Auth Backend (port 3001)
4. ✅ Start Acentra Backend (port 3000)
5. ✅ Start Auth Frontend (port 5174)
6. ✅ Start Acentra Frontend (port 5173)
7. ✅ Create .env files if missing
8. ✅ Install dependencies if needed
9. ✅ Monitor all services

### Stopping Services

Press `Ctrl+C` in the terminal where the script is running. This will gracefully shut down all services.

## Service URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Main Application** | http://localhost:5173 | Acentra recruitment platform |
| **Auth Module** | http://localhost:5174 | Standalone auth interface |
| **Acentra API** | http://localhost:3000 | Main backend API |
| **Auth API** | http://localhost:3001 | Authentication API |
| **PostgreSQL** | localhost:5432 | Database server |

## Log Files

All service logs are stored in the `logs/` directory:

```bash
# View real-time logs
tail -f logs/auth-backend.log
tail -f logs/acentra-backend.log
tail -f logs/auth-frontend.log
tail -f logs/acentra-frontend.log

# View all logs at once
tail -f logs/*.log
```

## Manual Service Management

If you prefer to run services individually:

### 1. Start Database

```bash
docker-compose up -d postgres
```

### 2. Start Auth Backend

```bash
cd apps/auth-backend
npm run dev
```

### 3. Start Acentra Backend

```bash
cd apps/acentra-backend
npm run dev
```

### 4. Start Auth Frontend

```bash
cd apps/auth-frontend
npm run dev
```

### 5. Start Acentra Frontend

```bash
cd apps/acentra-frontend
npm run dev
```

## Database Management

### Access PostgreSQL

```bash
# Using Docker
docker exec -it acentra_db psql -U postgres

# List databases
\l

# Connect to auth_db
\c auth_db

# Connect to acentra
\c acentra

# List tables
\dt

# Exit
\q
```

### Reset Databases

```bash
# Stop all services first (Ctrl+C)

# Remove database volume
docker-compose down -v

# Restart (will reinitialize)
./start-all-dev.sh
```

### Create Superadmin User

```bash
cd apps/auth-backend
npm run create-superadmin
```

Follow the prompts to create a superadmin account.

## Troubleshooting

### Port Already in Use

If you see port conflict errors:

```bash
# Find process using port
lsof -i :5173  # or any other port

# Kill process
kill -9 <PID>
```

### Docker Not Running

```bash
# Start Docker Desktop (macOS)
open -a Docker

# Or start Docker service (Linux)
sudo systemctl start docker
```

### Dependencies Issues

```bash
# Clean install all dependencies
rm -rf node_modules apps/*/node_modules libs/*/node_modules
npm install

# Or use the startup script which handles this automatically
./start-all-dev.sh
```

### Database Connection Errors

```bash
# Check if PostgreSQL is running
docker ps | grep acentra_db

# Check logs
docker logs acentra_db

# Restart database
docker-compose restart postgres
```

### Module Federation Errors

If you see "Failed to fetch dynamically imported module":

1. Ensure auth-frontend is running on port 5174
2. Clear browser cache
3. Check browser console for CORS errors
4. Verify remoteEntry.js is accessible: http://localhost:5174/assets/remoteEntry.js

### Service Won't Start

Check the log files for errors:

```bash
# View specific service log
cat logs/auth-backend.log
cat logs/acentra-backend.log
cat logs/auth-frontend.log
cat logs/acentra-frontend.log
```

## Environment Variables

The startup script automatically creates `.env` files if they don't exist. You can customize them:

### Auth Backend (.env)

```env
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=auth_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
```

### Acentra Backend (.env)

```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=acentra
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@acentra.com
```

### Auth Frontend (.env)

```env
VITE_AUTH_API_URL=http://localhost:3001
```

### Acentra Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_AUTH_API_URL=http://localhost:3001
```

## Development Workflow

### Adding New Modules

When adding new federated modules:

1. Create the module in `apps/` directory
2. Add module configuration to `vite.config.ts`
3. Update `start-all-dev.sh` to include the new module
4. Add port configuration and health check

Example addition to `start-all-dev.sh`:

```bash
# Step 7: Start New Module
print_status "Starting New Module (port 5175)..."
cd apps/new-module

if [ ! -d "node_modules" ]; then
    npm install
fi

npm run dev > ../../logs/new-module.log 2>&1 &
NEW_MODULE_PID=$!
cd ../..
```

### Hot Reload

All services support hot reload:
- **Frontends**: Vite HMR (instant updates)
- **Backends**: ts-node-dev (auto-restart on changes)

### Testing Changes

1. Make your changes
2. Services will auto-reload
3. Check logs for errors: `tail -f logs/<service>.log`
4. Test in browser: http://localhost:5173

## Performance Tips

### Faster Startup

If you're only working on specific services:

```bash
# Only start what you need
docker-compose up -d postgres
cd apps/acentra-backend && npm run dev &
cd apps/acentra-frontend && npm run dev &
```

### Memory Usage

If experiencing high memory usage:

```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Then run startup script
./start-all-dev.sh
```

## CI/CD Integration

The startup script can be used in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Start Development Environment
  run: |
    ./start-all-dev.sh &
    sleep 30  # Wait for services to start
    
- name: Run Tests
  run: npm test
```

## Best Practices

1. **Always use the startup script** for consistent environment setup
2. **Check logs** when debugging issues
3. **Keep .env files** out of version control (already in .gitignore)
4. **Stop services properly** with Ctrl+C to avoid orphaned processes
5. **Update the script** when adding new modules

## Additional Resources

- [Federated Auth Module Documentation](FEDERATED_AUTH_MODULE_DOCUMENTATION.md)
- [Federation Migration Guide](FEDERATION_MIGRATION_GUIDE.md)
- [Startup Guide](STARTUP_GUIDE.md)
- [User Preferences Implementation](USER_PREFERENCES_IMPLEMENTATION.md)

## Support

If you encounter issues not covered here:

1. Check service logs in `logs/` directory
2. Verify all ports are available
3. Ensure Docker is running
4. Try a clean restart: Stop all services, remove containers, restart

```bash
# Clean restart
docker-compose down -v
rm -rf logs/*
./start-all-dev.sh