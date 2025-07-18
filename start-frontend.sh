#!/bin/bash

echo "🚀 Starting IDURAR ERP CRM Frontend..."
echo "📁 Current directory: $(pwd)"

# Navigate to frontend directory
cd frontend

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing frontend dependencies..."
    npm install
fi

# Start development server
echo "🚀 Starting frontend server on port 3000..."
npm run dev