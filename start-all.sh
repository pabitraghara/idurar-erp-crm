#!/bin/bash

echo "🚀 Starting IDURAR ERP CRM Full Stack Application..."
echo "📁 Current directory: $(pwd)"

# Function to handle cleanup
cleanup() {
    echo "🛑 Stopping all services..."
    kill $(jobs -p) 2>/dev/null
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Test database connection first
echo "🔄 Testing MongoDB connection..."
cd backend
node test-db-connection.js

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
    
    # Start backend in background
    echo "🚀 Starting backend server..."
    cd ..
    ./start-backend.sh &
    BACKEND_PID=$!
    
    # Wait a bit for backend to start
    sleep 10
    
    # Start frontend in background
    echo "🚀 Starting frontend server..."
    ./start-frontend.sh &
    FRONTEND_PID=$!
    
    echo "✅ Both services started!"
    echo "🌐 Backend: http://localhost:8888"
    echo "🌐 Frontend: http://localhost:3000"
    echo "⏹️  Press Ctrl+C to stop all services"
    
    # Wait for background jobs
    wait
else
    echo "❌ Database connection failed. Please check your MongoDB configuration."
    exit 1
fi