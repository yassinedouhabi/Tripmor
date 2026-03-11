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

function slugify(name) {
  return name.toLowerCase().replace(/\s+/g, "-");
}

export default function CityShowcase() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Popular Cities</h2>
        <p className="mt-2 text-gray-500">Discover transport options across Morocco</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {cities.map(({ name, trips }) => (
          <Link
            key={name}
            href={`/cities/${slugify(name)}`}
            className="group relative bg-gray-100 hover:bg-teal-50 border border-gray-200 hover:border-teal-300 rounded-2xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-sm"
          >
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={16} className="text-teal-600" />
              <span className="font-semibold text-gray-900 group-hover:text-teal-700 transition-colors">
                {name}
              </span>
            </div>
            <p className="text-sm text-gray-500">{trips} trips available</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
