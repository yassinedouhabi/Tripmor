import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Users } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import Badge from "@/components/ui/Badge";
import StarRating from "@/components/trips/StarRating";

export default function TripCard({ trip }) {
  const {
    _id,
    title,
    shortDescription,
    images,
    price,
    duration,
    departureCity,
    destinationCity,
    maxPassengers,
    averageRating,
    totalRatings,
    category,
  } = trip;

  const location = destinationCity
    ? `${departureCity} → ${destinationCity}`
    : departureCity;

  return (
    <Link
      href={`/trips/${_id}`}
      className="group block overflow-hidden rounded-xl border border-gray-200 bg-white transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {images?.[0] ? (
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="h-full w-full bg-teal-50 flex items-center justify-center">
            <MapPin className="h-10 w-10 text-teal-200" />
          </div>
        )}
        <div className="absolute left-3 top-3">
          <Badge variant="teal" className="capitalize">
            {category?.replace(/-/g, " ")}
          </Badge>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-gray-900 line-clamp-1">{title}</h3>
        {shortDescription && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{shortDescription}</p>
        )}

        <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-teal-600" />{location}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-teal-600" />{duration}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3 text-teal-600" />Up to {maxPassengers}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between">
          <StarRating rating={averageRating} count={totalRatings > 0 ? totalRatings : undefined} size="sm" />
          <p className="font-semibold text-teal-700">
            {formatPrice(price)}
          </p>
        </div>
      </div>
    </Link>
  );
}
