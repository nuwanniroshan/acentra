#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} ✓ $1"
}

print_error() {
    echo -e "${RED}[$(date +'%H:%M:%S')]${NC} ✗ $1"
}

print_warning() {
    echo -e "${YELLOW}[$(date +'%H:%M:%S')]${NC} ⚠ $1"
}

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1; then
        return 0
    else
        return 1
    fi
}

# Function to wait for a service to be ready
wait_for_service() {
    local name=$1
    local url=$2
    local max_attempts=30
    local attempt=0
    
    print_status "Waiting for $name to be ready..."
    
    while [ $attempt -lt $max_attempts ]; do
        if curl -s "$url" > /dev/null 2>&1; then
            print_success "$name is ready!"
            return 0
        fi
        attempt=$((attempt + 1))
        sleep 2
    done
    
    print_error "$name failed to start within expected time"
    return 1
}

# Cleanup function
cleanup() {
    print_warning "\nShutting down all services..."
    
    # Kill all background jobs
    jobs -p | xargs -r kill 2>/dev/null
    
    # Stop Docker containers
    print_status "Stopping Docker containers..."
    docker-compose down
    
    print_success "All services stopped"
    exit 0
}

# Set up trap to catch Ctrl+C
trap cleanup SIGINT SIGTERM

# Main script
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║         Acentra Development Environment Startup            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check for port conflicts
print_status "Checking for port conflicts..."
PORTS_IN_USE=()

if check_port 5432; then PORTS_IN_USE+=("5432 (PostgreSQL)"); fi
if check_port 3000; then PORTS_IN_USE+=("3000 (Acentra Backend)"); fi
if check_port 3001; then PORTS_IN_USE+=("3001 (Auth Backend)"); fi
if check_port 5173; then PORTS_IN_USE+=("5173 (Acentra Frontend)"); fi

if [ ${#PORTS_IN_USE[@]} -gt 0 ]; then
    print_warning "The following ports are already in use:"
    for port_info in "${PORTS_IN_USE[@]}"; do
        echo "  - $port_info"
    done
    echo ""
    
    read -p "Do you want to kill the processes using these ports? (y/N) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        for port_info in "${PORTS_IN_USE[@]}"; do
            # Extract port number
            port=$(echo $port_info | cut -d ' ' -f 1)
            # Get PID
            pid=$(lsof -t -i:$port)
            if [ -n "$pid" ]; then
                print_status "Killing process $pid on port $port..."
                kill -9 $pid 2>/dev/null || true
            fi
        done
        print_success "Ports freed."
        # Clear the array as ports are now free
        PORTS_IN_USE=()
    else
        read -p "Do you want to continue anyway? (y/N) " -n 1 -r
        echo ""
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Startup cancelled"
            exit 1
        fi
    fi
fi

# Step 1: Start PostgreSQL
print_status "Starting PostgreSQL database..."
docker-compose up -d postgres

if [ $? -eq 0 ]; then
    print_success "PostgreSQL container started"
else
    print_error "Failed to start PostgreSQL"
    exit 1
fi

# Wait for PostgreSQL to be ready
print_status "Waiting for PostgreSQL to be ready..."
sleep 5

# Test database connection
print_status "Testing database connection..."
DB_READY=false
for i in {1..30}; do
  if docker exec acentra_db psql -U postgres -d postgres -c "SELECT 1" > /dev/null 2>&1; then
    DB_READY=true
    break
  fi
  sleep 2
done

if [ "$DB_READY" = false ]; then
  print_error "PostgreSQL is not ready after 60 seconds"
  exit 1
fi
print_success "PostgreSQL is ready"

# Check if databases exist
print_status "Checking databases..."
DB_CHECK=$(docker exec acentra_db psql -U postgres -lqt | cut -d \| -f 1 | grep -w "auth_db\|acentra" | wc -l)

if [ "$DB_CHECK" -lt 2 ]; then
    print_warning "Databases not found. Running initialization..."
    docker exec acentra_db psql -U postgres -f /docker-entrypoint-initdb.d/init-db.sql
    print_success "Databases initialized"
else
    print_success "Databases already exist"
fi

# Step 2: Install dependencies if needed
print_status "Checking dependencies..."

if [ ! -d "node_modules" ]; then
    print_status "Installing root dependencies..."
    npm install
fi

# Step 3: Start Auth Backend
print_status "Starting Auth Backend (port 3001)..."
cd apps/auth-backend

if [ ! -d "node_modules" ]; then
    print_status "Installing auth-backend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning "Creating .env file for auth-backend..."
    cat > .env << EOF
PORT=3001
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=auth_db
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NODE_ENV=development
EOF
    print_success ".env file created"
fi

npm run dev > ../../logs/auth-backend.log 2>&1 &
AUTH_BACKEND_PID=$!
cd ../..

# Step 4: Start Acentra Backend
print_status "Starting Acentra Backend (port 3000)..."
cd apps/acentra-backend

if [ ! -d "node_modules" ]; then
    print_status "Installing acentra-backend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning "Creating .env file for acentra-backend..."
    cat > .env << EOF
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
EOF
    print_success ".env file created"
fi

npm run dev > ../../logs/acentra-backend.log 2>&1 &
ACENTRA_BACKEND_PID=$!
cd ../..

# Wait for backends to be ready
sleep 5
wait_for_service "Auth Backend" "http://localhost:3001/health"
wait_for_service "Acentra Backend" "http://localhost:3000/health"


# Step 6: Start Acentra Frontend
print_status "Starting Acentra Frontend (port 5173)..."
cd apps/acentra-frontend

if [ ! -d "node_modules" ]; then
    print_status "Installing acentra-frontend dependencies..."
    npm install
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    print_warning "Creating .env file for acentra-frontend..."
    cat > .env << EOF
VITE_API_URL=http://localhost:3000
VITE_AUTH_API_URL=http://localhost:3001
EOF
    print_success ".env file created"
fi

# Use Node 22 for frontend
PATH="/opt/homebrew/opt/node@22/bin:$PATH" npm run dev > ../../logs/acentra-frontend.log 2>&1 &
ACENTRA_FRONTEND_PID=$!
cd ../..

# Wait for frontends to be ready
sleep 5

# Display status
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   Services Status                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Check each service
if check_port 5432; then
    print_success "PostgreSQL:        http://localhost:5432"
else
    print_error "PostgreSQL:        Not running"
fi

if check_port 3001; then
    print_success "Auth Backend:      http://localhost:3001"
else
    print_error "Auth Backend:      Not running"
fi

if check_port 3000; then
    print_success "Acentra Backend:   http://localhost:3000"
else
    print_error "Acentra Backend:   Not running"
fi

if check_port 5173; then
    print_success "Acentra Frontend:  http://localhost:5173"
else
    print_error "Acentra Frontend:  Not running"
fi

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   Quick Access URLs                        ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  🌐 Main Application:    http://localhost:5173"
echo "  📡 Acentra API:         http://localhost:3000/health"
echo "  🔑 Auth API:            http://localhost:3001/health"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   Log Files Location                       ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  📄 Auth Backend:        logs/auth-backend.log"
echo "  📄 Acentra Backend:     logs/acentra-backend.log"
echo "  📄 Acentra Frontend:    logs/acentra-frontend.log"
echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   Useful Commands                          ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""
echo "  View logs:              tail -f logs/<service>.log"
echo "  Stop all services:      Press Ctrl+C"
echo "  Database access:        docker exec -it acentra_db psql -U postgres"
echo ""
print_success "All services are running!"
print_warning "Press Ctrl+C to stop all services"
echo ""

# Keep script running and monitor processes
while true; do
    # Check if any process has died
    if ! kill -0 $AUTH_BACKEND_PID 2>/dev/null; then
        print_error "Auth Backend has stopped unexpectedly"
    fi

    if ! kill -0 $ACENTRA_BACKEND_PID 2>/dev/null; then
        print_error "Acentra Backend has stopped unexpectedly"
    fi

    if ! kill -0 $ACENTRA_FRONTEND_PID 2>/dev/null; then
        print_error "Acentra Frontend has stopped unexpectedly"
    fi

    sleep 5
done