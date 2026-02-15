# Ezz Eldin Emad — Data Science Portfolio

A modern, responsive single-page portfolio built with **pure HTML5, CSS3, and vanilla JavaScript**. No frameworks, no build tools — ready to deploy on GitHub Pages.

![Static Site](https://img.shields.io/badge/type-static%20site-blue)
![No Dependencies](https://img.shields.io/badge/dependencies-zero-green)
![GitHub Pages](https://img.shields.io/badge/deploy-GitHub%20Pages-black)

## Features

- 🌙 Dark mode with system font stack (zero external fonts)
- 📊 Animated CSS progress bars for skills visualization
- 📱 Fully responsive (mobile, tablet, desktop)
- ✉️ Contact form via Formspree (free)
- 🔒 Honeypot spam protection
- ♿ WCAG 2.1 AA accessible (ARIA labels, keyboard nav, skip-to-content)
- 🔍 SEO optimized (Open Graph, Twitter Cards, JSON-LD)
- ⚡ Fast — no CDN dependencies, deferred JS, lazy-loaded images

## Quick Start

### Local Development

```bash
# From the project root, serve with any static server:
python3 -m http.server 8080

# Then open http://localhost:8080
```

> **Note:** You must use a local server (not `file://`) because `fetch()` is used to load `data/portfolio.json`.

## Project Structure

```
my-portfolio/
├── index.html              # Single-page HTML (semantic, SEO-optimized)
├── css/
│   ├── styles.css          # Complete design system
│   └── styles.min.css      # Minified version
├── js/
│   ├── utils.js            # Validation & helper functions
│   ├── main.js             # Section rendering, navigation, animations
│   └── contact.js          # Formspree contact form handler
├── data/
│   └── portfolio.json      # ← All your content lives here
├── assets/
│   ├── images/
│   │   ├── profile.jpg     # Your profile photo (300×300px)
│   │   ├── project1.jpg    # Project screenshot (600×400px)
│   │   ├── project2.jpg
│   │   └── project3.jpg
│   ├── resume.pdf          # Your resume/CV
│   ├── favicon.ico         # Browser tab icon (32×32px)
│   └── apple-touch-icon.png # iOS bookmark icon (180×180px)
├── README.md
└── .gitignore
```

## Content Updates

**All content is in `data/portfolio.json`.** Edit this file to update your portfolio — no code changes needed.

### Update Personal Info

```json
{
  "about": {
    "name": "Your Name",
    "title": "Your Title",
    "bio": "Your bio paragraph...",
    "email": "your@email.com",
    "github": "https://github.com/yourusername",
    "linkedin": "https://linkedin.com/in/yourusername"
  }
}
```

### Add a New Project

Add an object to the `"projects"` array:

```json
{
  "title": "My New Project",
  "description": "What this project does...",
  "technologies": ["Python", "Pandas", "Matplotlib"],
  "github_url": "https://github.com/you/project",
  "demo_url": null,
  "image": "assets/images/project4.jpg"
}
```

Then add the screenshot image to `assets/images/`.

### Update Skills

Edit the `"skills"` object. Each category contains an array of skills:

```json
{
  "skills": {
    "Category Name": [
      {
        "name": "Skill Name",
        "proficiency": 80,
        "icon": "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg"
      }
    ]
  }
}
```

- `proficiency`: 0–100 (controls progress bar width)
- `icon`: URL to a skill icon (optional — from [devicons](https://devicon.dev/))

### Add Education / Experience / Certifications

Follow the existing patterns in `portfolio.json`. Each section has inline `_comment` fields explaining the format.

## Image Requirements

| Image | Size | Format | Notes |
|-------|------|--------|-------|
| `profile.jpg` | 300×300px | JPG/PNG | Square, professional headshot |
| `project*.jpg` | 600×400px | JPG/PNG | Project screenshot or preview |
| `favicon.ico` | 32×32px | ICO/SVG | Browser tab icon |
| `apple-touch-icon.png` | 180×180px | PNG | iOS/Android bookmark icon |
| `resume.pdf` | — | PDF | Your CV/resume for download |

> **Tip:** Compress images with [Squoosh](https://squoosh.app/) or [TinyPNG](https://tinypng.com/) for faster load times.

## Contact Form Setup

### Option 1: Formspree (Recommended)

1. Create a free account at [formspree.io](https://formspree.io)
2. Create a new form (you'll get an endpoint like `https://formspree.io/f/xyzabcde`)
3. Open `js/contact.js`
4. Replace `YOUR_FORM_ID` with your form ID:

```javascript
var FORMSPREE_ID = 'xyzabcde'; // ← Your ID here
```

That's it! Free tier: 50 submissions/month.

### Option 2: EmailJS (Alternative)

1. Sign up at [emailjs.com](https://www.emailjs.com/)
2. Create an email service + template
3. Replace the Formspree `fetch()` in `js/contact.js` with:

```javascript
// Add EmailJS SDK to index.html:
// <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', {
  from_name: formData.name,
  from_email: formData.email,
  subject: formData.subject,
  message: formData.message
}).then(function() {
  showFormStatus('Message sent!', 'success');
}).catch(function(err) {
  showFormStatus('Failed to send.', 'error');
});
```

## Deploy to GitHub Pages

### Step-by-step

1. **Create a GitHub repository** named `yourusername.github.io` (for a user site) or any name (for a project site)

2. **Push your code:**

```bash
cd my-portfolio
git init
git add .
git commit -m "Initial portfolio site"
git branch -M main
git remote add origin https://github.com/yourusername/yourusername.github.io.git
git push -u origin main
```

1. **Enable GitHub Pages:**
   - Go to: Repository → Settings → Pages
   - Source: **Deploy from a branch**
   - Branch: **main**, folder: **/ (root)**
   - Click **Save**

2. Your site will be live at `https://yourusername.github.io` within a few minutes!

### Custom Domain (Optional)

1. In repository Settings → Pages, enter your custom domain
2. Add a `CNAME` file to the project root containing your domain
3. Configure DNS with your domain registrar:
   - `A` record: `185.199.108.153` (GitHub IPs)
   - `CNAME` record: `yourusername.github.io`

## Browser Support

- Chrome 80+
- Firefox 78+
- Safari 13.1+
- Edge 80+
- Mobile Safari / Chrome (iOS/Android)

## Accessibility

- Skip-to-content link for keyboard users
- ARIA labels on all interactive elements
- Focus indicators (`:focus-visible`)
- `prefers-reduced-motion` support
- Screen reader friendly semantic HTML
- High contrast mode support

## 📋 How to Reorder Sections

Your portfolio sections are controlled by `data/sections-config.json`.

### Current Order (Your Preferred — CV-Based)

1. **Hero** — Landing page
2. **About** — Brief summary
3. **Education** — Academic background (HR recommended: first for students)
4. **Experience** — Work history
5. **Projects** — Portfolio work
6. **Skills** — Technical abilities
7. **Certifications** — Courses & certificates
8. **Contact** — Get in touch

### To Change Section Order

1. Open `data/sections-config.json`.
2. Find the section you want to move.
3. Change the `"order"` number.
4. Save and refresh the page.

**Example:** Move Projects to position 3 (before Education):

```json
// Change from:
{"id": "education", "order": 3}
{"id": "experience", "order": 4}
{"id": "projects", "order": 5}

// To:
{"id": "projects", "order": 3}
{"id": "education", "order": 4}
{"id": "experience", "order": 5}
```

### Hide/Show Sections

- **Hide completely:** Set `"enabled": false`
- **Hide from menu only:** Set `"showInNav": false`

### Alternative Order Available

There is an alternative ordering in `data/sections-config.recommended.json` that prioritizes Projects over Education (more engaging for web browsing).

- This file is for **local reference only** (not tracked in Git).
- To use it, copy its content into `data/sections-config.json`.

---

## 🎨 Favicon

The site uses a custom "Ez" monogram favicon.

- Source: `assets/favicon.svg`
- Generated files: `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`, `apple-touch-icon.png`

**To update the favicon:**

1. Modify `assets/favicon.svg`.
2. Use a tool like [RealFaviconGenerator.net](https://realfavicongenerator.net) to generate the new files.
3. Replace the files in the `assets/` folder.

## License

MIT License
