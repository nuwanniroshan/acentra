#!/bin/bash

# Start Acentra Frontend Script
# This script starts the acentra-frontend application

echo "🚀 Starting Acentra Frontend..."
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
    echo "🛑 Stopping services..."
    kill $(jobs -p) 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup EXIT INT TERM

# Start acentra-frontend on port 5173
echo "🏠 Starting acentra-frontend on port 5173..."
nx serve acentra-frontend &
FRONTEND_PID=$!

echo ""
echo "✅ Application is starting..."
echo ""
echo "📍 URL:"
echo "   - Acentra Frontend: http://localhost:5173"
echo ""
echo "💡 Press Ctrl+C to stop the service"
echo ""

# Wait for the process
wait $FRONTEND_PID