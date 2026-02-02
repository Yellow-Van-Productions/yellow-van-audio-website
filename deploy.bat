@echo off
REM Portfolio Deployment Script for GitHub Pages (Windows)

echo Starting deployment process...

REM Check if git is initialized
if not exist .git (
    echo Error: Git repository not initialized
    echo Please run: git init
    exit /b 1
)

REM Build the project
echo Building project...
call npm run build

if %errorlevel% neq 0 (
    echo Build failed
    exit /b 1
)

echo Build successful

REM Deploy to gh-pages
echo Deploying to GitHub Pages...
call npx gh-pages -d dist

if %errorlevel% equ 0 (
    echo Deployment successful!
    echo Your site will be available at: https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
) else (
    echo Deployment failed
    exit /b 1
)
