# Next.js App Router Patterns — Tripmor

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
      trips/page.jsx           → /provider/trips
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

## Server Components (Default)

Every page and component is a server component unless it needs interactivity. Query the database directly — never call your own API routes from server components.

### Direct DB Access Pattern

```jsx
// app/(public)/trips/page.jsx
import connectDB from "@/lib/mongodb";
import Trip from "@/models/Trip";
import TripGrid from "@/components/trips/TripGrid";

export default async function TripsPage({ searchParams }) {
  await connectDB();

  const { category, city, sort } = await searchParams;

  const filter = { status: "approved", isActive: true };
  if (category) filter.category = category;
  if (city) filter.departureCity = city;

  const trips = await Trip.find(filter)
    .sort(sort === "price-low" ? { price: 1 } : { createdAt: -1 })
    .lean();

  // Always serialize before passing to client components
  const serialized = JSON.parse(JSON.stringify(trips));

  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-tight">Explore Trips</h1>
      <TripGrid trips={serialized} />
    </section>
  );
}
```

### Serialization Rule

MongoDB ObjectIds and Dates cannot be passed to client components. Always serialize:

```jsx
// ✅ Correct
const trips = await Trip.find(filter).lean();
const serialized = JSON.parse(JSON.stringify(trips));

// ❌ Wrong — will throw serialization error
const trips = await Trip.find(filter);
return <TripGrid trips={trips} />;
```

## Client Components

Only add `"use client"` when truly needed:

```jsx
"use client";
// Only when using:
// - useState, useEffect, useRef, useContext
// - onClick, onChange, onSubmit handlers
// - useRouter, usePathname, useSearchParams
// - Browser APIs (localStorage, window)
// - useSession from next-auth/react
```

## API Routes

Only for external consumers (Stripe webhooks, client-side fetches from `"use client"` components):

```jsx
// app/api/trips/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const filter = { status: "approved", isActive: true };
    if (searchParams.get("category")) filter.category = searchParams.get("category");
    const trips = await Trip.find(filter).sort({ createdAt: -1 }).lean();
    return NextResponse.json(trips);
  } catch {
    return NextResponse.json({ error: "Failed to fetch trips" }, { status: 500 });
  }
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "provider") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    await connectDB();
    const body = await request.json();
    const trip = await Trip.create({
      ...body,
      providerId: session.user.providerId,
      providerName: session.user.name,
      status: "pending",
    });
    return NextResponse.json(trip, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create trip" }, { status: 500 });
  }
}
```

## Loading States

Every page with data must have a `loading.jsx`:

```jsx
// app/(public)/trips/loading.jsx
export default function TripsLoading() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

## Error Boundaries

```jsx
// app/(public)/trips/error.jsx
"use client";
import { Button } from "@/components/ui/button";

export default function TripsError({ error, reset }) {
  return (
    <section className="mx-auto flex max-w-7xl flex-col items-center justify-center px-4 py-24 text-center">
      <h2 className="text-2xl font-bold text-foreground">Something went wrong</h2>
      <p className="mt-2 text-muted-foreground">We couldn&apos;t load the trips. Please try again.</p>
      <Button onClick={reset} className="mt-6">Try Again</Button>
    </section>
  );
}
```

## SEO — generateMetadata

Every public page exports metadata:

```jsx
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

## Environment Variables

```
# Server-only (never exposed to client)
MONGODB_URI
NEXTAUTH_SECRET
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
GOOGLE_CLIENT_SECRET

# Client-accessible (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_WHATSAPP_NUMBER
NEXT_PUBLIC_STRIPE_KEY      (add when needed)
```

## searchParams in Next.js 15+

`searchParams` is now a Promise in Next.js 15+. Always await it:

```jsx
export default async function Page({ searchParams }) {
  const { category, city } = await searchParams; // ✅ await required
}
```
