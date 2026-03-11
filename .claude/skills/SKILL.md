---
name: tripmor-frontend
description: "Tripmor frontend development skill for building the tourist transport marketplace. Use this skill whenever building, editing, or styling any frontend component, page, layout, or UI element for the Tripmor project. This includes: creating Next.js pages or components, writing Tailwind CSS, building forms, designing cards/grids/tables, implementing responsive layouts, creating dashboard interfaces (admin, provider, tourist), building the public-facing booking flow, or making any visual/UI changes. Always use this skill when touching anything in app/, components/, or globals.css. Even for small UI tweaks, consult this skill first to maintain consistency."
---

# Tripmor Frontend Skill

This skill defines how every frontend element in Tripmor should be built. Follow these rules for every component, page, and layout. No exceptions.

## Design Philosophy

Tripmor follows a **clean, minimal, professional** aesthetic inspired by Airbnb and Stripe. Every UI decision should feel:

- **Trustworthy** — tourists are paying money, the site must feel safe
- **Simple** — tourists from any country should understand the UI instantly
- **Fast** — mobile-first, no bloat, no unnecessary animations
- **Consistent** — every page feels like the same product

**Never:** Overuse gradients, add decorative clutter, use generic stock-photo hero sections, create flashy animations, or make it feel like a template.

## Brand Tokens

```
Primary:       #0F766E (Deep Teal)     — Headers, nav, links, trust elements
Primary Light: #CCFBF1 (Teal 100)     — Backgrounds, hover states, badges
Primary Dark:  #134E4A (Teal 900)     — Dark text on teal backgrounds

Accent:        #F59E0B (Amber)         — CTAs, Book Now buttons, price highlights, stars
Accent Light:  #FEF3C7 (Amber 100)    — Warning badges, highlight backgrounds
Accent Dark:   #B45309 (Amber 700)    — Hover state for accent buttons

Neutral:       #111827 (Gray 900)      — Body text
Neutral Mid:   #6B7280 (Gray 500)     — Secondary text, placeholders
Neutral Light: #F9FAFB (Gray 50)      — Page backgrounds, alternating rows
Border:        #E5E7EB (Gray 200)      — Borders, dividers, card outlines

Success:       #059669                  — Approved, confirmed, paid
Error:         #DC2626                  — Rejected, failed, errors
Warning:       #D97706                  — Pending states

White:         #FFFFFF                  — Cards, modals, inputs
```

### Typography

- **Font:** Inter (loaded via `next/font/google`, set in layout.js)
- **Headings:** font-semibold or font-bold, never font-black
- **Body:** text-base (16px), text-gray-900
- **Secondary text:** text-sm, text-gray-500
- **Small/labels:** text-xs, text-gray-500, uppercase tracking-wide (sparingly)

### Spacing System

Use Tailwind's default scale consistently:
- **Section padding:** py-16 md:py-24 (public pages), p-6 md:p-8 (dashboards)
- **Card padding:** p-4 md:p-6
- **Between elements:** space-y-4 or gap-4
- **Between sections:** space-y-16 or mt-16
- **Max content width:** max-w-7xl mx-auto px-4 sm:px-6 lg:px-8

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
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md">
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
          <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
          <p className="mt-1 text-sm text-gray-500">{departureCity} · {duration}</p>
          <div className="mt-3 flex items-center justify-between">
            <StarRating rating={averageRating} size="sm" />
            <p className="font-semibold text-teal-700">
              {price} <span className="text-sm font-normal text-gray-500">MAD</span>
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
// Primary CTA (Book Now, Submit)
<button className="rounded-lg bg-amber-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-amber-600">

// Secondary (Cancel, Back)
<button className="rounded-lg border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50">

// Teal (Login, View Details)
<button className="rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-teal-800">

// Danger (Delete, Reject)
<button className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-700">

// Ghost (subtle actions)
<button className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100">
```

**Status Badges:**

```jsx
// Approved / Paid / Confirmed
<span className="rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">

// Pending
<span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">

// Rejected / Cancelled / Failed
<span className="rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
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

### Public Pages (Tourist-facing)

- Full-width hero sections with overlaid text
- Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- Sections separated by `py-16 md:py-24`
- WhatsApp floating button always visible

### Dashboard Pages (Provider & Admin)

- Sidebar layout: sidebar (w-64) + main content area
- Top bar with breadcrumbs and user info
- Content area: `p-6 md:p-8`
- Tables with horizontal scroll on mobile
- Cards for stats: white bg, subtle shadow, rounded-xl

### Forms

- Labels: `text-sm font-medium text-gray-700 mb-1`
- Inputs: `w-full rounded-lg border border-gray-200 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-teal-500 focus:outline-none focus:ring-1 focus:ring-teal-500`
- Error messages: `text-sm text-red-600 mt-1`
- Submit buttons: Always amber (accent) for primary action
- Group related fields, use `space-y-4` between field groups

## Performance Rules

1. **Images:** Always use `next/image` with `sizes` prop. Never `<img>` tags.
2. **Fonts:** Load Inter via `next/font/google` in root layout. Never CDN links.
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
7. Focus ring: `focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2`

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
- ❌ Stock photo placeholder URLs — use solid color backgrounds with icons
- ❌ Giant monolithic components — split at 150 lines
- ❌ Props drilling more than 2 levels deep
- ❌ Tailwind `@apply` in CSS — compose classes in JSX instead
- ❌ Any font other than Inter unless explicitly approved
- ❌ Purple gradients, excessive shadows, or generic "SaaS template" aesthetics

## Reference Files

For deeper patterns, read these files in `references/`:

- `references/nextjs-patterns.md` — Detailed Next.js App Router patterns, data fetching, caching, middleware
- `references/component-guide.md` — Full component library with code examples for every UI primitive and composite component
