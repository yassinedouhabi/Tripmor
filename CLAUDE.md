# CLAUDE.md — Tripmor Project Reference

## Project Overview

**Brand:** Tripmor
**Tagline:** Book tourist transport across Morocco
**Product:** Multi-vendor marketplace for tourist transport services in Morocco (expanding globally later)
**Version:** MVP

### What Is Tripmor?

Tripmor is a SaaS marketplace that connects tourists with local transport companies in Morocco. Transport providers sign up, list their trips and transfers, and tourists browse, book, and pay — all through the platform. Tripmor takes a commission on every booking.

Think Airbnb, but for tourist transport in Morocco.

### Business Model

- **Commission per booking:** Percentage TBD (to be decided before launch)
- **Premium subscription:** Not in MVP — planned for future (featured listings, analytics, priority placement)
- **Revenue split:** Tourist pays full price → Tripmor takes commission → Provider receives the rest

### User Roles

| Role     | Description                                                   |
|----------|---------------------------------------------------------------|
| Tourist  | Browses trips, books as guest OR with account, pays, rates    |
| Provider | Signs up, lists trips, manages bookings, sees earnings        |
| Admin    | Approves providers & trips, manages platform, sees all data   |

### Tourist Account System

Tourists have **two options at checkout:**

1. **Continue as Guest** — fill in name, email, pickup details, and pay (no account needed)
2. **Login / Create Account** — login with existing account or create one, then checkout with pre-filled info

**Account creation methods:** Email + password, or Google login

**Benefits of a tourist account:**
- Pre-filled checkout info (name, email) for faster booking
- View past bookings history

### Core Flow

```
Tourist Flow (Guest):
Browse → Select Trip → Checkout as Guest → Fill Details → Pay (Stripe) → WhatsApp Confirmation

Tourist Flow (Account):
Browse → Select Trip → Login / Create Account → Pre-filled Checkout → Pay (Stripe) → WhatsApp Confirmation

Provider Flow:
Sign Up (email + phone) → Admin Approves → List Trips → Admin Approves Trips → Receive Bookings → Get Paid

Admin Flow:
Approve Providers → Approve Trips → Monitor Bookings → Track Revenue
```

---

## Tech Stack

| Layer          | Technology                | Notes                                    |
|----------------|---------------------------|------------------------------------------|
| Framework      | Next.js 14+ (App Router)  | SSR for SEO, API routes for backend      |
| Language       | JavaScript                |                                          |
| Styling        | Tailwind CSS              | Mobile-first, responsive                 |
| Database       | MongoDB Atlas             | Free tier (512MB)                        |
| ODM            | Mongoose                  | Schema validation                        |
| Payment        | Stripe (test mode for MVP)| Stripe Connect for marketplace payouts   |
| Auth           | NextAuth.js               | Provider login + Admin login             |
| WhatsApp       | wa.me/ links              | Floating button + booking confirmation   |
| Deployment     | Vercel                    | Free tier                                |
| Image Storage  | Cloudinary (free tier)    | Trip photos, provider logos              |

---

## Services / Trip Categories

1. **Private Transfers** — Airport pickups, city-to-city transfers
2. **Day Trips** — One-day guided excursions
3. **Multi-Day Tours** — 2+ day tours with accommodation stops
4. **Car Rental with Driver** — Full-day or multi-day car + driver hire

**Initial Coverage:** All major Moroccan cities (Marrakech, Fes, Casablanca, Rabat, Tangier, Agadir, Ouarzazate, Essaouira, Chefchaouen, Meknes, etc.)

**Future:** Global expansion

---

## Project Structure

```
tripmor/
├── app/
│   ├── page.js                          # Homepage
│   ├── layout.js                        # Global layout (nav, footer, WhatsApp)
│   ├── globals.css                      # Tailwind + global styles
│   │
│   ├── trips/
│   │   ├── page.js                      # All trips listing (filterable)
│   │   └── [id]/page.js                 # Single trip detail + booking form
│   │
│   ├── categories/
│   │   └── [slug]/page.js              # Trips filtered by category
│   │
│   ├── cities/
│   │   └── [slug]/page.js              # Trips filtered by city
│   │
│   ├── booking/
│   │   └── success/page.js             # Post-payment confirmation
│   │
│   ├── about/page.js                   # About Tripmor
│   ├── how-it-works/page.js            # 3-step guide for tourists
│   ├── contact/page.js                 # Contact + WhatsApp
│   ├── faq/page.js                     # FAQ
│   ├── become-a-provider/page.js       # Provider signup landing page
│   │
│   ├── auth/
│   │   ├── login/page.js               # Provider + Admin + Tourist login
│   │   └── register/page.js            # Provider registration + Tourist signup
│   │
│   ├── account/
│   │   ├── page.js                      # Tourist account overview
│   │   └── bookings/page.js            # Tourist's past bookings
│   │
│   ├── provider/
│   │   ├── page.js                      # Provider dashboard (overview)
│   │   ├── trips/
│   │   │   ├── page.js                  # Provider's trip listings
│   │   │   ├── new/page.js              # Add new trip
│   │   │   └── [id]/edit/page.js        # Edit trip
│   │   ├── bookings/page.js             # Provider's bookings
│   │   ├── earnings/page.js             # Provider's earnings
│   │   └── settings/page.js             # Provider profile settings
│   │
│   ├── admin/
│   │   ├── page.js                      # Admin dashboard (stats, overview)
│   │   ├── providers/page.js            # Manage providers (approve/reject)
│   │   ├── trips/page.js               # Manage trips (approve/reject)
│   │   ├── bookings/page.js            # All bookings
│   │   └── revenue/page.js             # Revenue & commission tracking
│   │
│   └── api/
│       ├── trips/
│       │   ├── route.js                 # GET all (public), POST new (provider)
│       │   └── [id]/
│       │       ├── route.js             # GET one, PUT update, DELETE
│       │       └── rate/route.js        # POST star rating
│       ├── bookings/
│       │   ├── route.js                 # GET (provider/admin), POST new
│       │   └── [id]/route.js            # GET one, PUT update status
│       ├── providers/
│       │   ├── route.js                 # GET all (admin), POST register
│       │   └── [id]/route.js            # GET one, PUT approve/reject
│       ├── stripe/
│       │   ├── checkout/route.js        # Create Stripe Checkout session
│       │   └── webhook/route.js         # Handle payment confirmation
│       ├── auth/
│       │   └── [...nextauth]/route.js   # NextAuth config
│       └── admin/
│           ├── stats/route.js           # Dashboard statistics
│           └── revenue/route.js         # Revenue data
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx                   # Site navigation (responsive)
│   │   ├── Footer.jsx                   # Site footer
│   │   └── WhatsAppButton.jsx           # Floating WhatsApp button
│   ├── trips/
│   │   ├── TripCard.jsx                 # Trip listing card
│   │   ├── TripGrid.jsx                # Grid of trip cards
│   │   ├── TripFilter.jsx              # Filter by category, city, price
│   │   ├── TripGallery.jsx             # Image gallery on detail page
│   │   └── StarRating.jsx              # Star rating display + input
│   ├── booking/
│   │   ├── BookingForm.jsx              # Booking details form
│   │   └── BookingSummary.jsx           # Order summary before payment
│   ├── home/
│   │   ├── HeroSection.jsx              # Homepage hero with search
│   │   ├── CategoryCards.jsx            # 4 service categories
│   │   ├── FeaturedTrips.jsx            # Top/popular trips
│   │   ├── HowItWorks.jsx              # 3-step process
│   │   ├── CityShowcase.jsx            # Popular cities
│   │   └── TrustSignals.jsx            # Stats, reviews summary
│   ├── provider/
│   │   ├── ProviderSidebar.jsx          # Dashboard sidebar nav
│   │   ├── TripForm.jsx                # Add/edit trip form
│   │   ├── BookingTable.jsx            # Bookings list table
│   │   └── EarningsChart.jsx           # Revenue chart
│   ├── admin/
│   │   ├── AdminSidebar.jsx            # Admin sidebar nav
│   │   ├── ApprovalCard.jsx            # Provider/trip approval card
│   │   └── StatsCards.jsx              # Dashboard stat cards
│   └── ui/
│       ├── Button.jsx                   # Reusable button
│       ├── Input.jsx                    # Form input
│       ├── Select.jsx                   # Dropdown select
│       ├── Modal.jsx                    # Modal dialog
│       ├── Badge.jsx                    # Status badges
│       ├── Spinner.jsx                  # Loading spinner
│       └── EmptyState.jsx              # Empty state placeholder
│
├── lib/
│   ├── mongodb.js                       # MongoDB connection singleton
│   ├── stripe.js                        # Stripe instance
│   ├── auth.js                          # NextAuth configuration
│   ├── utils.js                         # Helper functions
│   └── constants.js                     # Categories, cities, config
│
├── models/
│   ├── Trip.js                          # Trip schema
│   ├── Booking.js                       # Booking schema
│   ├── Provider.js                      # Provider schema
│   ├── User.js                          # User schema (providers + admin)
│   └── Rating.js                        # Star rating schema
│
├── middleware.js                         # Route protection (auth middleware)
│
├── public/
│   ├── images/                          # Static images
│   └── logo.svg                         # Tripmor logo
│
├── .env.local                           # Environment variables
├── CLAUDE.md                            # This file
├── package.json
├── tailwind.config.js
└── next.config.js
```

---

## Database Schemas

### Provider

```javascript
{
  name: String,               // "Douhabi Transport Touristique"
  slug: String,               // "douhabi-transport"
  email: String,              // Login email
  phone: String,              // WhatsApp number
  password: String,           // Hashed
  description: String,        // About the company
  logo: String,               // Cloudinary URL
  status: String,             // "pending" | "approved" | "rejected" | "suspended"
  totalTrips: Number,         // Count of listed trips (denormalized)
  totalBookings: Number,      // Count of completed bookings (denormalized)
  averageRating: Number,      // Average star rating across all trips
  stripeAccountId: String,    // Stripe Connect account ID (for payouts)
  createdAt: Date,
  updatedAt: Date
}
```

### Trip

```javascript
{
  providerId: ObjectId,       // Reference to Provider
  providerName: String,       // Denormalized
  title: String,              // "Marrakech Airport to Hotel — Private Transfer"
  slug: String,               // "marrakech-airport-to-hotel"
  category: String,           // "private-transfers" | "day-trips" | "multi-day-tours" | "car-rental"
  description: String,        // Full description
  shortDescription: String,   // For cards (max 150 chars)
  images: [String],           // Cloudinary URLs
  price: Number,              // Price set by provider in MAD
  currency: "MAD",
  duration: String,           // "45 minutes" | "Full day" | "3 days / 2 nights"
  departureCity: String,      // "Marrakech"
  destinationCity: String,    // "Essaouira"
  maxPassengers: Number,
  included: [String],         // ["Air-conditioned vehicle", "Meet & greet"]
  notIncluded: [String],      // ["Meals", "Tips"]
  highlights: [String],       // Key selling points
  averageRating: Number,      // Average star rating
  totalRatings: Number,       // Number of ratings
  status: String,             // "pending" | "approved" | "rejected"
  isActive: Boolean,          // Provider can deactivate without deleting
  createdAt: Date,
  updatedAt: Date
}
```

### Booking

```javascript
{
  tripId: ObjectId,           // Reference to Trip
  providerId: ObjectId,       // Reference to Provider
  userId: ObjectId,           // Reference to User (null if guest checkout)
  tripTitle: String,          // Denormalized
  providerName: String,       // Denormalized
  customerName: String,       // Guest name
  customerEmail: String,      // Guest email
  pickupDate: String,         // "15 March 2026"
  pickupTime: String,         // "10:00 AM"
  pickupLocation: String,     // "Marrakech Menara Airport"
  passengers: Number,
  totalPrice: Number,         // Full price paid by tourist (MAD)
  commission: Number,         // Tripmor's cut (MAD)
  providerPayout: Number,     // Provider's share (MAD)
  stripeSessionId: String,    // Stripe reference
  paymentStatus: String,      // "pending" | "paid" | "refunded"
  bookingStatus: String,      // "confirmed" | "completed" | "cancelled"
  whatsappSent: Boolean,
  rated: Boolean,             // Whether tourist has rated this booking
  notes: String,              // Admin notes
  createdAt: Date,
  updatedAt: Date
}
```

### Rating

```javascript
{
  tripId: ObjectId,           // Reference to Trip
  bookingId: ObjectId,        // Reference to Booking (ensures one rating per booking)
  providerId: ObjectId,       // Reference to Provider
  customerName: String,       // Tourist's name
  stars: Number,              // 1-5 star rating
  createdAt: Date
}
```

### User (Auth)

```javascript
{
  email: String,
  password: String,           // Hashed (null if Google login)
  name: String,               // For tourists (pre-fill checkout)
  role: String,               // "tourist" | "provider" | "admin"
  providerId: ObjectId,       // Reference to Provider (if role is provider)
  googleId: String,           // Google OAuth ID (if signed up via Google)
  authMethod: String,         // "credentials" | "google"
  createdAt: Date
}
```

---

## API Endpoints

### Public (No auth required)

| Method | Endpoint                    | Purpose                               |
|--------|-----------------------------|---------------------------------------|
| GET    | /api/trips                  | List all approved + active trips      |
| GET    | /api/trips/[id]             | Get single trip with ratings          |
| POST   | /api/stripe/checkout        | Create Stripe Checkout session        |
| POST   | /api/stripe/webhook         | Stripe payment webhook                |

### Provider (Auth: provider role)

| Method | Endpoint                    | Purpose                               |
|--------|-----------------------------|---------------------------------------|
| GET    | /api/trips?provider=me      | List provider's own trips             |
| POST   | /api/trips                  | Create new trip (status: pending)     |
| PUT    | /api/trips/[id]             | Update own trip                       |
| DELETE | /api/trips/[id]             | Delete own trip                       |
| GET    | /api/bookings?provider=me   | List provider's bookings              |
| GET    | /api/bookings/[id]          | Get single booking detail             |

### Admin (Auth: admin role)

| Method | Endpoint                    | Purpose                               |
|--------|-----------------------------|---------------------------------------|
| GET    | /api/providers              | List all providers                    |
| GET    | /api/providers/[id]         | Get single provider                   |
| PUT    | /api/providers/[id]         | Approve/reject/suspend provider       |
| GET    | /api/trips?status=pending   | List trips pending approval           |
| PUT    | /api/trips/[id]             | Approve/reject trip                   |
| GET    | /api/bookings               | List all bookings                     |
| GET    | /api/admin/stats            | Dashboard statistics                  |
| GET    | /api/admin/revenue          | Revenue & commission data             |

### Auth

| Method | Endpoint                    | Purpose                               |
|--------|-----------------------------|---------------------------------------|
| POST   | /api/providers              | Register new provider                 |
| POST   | /api/auth/[...nextauth]     | NextAuth login/session                |

### Rating

| Method | Endpoint                    | Purpose                               |
|--------|-----------------------------|---------------------------------------|
| POST   | /api/trips/[id]/rate        | Submit star rating (1-5)              |

---

## Pages

### Public Pages (Tourist-facing)

| Route                    | Page                  | Description                                    |
|--------------------------|-----------------------|------------------------------------------------|
| /                        | Homepage              | Hero, search, categories, featured trips, CTA  |
| /trips                   | All Trips             | Filterable grid of all approved trips          |
| /trips/[id]              | Trip Detail           | Photos, info, ratings, booking form, price     |
| /categories/[slug]       | Category Page         | Trips filtered by category                     |
| /cities/[slug]           | City Page             | Trips filtered by city                         |
| /booking/success         | Booking Confirmation  | Thank you + WhatsApp info + rate prompt        |
| /about                   | About Tripmor         | Platform story, mission, trust signals         |
| /how-it-works            | How It Works          | 3-step visual guide for tourists               |
| /become-a-provider       | Provider Landing      | CTA for transport companies to join            |
| /contact                 | Contact               | WhatsApp link, email, form                     |
| /faq                     | FAQ                   | Common questions                               |

### Auth Pages

| Route                    | Page                  | Description                                    |
|--------------------------|-----------------------|------------------------------------------------|
| /auth/login              | Login                 | All roles: email/password + Google login       |
| /auth/register           | Register              | Provider registration OR tourist signup        |

### Tourist Account (Auth: tourist)

| Route                    | Page                  | Description                                    |
|--------------------------|-----------------------|------------------------------------------------|
| /account                 | My Account            | Profile overview, name, email                  |
| /account/bookings        | My Bookings           | Past booking history with trip details         |

### Provider Dashboard (Auth: provider)

| Route                    | Page                  | Description                                    |
|--------------------------|-----------------------|------------------------------------------------|
| /provider                | Dashboard             | Overview: bookings, earnings, trip stats       |
| /provider/trips          | My Trips              | List of provider's trips + status              |
| /provider/trips/new      | Add Trip              | Form to create new trip                        |
| /provider/trips/[id]/edit| Edit Trip             | Edit existing trip                             |
| /provider/bookings       | My Bookings           | All bookings for provider's trips              |
| /provider/earnings       | Earnings              | Revenue breakdown, payout history              |
| /provider/settings       | Settings              | Profile, company info, WhatsApp number         |

### Admin Dashboard (Auth: admin)

| Route                    | Page                  | Description                                    |
|--------------------------|-----------------------|------------------------------------------------|
| /admin                   | Dashboard             | Platform stats, recent activity                |
| /admin/providers         | Manage Providers      | Approve/reject/suspend providers               |
| /admin/trips             | Manage Trips          | Approve/reject trip listings                   |
| /admin/bookings          | All Bookings          | Every booking on the platform                  |
| /admin/revenue           | Revenue               | Total revenue, commission earned, charts        |

---

## Environment Variables (.env.local)

```
# Database
MONGODB_URI=mongodb+srv://...

# Auth
NEXTAUTH_SECRET=random-secret-string
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (for tourist login)
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Stripe (test mode for MVP)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary (image uploads)
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# WhatsApp
WHATSAPP_NUMBER=212XXXXXXXXX

# Platform Config
COMMISSION_RATE=0.10
PLATFORM_NAME=Tripmor
```

---

## Authentication & Authorization

### NextAuth.js Configuration

- **Providers:** Credentials (email + password) + Google OAuth
- **Roles:** tourist, provider, admin
- **Session strategy:** JWT
- **Middleware:** Protect /provider/*, /admin/*, /account/* routes

### Route Protection

```
/account/*   → Must be logged in with role "tourist"
/provider/*  → Must be logged in with role "provider" + status "approved"
/admin/*     → Must be logged in with role "admin"
/api/trips POST/PUT/DELETE → Must be provider (own trips) or admin
/api/bookings GET → Tourist sees own, Provider sees own, Admin sees all
/api/providers/* → Admin only (except POST for registration)
```

---

## Payment Flow (Stripe Test Mode)

```
1. Tourist clicks "Book Now" on trip detail page
2. Frontend sends POST to /api/stripe/checkout with trip + booking details
3. Backend creates Stripe Checkout Session with:
   - Line item: trip price
   - Metadata: tripId, providerId, customer details, booking info
   - Success URL: /booking/success?session_id={CHECKOUT_SESSION_ID}
   - Cancel URL: /trips/[id]
4. Tourist is redirected to Stripe Checkout (hosted page)
5. Tourist pays with test card
6. Stripe sends webhook to /api/stripe/webhook
7. Webhook handler:
   - Creates Booking in database
   - Calculates commission and provider payout
   - Updates provider stats
   - Triggers WhatsApp notification (via wa.me link on success page)
8. Tourist lands on /booking/success with confirmation details
```

### Stripe Test Cards

```
Success: 4242 4242 4242 4242
Decline: 4000 0000 0000 0002
3D Secure: 4000 0025 0000 3155
```

---

## MVP Scope

### In MVP (Build Now)

- Tourist browsing and search (by category, city, price)
- Tourist checkout: guest OR create account / login
- Tourist account: view past bookings, pre-filled checkout
- Google login + email/password for tourists
- Provider registration (email + phone)
- Admin approval of providers and trips
- Provider dashboard (add trips, view bookings, see earnings)
- Admin dashboard (stats, approvals, all bookings, revenue)
- Stripe payment (test mode)
- Star ratings (1-5, no written reviews)
- WhatsApp button on every page
- Booking confirmation page with WhatsApp link
- Responsive mobile-first design
- SSR for SEO

### Not in MVP (Future)

- Written reviews
- Premium provider subscriptions (featured listings, analytics)
- Multiple currencies (currency switcher)
- Multilingual (EN/FR/AR)
- Cancellation/refund system (handle manually via WhatsApp for now)
- Save favorite trips
- Rebook previous trips quickly
- Chat between tourist and provider
- Advanced analytics for providers
- Push notifications
- Provider ID/license verification
- Stripe Connect live payouts (using test mode for MVP)
- Blog for SEO
- Global expansion beyond Morocco

---

## Design Direction

- **Style:** Clean, modern, Airbnb-inspired
- **Primary Color:** Deep Teal (#0F766E) — trust, travel, professionalism
- **Accent Color:** Amber (#F59E0B) — warmth, Morocco, CTAs and highlights
- **Typography:** Inter (via Tailwind default) or similar clean sans-serif
- **Mobile-first:** Tourists browse on phones
- **WhatsApp button:** Floating bottom-right on every page (green)
- **Trust signals:** Ratings, number of trips, provider verification badge

---

## Moroccan Cities (Initial Coverage)

Marrakech, Fes, Casablanca, Rabat, Tangier, Agadir, Ouarzazate, Essaouira, Chefchaouen, Meknes, Errachidia, Merzouga, Nador, Oujda, Tetouan, El Jadida, Ifrane

---

## Build Order (MVP)

1. ✅ Project planning complete
2. ⬜ Project setup (Next.js + Tailwind + MongoDB connection)
3. ⬜ Database models (Provider, Trip, Booking, Rating, User)
4. ⬜ Auth system (NextAuth.js + middleware)
5. ⬜ Homepage design
6. ⬜ Global layout (Navbar, Footer, WhatsApp button)
7. ⬜ Provider registration + login
8. ⬜ Admin dashboard + provider approval
9. ⬜ Provider dashboard + trip management (add/edit)
10. ⬜ Admin trip approval
11. ⬜ Public trip listing + filters
12. ⬜ Trip detail page + booking form
13. ⬜ Stripe payment integration (test mode)
14. ⬜ Booking confirmation + WhatsApp flow
15. ⬜ Star rating system
16. ⬜ Provider earnings page
17. ⬜ Admin revenue page
18. ⬜ Responsive polish + testing
19. ⬜ Deployment (Vercel + MongoDB Atlas)
20. ⬜ Domain + go live

---

## Commands

```bash
# Setup
npx create-next-app@latest tripmor
npm install mongoose stripe next-auth bcryptjs

# Development
npm run dev              # localhost:3000

# Build & Deploy
npm run build
npm run start

# Stripe CLI (for webhook testing)
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Notes

- MVP first — launch fast, iterate based on real feedback
- No tax on bookings (prices are final)
- Tourists can book as guest OR create an account (email/password or Google)
- Tourist accounts enable: past bookings view + pre-filled checkout
- Cancellations handled manually via WhatsApp for now
- Star ratings only (no written reviews in MVP)
- Stripe test mode for MVP — switch to live when ready
- Douhabi Transport Touristique is the first provider
- All trip prices are set by providers in MAD
- Commission rate stored in env variable for easy adjustment
- Brand colors: Deep Teal (#0F766E) + Amber (#F59E0B)
