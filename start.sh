#!/bin/bash

# Start Federated Applications Script
# This script starts both the auth-frontend (remote) and acentra-frontend (host)

echo "🚀 Starting Federated Applications..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start auth-frontend (remote) on port 5174
echo "🔐 Starting auth-frontend (remote) on port 5174..."
nx serve auth-frontend &
AUTH_PID=$!

# Wait a bit for auth-frontend to start
sleep 3

# Start acentra-frontend (host) on port 5173
echo "🏠 Starting acentra-frontend (host) on port 5173..."
nx serve acentra-frontend &
FRONTEND_PID=$!

echo ""
echo "✅ Both applications are starting..."
echo ""
echo "📍 URLs:"
echo "   - Auth Frontend (Remote): http://localhost:5174"
echo "   - Main Frontend (Host):   http://localhost:5173"
echo ""
echo "💡 Press Ctrl+C to stop all services"
echo ""

# Wait for both processes
wait $AUTH_PID $FRONTEND_PID