# Component Guide — Tripmor

Complete reference for every component. All use shadcn/ui primitives and CSS variable-based colors.

---

## 1. UI Primitives (shadcn/ui — do not edit)

Installed via `npx shadcn@latest add <component>`:

- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `components/ui/select.tsx`
- `components/ui/label.tsx`
- `components/ui/separator.tsx`
- `components/ui/dialog.tsx`

### EmptyState (custom)

```jsx
// components/ui/EmptyState.jsx
import { cn } from "@/lib/utils";

export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border px-6 py-16 text-center",
      className
    )}>
      {Icon && <Icon className="h-12 w-12 text-muted-foreground/40" />}
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
```

### Spinner (custom)

```jsx
// components/ui/Spinner.jsx
import { cn } from "@/lib/utils";

export default function Spinner({ size = "md", className }) {
  const sizes = { sm: "h-4 w-4", md: "h-6 w-6", lg: "h-8 w-8" };
  return (
    <svg className={cn("animate-spin text-primary", sizes[size], className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}
```

---

## 2. Trip Components

### StarRating

```jsx
// components/trips/StarRating.jsx
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export default function StarRating({ rating = 0, count, size = "md" }) {
  const sizes = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-5 w-5" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={cn(sizes[size], star <= Math.round(rating) ? "fill-accent text-accent" : "text-muted-foreground/30")}
        />
      ))}
      {count !== undefined && (
        <span className={cn("ml-1 text-muted-foreground", textSizes[size])}>({count})</span>
      )}
    </div>
  );
}
```

### TripCard

```jsx
// components/trips/TripCard.jsx
import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/trips/StarRating";
import { formatPrice } from "@/lib/utils";

export default function TripCard({ trip }) {
  const { _id, title, shortDescription, images, price, duration, departureCity, destinationCity, maxPassengers, averageRating, totalRatings, category } = trip;
  const location = destinationCity ? `${departureCity} → ${destinationCity}` : departureCity;

  return (
    <Link href={`/trips/${_id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5">
        <div className="relative aspect-[4/3] overflow-hidden">
          {images?.[0] ? (
            <Image src={images[0]} alt={title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          ) : (
            <div className="h-full w-full bg-muted flex items-center justify-center">
              <MapPin className="h-10 w-10 text-muted-foreground/30" />
            </div>
          )}
          <div className="absolute left-3 top-3">
            <Badge className="capitalize bg-background/90 text-foreground border-0 backdrop-blur-sm shadow-sm">
              {category?.replace(/-/g, " ")}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-foreground line-clamp-1">{title}</h3>
          {shortDescription && <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{shortDescription}</p>}
          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3 text-primary" />{location}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3 text-primary" />{duration}</span>
            <span className="flex items-center gap-1"><Users className="h-3 w-3 text-primary" />Up to {maxPassengers}</span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <StarRating rating={averageRating} count={totalRatings > 0 ? totalRatings : undefined} size="sm" />
            <p className="font-semibold text-primary">{formatPrice(price)}</p>
          </div>
        </CardContent>
      </Card>
    </Link>
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
    return <EmptyState icon={Map} title="No trips found" description="Try adjusting your filters or check back later." />;
  }
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {trips.map((trip) => <TripCard key={trip._id} trip={trip} />)}
    </div>
  );
}
```

---

## 3. Layout Components

### Sidebar (Dashboard)

```jsx
// components/provider/ProviderSidebar.jsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Map, Calendar, DollarSign, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

const navItems = [
  { href: "/provider", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/provider/trips", label: "My Trips", icon: Map },
  { href: "/provider/bookings", label: "Bookings", icon: Calendar },
  { href: "/provider/earnings", label: "Earnings", icon: DollarSign },
  { href: "/provider/settings", label: "Settings", icon: Settings },
];

export default function ProviderSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-background lg:flex flex-col">
      <div className="p-4 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-primary-foreground text-xs font-bold">T</div>
          <span className="font-bold text-foreground">Trip<span className="text-primary">mor</span></span>
        </Link>
      </div>
      <nav className="flex flex-col gap-1 p-3 flex-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const isActive = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
```

### StatsCard (Dashboard)

```jsx
// components/admin/StatsCards.jsx
import { Card, CardContent } from "@/components/ui/card";

export function StatsCard({ label, value, change, icon: Icon }) {
  const isPositive = change && change > 0;
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          {Icon && (
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Icon className="h-4 w-4" />
            </div>
          )}
        </div>
        <p className="mt-2 text-3xl font-bold text-foreground">{value}</p>
        {change !== undefined && (
          <p className={cn("mt-1 text-sm", isPositive ? "text-green-600" : "text-destructive")}>
            {isPositive ? "+" : ""}{change}% from last month
          </p>
        )}
      </CardContent>
    </Card>
  );
}
```

### DataTable Pattern

```jsx
// Always wrap in overflow-x-auto for mobile
<Card>
  <div className="overflow-x-auto">
    <table className="w-full min-w-[600px]">
      <thead>
        <tr className="border-b border-border">
          <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Column
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-border">
        <tr className="hover:bg-muted/50 transition-colors">
          <td className="whitespace-nowrap px-4 py-3 text-sm text-foreground">Data</td>
        </tr>
      </tbody>
    </table>
  </div>
</Card>
```

---

## 4. Auth Pages Pattern

```jsx
// Centered card layout — (auth)/layout.jsx handles centering
// Each auth page is a simple card:

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <p className="text-sm text-muted-foreground">Sign in to your account</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="you@example.com" className="mt-1" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" className="mt-1" />
        </div>
        <Button className="w-full">Sign in</Button>
      </CardContent>
    </Card>
  );
}
```

---

## 5. Loading Skeletons

Every page with data fetching must have `loading.jsx`:

```jsx
// Skeleton pattern — animate-pulse gray blocks
export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="h-9 w-48 animate-pulse rounded-lg bg-muted" />
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border">
            <div className="aspect-[4/3] animate-pulse bg-muted" />
            <div className="space-y-3 p-4">
              <div className="h-5 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
              <div className="flex justify-between">
                <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                <div className="h-5 w-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

## 6. Composition Rules

1. **Homepage:** HeroSection → TrustSignals → CategoryCards → FeaturedTrips → HowItWorks → CityShowcase → Provider CTA
2. **Trip listing:** TripFilter (client) + TripGrid (server data)
3. **Trip detail:** Image gallery → Trip info → BookingForm → StarRating list
4. **Dashboard:** Sidebar + TopBar → StatsCards → DataTable/Content
5. **Auth pages:** Centered card with logo above (handled by layout)
