import { Search, CreditCard, MessageCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Choose your trip",
    description: "Browse transfers, day trips, and tours across Morocco.",
  },
  {
    icon: CreditCard,
    title: "Book & pay securely",
    description: "Pay online with your card. Instant confirmation.",
  },
  {
    icon: MessageCircle,
    title: "Get WhatsApp confirmation",
    description: "Receive your booking details and connect with your provider directly.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-center text-2xl font-bold text-gray-900 md:text-3xl">
          How it works
        </h2>
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map(({ icon: Icon, title, description }, i) => (
            <div key={title} className="text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-teal-700 text-white">
                <Icon className="h-6 w-6" />
              </div>
              <p className="mt-2 text-sm font-bold text-amber-500">Step {i + 1}</p>
              <h3 className="mt-2 text-lg font-semibold text-gray-900">{title}</h3>
              <p className="mt-2 text-sm text-gray-500">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
