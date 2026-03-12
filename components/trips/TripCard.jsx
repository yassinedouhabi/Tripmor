import Link from "next/link";
import Image from "next/image";
import { MapPin, Clock, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/trips/StarRating";
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
    <Link href={`/trips/${_id}`} className="group block">
      <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
          <h3 className="font-heading font-semibold text-foreground line-clamp-1 leading-snug">{title}</h3>
          {shortDescription && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{shortDescription}</p>
          )}

          <div className="mt-3 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-muted-foreground" />{location}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3 text-muted-foreground" />{duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3 text-muted-foreground" />Up to {maxPassengers}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <StarRating rating={averageRating} count={totalRatings > 0 ? totalRatings : undefined} size="sm" />
            <p className="font-bold text-foreground">
              {formatPrice(price)}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
