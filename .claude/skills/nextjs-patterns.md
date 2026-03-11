# Next.js App Router Patterns for Tripmor

## Routing Structure

### Route Groups

Use route groups to share layouts without affecting the URL:

```
app/
  (public)/                    → Shares Navbar + Footer layout
    layout.js                  → <Navbar /> {children} <Footer /> <WhatsAppButton />
    page.js                    → / (Homepage)
    trips/
      page.js                  → /trips
      [id]/page.js             → /trips/abc123
    categories/
      [slug]/page.js           → /categories/day-trips
    cities/
      [slug]/page.js           → /cities/marrakech
    about/page.js              → /about
    how-it-works/page.js       → /how-it-works
    become-a-provider/page.js  → /become-a-provider
    contact/page.js            → /contact
    faq/page.js                → /faq
    booking/
      success/page.js          → /booking/success

  (auth)/                      → Centered card layout, no nav/footer
    layout.js                  → Centered flex container with logo
    login/page.js              → /login
    register/page.js           → /register

  (dashboard)/                 → Sidebar + topbar layout
    layout.js                  → Auth check wrapper
    provider/
      layout.js                → Provider sidebar + topbar
      page.js                  → /provider (dashboard)
      trips/page.js            → /provider/trips
      trips/new/page.js        → /provider/trips/new
      trips/[id]/edit/page.js  → /provider/trips/abc123/edit
      bookings/page.js         → /provider/bookings
      earnings/page.js         → /provider/earnings
      settings/page.js         → /provider/settings
    admin/
      layout.js                → Admin sidebar + topbar
      page.js                  → /admin (dashboard)
      providers/page.js        → /admin/providers
      trips/page.js            → /admin/trips
      bookings/page.js         → /admin/bookings
      revenue/page.js          → /admin/revenue

  api/                         → API routes (no layout)
    trips/route.js
    bookings/route.js
    ...
```

## Server Components (Default)

Every component and page is a server component by default. This means:

### Direct Database Access

```jsx
// app/(public)/trips/page.js — Server component
import { connectDB } from "@/lib/mongodb";
import Trip from "@/models/Trip";
import TripGrid from "@/components/trips/TripGrid";
import TripFilter from "@/components/trips/TripFilter";

export default async function TripsPage({ searchParams }) {
  await connectDB();

  const { category, city, sort } = searchParams;

  const filter = { status: "approved", isActive: true };
  if (category) filter.category = category;
  if (city) filter.departureCity = city;

  const trips = await Trip.find(filter)
    .sort(sort === "price-low" ? { price: 1 } : { createdAt: -1 })
    .lean();

  // Serialize MongoDB objects for client components
  const serializedTrips = JSON.parse(JSON.stringify(trips));

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Explore Trips</h1>
      <TripFilter />  {/* Client component for interactive filters */}
      <TripGrid trips={serializedTrips} />
    </section>
  );
}
```

### Key Rule: Serialize MongoDB Data

MongoDB documents contain ObjectId and Date types that can't be passed to client components. Always serialize:

```jsx
// ✅ Correct
const trips = await Trip.find(filter).lean();
const serialized = JSON.parse(JSON.stringify(trips));

// ❌ Wrong — will throw serialization error
const trips = await Trip.find(filter);
return <TripGrid trips={trips} />;
```

## Client Components

Only add `"use client"` when the component genuinely needs browser interactivity.

### When to Use Client Components

```jsx
"use client";
// ✅ Reasons to use "use client":
// - useState, useEffect, useRef, useContext
// - Event handlers (onClick, onChange, onSubmit)
// - Browser APIs (localStorage, window, navigator)
// - Third-party libraries that require browser (maps, charts)
```

### Client Component Pattern

```jsx
// components/trips/TripFilter.jsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, MOROCCAN_CITIES } from "@/lib/constants";

export default function TripFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [category, setCategory] = useState(searchParams.get("category") || "");

  function handleFilter(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/trips?${params.toString()}`);
  }

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => handleFilter("category", cat.slug)}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            category === cat.slug
              ? "bg-teal-700 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
```

## Loading States

Every page that fetches data must have a `loading.js` with skeleton UI:

```jsx
// app/(public)/trips/loading.js
export default function TripsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-gray-200" />
      <div className="mt-6 flex gap-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 w-28 animate-pulse rounded-full bg-gray-200" />
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-gray-200">
            <div className="aspect-[4/3] animate-pulse bg-gray-200" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
              <div className="flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
                <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

## Error Handling

```jsx
// app/(public)/trips/error.js
"use client";

export default function TripsError({ error, reset }) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
      <h2 className="text-2xl font-bold text-gray-900">Something went wrong</h2>
      <p className="mt-2 text-gray-500">We couldn't load the trips. Please try again.</p>
      <button
        onClick={reset}
        className="mt-6 rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white hover:bg-teal-800"
      >
        Try Again
      </button>
    </section>
  );
}
```

## API Routes

API routes live in `app/api/` and handle external requests (Stripe webhooks, client-side fetches).

```jsx
// app/api/trips/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/trips — Public: list approved trips
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const city = searchParams.get("city");

    const filter = { status: "approved", isActive: true };
    if (category) filter.category = category;
    if (city) filter.departureCity = city;

    const trips = await Trip.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(trips);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

// POST /api/trips — Provider: create new trip
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "provider") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    const trip = await Trip.create({
      ...body,
      providerId: session.user.providerId,
      providerName: session.user.name,
      status: "pending",
      isActive: true,
    });

    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
```

## Metadata & SEO

Every public page must export metadata:

```jsx
// app/(public)/trips/[id]/page.js
export async function generateMetadata({ params }) {
  await connectDB();
  const trip = await Trip.findById(params.id).lean();

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

## Middleware (Auth Protection)

```jsx
// middleware.js
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const { role } = req.nextauth.token;

    // Provider routes
    if (pathname.startsWith("/provider") && role !== "provider") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Admin routes
    if (pathname.startsWith("/admin") && role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Tourist account routes
    if (pathname.startsWith("/account") && role !== "tourist") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  { callbacks: { authorized: ({ token }) => !!token } }
);

export const config = {
  matcher: ["/provider/:path*", "/admin/:path*", "/account/:path*"],
};
```

## Environment Variables in Client Components

Never expose server-side env vars to the client. Only `NEXT_PUBLIC_` prefixed vars are available:

```
// .env.local
STRIPE_SECRET_KEY=sk_test_...           // Server only
NEXT_PUBLIC_STRIPE_KEY=pk_test_...      // Available in client
MONGODB_URI=mongodb+srv://...           // Server only
NEXT_PUBLIC_WHATSAPP_NUMBER=212...      // Available in client
```
