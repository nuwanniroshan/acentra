#!/bin/bash

# Acentra Development Environment Startup Script
# This script starts all services needed for local development

set -e

echo "🚀 Starting Acentra Development Environment..."
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start PostgreSQL
echo -e "${YELLOW}📦 Starting PostgreSQL...${NC}"
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo -e "${YELLOW}⏳ Waiting for PostgreSQL to be ready...${NC}"
until docker exec acentra_db pg_isready -U postgres > /dev/null 2>&1; do
    sleep 1
done
echo -e "${GREEN}✅ PostgreSQL is ready${NC}"
echo ""

# Start auth-backend
echo -e "${YELLOW}🔐 Starting auth-backend on port 3001...${NC}"
echo "   Run in a new terminal: npm run dev --workspace=apps/auth-backend"
echo ""

# Start acentra-backend
echo -e "${YELLOW}🔧 Starting acentra-backend on port 3000...${NC}"
echo "   Run in a new terminal: npm run dev --workspace=apps/acentra-backend"
echo ""

# Start frontend
echo -e "${YELLOW}🌐 Starting frontend on port 5173...${NC}"
echo "   Run in a new terminal: nx serve acentra-frontend"
echo ""

echo -e "${GREEN}✅ PostgreSQL is running!${NC}"
echo ""
echo "📋 Next steps:"
echo "   1. Open a new terminal and run: npm run dev --workspace=apps/auth-backend"
echo "   2. Open another terminal and run: npm run dev --workspace=apps/acentra-backend"
echo "   3. Open another terminal and run: nx serve acentra-frontend"
echo ""
echo "🛑 To stop PostgreSQL:"
echo "   docker-compose down"
echo ""
