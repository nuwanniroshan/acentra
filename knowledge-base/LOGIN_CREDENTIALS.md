# Login Credentials

## Issue Resolution

The login issue has been resolved. The problem was that **no users existed in the database**.

## Superadmin Account Created

A superadmin user has been successfully created in the auth database:

- **Email:** `superadmin@acentra.com`
- **Password:** `Ok4Me2bhr!`
- **Role:** `admin`
- **Status:** Active

## How to Login

1. Navigate to the frontend application (running on the port shown in Terminal 1)
2. Use the credentials above to login
3. You will be redirected to the dashboard after successful authentication

## API Endpoints

- **Auth Backend:** `http://localhost:3002/api`
- **Login Endpoint:** `POST http://localhost:3002/api/auth/login`
- **Main Backend:** `http://localhost:3001/api`

## Verification

The login has been tested and verified using curl:

```bash
curl -X POST http://localhost:3002/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@acentra.com","password":"Ok4Me2bhr!"}'
```

Response: ✅ Success - Returns user data and JWT token

## Services Status

All required services are running in Docker:
- ✅ PostgreSQL Database (acentra_db) - Port 5432
- ✅ Auth Backend (acentra_auth_backend) - Port 3002
- ✅ Main Backend (acentra_backend) - Port 3001
- ✅ Frontend - Running locally via npm

## Creating Additional Users

To create additional users, you can either:

1. **Use the registration endpoint** (if enabled):
   ```bash
   curl -X POST http://localhost:3002/api/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password123","name":"User Name","role":"engineering_manager"}'
   ```

2. **Use the admin panel** after logging in with the superadmin account

3. **Run SQL directly** in the database:
   ```bash
   docker exec acentra_db psql -U postgres -d acentra -c "INSERT INTO \"user\" ..."