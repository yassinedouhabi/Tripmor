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
