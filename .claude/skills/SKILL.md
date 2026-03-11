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

---

## Tech Stack

| Layer       | Technology                  | Notes                                     |
|-------------|-----------------------------|-------------------------------------------|
| Framework   | Next.js (App Router)        | RSC by default, route groups              |
| Language    | JavaScript (JSX)            | TypeScript only for shadcn-generated files|
| Styling     | Tailwind CSS v4             | CSS variable tokens, mobile-first         |
| UI Library  | shadcn/ui (New York style)  | Zinc base, cssVariables: true             |
| Icons       | lucide-react                | Always `className="h-X w-X"`, never `size` prop |
| Images      | next/image + Unsplash       | Remote pattern added in next.config.ts    |
| Utils       | clsx + tailwind-merge       | via `cn()` in lib/utils.js                |

---

## CSS Variables (Design Tokens)

All colors use CSS custom properties — **never use raw Tailwind color classes** like `text-teal-700` or `bg-amber-500`.

```css
/* globals.css — :root */
--primary: oklch(0.442 0.101 174.5);         /* Deep Teal #0F766E */
--primary-foreground: oklch(0.985 0 0);      /* White */
--accent: oklch(0.769 0.164 70.08);          /* Amber #F59E0B */
--accent-foreground: oklch(0.141 0.005 285.823);
--background: oklch(1 0 0);                  /* White */
--foreground: oklch(0.141 0.005 285.823);    /* Near-black */
--muted: oklch(0.967 0.001 286.375);         /* Light gray bg */
--muted-foreground: oklch(0.552 0.016 285.938);
--card: oklch(1 0 0);
--card-foreground: oklch(0.141 0.005 285.823);
--border: oklch(0.92 0.004 286.32);
--input: oklch(0.92 0.004 286.32);
--ring: oklch(0.442 0.101 174.5);            /* Teal focus ring */
--destructive: oklch(0.577 0.245 27.325);    /* Red */
--radius: 0.625rem;
```

**Usage in components:**
```jsx
// ✅ Correct — CSS variable tokens
className="bg-primary text-primary-foreground"
className="bg-accent text-accent-foreground"
className="text-muted-foreground"
className="border-border"
className="bg-muted"

// ❌ Wrong — raw color classes
className="bg-teal-700 text-white"
className="bg-amber-500"
className="text-gray-500"
```

---

## shadcn/ui Component Catalog

These are installed. Import from `@/components/ui/`:

| Component   | Import                                    | Notes                        |
|-------------|-------------------------------------------|------------------------------|
| Button      | `@/components/ui/button`                  | variants: default/ghost/outline/destructive |
| Input       | `@/components/ui/input`                   |                              |
| Card        | `@/components/ui/card`                    | CardContent, CardHeader, CardTitle |
| Badge       | `@/components/ui/badge`                   | variants: default/secondary/outline/destructive |
| Select      | `@/components/ui/select`                  | SelectTrigger, SelectContent, SelectItem |
| Label       | `@/components/ui/label`                   |                              |
| Separator   | `@/components/ui/separator`               |                              |
| Dialog      | `@/components/ui/dialog`                  | DialogContent, DialogHeader, DialogTitle |

**Do NOT edit files in `components/ui/`** — they are shadcn-generated. Re-add via `npx shadcn@latest add`.

### Custom UI Primitives (editable)

- `components/ui/EmptyState.jsx` — empty state with icon, title, description, action
- `components/ui/Spinner.jsx` — animated loading spinner

---

## cn() Utility

Always use `cn()` for conditional/merged class names:

```jsx
import { cn } from "@/lib/utils";

// Conditional classes
className={cn("base-class", isActive && "active-class", className)}

// Merging with props
export default function MyComponent({ className, ...props }) {
  return <div className={cn("default-classes", className)} {...props} />;
}
```

---

## Icons

Use `lucide-react`. **Always use `className` for sizing — never the `size` prop.**

```jsx
// ✅ Correct
import { MapPin, Clock, Users } from "lucide-react";
<MapPin className="h-4 w-4 text-primary" />
<Clock className="h-5 w-5" />

// ❌ Wrong
<MapPin size={16} />
```

Common sizes: `h-3 w-3`, `h-3.5 w-3.5`, `h-4 w-4`, `h-5 w-5`, `h-8 w-8`, `h-10 w-10`, `h-12 w-12`

---

## Typography

- **Font:** Inter via `next/font/google` in root layout
- **Headings:** `font-bold` or `font-semibold`, `tracking-tight`
- **Body:** `text-foreground` (near-black)
- **Secondary:** `text-muted-foreground text-sm`
- **Labels/caps:** `text-xs font-medium uppercase tracking-wide text-muted-foreground`

---

## Spacing & Layout

- **Section padding (public):** `py-16 md:py-24`
- **Max content width:** `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Card padding:** `p-4` (cards) or `p-6` (dashboard cards)
- **Dashboard content:** `p-6 md:p-8`

---

## Unsplash Image Catalog

Use these real Moroccan Unsplash photos — always with `?w=1800&q=80` or similar:

| Context                  | URL fragment                                           |
|--------------------------|--------------------------------------------------------|
| Hero (Marrakech aerial)  | `photo-1539650116574-8efeb43e2750?w=1800&q=85`        |
| HowItWorks (Atlas Mtns)  | `photo-1548013146-72479768bada?w=1800&q=80`           |
| Provider CTA (Riad)      | `photo-1566073771259-6a8506099945?w=1800&q=80`        |
| Marrakech city           | `photo-1597212720157-58a9d5262b47?w=800&q=80`         |
| Fes medina               | `photo-1570099560969-b9af72b5e05d?w=800&q=80`         |
| Chefchaouen (blue city)  | `photo-1548801680-46e6e2e08e40?w=800&q=80`            |
| Sahara desert            | `photo-1509395176047-4a66953fd231?w=800&q=80`         |
| Essaouira coast          | `photo-1555375771-14b2a63968a9?w=800&q=80`            |

All photos are from `images.unsplash.com` — already added to `next.config.ts` remote patterns.

---

## Route Group Structure

```
app/
  (public)/                    → layout.jsx: Navbar + main + Footer + WhatsApp
    page.tsx                   → / (Homepage)
    trips/
      page.jsx                 → /trips
      [id]/page.jsx            → /trips/[id]
    categories/[slug]/page.jsx → /categories/day-trips
    cities/[slug]/page.jsx     → /cities/marrakech
    about/page.jsx
    how-it-works/page.jsx
    become-a-provider/page.jsx
    contact/page.jsx
    faq/page.jsx
    booking/success/page.jsx

  auth/                        → inside (auth)/ route group
    login/page.jsx             → /auth/login
    register/page.jsx          → /auth/register
  (auth)/layout.jsx            → centered card, no nav/footer

  (dashboard)/                 → layout.jsx: bare wrapper
    provider/
      layout.jsx               → Provider sidebar + topbar
      page.jsx                 → /provider
      trips/page.jsx
      trips/new/page.jsx
      trips/[id]/edit/page.jsx
      bookings/page.jsx
      earnings/page.jsx
      settings/page.jsx
    admin/
      layout.jsx               → Admin sidebar + topbar
      page.jsx                 → /admin
      providers/page.jsx
      trips/page.jsx
      bookings/page.jsx
      revenue/page.jsx

  provider/pending/page.jsx    → Outside (dashboard) — for unapproved providers
  api/                         → No layout
```

---

## Navbar Pattern

```jsx
// components/layout/Navbar.jsx — "use client"
// sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur
// Logo: T square with bg-primary, "Trip" + <span className="text-primary">mor</span>
// Desktop nav: ghost links, px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground
// Auth: Button variant="ghost" for login, Button for sign-up
// Logged in: user dropdown with LayoutDashboard link + signOut
// Mobile: hamburger Button variant="ghost", slide-out menu
```

---

## Data Fetching Pattern

```jsx
// Server component — query DB directly
import connectDB from "@/lib/mongodb";
import Trip from "@/models/Trip";

export default async function Page({ searchParams }) {
  await connectDB();
  const { category } = await searchParams; // ✅ await required in Next.js 15+
  const trips = await Trip.find({ status: "approved", isActive: true }).lean();
  const serialized = JSON.parse(JSON.stringify(trips)); // ✅ always serialize
  return <TripGrid trips={serialized} />;
}
```

---

## Form Pattern

```jsx
// Use shadcn Label + Input + Button
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

<div className="space-y-4">
  <div>
    <Label htmlFor="email">Email</Label>
    <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
  </div>
  <Button className="w-full" type="submit">Submit</Button>
</div>
```

---

## Dashboard Layout Pattern

```jsx
// (dashboard)/provider/layout.jsx
import ProviderSidebar from "@/components/provider/ProviderSidebar";
import ProviderTopbar from "@/components/provider/ProviderTopbar";

export default function ProviderLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden bg-muted/40">
      <ProviderSidebar />
      <div className="flex flex-1 flex-col overflow-auto">
        <ProviderTopbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
```

---

## Anti-Patterns (Never Do These)

- ❌ Raw Tailwind color classes: `text-teal-700`, `bg-amber-500`, `text-gray-500`
- ❌ `size` prop on lucide icons — use `className="h-X w-X"`
- ❌ Edit files in `components/ui/` (shadcn-generated)
- ❌ Inline styles (`style={{ color: "red" }}`)
- ❌ `<img>` tags — use `next/image`
- ❌ `<a>` tags for internal links — use `next/link`
- ❌ `"use client"` on every component — only when truly needed
- ❌ Fetching your own API routes from server components
- ❌ Pass unserialized Mongoose docs to client components (always `.lean()` + `JSON.parse(JSON.stringify(...))`)
- ❌ `useEffect` for data fetching in server components
- ❌ Props drilling more than 2 levels deep
- ❌ Giant monolithic components — split at ~150 lines
- ❌ Any font other than Inter

## Reference Files

- `.claude/skills/nextjs-patterns.md` — Route groups, server components, serialization, API routes, loading.jsx, generateMetadata
- `.claude/skills/component-guide.md` — Full shadcn component patterns: TripCard, StarRating, TripGrid, ProviderSidebar, StatsCard, DataTable, auth cards, loading skeletons
