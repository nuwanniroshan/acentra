# Acentra

An Nx monorepo project consisting of a React frontend, Node.js backends, and infrastructure for deployment.

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose
- npm or yarn

### Steps to Run

1. **Install dependencies** (run once at the root):
   ```
   npm install
   ```

2. **Start the database and backends** (in one terminal):
   ```
   docker-compose up
   ```
   This starts:
   - PostgreSQL on port 5432
   - auth-backend on port 3002
   - acentra-backend on port 3001

3. **Start the frontend** (in another terminal):
   ```
   nx serve acentra-frontend
   ```
   The frontend will be available at `http://localhost:5173`.

   **Optional**: Create a `.env` file in `apps/acentra-frontend/` to customize API URLs:
   ```
   VITE_API_URL=http://localhost:3001
   VITE_AUTH_API_URL=http://localhost:3002
   ```

### Additional Notes
- The backends use TypeORM with `synchronize: true`, so database tables are created automatically on startup.
- Default database credentials (from docker-compose.yml): user `postgres`, password `password`.
- Databases: `acentra` for acentra-backend, `auth_db` for auth-backend.
- A default super admin user is available: `superadmin@acentra.com` / `Ok4Me2bhr!`
- If you encounter database errors, try `docker-compose down -v` to remove volumes and restart.
- If you need to stop the services, use `Ctrl+C` in the docker-compose terminal, then `docker-compose down` to clean up containers.
- For production deployment, refer to the infrastructure CDK stacks in the `infrastructure/` directory.

## Project Structure
- `apps/acentra-frontend/`: React frontend application
- `apps/acentra-backend/`: Main backend API
- `apps/auth-backend/`: Authentication backend
- `libs/`: Shared libraries
- `infrastructure/`: AWS CDK infrastructure as code