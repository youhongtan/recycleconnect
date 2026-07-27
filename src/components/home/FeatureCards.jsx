import React from "react";
import { Link } from "react-router-dom";
import { ScanLine, Map, Wand2, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";

const FEATURES = [
  {
    icon: ScanLine,
    title: "AI Recycling Assistant",
    body: "Snap or upload a photo. Our AI names the item, its material, whether it is recyclable, and exactly how to prepare it.",
    to: "/assistant",
    cta: "Scan an item",
  },
  {
    icon: Map,
    title: "Smart Centre Finder",
    body: "An interactive Malaysia map with opening hours, accepted materials, contacts and one-tap navigation.",
    to: "/finder",
    cta: "Open the map",
  },
  {
    icon: Wand2,
    title: "Smart Recommendation",
    body: "Tell us what you have, how you travel and how far you'll go — we match the best centre for you.",
    to: "/finder#recommend",
    cta: "Get matched",
  },
];

export default function FeatureCards() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <SectionHeading
        eyebrow="What you can do"
        title="Three tools, one greener habit"
        subtitle="Everything you need to recycle correctly in Malaysia — designed to be used in under a minute."
      />
      <div className="mt-14 grid md:grid-cols-3 gap-6">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 0.1}>
            <Link
              to={f.to}
              className="group block h-full glass orbital soft-shadow p-8 hover:-translate-y-1.5 hover:bg-primary/5 transition-all duration-500"
            >
              <span className="h-14 w-14 rounded-2xl bg-primary/12 grid place-items-center">
                <f.icon className="w-7 h-7 text-primary" aria-hidden="true" />
              </span>
              <h3 className="mt-6 text-2xl font-semibold tracking-tight">{f.title}</h3>
              <p className="mt-3 text-muted-foreground">{f.body}</p>
              <span className="mt-6 inline-flex items-center gap-1.5 font-semibold text-primary">
                {f.cta}
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}