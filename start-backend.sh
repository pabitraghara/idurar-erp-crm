#!/bin/bash

echo "🚀 Starting IDURAR ERP CRM Backend..."
echo "📁 Current directory: $(pwd)"

# Navigate to backend directory
cd backend

# Test database connection first
echo "🔄 Testing MongoDB connection..."
node test-db-connection.js

if [ $? -eq 0 ]; then
    echo "✅ Database connection successful!"
    
    # Install dependencies if node_modules doesn't exist
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing backend dependencies..."
        npm install
    fi
    
    # Run setup if needed
    echo "🛠️  Running setup script..."
    npm run setup
    
    # Start development server
    echo "🚀 Starting backend server on port 8888..."
    npm run dev
else
    echo "❌ Database connection failed. Please check your MongoDB configuration."
    exit 1
fi