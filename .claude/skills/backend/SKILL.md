---
name: tripmor-backend
description: "Tripmor backend development skill for the tourist transport marketplace. Use this skill whenever building, editing, or debugging any backend code for the Tripmor project. This includes: creating or modifying API routes, writing Mongoose models/schemas, setting up NextAuth.js authentication, implementing Stripe payment flows, writing database queries, handling errors, creating middleware, or working with any file in app/api/, lib/, or models/. Always use this skill when touching backend logic, even for small fixes. Also use when the user asks about data flow, commission calculations, or booking logic."
---

# Tripmor Backend Skill

This skill defines how every backend element in Tripmor should be built. Follow these rules for every API route, database model, and server-side function.

## Architecture Overview

Tripmor uses Next.js App Router API routes as the backend. No separate Express server.

```
Backend Stack:
- Runtime:    Next.js API Routes (app/api/)
- Database:   MongoDB Atlas + Mongoose ODM
- Auth:       NextAuth.js (Credentials + Google OAuth)
- Payments:   Stripe (Checkout + Webhooks)
- Validation: Manual + Mongoose schema validation
```

### Key Principles

1. **API routes are thin** — they validate input, call a service function, return a response
2. **Business logic lives in `lib/`** — reusable functions, not embedded in routes
3. **Mongoose models define truth** — validation, defaults, and constraints live in schemas
4. **Fail loudly in dev, gracefully in prod** — detailed errors locally, safe messages to users
5. **Never trust client input** — validate and sanitize everything

## API Route Patterns

Read `references/api-patterns.md` for detailed examples. Key rules:

### Route File Structure

```javascript
// app/api/trips/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Trip from "@/models/Trip";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET /api/trips
export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    
    // Build query from params
    const filter = { status: "approved", isActive: true };
    const category = searchParams.get("category");
    if (category) filter.category = category;

    const trips = await Trip.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(trips);
  } catch (error) {
    console.error("GET /api/trips error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trips" },
      { status: 500 }
    );
  }
}
```

### Response Format

Always return consistent JSON:

```javascript
// Success
return NextResponse.json(data);                           // 200
return NextResponse.json(data, { status: 201 });          // Created
return NextResponse.json({ message: "Deleted" });         // 200

// Errors
return NextResponse.json({ error: "Not found" }, { status: 404 });
return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
return NextResponse.json({ error: "Server error" }, { status: 500 });
```

### Auth Check Pattern

```javascript
// Check if user is authenticated and has correct role
async function requireRole(roles) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return { error: "Unauthorized", status: 401 };
  }
  if (!roles.includes(session.user.role)) {
    return { error: "Forbidden", status: 403 };
  }
  return { session };
}

// Usage in route
export async function POST(request) {
  const { session, error, status } = await requireRole(["provider"]);
  if (error) return NextResponse.json({ error }, { status });
  
  // ... proceed with authenticated logic
}
```

### Input Validation

```javascript
// Validate required fields
function validateTrip(body) {
  const errors = [];
  if (!body.title?.trim()) errors.push("Title is required");
  if (!body.category) errors.push("Category is required");
  if (!body.price || body.price <= 0) errors.push("Price must be positive");
  if (!body.departureCity?.trim()) errors.push("Departure city is required");
  if (!body.duration?.trim()) errors.push("Duration is required");
  return errors;
}

// Use in route
const body = await request.json();
const errors = validateTrip(body);
if (errors.length > 0) {
  return NextResponse.json({ error: "Validation failed", details: errors }, { status: 400 });
}
```

### Route Protection Summary

```
PUBLIC (no auth):
  GET  /api/trips              — List approved trips
  GET  /api/trips/[id]         — Get single trip
  POST /api/stripe/checkout    — Create checkout session
  POST /api/stripe/webhook     — Stripe webhook (verified by signature)

TOURIST (role: tourist):
  GET  /api/bookings/mine      — Tourist's own bookings

PROVIDER (role: provider):
  GET  /api/trips?mine=true    — Provider's own trips
  POST /api/trips              — Create trip (status: pending)
  PUT  /api/trips/[id]         — Update own trip
  DELETE /api/trips/[id]       — Delete own trip
  GET  /api/bookings?mine=true — Provider's bookings

ADMIN (role: admin):
  GET  /api/providers          — List all providers
  PUT  /api/providers/[id]     — Approve/reject provider
  GET  /api/trips?status=pending — Pending trips
  PUT  /api/trips/[id]         — Approve/reject any trip
  GET  /api/bookings           — All bookings
  GET  /api/admin/stats        — Dashboard stats
  GET  /api/admin/revenue      — Revenue data
```

## MongoDB Connection

```javascript
// lib/mongodb.js — Singleton connection
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in .env.local");
}

let cached = global.mongoose;
if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
```

**Rules:**
- Always call `await connectDB()` at the top of every API route and server component that accesses the database
- Never create multiple connections — the singleton pattern handles this
- Use `.lean()` on queries when you don't need Mongoose document methods (faster, plain objects)

## Database Models

Read `references/models.md` for complete schemas with all fields, validation rules, and indexes. Key rules:

### Model File Pattern

```javascript
// models/Trip.js
import mongoose from "mongoose";

const TripSchema = new mongoose.Schema({
  // ... fields
}, {
  timestamps: true,  // Adds createdAt and updatedAt automatically
});

// Add indexes
TripSchema.index({ category: 1, status: 1 });
TripSchema.index({ departureCity: 1 });
TripSchema.index({ providerId: 1 });
TripSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Trip || mongoose.model("Trip", TripSchema);
```

### Schema Rules

1. **Always use `timestamps: true`** — never manually manage createdAt/updatedAt
2. **Always export with `mongoose.models.X || mongoose.model()`** — prevents re-compilation errors in dev
3. **Add indexes** for every field you query or filter by
4. **Use `enum` for status fields** — catches invalid values at the database level
5. **Use `required: true`** for mandatory fields — don't rely on API validation alone
6. **Use `default` values** — reduce code in API routes
7. **Denormalize carefully** — store `providerName` on Trip to avoid joins, but update when provider name changes

### Slug Generation

```javascript
// lib/utils.js
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// In API route when creating a trip
const slug = slugify(body.title);
// Check uniqueness
const existing = await Trip.findOne({ slug });
if (existing) {
  slug = `${slug}-${Date.now()}`;
}
```

### Commission Calculation

```javascript
// lib/utils.js
export function calculateCommission(price) {
  const rate = parseFloat(process.env.COMMISSION_RATE || "0.10");
  const commission = Math.round(price * rate * 100) / 100;
  const providerPayout = Math.round((price - commission) * 100) / 100;
  return { totalPrice: price, commission, providerPayout };
}
```

## Authentication

Read `references/auth.md` for complete NextAuth.js setup. Key rules:

### NextAuth Configuration

```javascript
// lib/auth.js
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "./mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        await connectDB();
        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");
        
        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");
        
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          providerId: user.providerId?.toString() || null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.providerId = user.providerId;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.providerId = token.providerId;
      session.user.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
```

### Key Auth Rules

1. **Passwords:** Always hash with `bcrypt.hash(password, 12)` — never store plain text
2. **Session:** Use JWT strategy (stateless, no session DB needed)
3. **Role in token:** Include `role` and `providerId` in JWT so every route can check access
4. **Google login:** Creates a tourist account by default. Providers register separately.
5. **Provider registration:** Creates both a User (role: provider) and a Provider document

## Stripe Integration

Read `references/stripe.md` for complete payment flow. Key rules:

### Stripe Instance

```javascript
// lib/stripe.js
import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});
```

### Checkout Flow

```
1. Tourist clicks "Book Now"
2. Client sends POST /api/stripe/checkout with { tripId, booking details }
3. Server creates Stripe Checkout Session with metadata
4. Server returns session URL → client redirects tourist to Stripe
5. Tourist pays on Stripe's hosted page
6. Stripe sends webhook to POST /api/stripe/webhook
7. Webhook creates Booking in database with commission split
8. Tourist lands on /booking/success
```

### Webhook Security

```javascript
// CRITICAL: Always verify webhook signature
const sig = request.headers.get("stripe-signature");
const body = await request.text();

let event;
try {
  event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET);
} catch (err) {
  return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
}
```

### Key Stripe Rules

1. **Never trust client-sent prices** — always fetch the trip price from the database
2. **Use metadata** to pass tripId, providerId, and booking details through checkout
3. **Webhook creates the booking** — not the checkout route. This ensures payment was actually received.
4. **Idempotency** — check if a booking with this stripeSessionId already exists before creating a duplicate
5. **Test mode** for MVP — use `sk_test_` and `pk_test_` keys

## Error Handling

```javascript
// Consistent error handling wrapper
export function withErrorHandler(handler) {
  return async (request, context) => {
    try {
      return await handler(request, context);
    } catch (error) {
      console.error(`API Error [${request.method} ${request.url}]:`, error);
      
      if (error.name === "ValidationError") {
        const details = Object.values(error.errors).map(e => e.message);
        return NextResponse.json({ error: "Validation failed", details }, { status: 400 });
      }
      
      if (error.name === "CastError") {
        return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
      }
      
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
  };
}

// Usage
export const GET = withErrorHandler(async (request) => {
  await connectDB();
  const trips = await Trip.find({ status: "approved" }).lean();
  return NextResponse.json(trips);
});
```

## Anti-Patterns (Never Do These)

- ❌ Calling your own API routes from server components — access MongoDB directly
- ❌ Storing passwords as plain text — always bcrypt with salt rounds 12
- ❌ Trusting client-sent prices or IDs without server-side validation
- ❌ Using `findById` with unvalidated input — can throw CastError
- ❌ Forgetting `await connectDB()` before database operations
- ❌ Creating Mongoose models without `mongoose.models.X ||` check
- ❌ Returning stack traces or internal errors to the client
- ❌ Hardcoding commission rates — use `process.env.COMMISSION_RATE`
- ❌ Processing payments without webhook verification
- ❌ Querying without indexes on filtered/sorted fields

## Reference Files

- `references/models.md` — Complete Mongoose schemas for Provider, Trip, Booking, Rating, User
- `references/auth.md` — Full NextAuth.js setup, registration flows, middleware, role-based access
- `references/stripe.md` — Complete Stripe Checkout + Webhook implementation with commission split
- `references/api-patterns.md` — Detailed API route examples for every endpoint
