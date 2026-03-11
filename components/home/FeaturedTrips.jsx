import Link from "next/link";
import { ArrowRight } from "lucide-react";
import TripCard from "@/components/trips/TripCard";

async function getFeaturedTrips() {
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL}/api/trips?status=approved&limit=6`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) return [];
    const data = await res.json();
    return data.trips ?? [];
  } catch {
    return [];
  }
}

export default async function FeaturedTrips() {
  const trips = await getFeaturedTrips();

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Trips</h2>
            <p className="mt-1 text-gray-500">Top-rated trips from verified providers</p>
          </div>
          <Link
            href="/trips"
            className="hidden sm:flex items-center gap-1.5 text-teal-700 font-medium hover:text-teal-800 transition-colors"
          >
            View all trips
            <ArrowRight size={16} />
          </Link>
        </div>

        {trips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">Trips coming soon</p>
            <p className="text-sm mt-1">Check back once providers have listed their services.</p>
          </div>
        )}

        <div className="text-center mt-8 sm:hidden">
          <Link
            href="/trips"
            className="inline-flex items-center gap-1.5 text-teal-700 font-medium"
          >
            View all trips
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
