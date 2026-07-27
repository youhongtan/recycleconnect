import React, { useEffect, useState } from "react";
import { supabase } from "@/api/supabaseClient";
import { getOrCreateProfile } from "@/lib/ecoProfile";
import { Target, Trophy, Loader2, CheckCircle2 } from "lucide-react";

export default function Challenges() {
  const [challenges, setChallenges] = useState([]);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: ch } = await supabase.from('challenges').select('*').eq('active', true);
      const { user, profile: p } = await getOrCreateProfile();
      setChallenges(ch || []);
      setProfile(p);
      if (user) {
        const { data: userLogs } = await supabase
          .from('recycle_logs')
          .select('*')
          .eq('user_id', user.id);
        setLogs(userLogs || []);
      }
      setLoading(false);
    })();
  }, []);

  const getProgress = (ch) => {
    if (!profile) return 0;
    switch (ch.metric) {
      case "items_recycled": return logs.length;
      case "plastic_saved": return logs.filter((l) => l.material === "Plastic").reduce((s, l) => s + (l.weight_kg || 0), 0);
      case "co2_reduced": return logs.reduce((s, l) => s + (l.weight_kg || 0) * 1.5, 0);
      case "streak_days": return profile.streak_days || 0;
      default: return 0;
    }
  };

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-20 flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto px-6 pb-10 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Eco Challenges</h1>
        <p className="text-muted-foreground mt-1">Complete challenges to earn XP, Eco Points and badges.</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {challenges.map((ch) => {
          const progress = getProgress(ch);
          const pct = Math.min(100, Math.round((progress / ch.target) * 100));
          const done = progress >= ch.target;
          return (
            <div key={ch.id} className="glass orbital p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-primary" />
                  <span className="text-xs font-semibold uppercase tracking-wide text-primary">{ch.type}</span>
                </div>
                {done && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </div>
              <h3 className="font-bold text-lg">{ch.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">{ch.description}</p>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-semibold">{Math.min(progress, ch.target)} / {ch.target}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden mb-4">
                <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
              </div>
              <div className="flex items-center gap-3 text-sm flex-wrap">
                <span className="flex items-center gap-1"><Trophy className="w-4 h-4 text-amber-500" /> +{ch.xp_reward} XP</span>
                <span className="flex items-center gap-1">🪙 +{ch.eco_points_reward} Eco Points</span>
                {ch.badge && <span className="flex items-center gap-1">🏅 {ch.badge}</span>}
              </div>
            </div>
          );
        })}
      </div>
      {challenges.length === 0 && <p className="text-center text-muted-foreground py-20">No active challenges right now.</p>}
    </div>
  );
}
