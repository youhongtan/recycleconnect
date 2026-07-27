import React, { useState } from "react";
import { Wand2 } from "lucide-react";
import { MATERIALS } from "@/lib/recycleData";
import CentreCard from "@/components/finder/CentreCard";

const TRANSPORT = { Walking: 3, Motorcycle: 15, Car: 40 };

export default function RecommendForm({ centres }) {
  const [material, setMaterial] = useState("Plastic");
  const [location, setLocation] = useState("");
  const [transport, setTransport] = useState("Car");
  const [distance, setDistance] = useState(10);
  const [wantPoints, setWantPoints] = useState(false);
  const [wantCash, setWantCash] = useState(false);
  const [wantPickup, setWantPickup] = useState(false);
  const [result, setResult] = useState(null);

  const score = (c) => {
    let s = 0;
    if ((c.materials || []).includes(material)) s += 5;
    if (wantPoints && c.reward_points) s += 2;
    if (wantCash && c.pays_cash) s += 2;
    if (wantPickup && c.home_collection) s += 2;
    if (location && `${c.city} ${c.address}`.toLowerCase().includes(location.toLowerCase())) s += 3;
    if (distance >= TRANSPORT[transport]) s += 1;
    return s;
  };

  const submit = (e) => {
    e.preventDefault();
    const ranked = [...centres].sort((a, b) => score(b) - score(a));
    setResult(ranked.slice(0, 3));
  };

  const field = "w-full h-12 px-4 rounded-2xl bg-background border border-border focus:border-primary";

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <form onSubmit={submit} className="glass orbital soft-shadow p-8 space-y-5">
        <div>
          <label htmlFor="rec-material" className="block text-sm font-semibold mb-2">What do you want to recycle?</label>
          <select id="rec-material" className={field} value={material} onChange={(e) => setMaterial(e.target.value)}>
            {[...MATERIALS, "Others"].map((m) => <option key={m}>{m}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="rec-loc" className="block text-sm font-semibold mb-2">Your current location</label>
          <input id="rec-loc" className={field} placeholder="e.g. Petaling Jaya" value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="rec-transport" className="block text-sm font-semibold mb-2">Transportation</label>
            <select id="rec-transport" className={field} value={transport} onChange={(e) => setTransport(e.target.value)}>
              {Object.keys(TRANSPORT).map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="rec-dist" className="block text-sm font-semibold mb-2">Max distance: {distance} km</label>
            <input id="rec-dist" type="range" min="1" max="50" value={distance} onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-[#2E7D32] mt-4" />
          </div>
        </div>
        <fieldset className="space-y-3">
          <legend className="text-sm font-semibold mb-1">Preferences</legend>
          {[
            ["Reward points", wantPoints, setWantPoints],
            ["Cash for recyclables", wantCash, setWantCash],
            ["Home collection", wantPickup, setWantPickup],
          ].map(([label, val, set]) => (
            <label key={label} className="flex items-center gap-3 text-sm">
              <input type="checkbox" checked={val} onChange={(e) => set(e.target.checked)} className="h-5 w-5 rounded accent-[#2E7D32]" />
              {label}
            </label>
          ))}
        </fieldset>
        <button type="submit" className="h-14 w-full rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition">
          <Wand2 className="w-5 h-5" /> Generate recommendation
        </button>
      </form>

      <div className="space-y-4">
        {!result && (
          <div className="glass orbital p-8 text-muted-foreground">
            Fill in the form and we'll rank the best matching centres for your material, travel mode and preferences.
          </div>
        )}
        {result && result.map((c, i) => <CentreCard key={c.id || c.name} centre={c} highlight={i === 0} />)}
      </div>
    </div>
  );
}