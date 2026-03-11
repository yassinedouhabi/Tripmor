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
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
        How do you want to travel?
      </h2>
      <p className="mt-2 text-muted-foreground">Choose a category to find the right trip for you.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {categories.map(({ name, slug, icon: Icon, description }) => (
          <Link key={slug} href={`/categories/${slug}`}>
            <Card className="group h-full transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
              <CardContent className="flex flex-col items-center text-center p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground text-sm leading-snug">{name}</h3>
                <p className="mt-1 text-xs text-muted-foreground">{description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
