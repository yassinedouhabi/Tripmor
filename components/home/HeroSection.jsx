"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { CITIES, CATEGORIES } from "@/lib/constants";

export default function HeroSection() {
  const router = useRouter();
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    router.push(`/trips${params.toString() ? `?${params}` : ""}`);
  }

  return (
    <section className="relative bg-teal-700 text-white overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:32px_32px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <div className="inline-flex items-center gap-2 bg-white/20 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <MapPin size={14} />
          Morocco&apos;s #1 Tourist Transport Marketplace
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4">
          Book Tourist Transport
          <br />
          <span className="text-amber-400">Across Morocco</span>
        </h1>

        <p className="text-lg sm:text-xl text-teal-100 max-w-2xl mx-auto mb-10">
          Private transfers, day trips, multi-day tours, and car rentals with
          trusted local providers. Book in minutes, travel with confidence.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl p-2 flex flex-col sm:flex-row gap-2 max-w-2xl mx-auto shadow-xl"
        >
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 px-4 py-3 text-gray-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="">All cities</option>
            {CITIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          <div className="w-px bg-gray-200 hidden sm:block self-stretch my-1" />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 px-4 py-3 text-gray-700 bg-transparent rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.slug} value={cat.slug}>
                {cat.label}
              </option>
            ))}
          </select>

          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors whitespace-nowrap"
          >
            <Search size={18} />
            Search Trips
          </button>
        </form>
      </div>
    </section>
  );
}
