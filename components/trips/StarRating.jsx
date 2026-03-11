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
        <span className={`ml-1 text-gray-500 ${textSizes[size]}`}>({count})</span>
      )}
    </div>
  );
}
