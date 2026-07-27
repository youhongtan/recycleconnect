import React from "react";
import {
  ResponsiveContainer, PieChart, Pie, Cell, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid,
} from "recharts";
import Reveal from "@/components/common/Reveal";
import { WASTE_COMPOSITION, RECYCLING_TREND } from "@/lib/recycleData";

const COLORS = ["#2E7D32", "#2196F3", "#81C784", "#90A4AE", "#66BB6A", "#1976D2"];

export default function PollutionCharts() {
  return (
    <div className="mt-16 grid lg:grid-cols-2 gap-6">
      <Reveal>
        <div className="glass orbital soft-shadow p-8">
          <h3 className="text-xl font-semibold">What's in our rubbish bins</h3>
          <p className="text-sm text-muted-foreground">Household waste composition (%)</p>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={WASTE_COMPOSITION} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>
                  {WASTE_COMPOSITION.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="glass orbital soft-shadow p-8">
          <h3 className="text-xl font-semibold">National recycling rate</h3>
          <p className="text-sm text-muted-foreground">Percentage of waste recycled, with the 2025 target</p>
          <div className="h-72 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={RECYCLING_TREND}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.2)" />
                <XAxis dataKey="year" tickLine={false} axisLine={false} />
                <YAxis unit="%" tickLine={false} axisLine={false} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line type="monotone" dataKey="rate" stroke="#2E7D32" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </Reveal>
    </div>
  );
}