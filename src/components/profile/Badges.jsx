import React from "react";
import { Award, Lock } from "lucide-react";

const ALL_BADGES = [
  { name: "First Drop", need: "Log your first recycled item" },
  { name: "Plastic Buster", need: "Recycle 25 plastic items" },
  { name: "E-Waste Hero", need: "Drop off any electronics" },
  { name: "Oil Saver", need: "Recycle used cooking oil" },
  { name: "7-Day Streak", need: "Recycle 7 days in a row" },
  { name: "Community Champion", need: "Reach level 5" },
];

export default function Badges({ earned = [] }) {
  return (
    <div className="glass orbital soft-shadow p-8">
      <h2 className="text-2xl font-semibold">Badges & achievements</h2>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {ALL_BADGES.map((b) => {
          const has = earned.includes(b.name);
          return (
            <div
              key={b.name}
              className={`rounded-3xl p-5 border transition ${
                has ? "border-primary/40 bg-primary/8" : "border-border/60 opacity-70"
              }`}
            >
              {has ? <Award className="w-6 h-6 text-primary" /> : <Lock className="w-6 h-6 text-muted-foreground" />}
              <p className="mt-3 font-semibold">{b.name}</p>
              <p className="text-sm text-muted-foreground">{b.need}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}