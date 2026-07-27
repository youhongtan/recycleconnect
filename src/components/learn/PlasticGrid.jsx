import React from "react";
import Reveal from "@/components/common/Reveal";
import { PLASTIC_TYPES } from "@/lib/recycleData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const diffColor = {
  Easy: "bg-primary/12 text-primary",
  Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  Hard: "bg-rose-500/15 text-rose-700 dark:text-rose-400",
};

export default function PlasticGrid() {
  return (
    <section className="mt-20">
      <h2 className="text-3xl font-bold tracking-tight">The 7 plastic types</h2>
      <p className="mt-2 text-muted-foreground">Check the number inside the triangle on your packaging.</p>

      <div className="mt-8 grid md:grid-cols-2 gap-5">
        {PLASTIC_TYPES.map((p, i) => (
          <Reveal key={p.code} delay={(i % 2) * 0.08}>
            <div className="glass orbital soft-shadow p-7 h-full hover:-translate-y-1 transition-transform duration-500">
              <div className="flex items-center gap-4">
                <span className="h-12 w-12 rounded-2xl bg-accent/12 grid place-items-center font-bold text-accent text-lg">
                  {p.code}
                </span>
                <div>
                  <h3 className="text-xl font-semibold">{p.name}</h3>
                  <p className="text-sm text-muted-foreground">{p.recyclable}</p>
                </div>
                <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full ${diffColor[p.difficulty]}`}>
                  {p.difficulty}
                </span>
              </div>
              <Accordion type="single" collapsible className="mt-4">
                <AccordionItem value="details" className="border-none">
                  <AccordionTrigger className="text-sm font-semibold py-2">Details</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground space-y-3">
                    <p><strong className="text-foreground">Examples:</strong> {p.examples}</p>
                    <p><strong className="text-foreground">How to recycle:</strong> {p.how}</p>
                    <p><strong className="text-foreground">Impact:</strong> {p.impact}</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}