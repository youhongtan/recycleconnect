import React from "react";
import Counter from "@/components/common/Counter";
import Reveal from "@/components/common/Reveal";
import { Building2, Users, Recycle, Cloud } from "lucide-react";

const STATS = [
  { icon: Building2, label: "Recycling Centres", to: 1240, suffix: "+" },
  { icon: Users, label: "Users Helped", to: 58400, suffix: "+" },
  { icon: Recycle, label: "Plastic Saved (kg)", to: 92300, suffix: "" },
  { icon: Cloud, label: "CO₂ Reduced (tonnes)", to: 4120, suffix: "" },
];

export default function StatsBand() {
  return (
    <section className="max-w-6xl mx-auto px-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="glass orbital soft-shadow p-6 h-full hover:-translate-y-1 transition-transform duration-500">
              <s.icon className="w-6 h-6 text-primary" aria-hidden="true" />
              <p className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight">
                <Counter to={s.to} suffix={s.suffix} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}