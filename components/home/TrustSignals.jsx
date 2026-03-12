import { Users, MapPin, Star, ShieldCheck } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Happy Tourists" },
  { icon: MapPin, value: "17", label: "Moroccan Cities" },
  { icon: Star, value: "4.9", label: "Average Rating" },
  { icon: ShieldCheck, value: "100%", label: "Verified Providers" },
];

export default function TrustSignals() {
  return (
    <section className="border-y border-border bg-muted/40 py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-0 divide-x divide-border">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex items-center gap-3 px-8 py-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-accent">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-heading text-2xl font-bold text-foreground">{value}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
