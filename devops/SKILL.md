---
name: tripmor-devops
description: "Tripmor DevOps, deployment, testing, SEO, and security skill. Use this skill whenever working on: deploying to Vercel or configuring MongoDB Atlas, writing or running tests, adding SEO metadata or sitemaps, implementing security measures (input validation, rate limiting, XSS prevention), setting up environment variables, configuring CI/CD, optimizing performance, or handling any infrastructure/ops concern. Also trigger when the user asks about going live, launching, domain setup, or production readiness."
---

# Tripmor DevOps Skill

Covers deployment, testing, SEO, and security for the Tripmor platform.

## Deployment

Read `references/deployment.md` for step-by-step guides. Key architecture:

```
Production Stack:
  Frontend + API:  Vercel (free tier)
  Database:        MongoDB Atlas (free tier — 512MB)
  Payments:        Stripe (switch from test to live keys)
  Images:          Cloudinary (free tier — 25GB)
  Domain:          Custom domain on Vercel
```

### Vercel Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add NEXTAUTH_SECRET
vercel env add STRIPE_SECRET_KEY
# ... all from .env.local
```

### Environment Variables — Production vs Development

```
# .env.local (development)
MONGODB_URI=mongodb+srv://...dev-cluster...
NEXTAUTH_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...

# Vercel (production)
MONGODB_URI=mongodb+srv://...prod-cluster...
NEXTAUTH_URL=https://tripmor.com
STRIPE_SECRET_KEY=sk_live_...          ← Switch to live!
STRIPE_PUBLISHABLE_KEY=pk_live_...     ← Switch to live!
STRIPE_WEBHOOK_SECRET=whsec_...        ← New webhook for prod URL
```

### Pre-Deployment Checklist

Before going live:

```
[ ] All env vars set in Vercel
[ ] MongoDB Atlas IP whitelist: 0.0.0.0/0 (allow from anywhere for Vercel)
[ ] Stripe webhook URL updated to production domain
[ ] Stripe switched from test to live keys
[ ] NEXTAUTH_URL set to production domain
[ ] NEXTAUTH_SECRET is a strong random string (32+ chars)
[ ] Google OAuth redirect URIs updated for production domain
[ ] Cloudinary configured
[ ] Custom domain connected in Vercel
[ ] Admin user created in production database
[ ] First provider (Douhabi) seeded in production
[ ] Test a full booking flow end-to-end
```

### MongoDB Atlas Setup

```
1. Create account at cloud.mongodb.com
2. Create free M0 cluster (512MB)
3. Create database user (strong password)
4. Network access: Add 0.0.0.0/0 (required for Vercel serverless)
5. Get connection string: mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/tripmor
6. Set as MONGODB_URI in .env.local and Vercel
```

### Database Seeding

```javascript
// scripts/seed.js — Run once to set up initial data
import { connectDB } from "../lib/mongodb";
import User from "../models/User";
import Provider from "../models/Provider";
import bcrypt from "bcryptjs";

async function seed() {
  await connectDB();

  // Create admin user
  const adminPassword = await bcrypt.hash("your-secure-password", 12);
  await User.create({
    name: "Admin",
    email: "admin@tripmor.com",
    password: adminPassword,
    role: "admin",
  });

  // Create first provider (Douhabi)
  const provider = await Provider.create({
    name: "Douhabi Transport Touristique",
    slug: "douhabi-transport",
    email: "douhabi@example.com",
    phone: "+212600000000",
    status: "approved",
  });

  const providerPassword = await bcrypt.hash("provider-password", 12);
  await User.create({
    name: "Douhabi Transport",
    email: "douhabi@example.com",
    password: providerPassword,
    role: "provider",
    providerId: provider._id,
  });

  console.log("Seeded successfully");
  process.exit(0);
}

seed().catch(console.error);
```

---

## Testing

Read `references/testing.md` for detailed patterns.

### What to Test

```
CRITICAL (test these first):
  ✓ Stripe checkout creates valid session
  ✓ Stripe webhook creates booking with correct commission split
  ✓ Auth: login, registration, role-based access
  ✓ Provider can only CRUD their own trips
  ✓ Admin can approve/reject providers and trips
  ✓ Trip prices come from DB, never from client

IMPORTANT:
  ✓ Input validation rejects bad data
  ✓ Guest checkout works without account
  ✓ Tourist account checkout pre-fills data
  ✓ Rating system: one rating per booking
  ✓ Commission calculation is correct
  ✓ Slugs are unique

NICE TO HAVE:
  ✓ Search and filter return correct results
  ✓ Pagination works
  ✓ Loading states render
  ✓ Mobile responsive layouts
```

### Manual Testing Checklist

```
TOURIST FLOW:
[ ] Browse homepage — trips load
[ ] Filter by category — correct results
[ ] Filter by city — correct results
[ ] View trip detail — all info shows
[ ] Fill booking form — validation works
[ ] Submit booking — redirects to Stripe
[ ] Pay with test card (4242...) — payment succeeds
[ ] Success page shows booking details
[ ] WhatsApp link works with pre-filled message

PROVIDER FLOW:
[ ] Register as provider — account created with "pending" status
[ ] Cannot access dashboard until approved
[ ] Admin approves → can now access dashboard
[ ] Add new trip — status is "pending"
[ ] Edit own trip — changes save
[ ] Cannot edit other provider's trips
[ ] View own bookings — only sees own
[ ] Earnings show correct amounts

ADMIN FLOW:
[ ] Dashboard shows correct stats
[ ] View pending providers — approve/reject works
[ ] View pending trips — approve/reject works
[ ] View all bookings
[ ] Revenue numbers are correct
```

### API Testing with curl

```bash
# List trips
curl http://localhost:3000/api/trips

# Create trip (needs auth cookie)
curl -X POST http://localhost:3000/api/trips \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Trip","category":"day-trips","price":500,...}'

# Test Stripe webhook locally
stripe trigger checkout.session.completed
```

---

## SEO

Read `references/seo.md` for detailed implementation.

### Metadata on Every Page

```javascript
// Static pages
export const metadata = {
  title: "About Tripmor — Tourist Transport Marketplace in Morocco",
  description: "Book private transfers, day trips, and tours with trusted local transport companies across Morocco.",
  openGraph: {
    title: "About Tripmor",
    description: "Book private transfers, day trips, and tours across Morocco.",
    url: "https://tripmor.com/about",
    siteName: "Tripmor",
    type: "website",
  },
};

// Dynamic pages
export async function generateMetadata({ params }) {
  const trip = await Trip.findOne({ slug: params.id }).lean();
  if (!trip) return { title: "Trip Not Found — Tripmor" };

  return {
    title: `${trip.title} — Tripmor`,
    description: trip.shortDescription,
    openGraph: {
      title: trip.title,
      description: trip.shortDescription,
      images: trip.images[0] ? [{ url: trip.images[0] }] : [],
    },
  };
}
```

### Root Layout Metadata

```javascript
// app/layout.js
export const metadata = {
  title: {
    default: "Tripmor — Book Tourist Transport Across Morocco",
    template: "%s — Tripmor",
  },
  description: "Book private transfers, day trips, multi-day tours, and car rental with driver across all Moroccan cities.",
  keywords: ["Morocco transport", "tourist transfer", "Morocco day trips", "Marrakech airport transfer", "Sahara desert tour"],
  metadataBase: new URL("https://tripmor.com"),
  openGraph: {
    siteName: "Tripmor",
    type: "website",
    locale: "en_US",
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Sitemap

```javascript
// app/sitemap.js
import { connectDB } from "@/lib/mongodb";
import Trip from "@/models/Trip";

export default async function sitemap() {
  await connectDB();
  const trips = await Trip.find({ status: "approved", isActive: true })
    .select("slug updatedAt")
    .lean();

  const tripUrls = trips.map((trip) => ({
    url: `https://tripmor.com/trips/${trip.slug}`,
    lastModified: trip.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const staticPages = [
    { url: "https://tripmor.com", priority: 1.0, changeFrequency: "daily" },
    { url: "https://tripmor.com/trips", priority: 0.9, changeFrequency: "daily" },
    { url: "https://tripmor.com/about", priority: 0.5, changeFrequency: "monthly" },
    { url: "https://tripmor.com/how-it-works", priority: 0.6, changeFrequency: "monthly" },
    { url: "https://tripmor.com/contact", priority: 0.5, changeFrequency: "monthly" },
    { url: "https://tripmor.com/faq", priority: 0.5, changeFrequency: "monthly" },
    { url: "https://tripmor.com/become-a-provider", priority: 0.7, changeFrequency: "monthly" },
  ];

  return [...staticPages, ...tripUrls];
}
```

### Robots.txt

```javascript
// app/robots.js
export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/provider/", "/account/", "/api/"],
      },
    ],
    sitemap: "https://tripmor.com/sitemap.xml",
  };
}
```

### Structured Data (JSON-LD)

```javascript
// For trip detail pages — helps Google show rich results
function TripJsonLd({ trip }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: trip.title,
    description: trip.shortDescription,
    image: trip.images[0],
    touristType: "Adventure",
    offers: {
      "@type": "Offer",
      price: trip.price,
      priceCurrency: "MAD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: trip.totalRatings > 0 ? {
      "@type": "AggregateRating",
      ratingValue: trip.averageRating,
      ratingCount: trip.totalRatings,
    } : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
```

---

## Security

Read `references/security.md` for full details.

### Input Validation

```javascript
// Sanitize all string inputs
function sanitize(str) {
  if (typeof str !== "string") return "";
  return str.trim().replace(/[<>]/g, "");
}

// Validate email format
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Validate MongoDB ObjectId
import mongoose from "mongoose";
function isValidId(id) {
  return mongoose.Types.ObjectId.isValid(id);
}

// Use before any DB query
if (!isValidId(params.id)) {
  return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
}
```

### Rate Limiting

```javascript
// lib/rate-limit.js — Simple in-memory rate limiter
const rateLimitMap = new Map();

export function rateLimit(key, limit = 10, windowMs = 60000) {
  const now = Date.now();
  const windowStart = now - windowMs;

  if (!rateLimitMap.has(key)) {
    rateLimitMap.set(key, []);
  }

  const timestamps = rateLimitMap.get(key).filter(t => t > windowStart);
  rateLimitMap.set(key, timestamps);

  if (timestamps.length >= limit) {
    return false; // Rate limited
  }

  timestamps.push(now);
  return true; // Allowed
}

// Usage in API route
export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for") || "unknown";
  if (!rateLimit(`register:${ip}`, 5, 300000)) { // 5 per 5 minutes
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }
  // ... proceed
}
```

### Apply Rate Limiting To

```
Registration endpoints:     5 per 5 minutes per IP
Login attempts:             10 per 5 minutes per IP  
Stripe checkout creation:   10 per minute per IP
Rating submission:          5 per minute per IP
Trip creation:              20 per hour per provider
```

### Security Headers

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [{
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
      ],
    }];
  },
};
```

### Security Checklist

```
[ ] All user input sanitized before database storage
[ ] Passwords hashed with bcrypt (12 rounds)
[ ] JWT secret is strong (32+ random chars)
[ ] Stripe webhook signatures verified
[ ] MongoDB connection string never exposed to client
[ ] No sensitive env vars prefixed with NEXT_PUBLIC_
[ ] Rate limiting on auth and payment endpoints
[ ] CORS handled by Next.js defaults
[ ] No eval() or dangerouslySetInnerHTML with user content
[ ] Provider can only access their own data
[ ] Admin routes protected by middleware
[ ] API errors don't leak stack traces
[ ] File uploads validated (type, size) — if implemented
```

## Reference Files

- `references/deployment.md` — Step-by-step Vercel + MongoDB Atlas + domain setup
- `references/testing.md` — Test patterns, manual testing checklists, curl commands
- `references/seo.md` — Full SEO implementation with metadata, sitemap, robots, JSON-LD
- `references/security.md` — Input validation, rate limiting, XSS prevention, security headers
