import React from "react";
import { Link } from "react-router-dom";
import { Trophy, Flame, Target, Gift } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";

const ITEMS = [
  { icon: Target, title: "Daily Challenges", body: "Small tasks like rinsing and sorting five items." },
  { icon: Flame, title: "Streaks & XP", body: "Recycle every day to keep your streak alive and level up." },
  { icon: Trophy, title: "Leaderboards", body: "See how your school, street or state ranks nationwide." },
  { icon: Gift, title: "Eco Rewards", body: "Coming soon: scan a QR after recycling and redeem vouchers." },
];

export default function GamificationTeaser() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <SectionHeading
        eyebrow="Gamification"
        title="Recycling that actually rewards you"
        subtitle="Progress bars, badges and missions turn a chore into a daily habit."
      />
      <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {ITEMS.map((it, i) => (
          <Reveal key={it.title} delay={i * 0.08}>
            <div className="h-full glass orbital soft-shadow p-7 hover:-translate-y-1 transition-transform duration-500">
              <it.icon className="w-6 h-6 text-accent" aria-hidden="true" />
              <h3 className="mt-4 text-lg font-semibold">{it.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{it.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal delay={0.1}>
        <div className="mt-10 text-center">
          <Link
            to="/profile"
            className="inline-flex h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold items-center soft-shadow hover:brightness-110 active:scale-[0.98] transition"
          >
            View my eco profile
          </Link>
        </div>
      </Reveal>
    </section>
  );
}