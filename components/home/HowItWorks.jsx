import Image from "next/image";
import { Search, CreditCard, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Choose your trip",
    description: "Browse transfers, day trips, and tours across Morocco by city or category.",
  },
  {
    icon: CreditCard,
    title: "Book & pay securely",
    description: "Fill in your details and pay online with your card. Instant confirmation.",
  },
  {
    icon: MessageCircle,
    title: "Get WhatsApp confirmation",
    description: "Receive booking details and connect directly with your provider.",
  },
];

export default function HowItWorks() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <Image
        src="https://images.unsplash.com/photo-1553603229-1e59f0a2d4ef?w=1800&q=80"
        alt="Atlas Mountains Morocco"
        fill
        className="object-cover"
      />
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-5xl font-heading font-semibold tracking-tight text-white">
            How it works
          </h2>
          <p className="mt-3 text-zinc-400">Book your transport in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="text-white">
              <span className="text-xs font-semibold uppercase tracking-widest text-accent mb-4 block">
                Step {i + 1}
              </span>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 mb-5">
                <Icon className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading text-lg font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
