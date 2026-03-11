import HeroSection from "@/components/home/HeroSection";
import CategoryCards from "@/components/home/CategoryCards";
import FeaturedTrips from "@/components/home/FeaturedTrips";
import HowItWorks from "@/components/home/HowItWorks";
import CityShowcase from "@/components/home/CityShowcase";
import TrustSignals from "@/components/home/TrustSignals";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <CategoryCards />
      <TrustSignals />
      <HowItWorks />
      <FeaturedTrips />
      <CityShowcase />

      {/* Provider CTA */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-3">Are you a transport provider?</h2>
          <p className="text-gray-400 mb-8 text-lg">
            Join Tripmor and reach thousands of tourists looking for trusted
            transport across Morocco. List your trips in minutes.
          </p>
          <Link
            href="/become-a-provider"
            className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold px-8 py-3.5 rounded-xl transition-colors"
          >
            Become a Provider
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
