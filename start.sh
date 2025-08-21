#!/bin/bash

# Production start script for FITS AI
echo "🚀 Starting FITS AI in production mode..."

# Set production environment
export NODE_ENV=production
export PORT=8080

# Build the application
echo "📦 Building application..."
npm run build

# Start the server
echo "🌐 Starting Express server on port $PORT..."
node server/simple-server.js