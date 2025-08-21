#!/bin/bash

# Production start script for FITS AI
echo "🚀 Starting FITS AI in production mode..."

# Set production environment
export NODE_ENV=production

# Ensure build directory exists
if [ ! -d "build" ]; then
    echo "📦 Building application..."
    npm run build
fi

# Start the server
echo "🌐 Starting Express server..."
node server/simple-server.js