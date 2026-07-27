import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { MATERIALS, ECO_POINTS } from "@/lib/recycleData";
import { PlusCircle } from "lucide-react";

export default function LogRecycleForm({ profile, onUpdate }) {
  const [material, setMaterial] = useState("Plastic");
  const [weight, setWeight] = useState(0.5);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    await base44.entities.RecycleLog.create({ material, quantity: 1, weight_kg: Number(weight) });
    const ecoPoints = ECO_POINTS[material] || 5;
    const badges = new Set(profile.badges || []);
    badges.add("First Drop");
    if (material === "Electronics") badges.add("E-Waste Hero");
    if (material === "Cooking Oil") badges.add("Oil Saver");
    if ((profile.items_recycled || 0) + 1 >= 50) badges.add("Earth Guardian");
    const updated = await base44.entities.EcoProfile.update(profile.id, {
      xp: (profile.xp || 0) + ecoPoints * 2,
      eco_points: (profile.eco_points || 0) + ecoPoints,
      items_recycled: (profile.items_recycled || 0) + 1,
      plastic_saved_kg: (profile.plastic_saved_kg || 0) + (material === "Plastic" ? Number(weight) : 0),
      co2_reduced_kg: Number(((profile.co2_reduced_kg || 0) + Number(weight) * 1.5).toFixed(2)),
      badges: [...badges],
    });
    onUpdate(updated);
    setBusy(false);
  };

  const field = "w-full h-12 px-4 rounded-2xl bg-background border border-border focus:border-primary";

  return (
    <form onSubmit={submit} className="glass orbital soft-shadow p-8 grid sm:grid-cols-3 gap-4 items-end">
      <div>
        <label htmlFor="log-material" className="block text-sm font-semibold mb-2">Material recycled</label>
        <select id="log-material" className={field} value={material} onChange={(e) => setMaterial(e.target.value)}>
          {MATERIALS.map((m) => <option key={m}>{m}</option>)}
        </select>
      </div>
      <div>
        <label htmlFor="log-weight" className="block text-sm font-semibold mb-2">Weight (kg)</label>
        <input id="log-weight" type="number" step="0.1" min="0" className={field} value={weight} onChange={(e) => setWeight(e.target.value)} />
      </div>
      <button disabled={busy} type="submit" className="h-12 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60">
        <PlusCircle className="w-4 h-4" /> {busy ? "Saving…" : `Log +${ECO_POINTS[material] || 5} Eco Points`}
      </button>
    </form>
  );
}