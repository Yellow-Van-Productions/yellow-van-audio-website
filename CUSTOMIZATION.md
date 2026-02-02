# Customization Guide

Complete guide to customizing your portfolio website.

## Content Customization

### 1. Header Title

**File:** `src/App.tsx`

```typescript
<Header title="Your Portfolio Title" />
```

Change to your name or brand:
```typescript
<Header title="John Doe" />
```

### 2. Hero Section

**File:** `src/App.tsx`

```typescript
<Hero
  imageSrc="YOUR_IMAGE_PATH"
  title="Your Hero Title"
  subtitle="Your hero subtitle"
/>
```

Example:
```typescript
<Hero
  imageSrc="/images/hero-background.jpg"
  title="Full Stack Developer"
  subtitle="Building beautiful, performant web applications with modern technologies"
/>
```

### 3. Services

**File:** `src/App.tsx`

The services array must have exactly 5 items for optimal carousel display:

```typescript
const services: ServiceItem[] = [
  {
    id: 1,
    imageSrc: '/images/web-development.jpg',
    title: 'Web Development',
    description: 'Custom websites and web applications using React, TypeScript, and modern frameworks',
  },
  {
    id: 2,
    imageSrc: '/images/mobile-apps.jpg',
    title: 'Mobile Applications',
    description: 'Native and cross-platform mobile apps for iOS and Android',
  },
  // ... 3 more services
];
```

### 4. About Section

**File:** `src/App.tsx`

```typescript
<About
  profileImageSrc="/images/profile.jpg"
  logoImageSrc="/images/logo.png"
  linkedInUrl="https://www.linkedin.com/in/johndoe"
  bioText="I'm a passionate developer with 5+ years of experience..."
/>
```

Tips for bio text:
- Keep it concise (2-4 paragraphs)
- Highlight your expertise
- Mention what you're passionate about
- Include your current role or focus

### 5. Footer

**File:** `src/App.tsx`

```typescript
<Footer copyrightText={`© ${new Date().getFullYear()} Your Name. All rights reserved.`} />
```

The `new Date().getFullYear()` automatically updates the year.

## Style Customization

### Colors

**File:** `src/index.css`

Change the Material Design 3 color scheme:

```css
:root {
  /* Primary colors - your brand color */
  --md-sys-color-primary: #D0BCFF;  /* Light purple */
  --md-sys-color-on-primary: #381E72;  /* Dark purple */
  
  /* Try different colors: */
  /* Blue: #82B1FF / #004BA0 */
  /* Green: #69F0AE / #00695C */
  /* Orange: #FFAB40 / #E65100 */
  /* Pink: #FF4081 / #880E4F */
}
```

### Fonts

**File:** `index.html` and `src/index.css`

Current fonts:
- **Playfair Display** - Elegant serif for headings
- **Outfit** - Modern sans-serif for body

To change:

1. Visit [Google Fonts](https://fonts.google.com/)
2. Select your fonts
3. Update the link in `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Your+Font&display=swap" rel="stylesheet">
```
4. Update CSS variables in `src/index.css`:
```css
--font-display: 'Your Display Font', serif;
--font-body: 'Your Body Font', sans-serif;
```

### Spacing

**File:** `src/index.css`

Adjust spacing throughout the site:

```css
:root {
  --spacing-xs: 0.5rem;   /* 8px */
  --spacing-sm: 1rem;     /* 16px */
  --spacing-md: 1.5rem;   /* 24px */
  --spacing-lg: 2rem;     /* 32px */
  --spacing-xl: 3rem;     /* 48px */
  --spacing-2xl: 4rem;    /* 64px */
  --spacing-3xl: 6rem;    /* 96px */
}
```

### Animation Speed

**File:** `src/index.css`

Adjust animation durations:

```css
:root {
  --transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}
```

## Component Customization

### Carousel Auto-Scroll Timing

**File:** `src/components/Services.tsx`

Change how often the carousel advances:

```typescript
timeoutRef.current = setTimeout(() => {
  nextSlide();
}, 5000);  // Change 5000 to milliseconds you want
```

Examples:
- 3 seconds: `3000`
- 7 seconds: `7000`
- 10 seconds: `10000`

### Hero Image Overlay

**File:** `src/components/Hero.css`

Adjust the dark overlay on the hero image:

```css
.hero-overlay {
  background: linear-gradient(
    180deg,
    rgba(5, 5, 5, 0.3) 0%,    /* Top: 30% dark */
    rgba(5, 5, 5, 0.6) 50%,   /* Middle: 60% dark */
    rgba(5, 5, 5, 0.9) 100%   /* Bottom: 90% dark */
  );
}
```

For a lighter overlay:
```css
rgba(5, 5, 5, 0.2) 0%,
rgba(5, 5, 5, 0.4) 50%,
rgba(5, 5, 5, 0.6) 100%
```

### Profile Image Border

**File:** `src/components/About.css`

Change the circular profile image border color:

```css
.about-profile-container {
  border: 4px solid var(--md-sys-color-primary);
}
```

Try different colors:
```css
border: 4px solid #D0BCFF;  /* Solid color */
border: 4px solid transparent;  /* No border */
border-image: linear-gradient(45deg, #D0BCFF, #CCC2DC) 1;  /* Gradient border */
```

## Adding New Sections

### Example: Adding a Skills Section

1. Create `src/components/Skills.tsx`:
```typescript
import React from 'react';
import './Skills.css';

interface SkillsProps {
  skills: string[];
}

const Skills: React.FC<SkillsProps> = ({ skills }) => {
  return (
    <section className="skills">
      <div className="skills-container">
        <h2 className="skills-title">Skills</h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item">
              {skill}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;
```

2. Create `src/components/Skills.css`
3. Import and use in `src/App.tsx`:
```typescript
import Skills from './components/Skills';

// In the App component:
<Skills skills={['React', 'TypeScript', 'Node.js', 'Python']} />
```

## Image Optimization Tips

1. **Compress images** before adding them:
   - Use tools like TinyPNG or Squoosh
   - Target: under 500KB for photos

2. **Recommended sizes:**
   - Hero image: 1920x1080px
   - Profile image: 400x400px
   - Service images: 400x400px
   - Logo: 300x100px (or maintain aspect ratio)

3. **Formats:**
   - Photos: JPG
   - Logos/Icons: PNG or SVG
   - Use WebP for better compression (supported in modern browsers)

## SEO Customization

**File:** `index.html`

Add meta tags for SEO:

```html
<head>
  <!-- Existing tags -->
  <title>John Doe - Full Stack Developer</title>
  <meta name="description" content="Portfolio of John Doe, a full stack developer specializing in React and TypeScript">
  <meta name="keywords" content="web developer, react, typescript, portfolio">
  <meta name="author" content="John Doe">
  
  <!-- Open Graph for social sharing -->
  <meta property="og:title" content="John Doe - Full Stack Developer">
  <meta property="og:description" content="Portfolio showcasing my work and skills">
  <meta property="og:image" content="/images/og-image.jpg">
  <meta property="og:url" content="https://yourusername.github.io/your-repo">
</head>
```

## Performance Tips

1. **Lazy load images** for better performance
2. **Use WebP format** where supported
3. **Minimize animations** on slower devices
4. **Test with Lighthouse** in Chrome DevTools

## Questions?

If you need help with customization, check:
- README.md for general info
- Component files for structure
- CSS files for styling
