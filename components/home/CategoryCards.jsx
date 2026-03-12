import Link from "next/link";
import { Car, Compass, Mountain, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  { name: "Private Transfers", slug: "private-transfers", icon: Car, description: "Airport & city-to-city" },
  { name: "Day Trips", slug: "day-trips", icon: Compass, description: "One-day guided excursions" },
  { name: "Multi-Day Tours", slug: "multi-day-tours", icon: Mountain, description: "2+ day adventures" },
  { name: "Car Rental with Driver", slug: "car-rental", icon: Users, description: "Car + driver hire" },
];

export default function CategoryCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-28">
      <h2 className="text-3xl md:text-5xl font-heading font-semibold tracking-tight text-foreground">
        How do you want to travel?
      </h2>
      <p className="mt-3 text-muted-foreground">Choose a category to find the right trip for you.</p>

      <div className="mt-12 md:mt-16 grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-8">
        {categories.map(({ name, slug, icon: Icon, description }) => (
          <Link key={slug} href={`/categories/${slug}`}>
            <Card className="group h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer">
              <CardContent className="flex flex-col items-center text-center p-6 md:p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-accent transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-semibold text-foreground leading-snug">{name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
