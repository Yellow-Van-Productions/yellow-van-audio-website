# Quick Start Guide

## 1. Initial Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see your site.

## 2. Customize Content

Edit `src/App.tsx`:
- Replace placeholder images paths
- Update all text content
- Change the LinkedIn URL
- Update copyright information

## 3. Add Your Images

Place your images in the `public` folder:
```
public/
  images/
    hero.jpg
    profile.jpg
    logo.png
    service1.jpg
    service2.jpg
    service3.jpg
    service4.jpg
    service5.jpg
```

Then reference them in `src/App.tsx`:
```typescript
imageSrc="/images/hero.jpg"
```

## 4. Test Build

```bash
npm run build
npm run preview
```

## 5. Deploy to GitHub Pages

### First Time Setup:

```bash
# Initialize git
git init

# Create GitHub repository at github.com
# Then connect it:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Commit and push
git add .
git commit -m "Initial commit"
git push -u origin main
```

### Deploy:

**Unix/Mac:**
```bash
./deploy.sh
```

**Windows:**
```bash
deploy.bat
```

**Or use npm:**
```bash
npm run deploy
```

### Enable GitHub Pages:

1. Go to your repo on GitHub
2. Settings → Pages
3. Source: `gh-pages` branch
4. Save

Your site will be live at:
`https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

## Common Issues

### Build fails
- Make sure you have Node.js 18+ installed
- Delete `node_modules` and run `npm install` again

### Deployment fails
- Check git remote is configured
- Make sure you've committed all changes
- Verify GitHub credentials

### Images not showing
- Use relative paths: `/images/photo.jpg`
- Or import in component: `import photo from './assets/photo.jpg'`

## Need Help?

Check the full README.md for detailed instructions.
