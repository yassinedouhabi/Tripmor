import Link from "next/link";
import { MessageCircle, Mail } from "lucide-react";

const links = {
  Explore: [
    { label: "Browse Trips", href: "/trips" },
    { label: "Private Transfers", href: "/categories/private-transfers" },
    { label: "Day Trips", href: "/categories/day-trips" },
    { label: "Multi-Day Tours", href: "/categories/multi-day-tours" },
    { label: "Car Rental with Driver", href: "/categories/car-rental" },
  ],
  Company: [
    { label: "About Tripmor", href: "/about" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Become a Provider", href: "/become-a-provider" },
    { label: "Contact", href: "/contact" },
    { label: "FAQ", href: "/faq" },
  ],
  Account: [
    { label: "Log In", href: "/auth/login" },
    { label: "Sign Up", href: "/auth/register" },
    { label: "My Bookings", href: "/account/bookings" },
    { label: "Provider Dashboard", href: "/provider" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center">
                <span className="text-white text-sm font-bold">T</span>
              </div>
              <span className="text-lg font-bold text-white">
                Trip<span className="text-teal-400">mor</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5">
              Book tourist transport across Morocco with trusted local providers.
              Private transfers, day trips, tours, and more.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
              >
                <MessageCircle size={15} />
                WhatsApp Support
              </a>
              <a
                href="mailto:hello@tripmor.com"
                className="inline-flex items-center gap-2 hover:text-gray-200 transition-colors"
              >
                <Mail size={15} />
                hello@tripmor.com
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(links).map(([heading, items]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wide mb-4">
                {heading}
              </h3>
              <ul className="space-y-2.5">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm hover:text-gray-200 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <p>© {new Date().getFullYear()} Tripmor. All rights reserved.</p>
          <p>Morocco&apos;s trusted tourist transport marketplace.</p>
        </div>
      </div>
    </footer>
  );
}
