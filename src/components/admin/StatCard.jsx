import React from "react";

const COLORS = {
  primary: "bg-primary/10 text-primary",
  accent: "bg-accent/10 text-accent",
  amber: "bg-amber-500/10 text-amber-600",
  rose: "bg-rose-500/10 text-rose-600",
};

export default function StatCard({ icon: Icon, label, value, color = "primary" }) {
  return (
    <div className="glass orbital p-6">
      <div className="flex items-center gap-3 mb-2">
        <div className={`h-10 w-10 rounded-2xl grid place-items-center ${COLORS[color] || COLORS.primary}`}>
          <Icon className="w-5 h-5" />
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}