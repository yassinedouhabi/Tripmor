---
name: tripmor-frontend
description: "Tripmor frontend development skill for building the tourist transport marketplace. Use this skill whenever building, editing, or styling any frontend component, page, layout, or UI element for the Tripmor project. This includes: creating Next.js pages or components, writing Tailwind CSS, building forms, designing cards/grids/tables, implementing responsive layouts, creating dashboard interfaces (admin, provider, tourist), building the public-facing booking flow, or making any visual/UI changes. Always use this skill when touching anything in app/, components/, or globals.css. Even for small UI tweaks, consult this skill first to maintain consistency."
---

# Tripmor Frontend Skill

This skill defines how every frontend element in Tripmor should be built. Follow these rules for every component, page, and layout. No exceptions.

## Design Philosophy

Tripmor follows an **ultra-minimal, soft, app-like** aesthetic. Clean surfaces, generous whitespace, subtle borders, and rounded containers. The design feels light, calm, and trustworthy — like a well-made mobile app scaled to desktop.

Every UI decision should feel:

- **Minimal** — remove everything that isn't essential. When in doubt, leave it out.
- **Soft** — rounded corners, light backgrounds, subtle borders. Nothing harsh.
- **Spacious** — generous padding and whitespace. Sections breathe. Content never feels cramped.
- **Clear** — obvious hierarchy. Serif headings for impact, clean sans-serif body for readability.

**Design patterns from reference:**
- Soft rounded containers with subtle borders (`rounded-2xl border border-neutral-100`)
- Light gray surface backgrounds (`#F5F5F5` / `bg-neutral-50`) instead of bold dark sections
- Pill-shaped buttons with solid fills (black for primary, outlined for secondary)
- Icon cards with rounded backgrounds for quick actions / categories
- Minimal nav — clean, no heavy styling
- Cards with very subtle shadows or just borders — never heavy drop shadows
- Form inputs with rounded corners, light borders, clean labels above
- Very little color — coral accent appears ONLY on primary CTAs, active states, and highlights. Everything else is black, white, and gray.

**Never:**
- Bold dark/black section backgrounds on public pages
- Heavy shadows or elevation
- Dense layouts or cramped spacing
- Excessive use of the coral accent — it should feel like a pop, not a theme
- Busy backgrounds, patterns, or textures
- Generic SaaS template look

## Brand Tokens

```
Primary:       #000000 (Black)          — Headings, primary buttons, key text
Primary Soft:  #1A1A1A                  — Body text

Accent:        #FF4405 (Orange Coral)   — Primary CTAs only (Book Now, Get Started, Sign In)
Accent Hover:  #E63D04                  — Hover state for coral buttons
Accent Light:  #FFF1EC                  — Subtle highlight backgrounds, active tab tint

Neutral 900:   #111111                  — Headings, bold text
Neutral 700:   #444444                  — Body text
Neutral 500:   #888888                  — Secondary text, descriptions
Neutral 400:   #AAAAAA                  — Placeholder text
Neutral 200:   #E8E8E8                  — Borders, dividers
Neutral 100:   #F5F5F5                  — Surface/card backgrounds, input backgrounds
Neutral 50:    #FAFAFA                  — Page section backgrounds (barely visible)

Background:    #FFFFFF                  — Primary page background
Surface:       #F5F5F5                  — Cards, containers, input fields

Success:       #059669                  — Approved, confirmed, paid
Error:         #DC2626                  — Rejected, failed, errors  
Warning:       #D97706                  — Pending states

White:         #FFFFFF                  — Card surfaces on tinted backgrounds
```

### Tailwind Config — Custom Colors

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#FFF1EC',
          100: '#FFE0D4',
          200: '#FFC1A9',
          300: '#FF9B73',
          400: '#FF6B3D',
          500: '#FF4405',   // Primary accent
          600: '#E63D04',
          700: '#CC3604',
          800: '#992808',
          900: '#661B05',
        },
      },
    },
  },
};
```

### Typography

- **Display font:** DM Serif Display (loaded via `next/font/google`) — for hero headlines, section titles, large headings
- **Body font:** Inter (loaded via `next/font/google`) — for everything else
- **Loading fonts in layout.js:**

```jsx
import { DM_Serif_Display, Inter } from "next/font/google";

const serif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-serif" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

// Apply to <body>:
<body className={`${serif.variable} ${sans.variable} font-sans`}>
```

- **Hero headlines:** `font-serif text-4xl md:text-5xl lg:text-6xl` — serif, large but not overwhelming
- **Section titles:** `font-serif text-2xl md:text-3xl` — serif, clean
- **Card headings:** `font-sans text-lg font-bold` — sans-serif, bold
- **Subheadings:** `font-sans text-base font-semibold` — sans-serif
- **Body:** `font-sans text-base text-neutral-700` (16px)
- **Secondary text:** `font-sans text-sm text-neutral-500`
- **Labels:** `font-sans text-sm font-medium text-neutral-900` — clean labels above form fields
- **Overlines (sparingly):** `font-sans text-xs uppercase tracking-widest text-neutral-400` — subtle, gray, not coral
- **Stats numbers:** `font-serif text-3xl md:text-4xl` — serif for impact

### Spacing System

Use Tailwind's default scale consistently:
- **Section padding:** py-16 md:py-24 (public pages), p-6 md:p-8 (dashboards)
- **Card padding:** p-5 md:p-6
- **Between elements:** space-y-4 or gap-4
- **Between sections:** space-y-0 (sections handle their own padding)
- **Max content width:** max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

### Container & Card Patterns

Cards and containers are the core UI element. They should feel like soft, floating surfaces:

```jsx
// Standard card — soft border, rounded, white on white pages
<div className="rounded-2xl border border-neutral-100 bg-white p-6">

// Card on tinted background — white surface on neutral-50 page
<div className="rounded-2xl bg-white p-6 shadow-sm">

// Highlighted/active card — subtle coral tint
<div className="rounded-2xl border border-coral-100 bg-coral-50 p-6">

// Input-style container — like the form fields in the reference
<div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3">

// Icon action card — for quick action grids (like the Notes reference)
<div className="flex flex-col items-center gap-2 rounded-2xl border border-neutral-100 bg-neutral-50 p-6">
  <div className="rounded-xl bg-white p-3">
    <Icon className="h-6 w-6 text-neutral-700" />
  </div>
  <span className="text-sm font-medium text-neutral-700">Label</span>
</div>
```

## Next.js App Router Patterns

Read `references/nextjs-patterns.md` for detailed patterns. Key rules:

### Server vs Client Components

- **Default to Server Components** — every component is a server component unless it needs interactivity
- **Add `"use client"` only when:** using useState, useEffect, onClick, onChange, or browser APIs
- **Never put `"use client"` on:** pages that only display data, layout.js, loading.js, error.js

### File Conventions

```
app/
  page.js          → Server component (default)
  layout.js        → Server component (wraps children)
  loading.js       → Suspense fallback (skeleton UI)
  error.js         → Error boundary ("use client" required)
  not-found.js     → 404 page
```

### Data Fetching

- **Server components:** Fetch directly with `async/await` (no useEffect)
- **Client components:** Use `fetch` in useEffect or a library like SWR
- **API calls from server components:** Call MongoDB directly via lib functions, don't call your own API routes
- **API routes:** Only for external consumers (Stripe webhooks, client-side fetches)

### Route Groups & Layouts

```
app/
  (public)/              → Public pages share a layout with Navbar + Footer
    layout.js
    page.js              → Homepage
    trips/page.js
    about/page.js
  (auth)/                → Auth pages have a centered card layout
    layout.js
    login/page.js
    register/page.js
  (dashboard)/           → Dashboard pages share sidebar layout
    provider/layout.js
    admin/layout.js
```

## Component Architecture

Read `references/component-guide.md` for full patterns. Key rules:

### File Structure

```
components/
  ui/                → Reusable primitives (Button, Input, Badge, Modal)
  layout/            → Navbar, Footer, WhatsAppButton, Sidebar
  trips/             → Trip-specific (TripCard, TripGrid, TripFilter)
  booking/           → Booking flow (BookingForm, BookingSummary)
  home/              → Homepage sections (HeroSection, CategoryCards)
  provider/          → Provider dashboard components
  admin/             → Admin dashboard components
```

### Component Rules

1. **One component per file** — named export matching filename
2. **Props:** Destructure in function signature, provide defaults
3. **No prop drilling beyond 2 levels** — use composition or context
4. **Export:** Use `export default function ComponentName()`
5. **Naming:** PascalCase for components, camelCase for utilities

### Component Template

```jsx
// components/trips/TripCard.jsx
import Image from "next/image";
import Link from "next/link";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/trips/StarRating";

export default function TripCard({ trip }) {
  const { title, slug, images, price, duration, departureCity, averageRating, category } = trip;

  return (
    <Link href={`/trips/${slug}`} className="group block">
      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white transition-shadow hover:shadow-md">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <Badge className="absolute left-3 top-3">{category}</Badge>
        </div>
        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-neutral-900 line-clamp-1">{title}</h3>
          <p className="mt-1 text-sm text-neutral-500">{departureCity} · {duration}</p>
          <div className="mt-3 flex items-center justify-between">
            <StarRating rating={averageRating} size="sm" />
            <p className="font-semibold text-neutral-900">
              {price} <span className="text-sm font-normal text-neutral-500">MAD</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
```

### UI Primitives

Every primitive component in `components/ui/` must:
- Accept a `className` prop and merge it with defaults
- Use `forwardRef` if it wraps a native element
- Support all relevant HTML attributes via `...props` spread

**Button variants:**

```jsx
// Primary CTA (Book Now, Get Started, Sign In) — BLACK pill
<button className="rounded-full bg-black px-8 py-3 font-semibold text-white transition-colors hover:bg-neutral-800">

// Coral CTA (used sparingly — main hero action, payment) — CORAL pill
<button className="rounded-full bg-coral-500 px-8 py-3 font-semibold text-white transition-colors hover:bg-coral-600">

// Secondary (Cancel, Back, alternative actions) — Outlined pill
<button className="rounded-full border border-neutral-200 bg-white px-8 py-3 font-semibold text-neutral-900 transition-colors hover:bg-neutral-50">

// Danger (Delete, Reject)
<button className="rounded-full bg-red-600 px-8 py-3 font-semibold text-white transition-colors hover:bg-red-700">

// Ghost (subtle actions, links)
<button className="rounded-full px-6 py-2 text-sm font-medium text-neutral-500 transition-colors hover:bg-neutral-50 hover:text-neutral-900">

// Tab-style button pair (like Sign In / Sign Up toggle in reference)
<div className="flex gap-0 rounded-full border border-neutral-200 p-1">
  <button className="rounded-full bg-white px-6 py-2 text-sm font-semibold text-neutral-900 shadow-sm">Active</button>
  <button className="rounded-full px-6 py-2 text-sm font-medium text-neutral-400">Inactive</button>
</div>
```

**Note:** Primary action is BLACK by default. Coral is reserved for the most important conversion action on the page (Book Now on trip detail, Get Started on hero). Do not overuse coral.

**Status Badges:**

```jsx
// Approved / Paid / Confirmed
<span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">

// Pending
<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">

// Rejected / Cancelled / Failed
<span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">

// Featured / Highlighted
<span className="rounded-full bg-coral-50 px-3 py-1 text-xs font-medium text-coral-600">
```

## Responsive Design

**Mobile-first. Always.** Write the mobile layout first, then add `sm:`, `md:`, `lg:` breakpoints.

### Breakpoint Usage

```
Default (0px)     → Mobile phones (single column, stacked, full width)
sm: (640px)       → Large phones (minor tweaks)
md: (768px)       → Tablets (2-column grids, side padding)
lg: (1024px)      → Desktop (3-4 column grids, sidebar layouts)
xl: (1280px)      → Large desktop (max-width containers)
```

### Grid Patterns

```jsx
// Trip listing grid
<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

// Category cards (homepage)
<div className="grid grid-cols-2 gap-4 md:grid-cols-4">

// Dashboard stats
<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">

// Two-column form layout
<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
```

### Navigation

- **Mobile:** Hamburger menu with slide-out drawer (use `"use client"`)
- **Desktop:** Horizontal nav with links
- **Dashboard:** Collapsible sidebar on mobile, fixed sidebar on desktop

## Page-Specific Patterns

### Public Pages (Tourist-facing) — Soft & Minimal

Public pages use white and light gray backgrounds. No dark sections. Sections are separated by subtle background color shifts.

```jsx
// PATTERN: Soft alternating sections
<section className="bg-white py-16 md:py-24">             {/* White section */}
<section className="bg-neutral-50 py-16 md:py-24">        {/* Barely tinted section */}
<section className="bg-white py-16 md:py-24">             {/* White section */}
```

- **Section title:** Serif font, left or center aligned, no overline labels
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- WhatsApp floating button always visible

```jsx
// Section title pattern — clean and minimal
<h2 className="font-serif text-2xl md:text-3xl">Explore by city</h2>
<p className="mt-2 text-neutral-500">Find trips across Morocco's most popular destinations</p>
```

### Stats Row Pattern

Clean serif numbers, no background cards:

```jsx
<div className="grid grid-cols-2 gap-8 md:grid-cols-4">
  <div className="text-center">
    <p className="font-serif text-3xl md:text-4xl">350+</p>
    <p className="mt-1 text-sm text-neutral-500">Transport providers</p>
  </div>
</div>
```

### Dashboard Pages (Provider & Admin)

- Sidebar layout: sidebar (w-64) + main content area
- Top bar with breadcrumbs and user info
- Content area: `p-6 md:p-8`, background `bg-neutral-50`
- Tables with horizontal scroll on mobile
- Cards: `bg-white rounded-2xl border border-neutral-100 p-6`
- Dashboard uses `rounded-xl` buttons (not pill) for a structured feel

### Auth Pages (Login / Register)

Follow the Notes reference closely — centered, minimal, app-like:

```jsx
// Auth layout — centered card
<div className="flex min-h-screen items-center justify-center bg-white px-4">
  <div className="w-full max-w-sm">
    {/* Logo */}
    <div className="mb-8 text-center">
      <h1 className="font-serif text-2xl">Tripmor</h1>
      <p className="mt-2 text-sm text-neutral-500">Book tourist transport across Morocco</p>
    </div>
    {/* Tab toggle (Sign In / Sign Up) */}
    <div className="flex gap-0 rounded-full border border-neutral-200 p-1 mb-6">
      <button className="flex-1 rounded-full bg-white py-2 text-sm font-semibold shadow-sm">Sign In</button>
      <button className="flex-1 rounded-full py-2 text-sm font-medium text-neutral-400">Sign Up</button>
    </div>
    {/* Form */}
    <form className="space-y-4">
      <Input label="Email Address" placeholder="Enter your email" />
      <Input label="Password" type="password" placeholder="Enter your password" />
      <button className="w-full rounded-full bg-black py-3 font-semibold text-white">Sign In</button>
    </form>
  </div>
</div>
```

### Forms

- Labels: `text-sm font-medium text-neutral-900 mb-1.5`
- Inputs: `w-full rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-coral-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-coral-500`
- Error messages: `text-sm text-red-600 mt-1`
- Submit buttons: Black pill for most forms, coral pill only for payment/booking
- Group related fields, use `space-y-4` between field groups
- Inputs have a tinted `bg-neutral-50` background that clears to white on focus

## Performance Rules

1. **Images:** Always use `next/image` with `sizes` prop. Never `<img>` tags.
2. **Fonts:** Load DM Serif Display + Inter via `next/font/google` in root layout. Never CDN links.
3. **Icons:** Use `lucide-react` — import only the icons you need.
4. **Code splitting:** Dynamic import for heavy components: `const Map = dynamic(() => import("./Map"), { ssr: false })`
5. **Loading states:** Every page with data fetching must have a `loading.js` with skeleton UI.
6. **No unused imports.** No commented-out code. No console.logs in production.

## Accessibility

1. All images: meaningful `alt` text (not "image" or "photo")
2. All interactive elements: focusable and keyboard-navigable
3. Buttons: Never use `<div onClick>`. Always `<button>` or `<a>`.
4. Form inputs: Always associated `<label>` element
5. Color contrast: Minimum 4.5:1 ratio for text
6. ARIA labels on icon-only buttons: `aria-label="Open menu"`
7. Focus ring: `focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2`

## Code Style

### Imports Order

```jsx
// 1. React / Next.js
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// 2. Third-party libraries
import { Star, MapPin, Clock } from "lucide-react";

// 3. Internal: lib / utils
import { formatPrice } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";

// 4. Internal: components
import Button from "@/components/ui/Button";
import TripCard from "@/components/trips/TripCard";
```

### Naming Conventions

```
Files:          PascalCase.jsx (components), camelCase.js (utils/lib)
Components:     PascalCase      — TripCard, BookingForm, HeroSection
Functions:      camelCase        — formatPrice, calculateCommission
Constants:      UPPER_SNAKE      — CATEGORIES, MOROCCAN_CITIES
CSS classes:    Tailwind only    — no custom CSS classes unless absolutely necessary
API routes:     route.js         — Next.js convention
```

### Path Aliases

Always use `@/` prefix for imports from project root:
```jsx
import Button from "@/components/ui/Button";    // ✅
import Button from "../../../components/ui/Button";  // ❌
```

## Anti-Patterns (Never Do These)

- ❌ Inline styles (`style={{ color: "red" }}`) — use Tailwind
- ❌ CSS modules or styled-components — use Tailwind
- ❌ `useEffect` for data fetching in server components
- ❌ `"use client"` on every component
- ❌ Fetching your own API routes from server components
- ❌ Hardcoded colors or spacing values — use Tailwind scale
- ❌ `<img>` tags — use `next/image`
- ❌ `<a>` tags for internal links — use `next/link`
- ❌ Generic placeholder text ("Lorem ipsum")
- ❌ Placeholder gray boxes for images — use Unsplash photos (see Unsplash section below)
- ❌ Giant monolithic components — split at 150 lines
- ❌ Props drilling more than 2 levels deep
- ❌ Tailwind `@apply` in CSS — compose classes in JSX instead
- ❌ Teal, blue, or purple color schemes — this project uses black + coral
- ❌ Bold dark/black background sections on public pages — keep it light and airy
- ❌ Heavy shadows (shadow-md, shadow-lg) — use shadow-sm or borders only
- ❌ Gradients of any kind
- ❌ Dense, information-heavy layouts — keep it spacious
- ❌ Overusing the coral accent — it's for CTAs only, not decoration
- ❌ Using sans-serif for hero headlines — always use font-serif for display text
- ❌ Sharp corners on cards (rounded-lg or less) — use rounded-xl or rounded-2xl
- ❌ Generic "SaaS template" or "admin dashboard template" aesthetics

## Unsplash Image Integration

Tripmor uses **Unsplash** for all trip, city, hero, and category images. Never use gray placeholders or dummy URLs. Every image should feel like real Morocco.

### How to Use Unsplash Images

Use the Unsplash Source URL format for quick, free, no-API-key images:

```
https://images.unsplash.com/photo-{PHOTO_ID}?auto=format&fit=crop&w={WIDTH}&q=80
```

### Usage with next/image

```jsx
<Image
  src="https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80"
  alt="Marrakech medina streets"
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### next.config.js — Required Image Domain

Add Unsplash to allowed image domains:

```javascript
// next.config.js
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",  // for provider-uploaded images later
      },
    ],
  },
};
module.exports = nextConfig;
```

### Curated Photo Library

Read `references/unsplash-library.md` for a full curated library of Morocco-specific Unsplash photo IDs organized by city, category, and use case. Always pick from this library first before searching for new photos.

### Image Size Guidelines

| Context            | Width | Aspect Ratio | Example                          |
|--------------------|-------|--------------|----------------------------------|
| Hero section       | 1920  | 16:9         | Full-width background            |
| Trip card          | 800   | 4:3          | Card thumbnail                   |
| Trip detail gallery| 1200  | 16:9         | Detail page carousel             |
| City showcase      | 600   | 1:1          | Square city card                 |
| Category card      | 400   | 4:3          | Small category thumbnail         |
| Provider logo      | 200   | 1:1          | Circular avatar                  |

### Image Loading Pattern

Always use blur placeholder for better UX:

```jsx
// For static/known images (hero, categories)
<Image
  src={unsplashUrl}
  alt="Description"
  fill
  className="object-cover"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFAABAAAAAAAAAAAAAAAAAAAABv/EAB8QAAICAgIDAQAAAAAAAAAAAAECAwQABREhEjFBUf/EABQBAQAAAAAAAAAAAAAAAAAAAAD/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCp5LdvI1a0Uk0kMUkxijZ2IVQSdAE+gNnGMB//2Q=="
  sizes="(max-width: 768px) 100vw, 50vw"
/>

// For dynamic images (trip cards with data)
<Image
  src={trip.images[0] || "/images/placeholder-trip.jpg"}
  alt={trip.title}
  fill
  className="object-cover"
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
/>
```

### Fallback Strategy

1. **Trip images from providers** → Cloudinary URLs (uploaded by provider)
2. **Default/seed images** → Unsplash curated library
3. **Missing image fallback** → `/public/images/placeholder-trip.jpg` (a generic Morocco landscape from Unsplash, saved locally)

Always provide a local fallback. Never let a broken image show.

## Reference Files

For deeper patterns, read these files in `references/`:

- `references/nextjs-patterns.md` — Detailed Next.js App Router patterns, data fetching, caching, middleware
- `references/component-guide.md` — Full component library with code examples for every UI primitive and composite component
