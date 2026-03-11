import { Star, Users, MapPin, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Happy Tourists" },
  { icon: MapPin, value: "17", label: "Moroccan Cities" },
  { icon: Star, value: "4.9", label: "Average Rating" },
  { icon: ShieldCheck, value: "100%", label: "Verified Providers" },
];

export default function TrustSignals() {
  return (
    <section className="bg-teal-700 text-white py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Icon size={24} />
              </div>
              <div>
                <div className="text-3xl font-bold">{value}</div>
                <div className="text-teal-200 text-sm mt-0.5">{label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
