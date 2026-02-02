# Deployment Checklist

Use this checklist to ensure a smooth deployment to GitHub Pages.

## Pre-Deployment

- [ ] Replace all placeholder content in `src/App.tsx`
- [ ] Add your actual images to the `public/images/` folder
- [ ] Update all image paths in `src/App.tsx`
- [ ] Update LinkedIn URL
- [ ] Update copyright text with your name
- [ ] Test the site locally with `npm run dev`
- [ ] Build and preview production version:
  ```bash
  npm run build
  npm run preview
  ```
- [ ] Check all sections display correctly
- [ ] Test carousel auto-rotation
- [ ] Test on mobile viewport (Chrome DevTools)
- [ ] Verify all links work

## GitHub Setup

- [ ] Create a new repository on GitHub
- [ ] Initialize git in your project:
  ```bash
  git init
  git add .
  git commit -m "Initial commit"
  ```
- [ ] Connect to GitHub:
  ```bash
  git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
  git branch -M main
  git push -u origin main
  ```

## Deployment

- [ ] Run deployment command:
  - Unix/Mac: `./deploy.sh`
  - Windows: `deploy.bat`
  - Or: `npm run deploy`
- [ ] Wait for deployment to complete
- [ ] Go to GitHub repository Settings → Pages
- [ ] Set Source to `gh-pages` branch
- [ ] Click Save
- [ ] Wait 2-5 minutes for GitHub Pages to build

## Post-Deployment

- [ ] Visit your live site: `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- [ ] Check all sections load correctly
- [ ] Test all images display
- [ ] Click all links (LinkedIn, etc.)
- [ ] Test carousel functionality
- [ ] Check on mobile device
- [ ] Share your link!

## Optional Enhancements

- [ ] Set up custom domain (see README.md)
- [ ] Add Google Analytics
- [ ] Add SEO meta tags in `index.html`
- [ ] Create custom 404 page
- [ ] Add more sections (Projects, Skills, Contact)
- [ ] Implement dark/light mode toggle

## Troubleshooting

**Images not showing after deployment:**
- Ensure images are in `public` folder
- Use paths like `/images/photo.jpg` not `./images/photo.jpg`
- Clear browser cache

**404 error on deployed site:**
- Check GitHub Pages is enabled
- Verify `gh-pages` branch exists
- Wait a few more minutes

**Build fails:**
- Check all TypeScript types are correct
- Ensure all imports are valid
- Run `npm install` again

**Carousel not working:**
- Check browser console for errors
- Verify all service images load

## Updates After Initial Deployment

To update your site after changes:

```bash
git add .
git commit -m "Update content"
git push origin main
npm run deploy
```

Your changes will be live in 2-5 minutes!
