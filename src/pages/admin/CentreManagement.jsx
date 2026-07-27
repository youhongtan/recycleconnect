import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { MATERIALS } from "@/lib/recycleData";
import { Plus, Pencil, Trash2, X, Loader2 } from "lucide-react";

const EMPTY = {
  name: "", description: "", address: "", city: "", state: "", lat: 0, lng: 0,
  hours: "", contact: "", website: "", category: "Community Point",
  materials: [], pays_cash: false, reward_points: false, home_collection: false,
};
const CATEGORIES = ["Mall Drop-off", "Council Centre", "Scrap Dealer", "Community Point", "E-Waste Collector", "Oil Collector", "Fabric Bank"];

export default function CentreManagement() {
  const [centres, setCentres] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    const { data } = await supabase.from('recycling_centres').select('*');
    setCentres(data || []);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    if (editing.id) {
      await supabase.from('recycling_centres').update(editing).eq('id', editing.id);
    } else {
      await supabase.from('recycling_centres').insert(editing);
    }
    setSaving(false);
    setEditing(null);
    load();
  };

  const del = async (c) => {
    if (!confirm(`Delete ${c.name}?`)) return;
    await supabase.from('recycling_centres').delete().eq('id', c.id);
    load();
  };

  const toggleMat = (m) =>
    setEditing((e) => ({
      ...e,
      materials: e.materials.includes(m) ? e.materials.filter((x) => x !== m) : [...e.materials, m],
    }));

  const field = "w-full h-12 px-4 rounded-2xl border border-border bg-background";

  if (loading) return <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading centres…</p>;

  if (editing) {
    return (
      <div className="max-w-2xl space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{editing.id ? "Edit Centre" : "Add Centre"}</h1>
          <button onClick={() => setEditing(null)} className="h-10 w-10 rounded-full grid place-items-center glass"><X className="w-4 h-4" /></button>
        </div>
        <input className={field} placeholder="Centre name *" value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
        <textarea className={field + " h-20 py-3"} placeholder="Description" value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} />
        <input className={field} placeholder="Address *" value={editing.address} onChange={(e) => setEditing({ ...editing, address: e.target.value })} />
        <div className="grid grid-cols-2 gap-3">
          <input className={field} placeholder="City" value={editing.city || ""} onChange={(e) => setEditing({ ...editing, city: e.target.value })} />
          <input className={field} placeholder="State" value={editing.state || ""} onChange={(e) => setEditing({ ...editing, state: e.target.value })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input type="number" step="0.0001" className={field} placeholder="Latitude" value={editing.lat || ""} onChange={(e) => setEditing({ ...editing, lat: Number(e.target.value) })} />
          <input type="number" step="0.0001" className={field} placeholder="Longitude" value={editing.lng || ""} onChange={(e) => setEditing({ ...editing, lng: Number(e.target.value) })} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <input className={field} placeholder="Opening hours" value={editing.hours || ""} onChange={(e) => setEditing({ ...editing, hours: e.target.value })} />
          <input className={field} placeholder="Contact" value={editing.contact || ""} onChange={(e) => setEditing({ ...editing, contact: e.target.value })} />
        </div>
        <input className={field} placeholder="Website URL" value={editing.website || ""} onChange={(e) => setEditing({ ...editing, website: e.target.value })} />
        <select className={field} value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })}>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <div>
          <p className="text-sm font-medium mb-2">Accepted Materials</p>
          <div className="flex flex-wrap gap-2">
            {MATERIALS.map((m) => (
              <button key={m} type="button" onClick={() => toggleMat(m)} className={`px-3 py-1.5 rounded-full text-sm font-medium ${editing.materials.includes(m) ? "bg-primary text-primary-foreground" : "glass"}`}>{m}</button>
            ))}
          </div>
        </div>
        <div className="flex gap-4 flex-wrap">
          {[["pays_cash", "Pays cash"], ["reward_points", "Reward points"], ["home_collection", "Home collection"]].map(([k, label]) => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={editing[k] || false} onChange={(e) => setEditing({ ...editing, [k]: e.target.checked })} />
              {label}
            </label>
          ))}
        </div>
        <button onClick={save} disabled={saving || !editing.name || !editing.address} className="w-full h-12 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50">
          {saving ? "Saving…" : "Save Centre"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">Centre Management</h1>
          <p className="text-muted-foreground mt-1">{centres.length} recycling centres</p>
        </div>
        <button onClick={() => setEditing({ ...EMPTY })} className="h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Centre
        </button>
      </div>
      <div className="grid gap-3">
        {centres.map((c) => (
          <div key={c.id} className="glass orbital p-4 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold truncate">{c.name}</p>
              <p className="text-sm text-muted-foreground truncate">{c.address} • {c.city || c.state}</p>
              <div className="flex gap-1 mt-1 flex-wrap">
                {(c.materials || []).slice(0, 5).map((m) => <span key={m} className="text-xs px-2 py-0.5 rounded-full bg-primary/8 text-primary">{m}</span>)}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={() => setEditing({ ...c })} className="h-10 w-10 rounded-full grid place-items-center glass"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => del(c)} className="h-10 w-10 rounded-full grid place-items-center glass text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
