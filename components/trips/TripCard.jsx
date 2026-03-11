import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Users, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";

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
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
    >
      {/* Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {images?.[0] ? (
          <Image
            src={images[0]}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-teal-50">
            <MapPin size={32} className="text-teal-300" />
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="bg-white/90 text-teal-700 text-xs font-semibold px-2.5 py-1 rounded-full capitalize">
            {category?.replace(/-/g, " ")}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 leading-snug mb-1 group-hover:text-teal-700 transition-colors line-clamp-2">
          {title}
        </h3>

        {shortDescription && (
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{shortDescription}</p>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1">
            <MapPin size={12} className="text-teal-600" />
            {location}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={12} className="text-teal-600" />
            {duration}
          </span>
          <span className="flex items-center gap-1">
            <Users size={12} className="text-teal-600" />
            Up to {maxPassengers}
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between">
          <div>
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(price)}
            </span>
            <span className="text-xs text-gray-400 ml-1">/ group</span>
          </div>
          {totalRatings > 0 && (
            <div className="flex items-center gap-1 text-sm">
              <Star size={14} className="text-amber-400 fill-amber-400" />
              <span className="font-medium text-gray-700">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-gray-400">({totalRatings})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
