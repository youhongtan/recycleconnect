import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { MATERIALS, ECO_POINTS, getLevel } from "@/lib/recycleData";
import { getOrCreateProfile } from "@/lib/ecoProfile";
import { MapPin, Clock, Phone, CheckCircle2, Loader2, Sparkles, ScanLine } from "lucide-react";

export default function CheckIn() {
  const [params] = useSearchParams();
  const centreId = params.get("centre");
  const [centre, setCentre] = useState(null);
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [selected, setSelected] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (centreId) {
        const { data: c } = await supabase.from('recycling_centres').select('*').eq('id', centreId).maybeSingle();
        setCentre(c);
      }
      const { user: u, profile: p } = await getOrCreateProfile();
      setUser(u);
      setProfile(p);
      setLoading(false);
    })();
  }, [centreId]);

  const toggle = (m) => setSelected((s) => ({ ...s, [m]: s[m] ? undefined : { qty: 1 } }));
  const setQty = (m, qty) => setSelected((s) => ({ ...s, [m]: { qty: Math.max(1, Number(qty)) } }));
  const total = Object.entries(selected).reduce((sum, [m, v]) => sum + (ECO_POINTS[m] || 5) * (v?.qty || 0), 0);
  const totalItems = Object.values(selected).reduce((s, v) => s + (v?.qty || 0), 0);

  const submit = async () => {
    setSubmitting(true);
    const entries = Object.entries(selected).filter(([, v]) => v);
    let pointsEarned = 0;
    for (const [material, v] of entries) {
      const pts = (ECO_POINTS[material] || 5) * v.qty;
      pointsEarned += pts;
      await supabase.from('recycle_logs').insert({
        user_id: user.id,
        material,
        quantity: v.qty,
        weight_kg: 0,
        centre_id: centreId,
        centre_name: centre?.name,
        eco_points_earned: pts,
        source: "qr_checkin",
      });
    }
    const oldBadges = profile.badges || [];
    const badges = new Set(oldBadges);
    badges.add("First Recycling Action");
    if ((profile.items_recycled || 0) + totalItems >= 50) badges.add("Earth Guardian");
    const { data: updated } = await supabase.from('eco_profiles').update({
      xp: (profile.xp || 0) + pointsEarned * 2,
      eco_points: (profile.eco_points || 0) + pointsEarned,
      items_recycled: (profile.items_recycled || 0) + totalItems,
      badges: [...badges],
    }).eq('id', profile.id).select().single();
    setProfile(updated);
    const newBadges = [...badges].filter((b) => !oldBadges.includes(b));
    setResult({ pointsEarned, level: getLevel(updated.xp), newBadges });
    setSubmitting(false);
  };

  if (loading) return <div className="max-w-2xl mx-auto px-6 py-20 flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;

  if (!centreId) return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <ScanLine className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
      <h1 className="text-2xl font-bold mb-2">Scan to Check In</h1>
      <p className="text-muted-foreground mb-6">Scan the QR code at any recycling centre to log your items and earn Eco Points.</p>
      <Link to="/finder" className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold">Find a Centre</Link>
    </div>
  );

  if (!user) return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <h1 className="text-3xl font-bold mb-4">Sign in to check in</h1>
      <p className="text-muted-foreground mb-6">Scan recycling QR codes to earn Eco Points.</p>
      <Link to="/login" className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center">Sign in</Link>
    </div>
  );

  if (result) return (
    <div className="max-w-2xl mx-auto px-6 py-20 text-center">
      <CheckCircle2 className="w-16 h-16 mx-auto text-primary mb-4" />
      <h1 className="text-3xl font-bold mb-2">+{result.pointsEarned} Eco Points!</h1>
      <p className="text-muted-foreground mb-6">Level {result.level} • {profile.eco_points} total Eco Points</p>
      {result.newBadges.length > 0 && (
        <div className="mb-6">
          <p className="text-sm font-semibold mb-2">New badges unlocked!</p>
          <div className="flex gap-2 justify-center flex-wrap">
            {result.newBadges.map((b) => <span key={b} className="px-3 py-1 rounded-full bg-primary/12 text-primary text-sm font-medium">🏅 {b}</span>)}
          </div>
        </div>
      )}
      <div className="flex gap-3 justify-center flex-wrap">
        <Link to="/profile" className="h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center">View Profile</Link>
        <Link to="/rewards" className="h-12 px-6 rounded-full glass font-semibold inline-flex items-center">Rewards</Link>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-6 pb-10">
      {centre && (
        <div className="glass orbital p-6 mb-6">
          <h1 className="text-2xl font-bold">{centre.name}</h1>
          <div className="mt-2 space-y-1 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {centre.address}</p>
            {centre.hours && <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {centre.hours}</p>}
            {centre.contact && <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> {centre.contact}</p>}
          </div>
        </div>
      )}
      <div className="glass orbital p-6">
        <h2 className="text-lg font-semibold mb-1">What did you recycle?</h2>
        <p className="text-sm text-muted-foreground mb-4">Select items to earn Eco Points.</p>
        <div className="space-y-2 mb-4">
          {MATERIALS.map((m) => (
            <div key={m} className={`flex items-center gap-3 p-3 rounded-2xl border transition-colors ${selected[m] ? "border-primary bg-primary/5" : "border-border"}`}>
              <button type="button" onClick={() => toggle(m)} className={`h-6 w-6 rounded-lg border-2 grid place-items-center shrink-0 ${selected[m] ? "bg-primary border-primary" : "border-border"}`}>
                {selected[m] && <CheckCircle2 className="w-4 h-4 text-primary-foreground" />}
              </button>
              <span className="flex-1 font-medium">{m}</span>
              <span className="text-sm text-muted-foreground">+{ECO_POINTS[m] || 5}</span>
              {selected[m] && (
                <input type="number" min="1" value={selected[m].qty} onChange={(e) => setQty(m, e.target.value)} className="w-16 h-10 px-2 rounded-xl border border-border text-center" />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4 p-4 rounded-2xl bg-primary/8">
          <div>
            <p className="text-sm text-muted-foreground">You'll earn</p>
            <p className="text-2xl font-bold text-primary">+{total} Eco Points</p>
          </div>
          <Sparkles className="w-8 h-8 text-primary" />
        </div>
        <button
          disabled={submitting || totalItems === 0}
          onClick={submit}
          className="w-full h-14 rounded-full bg-primary text-primary-foreground font-semibold disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing…</> : `Check In & Earn ${total} Points`}
        </button>
      </div>
    </div>
  );
}
