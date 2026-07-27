import React from "react";
import { MATERIALS } from "@/lib/recycleData";

export default function MaterialFilters({ active, onToggle }) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by material">
      {MATERIALS.map((m) => {
        const on = active.includes(m);
        return (
          <button
            key={m}
            type="button"
            aria-pressed={on}
            onClick={() => onToggle(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              on
                ? "bg-primary text-primary-foreground soft-shadow"
                : "glass hover:bg-primary/10"
            }`}
          >
            {m}
          </button>
        );
      })}
    </div>
  );
}