import React from "react";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import Counter from "@/components/common/Counter";
import PollutionCharts from "@/components/pollution/PollutionCharts";
import { POLLUTION_STATS } from "@/lib/recycleData";
import { Waves, Trash2, Fish, Factory } from "lucide-react";

const ISSUES = [
  { icon: Trash2, title: "Plastic pollution", body: "Malaysians use roughly 300 plastic bags per person each year. Single-use packaging dominates our bins and much of it is too thin or dirty to recycle." },
  { icon: Waves, title: "Ocean pollution", body: "Rivers like the Klang carry plastic straight into the Straits of Malacca, making Malaysia one of the top contributors of ocean plastic in Southeast Asia." },
  { icon: Factory, title: "Landfill pressure", body: "Most of our landfills are open dumpsites near capacity. Leachate seeps into groundwater and methane escapes into the air." },
  { icon: Fish, title: "Marine life impact", body: "Turtles off Terengganu mistake plastic bags for jellyfish, and microplastics have been found in fish sold at local markets." },
];

export default function Pollution() {
  return (
    <div className="max-w-6xl mx-auto px-6 pb-10">
      <SectionHeading
        eyebrow="Malaysia Pollution"
        title="The numbers behind our waste"
        subtitle="Understanding the scale of the problem is the first step to fixing it."
      />

      <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {POLLUTION_STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08}>
            <div className="glass orbital soft-shadow p-6 h-full">
              <p className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
                <Counter to={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </div>

      <PollutionCharts />

      <section className="mt-24 grid md:grid-cols-2 gap-5">
        {ISSUES.map((it, i) => (
          <Reveal key={it.title} delay={(i % 2) * 0.08}>
            <article className="h-full glass orbital soft-shadow p-8">
              <span className="h-12 w-12 rounded-2xl bg-accent/12 grid place-items-center">
                <it.icon className="w-6 h-6 text-accent" aria-hidden="true" />
              </span>
              <h3 className="mt-5 text-xl font-semibold">{it.title}</h3>
              <p className="mt-3 text-muted-foreground">{it.body}</p>
            </article>
          </Reveal>
        ))}
      </section>
    </div>
  );
}