# Component Guide — Tripmor

Complete reference for every component in the Tripmor design system.

## Table of Contents

1. UI Primitives (Button, Input, Select, Badge, Modal, Spinner, EmptyState)
2. Layout Components (Navbar, Footer, WhatsAppButton, Sidebar)
3. Trip Components (TripCard, TripGrid, TripFilter, TripGallery, StarRating)
4. Booking Components (BookingForm, BookingSummary)
5. Homepage Sections (HeroSection, CategoryCards, FeaturedTrips, HowItWorks, CityShowcase, TrustSignals)
6. Dashboard Components (StatsCard, DataTable, ApprovalCard, EarningsChart)

---

## 1. UI Primitives

### Button

```jsx
// components/ui/Button.jsx
import { forwardRef } from "react";

const variants = {
  primary: "bg-black text-white hover:bg-neutral-800",
  coral: "bg-coral-500 text-white hover:bg-coral-600",
  secondary: "border border-neutral-200 bg-white text-neutral-900 hover:bg-neutral-50",
  dark: "bg-black text-white hover:bg-neutral-800",
  danger: "bg-red-600 text-white hover:bg-red-700",
  ghost: "text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900",
};

const sizes = {
  sm: "px-4 py-1.5 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3 text-base",
};

const Button = forwardRef(function Button(
  { variant = "primary", size = "md", pill = true, className = "", children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={`inline-flex items-center justify-center font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-coral-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${pill ? "rounded-full" : "rounded-lg"} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;
```

### Input

```jsx
// components/ui/Input.jsx
import { forwardRef } from "react";

const Input = forwardRef(function Input(
  { label, error, className = "", ...props },
  ref
) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`w-full rounded-lg border px-4 py-3 text-neutral-900 placeholder:text-neutral-400 transition-colors focus:outline-none focus:ring-1 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-neutral-200 focus:border-coral-500 focus:ring-coral-500"
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Input;
```

### Select

```jsx
// components/ui/Select.jsx
import { forwardRef } from "react";

const Select = forwardRef(function Select(
  { label, error, options = [], placeholder, className = "", ...props },
  ref
) {
  return (
    <div>
      {label && (
        <label className="mb-1 block text-sm font-medium text-neutral-700">
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={`w-full rounded-lg border border-neutral-200 px-4 py-3 text-neutral-900 focus:border-coral-500 focus:outline-none focus:ring-1 focus:ring-coral-500 ${className}`}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>{placeholder}</option>
        )}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
});

export default Select;
```

### Badge

```jsx
// components/ui/Badge.jsx
const variants = {
  default: "bg-neutral-100 text-neutral-700",
  coral: "bg-coral-50 text-coral-600",
  amber: "bg-amber-50 text-amber-700",
  success: "bg-green-50 text-green-700",
  warning: "bg-amber-50 text-amber-700",
  danger: "bg-red-50 text-red-700",
};

export default function Badge({ variant = "default", className = "", children }) {
  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
```

### Modal

```jsx
// components/ui/Modal.jsx
"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      {/* Content */}
      <div className="relative w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-neutral-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
```

### Spinner

```jsx
// components/ui/Spinner.jsx
export default function Spinner({ size = "md", className = "" }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  return (
    <svg
      className={`animate-spin text-neutral-900 ${sizes[size]} ${className}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
```

### EmptyState

```jsx
// components/ui/EmptyState.jsx
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-200 px-6 py-16 text-center">
      {Icon && <Icon className="h-12 w-12 text-neutral-300" />}
      <h3 className="mt-4 text-lg font-semibold text-neutral-900">{title}</h3>
      {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
```

---

## 2. Layout Components

### WhatsAppButton

```jsx
// components/layout/WhatsAppButton.jsx
import { MessageCircle } from "lucide-react";

export default function WhatsAppButton({ phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER }) {
  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  );
}
```

### Sidebar (Dashboard)

```jsx
// Pattern for dashboard sidebar
// components/provider/ProviderSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Calendar, DollarSign, Settings } from "lucide-react";

const navItems = [
  { href: "/provider", label: "Dashboard", icon: LayoutDashboard },
  { href: "/provider/trips", label: "My Trips", icon: Map },
  { href: "/provider/bookings", label: "Bookings", icon: Calendar },
  { href: "/provider/earnings", label: "Earnings", icon: DollarSign },
  { href: "/provider/settings", label: "Settings", icon: Settings },
];

export default function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-neutral-200 bg-white lg:block">
      <nav className="flex flex-col gap-1 p-4">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-coral-50 text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

---

## 3. Trip Components

### StarRating

```jsx
// components/trips/StarRating.jsx
import { Star } from "lucide-react";

export default function StarRating({ rating = 0, count, size = "md" }) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizes[size]} ${
            star <= Math.round(rating) ? "fill-amber-400 text-amber-400" : "text-gray-200"
          }`}
        />
      ))}
      {count !== undefined && (
        <span className={`ml-1 text-neutral-500 ${textSizes[size]}`}>({count})</span>
      )}
    </div>
  );
}
```

### TripGrid

```jsx
// components/trips/TripGrid.jsx
import TripCard from "./TripCard";
import EmptyState from "@/components/ui/EmptyState";
import { Map } from "lucide-react";

export default function TripGrid({ trips }) {
  if (!trips || trips.length === 0) {
    return (
      <EmptyState
        icon={Map}
        title="No trips found"
        description="Try adjusting your filters or check back later for new trips."
      />
    );
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => (
        <TripCard key={trip._id} trip={trip} />
      ))}
    </div>
  );
}
```

---

## 5. Homepage Sections

### HeroSection Pattern

```jsx
// components/home/HeroSection.jsx
// Minimal hero: white bg, serif headline, clean CTA pair
export default function HeroSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="font-serif text-4xl leading-tight md:text-5xl lg:text-6xl">
            Explore Morocco, Your Way
          </h1>
          <p className="mt-6 text-lg text-neutral-500">
            Book private transfers, day trips, and multi-day tours with trusted
            local transport companies across Morocco.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <button className="rounded-full bg-coral-500 px-8 py-3 font-semibold text-white hover:bg-coral-600">
              Get Started
            </button>
            <button className="rounded-full border border-neutral-200 px-8 py-3 font-semibold text-neutral-900 hover:bg-neutral-50">
              How It Works
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
```

### CategoryCards Pattern

```jsx
// components/home/CategoryCards.jsx
import Link from "next/link";
import { Car, Compass, Mountain, Calendar } from "lucide-react";

const categories = [
  { name: "Private Transfers", slug: "private-transfers", icon: Car, description: "Airport & city-to-city" },
  { name: "Day Trips", slug: "day-trips", icon: Compass, description: "One-day guided excursions" },
  { name: "Multi-Day Tours", slug: "multi-day-tours", icon: Mountain, description: "2+ day adventures" },
  { name: "Car Rental", slug: "car-rental", icon: Calendar, description: "Car + driver hire" },
];

export default function CategoryCards() {
  return (
    <section className="bg-neutral-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <h2 className="font-serif text-2xl md:text-3xl">How do you want to travel?</h2>
      <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map(({ name, slug, icon: Icon, description }) => (
          <Link
            key={slug}
            href={`/categories/${slug}`}
            className="group flex flex-col items-center gap-3 rounded-2xl border border-neutral-100 bg-white p-6 text-center transition-all hover:shadow-sm"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-coral-50 text-neutral-900 transition-colors group-hover:bg-coral-100">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-semibold text-neutral-900">{name}</h3>
            <p className="mt-1 text-sm text-neutral-500">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

### HowItWorks Pattern

```jsx
// components/home/HowItWorks.jsx
import { Search, CreditCard, MessageCircle } from "lucide-react";

const steps = [
  { icon: Search, title: "Choose your trip", description: "Browse transfers, day trips, and tours across Morocco" },
  { icon: CreditCard, title: "Book & pay securely", description: "Pay online with your card. Instant confirmation." },
  { icon: MessageCircle, title: "Get WhatsApp confirmation", description: "Receive your booking details and connect with us directly." },
];

export default function HowItWorks() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center font-serif text-2xl md:text-3xl">How it works</h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-neutral-50">
                <Icon className="h-6 w-6 text-neutral-700" />
              </div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-neutral-400">Step {i + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-neutral-900">{title}</h3>
              <p className="mt-2 text-sm text-neutral-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 6. Dashboard Components

### StatsCard

```jsx
// components/admin/StatsCards.jsx
export function StatsCard({ label, value, change, icon: Icon }) {
  const isPositive = change && change > 0;
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        {Icon && (
          <div className="rounded-lg bg-coral-50 p-2 text-neutral-900">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <p className="mt-2 text-3xl font-bold text-neutral-900">{value}</p>
      {change !== undefined && (
        <p className={`mt-1 text-sm ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isPositive ? "+" : ""}{change}% from last month
        </p>
      )}
    </div>
  );
}
```

### DataTable Pattern

```jsx
// Dashboard table pattern — used for bookings, trips, providers
// Always wrap in overflow-x-auto for mobile
<div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
  <div className="overflow-x-auto">
    <table className="w-full min-w-[600px]">
      <thead>
        <tr className="border-b border-neutral-200 bg-neutral-50">
          <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-neutral-500">Column</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">
        <tr className="hover:bg-neutral-50">
          <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-900">Data</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>
```

---

## Composition Rules

1. **Homepage:** HeroSection → CategoryCards → FeaturedTrips → HowItWorks → CityShowcase → TrustSignals
2. **Trip listing page:** TripFilter (client) + TripGrid (server-passed data)
3. **Trip detail:** TripGallery → Trip info → BookingForm → StarRating
4. **Dashboard pages:** Sidebar → TopBar → StatsCards → DataTable/Content
5. **Auth pages:** Centered card with logo above, form inside, link below
