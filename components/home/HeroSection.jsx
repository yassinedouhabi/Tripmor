"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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
    <section className="relative overflow-hidden bg-teal-900 py-24 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-teal-800 to-teal-900" />
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:32px_32px]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-amber-400 mb-4">
            Morocco&apos;s #1 Tourist Transport Marketplace
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            Explore Morocco,{" "}
            <span className="text-amber-400">Your Way</span>
          </h1>
          <p className="mt-6 text-lg text-teal-100 max-w-xl">
            Book private transfers, day trips, and multi-day tours with trusted
            local transport companies across Morocco.
          </p>

          <form onSubmit={handleSearch} className="mt-8 flex flex-col sm:flex-row gap-3">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="rounded-lg border-0 bg-white px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 sm:w-48"
            >
              <option value="">All cities</option>
              {CITIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="rounded-lg border-0 bg-white px-4 py-3 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 sm:w-52"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.label}</option>
              ))}
            </select>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-lg bg-amber-400 hover:bg-amber-500 px-6 py-3 text-sm font-semibold text-gray-900 transition-colors"
            >
              <Search className="h-4 w-4" />
              Search Trips
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
