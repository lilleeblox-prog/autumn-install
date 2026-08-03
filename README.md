# Made to Welcome — Shopify Theme

A complete Shopify Liquid theme matching the Made to Welcome brand: cream background, terracotta primary, dusty sage secondary, Fraunces serif + IBM Plex Mono + Work Sans.

---

## Pages included

| URL handle | Template used | Purpose |
|---|---|---|
| `/` | `index.json` | Homepage — hero, how it works, gallery, season cards, dark CTA |
| `/pages/fall` | `page.fall.json` | Fall 2026 — full-bleed hero, content, waitlist form |
| `/pages/winter` | `page.winter.json` | Winter — coming soon + notification form |
| `/pages/summer` | `page.summer.json` | Summer — coming soon + notification form |
| `/pages/contact` | `page.contact.json` | Contact — form goes to your Shopify inbox |

---

## How to upload to Shopify

1. **Create a Shopify account** at shopify.com (free 3-day trial, then from $39/mo)
2. In your Shopify admin, go to **Online Store → Themes**
3. Click **Add theme → Upload zip file**
4. Upload `made-to-welcome-theme.zip`
5. Click **Customize** to add your images in the theme editor

---

## After uploading — first things to set up

### Add your images (Theme Editor)
- **Homepage hero**: Customize → Hero Home → upload `hero-doorway.jpg`
- **Fall hero**: Customize → Fall Hero → upload `hero-fall.png`
- **Gallery photos**: Customize → Gallery → upload `portfolio-fall-1.png`, `portfolio-fall-2.png`, `portfolio-fall-3.png`
- **OG image**: Theme Settings → Social & SEO → upload `hero-doorway.jpg`

### Create the pages in Shopify admin
Go to **Online Store → Pages** and create these pages with the exact handles shown:

| Page title | Handle (URL) | Template |
|---|---|---|
| Fall | `fall` | `page.fall` |
| Winter | `winter` | `page.winter` |
| Summer | `summer` | `page.summer` |
| Contact | `contact` | `page.contact` |

### Where form submissions go
All waitlist and contact forms use Shopify's built-in contact form. Submissions arrive in your **Shopify admin → Orders → Contact** inbox and are also forwarded to your store email. No third-party app needed.

---

## File structure

```
shopify-theme/
├── assets/
│   ├── theme.css        ← all styles
│   └── theme.js         ← gallery, mobile nav, hero form toggle
├── config/
│   ├── settings_schema.json
│   └── settings_data.json
├── layout/
│   └── theme.liquid     ← main HTML wrapper, fonts, meta tags
├── locales/
│   └── en.default.json
├── sections/
│   ├── header.liquid
│   ├── footer.liquid
│   ├── hero-home.liquid
│   ├── how-it-works.liquid
│   ├── gallery.liquid
│   ├── season-cards.liquid
│   ├── cta-dark.liquid
│   ├── fall-hero.liquid
│   ├── fall-content.liquid
│   ├── fall-form.liquid
│   ├── coming-soon.liquid  ← used by both winter + summer
│   ├── contact-form.liquid
│   └── main-page.liquid
└── templates/
    ├── index.json
    ├── page.fall.json
    ├── page.winter.json
    ├── page.summer.json
    ├── page.contact.json
    └── page.json
```
