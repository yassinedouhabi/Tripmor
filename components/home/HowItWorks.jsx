import { Search, CreditCard, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Browse & Choose",
    description:
      "Search trips by city or category. Compare providers, read ratings, and pick the trip that suits you.",
  },
  {
    icon: CreditCard,
    title: "Book & Pay",
    description:
      "Fill in your pickup details and pay securely via Stripe. No account needed — book as a guest.",
  },
  {
    icon: CheckCircle,
    title: "Travel & Enjoy",
    description:
      "Receive instant confirmation. Your provider will meet you at the agreed location, on time.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
          <p className="mt-2 text-gray-500">Book your transport in three simple steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-full h-0.5 bg-teal-100 z-0" />
                )}

                <div className="relative z-10 inline-flex items-center justify-center w-20 h-20 bg-teal-700 text-white rounded-2xl mb-5 shadow-md">
                  <Icon size={32} />
                  <span className="absolute -top-2 -right-2 w-6 h-6 bg-amber-400 text-gray-900 text-xs font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
