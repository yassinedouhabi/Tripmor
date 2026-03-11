import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HeroSection from "@/components/home/HeroSection";
import CategoryCards from "@/components/home/CategoryCards";
import TrustSignals from "@/components/home/TrustSignals";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturedTrips from "@/components/home/FeaturedTrips";
import CityShowcase from "@/components/home/CityShowcase";

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustSignals />
      <CategoryCards />
      <FeaturedTrips />
      <HowItWorks />
      <CityShowcase />

      {/* Provider CTA */}
      <section className="relative overflow-hidden py-24">
        <Image
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1800&q=80"
          alt="Moroccan architecture riad"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-zinc-950/85" />
        <div className="relative mx-auto max-w-2xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Are you a transport provider?
          </h2>
          <p className="mt-4 text-lg text-zinc-300">
            Join Tripmor and reach thousands of tourists looking for trusted
            transport across Morocco. List your trips in minutes.
          </p>
          <Button
            asChild
            size="lg"
            className="mt-8 bg-accent text-accent-foreground hover:bg-accent/90 gap-2"
          >
            <Link href="/become-a-provider">
              Become a Provider <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
