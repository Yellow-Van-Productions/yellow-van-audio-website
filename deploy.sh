#!/bin/bash

# Yellow Van Audio Deployment Script for GitHub Pages

echo "🚀 Starting deployment process..."

# Check if git is initialized
if [ ! -d .git ]; then
    echo "❌ Error: Git repository not initialized"
    echo "Please run: git init"
    exit 1
fi

# Check if remote is set
if ! git remote | grep -q 'origin'; then
    echo "❌ Error: Git remote 'origin' not set"
    echo "Please run: git remote add origin YOUR_REPO_URL"
    exit 1
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Deploy to gh-pages
echo "🌐 Deploying to GitHub Pages..."
npx gh-pages -d dist

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🎉 Your site will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/"
else
    echo "❌ Deployment failed"
    exit 1
fi
