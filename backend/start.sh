#!/bin/bash

echo "🚀 Starting Pibardex Backend Setup..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Check if MongoDB is running
echo "🔍 Checking MongoDB connection..."

# Try to connect to MongoDB
if ! nc -z localhost 27017 2>/dev/null; then
    echo "⚠️  MongoDB is not running on localhost:27017"
    echo ""
    echo "📋 MongoDB Setup Options:"
    echo ""
    echo "Option 1 - Install MongoDB locally:"
    echo "  1. Install Homebrew: /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    echo "  2. Install MongoDB: brew tap mongodb/brew && brew install mongodb-community"
    echo "  3. Start MongoDB: brew services start mongodb-community"
    echo ""
    echo "Option 2 - Use MongoDB Atlas (Cloud):"
    echo "  1. Go to https://www.mongodb.com/atlas"
    echo "  2. Create a free account and cluster"
    echo "  3. Get your connection string"
    echo "  4. Update MONGODB_URI in .env file"
    echo ""
    echo "Option 3 - Use Docker:"
    echo "  docker run -d -p 27017:27017 --name mongodb mongo:latest"
    echo ""
    echo "After setting up MongoDB, run: npm run dev"
    exit 1
else
    echo "✅ MongoDB is running on localhost:27017"
fi

echo ""
echo "🎉 All dependencies are ready!"
echo "🚀 Starting development server..."
echo ""

# Start the development server
npm run dev