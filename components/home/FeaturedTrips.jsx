import Link from "next/link";
import { ArrowRight } from "lucide-react";
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
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Featured Trips</h2>
            <p className="mt-1 text-gray-500">Top-rated trips from verified providers</p>
          </div>
          <Link
            href="/trips"
            className="hidden sm:flex items-center gap-1.5 text-sm font-medium text-teal-700 hover:text-teal-800 transition-colors"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <TripGrid trips={trips} />

        <div className="mt-6 text-center sm:hidden">
          <Link href="/trips" className="inline-flex items-center gap-1.5 text-sm font-medium text-teal-700">
            View all trips <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
