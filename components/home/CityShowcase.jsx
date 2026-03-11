import Link from "next/link";
import { MapPin } from "lucide-react";

const cities = [
  { name: "Marrakech", trips: 12 },
  { name: "Fes", trips: 8 },
  { name: "Casablanca", trips: 6 },
  { name: "Chefchaouen", trips: 5 },
  { name: "Agadir", trips: 7 },
  { name: "Essaouira", trips: 4 },
  { name: "Merzouga", trips: 6 },
  { name: "Ouarzazate", trips: 5 },
];

export default function CityShowcase() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">Popular Cities</h2>
      <p className="mt-2 text-gray-500">Discover transport options across Morocco</p>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {cities.map(({ name, trips }) => (
          <Link
            key={name}
            href={`/cities/${name.toLowerCase().replace(/\s+/g, "-")}`}
            className="group flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4 transition-all hover:border-teal-200 hover:shadow-sm"
          >
            <MapPin className="h-5 w-5 shrink-0 text-teal-600" />
            <div>
              <p className="font-medium text-gray-900 group-hover:text-teal-700 transition-colors">
                {name}
              </p>
              <p className="text-xs text-gray-500">{trips} trips</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
