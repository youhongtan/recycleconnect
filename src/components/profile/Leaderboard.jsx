import React from "react";
import { Trophy } from "lucide-react";

const ROWS = [
  { name: "Aisyah R.", city: "Shah Alam", xp: 4820 },
  { name: "Wei Jian", city: "Penang", xp: 4410 },
  { name: "Kumar S.", city: "Ipoh", xp: 3990 },
  { name: "Nurul H.", city: "Kuantan", xp: 3520 },
  { name: "Daniel T.", city: "Johor Bahru", xp: 3105 },
];

export default function Leaderboard({ you }) {
  return (
    <div className="glass orbital soft-shadow p-8">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Trophy className="w-5 h-5 text-primary" /> National leaderboard
      </h2>
      <ul className="mt-6 divide-y divide-border/60">
        {ROWS.map((r, i) => (
          <li key={r.name} className={`flex items-center gap-4 py-4 ${i === 0 ? "text-primary font-semibold" : ""}`}>
            <span className="w-8 text-sm tabular-nums">{i + 1}</span>
            <span className="flex-1">{r.name}</span>
            <span className="text-sm text-muted-foreground hidden sm:block">{r.city}</span>
            <span className="tabular-nums font-medium">{r.xp.toLocaleString()} XP</span>
          </li>
        ))}
        <li className="flex items-center gap-4 py-4 bg-primary/8 rounded-2xl px-3 mt-2">
          <span className="w-8 text-sm">—</span>
          <span className="flex-1 font-semibold">You</span>
          <span className="tabular-nums font-medium">{(you || 0).toLocaleString()} XP</span>
        </li>
      </ul>
    </div>
  );
}