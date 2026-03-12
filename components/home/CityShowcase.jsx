import Image from "next/image";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const featuredCity = {
  name: "Marrakech",
  trips: 12,
  image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80",
  description: "The Red City — souks, palaces & desert gateways",
};

const cities = [
  { name: "Chefchaouen", trips: 5, image: "https://images.unsplash.com/photo-1528702748617-c64d49f918af?w=600&q=75" },
  { name: "Fes", trips: 8, image: "https://images.unsplash.com/photo-1606814893907-2f7aef6e00b3?w=600&q=75" },
  { name: "Merzouga", trips: 6, image: "https://images.unsplash.com/photo-1548013146-52088f05e898?w=600&q=75" },
  { name: "Essaouira", trips: 4, image: "https://images.unsplash.com/photo-1594640571672-bdb34c9f1c87?w=600&q=75" },
];

const otherCities = ["Casablanca", "Agadir", "Ouarzazate", "Rabat", "Tangier", "Ifrane"];

export default function CityShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <div className="flex items-end justify-between mb-12 md:mb-16">
        <div>
          <h2 className="text-3xl md:text-5xl font-heading font-semibold tracking-tight text-foreground">Popular Cities</h2>
          <p className="mt-3 text-muted-foreground">Discover transport options across Morocco</p>
        </div>
        <Link href="/trips" className="hidden sm:flex items-center gap-1 text-sm font-medium text-foreground hover:underline">
          All cities <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Featured large city */}
        <Link href="/cities/marrakech" className="col-span-2 row-span-2 group relative rounded-xl overflow-hidden h-64 lg:h-auto">
          <Image src={featuredCity.image} alt={featuredCity.name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <Badge className="mb-2 bg-accent text-accent-foreground border-0">{featuredCity.trips} trips</Badge>
            <p className="text-lg font-heading font-bold text-white">{featuredCity.name}</p>
            <p className="text-xs text-zinc-300 mt-0.5">{featuredCity.description}</p>
          </div>
        </Link>

        {/* Photo cities */}
        {cities.map(({ name, trips, image }) => (
          <Link key={name} href={`/cities/${name.toLowerCase()}`} className="group relative rounded-xl overflow-hidden h-32">
            <Image src={image} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/70 to-transparent" />
            <div className="absolute bottom-3 left-3">
              <p className="text-sm font-semibold text-white">{name}</p>
              <p className="text-xs text-zinc-300">{trips} trips</p>
            </div>
          </Link>
        ))}

        {/* Text-only remaining cities */}
        {otherCities.map((city) => (
          <Link
            key={city}
            href={`/cities/${city.toLowerCase()}`}
            className="flex items-center gap-2 rounded-xl border border-border bg-card p-3 text-sm font-medium text-foreground hover:bg-muted/50 hover:border-accent/30 transition-colors"
          >
            <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            {city}
          </Link>
        ))}
      </div>
    </section>
  );
}
