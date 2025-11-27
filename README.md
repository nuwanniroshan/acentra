# Acentra

An Nx monorepo project consisting of a React frontend, Node.js backends, and infrastructure for deployment.

## Local Development Setup

### Prerequisites
- Node.js (v18+)
- Docker and Docker Compose (for PostgreSQL only)
- npm or yarn

### Steps to Run

1. **Install dependencies** (run once at the root):
   ```
   npm install
   ```

2. **Start PostgreSQL** (in one terminal):
   ```
   docker-compose up postgres
   ```
   Or use the convenience script:
   ```
   ./start-dev.sh
   ```
   This starts PostgreSQL on port 5432.

3. **Start auth-backend** (in another terminal):
   ```
   npm run dev --workspace=apps/auth-backend
   ```
   The auth-backend will be available at `http://localhost:3002`.

4. **Start acentra-backend** (in another terminal):
   ```
   npm run dev --workspace=apps/acentra-backend
   ```
   The acentra-backend will be available at `http://localhost:3001`.

5. **Start the frontend** (in another terminal):
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
- Environment variables for backends are configured in `.env` files in each backend directory.
- If you encounter database errors, try `docker-compose down -v` to remove volumes and restart.
- To stop PostgreSQL, use `Ctrl+C` in the docker-compose terminal, then `docker-compose down` to clean up containers.
- For production deployment, refer to the infrastructure CDK stacks in the `infrastructure/` directory.

### Troubleshooting

**Backend can't connect to database:**
- Ensure PostgreSQL is running: `docker ps | grep acentra_db`
- Check that `.env` files have `DB_HOST=localhost`
- Verify database credentials match docker-compose.yml

**Port already in use:**
- Check if another service is using the port: `lsof -i :3001` or `lsof -i :3002`
- Stop the conflicting service or change the port in the `.env` file

## Project Structure
- `apps/acentra-frontend/`: React frontend application
- `apps/acentra-backend/`: Main backend API
- `apps/auth-backend/`: Authentication backend
- `libs/`: Shared libraries
- `infrastructure/`: AWS CDK infrastructure as code