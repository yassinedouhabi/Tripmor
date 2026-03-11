import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import TripGrid from "@/components/trips/TripGrid";

async function getFeaturedTrips() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/trips?status=approved&limit=6`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 6) : (data.trips ?? []);
  } catch {
    return [];
  }
}

export default async function FeaturedTrips() {
  const trips = await getFeaturedTrips();

  return (
    <section className="bg-muted/40 border-y border-border py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">Featured Trips</h2>
            <p className="mt-1 text-muted-foreground">Top-rated trips from verified providers</p>
          </div>
          <Button variant="ghost" asChild className="hidden sm:flex text-primary hover:text-primary gap-1">
            <Link href="/trips">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <TripGrid trips={trips} />

        <div className="mt-8 text-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/trips">View all trips</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
