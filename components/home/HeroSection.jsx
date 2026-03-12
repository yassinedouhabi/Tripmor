"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
    <section className="relative min-h-[700px] flex items-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1800&q=85"
        alt="Aerial view of Marrakech medina"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-accent mb-4">
            Morocco&apos;s #1 Transport Marketplace
          </p>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold tracking-tight text-white leading-tight mb-5">
            Explore Morocco,{" "}
            <span className="text-accent">Your Way</span>
          </h1>
          <p className="text-lg md:text-xl text-zinc-300 mb-10 leading-relaxed">
            Book private transfers, day trips, and multi-day tours with trusted
            local transport companies across Morocco.
          </p>

          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 max-w-xl"
          >
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm px-3 py-2.5 focus:outline-none [&>option]:text-zinc-900"
            >
              <option value="">All cities</option>
              {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="w-px bg-white/20 hidden sm:block self-stretch my-1" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="flex-1 bg-transparent text-white text-sm px-3 py-2.5 focus:outline-none [&>option]:text-zinc-900"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat.slug} value={cat.slug}>{cat.label}</option>
              ))}
            </select>
            <Button type="submit" className="shrink-0 bg-accent text-accent-foreground hover:bg-accent/90 gap-2">
              <Search className="h-4 w-4" />
              Search
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
