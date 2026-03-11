import Link from "next/link";
import { Car, Sunrise, Tent, CircleUserRound } from "lucide-react";

const categories = [
  {
    slug: "private-transfers",
    label: "Private Transfers",
    description: "Airport pickups and city-to-city transfers",
    icon: Car,
    color: "bg-blue-50 text-blue-600",
  },
  {
    slug: "day-trips",
    label: "Day Trips",
    description: "One-day guided excursions across Morocco",
    icon: Sunrise,
    color: "bg-amber-50 text-amber-600",
  },
  {
    slug: "multi-day-tours",
    label: "Multi-Day Tours",
    description: "2+ day tours with accommodation stops",
    icon: Tent,
    color: "bg-teal-50 text-teal-600",
  },
  {
    slug: "car-rental",
    label: "Car Rental with Driver",
    description: "Full-day or multi-day car and driver hire",
    icon: CircleUserRound,
    color: "bg-purple-50 text-purple-600",
  },
];

export default function CategoryCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
        <p className="mt-2 text-gray-500">Find the right transport for your journey</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(({ slug, label, description, icon: Icon, color }) => (
          <Link
            key={slug}
            href={`/categories/${slug}`}
            className="group bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
          >
            <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${color}`}>
              <Icon size={24} />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">
              {label}
            </h3>
            <p className="text-sm text-gray-500">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
