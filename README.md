# Portfolio Website

A modern, dark-themed one-page portfolio website built with React, TypeScript, and Vite. Features Material Design 3 theming and smooth animations.

## Features

- **Header**: Fixed header with gradient title
- **Hero Section**: Full-screen hero with image overlay and text
- **Services Carousel**: Auto-rotating infinite carousel with 5 service items
- **About Section**: Profile image (circular), logo, LinkedIn link, and bio
- **Footer**: Simple copyright notice
- **Material Design 3**: Dark theme with sophisticated color palette
- **Responsive**: Mobile-first design that works on all devices
- **Animations**: Smooth fade-in and slide animations

## Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)
- Git

## Installation

1. Clone or download this repository
2. Navigate to the project directory:
```bash
cd portfolio-site
```

3. Install dependencies:
```bash
npm install
```

## Development

Run the development server:

```bash
npm run dev
```

The site will be available at `http://localhost:5173`

## Customization

### Replace Placeholder Content

Edit `src/App.tsx` to replace placeholder content with your actual data:

1. **Header Title**: Change `"Your Portfolio Title"`
2. **Hero Section**: 
   - Replace `imageSrc` with your hero image path
   - Update `title` and `subtitle`
3. **Services**: Modify the `services` array with your 5 services:
   ```typescript
   {
     id: 1,
     imageSrc: '/path/to/your/image.jpg',
     title: 'Your Service Title',
     description: 'Your service description'
   }
   ```
4. **About Section**:
   - `profileImageSrc`: Your profile photo
   - `logoImageSrc`: Your logo
   - `linkedInUrl`: Your LinkedIn profile URL
   - `bioText`: Your biography
5. **Footer**: Update copyright text with your name

### Adding Your Images

Place your images in the `public` folder and reference them like:
```typescript
imageSrc="/images/hero.jpg"
```

Or use the `src/assets` folder and import them:
```typescript
import heroImage from './assets/hero.jpg'
```

### Customizing Colors

Edit `src/index.css` to change the Material Design 3 color variables:
- `--md-sys-color-primary`: Primary brand color
- `--md-sys-color-secondary`: Secondary brand color
- `--md-sys-color-surface`: Surface backgrounds
- And more...

### Customizing Fonts

The site uses:
- **Display**: Playfair Display (headings)
- **Body**: Outfit (body text)

To change fonts, update the Google Fonts link in `index.html` and the CSS variables in `src/index.css`.

## Building for Production

Build the optimized production version:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment to GitHub Pages

### Initial Setup

1. Create a new repository on GitHub
2. Initialize git in your project (if not already done):
```bash
git init
git add .
git commit -m "Initial commit"
```

3. Add your GitHub repository as remote:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### Deploy

Run the deployment script:

```bash
npm run deploy
```

This will:
1. Build your project
2. Deploy to the `gh-pages` branch
3. Make your site available at `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`

### Configure GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** → **Pages**
3. Under **Source**, select the `gh-pages` branch
4. Click **Save**

Your site will be live in a few minutes!

### Custom Domain (Optional)

To use a custom domain:

1. Create a file named `CNAME` in the `public` folder with your domain:
```
yourdomain.com
```

2. Configure your domain's DNS settings to point to GitHub Pages
3. Redeploy: `npm run deploy`

## Project Structure

```
portfolio-site/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── About.tsx
│   │   └── Footer.tsx
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── index.css       # Global styles
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── vite.config.ts      # Vite config
```

## Technologies Used

- **React 18**: UI framework
- **TypeScript**: Type-safe JavaScript
- **Vite 6**: Fast build tool
- **Material Design 3**: Design system
- **Google Fonts**: Playfair Display & Outfit
- **gh-pages**: Deployment tool

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT License - feel free to use this template for your portfolio!

## Support

For issues or questions, create an issue in the GitHub repository.
