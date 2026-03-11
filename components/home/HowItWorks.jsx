import Image from "next/image";
import { Search, CreditCard, MessageCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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
      <div className="absolute inset-0 bg-zinc-950/80" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-2xl font-bold tracking-tight text-white md:text-3xl">How it works</h2>
          <p className="mt-2 text-zinc-400">Book your transport in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <Card key={title} className="bg-white/5 border-white/10 backdrop-blur-sm text-white">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                  <Separator orientation="vertical" className="h-6 bg-white/20" />
                  <span className="text-xs font-bold uppercase tracking-widest text-accent">
                    Step {i + 1}
                  </span>
                </div>
                <h3 className="font-semibold text-white mb-1">{title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">{description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
