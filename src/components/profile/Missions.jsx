import React from "react";
import { CalendarDays, CalendarRange, CalendarCheck } from "lucide-react";

const GROUPS = [
  {
    icon: CalendarDays,
    title: "Daily challenges",
    items: [
      { text: "Rinse and sort 5 items", progress: 60 },
      { text: "Scan one item with the AI assistant", progress: 100 },
    ],
  },
  {
    icon: CalendarRange,
    title: "Weekly missions",
    items: [
      { text: "Visit a recycling centre", progress: 40 },
      { text: "Collect 2 kg of paper", progress: 25 },
    ],
  },
  {
    icon: CalendarCheck,
    title: "Monthly goals",
    items: [
      { text: "Recycle 20 kg total", progress: 55 },
      { text: "Keep a 20-day streak", progress: 35 },
    ],
  },
];

export default function Missions() {
  return (
    <div className="grid md:grid-cols-3 gap-5">
      {GROUPS.map((g) => (
        <div key={g.title} className="glass orbital soft-shadow p-7">
          <g.icon className="w-5 h-5 text-accent" aria-hidden="true" />
          <h3 className="mt-3 text-lg font-semibold">{g.title}</h3>
          <ul className="mt-4 space-y-4">
            {g.items.map((it) => (
              <li key={it.text}>
                <p className="text-sm">{it.text}</p>
                <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${it.progress}%` }}
                    role="progressbar"
                    aria-valuenow={it.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={it.text}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}