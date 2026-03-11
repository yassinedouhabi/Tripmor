import Link from "next/link";
import { Car, Compass, Mountain, Users } from "lucide-react";

const categories = [
  { name: "Private Transfers", slug: "private-transfers", icon: Car, description: "Airport & city-to-city" },
  { name: "Day Trips", slug: "day-trips", icon: Compass, description: "One-day guided excursions" },
  { name: "Multi-Day Tours", slug: "multi-day-tours", icon: Mountain, description: "2+ day adventures" },
  { name: "Car Rental with Driver", slug: "car-rental", icon: Users, description: "Car + driver hire" },
];

export default function CategoryCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8">
      <h2 className="text-2xl font-bold text-gray-900 md:text-3xl">How do you want to travel?</h2>
      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map(({ name, slug, icon: Icon, description }) => (
          <Link
            key={slug}
            href={`/categories/${slug}`}
            className="group rounded-xl border border-gray-200 bg-white p-6 text-center transition-all hover:border-teal-200 hover:shadow-md"
          >
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-100">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">{name}</h3>
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
