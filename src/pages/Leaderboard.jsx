import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { getLevel } from "@/lib/recycleData";
import { getOrCreateProfile } from "@/lib/ecoProfile";
import { Trophy, Loader2 } from "lucide-react";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard() {
  const [profiles, setProfiles] = useState([]);
  const [myProfile, setMyProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const all = await base44.entities.EcoProfile.list("", 100).catch(() => []);
      all.sort((a, b) => (b.eco_points || 0) - (a.eco_points || 0));
      setProfiles(all);
      const { profile: p } = await getOrCreateProfile();
      setMyProfile(p);
      setLoading(false);
    })();
  }, []);

  if (loading) return <div className="max-w-3xl mx-auto px-6 py-20 flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;

  const myRank = profiles.findIndex((p) => p.id === myProfile?.id) + 1;

  return (
    <div className="max-w-3xl mx-auto px-6 pb-10 space-y-6">
      <div className="text-center">
        <Trophy className="w-12 h-12 mx-auto text-amber-500 mb-2" />
        <h1 className="text-4xl font-bold">Eco Leaderboard</h1>
        <p className="text-muted-foreground mt-1">Top recyclers making the biggest impact.</p>
      </div>
      {myProfile && (
        <div className="glass orbital p-4 flex items-center gap-4">
          <span className="text-2xl font-bold text-primary w-12 text-center">#{myRank}</span>
          <div className="flex-1">
            <p className="font-semibold">{myProfile.display_name || "You"}</p>
            <p className="text-sm text-muted-foreground">Level {getLevel(myProfile.xp)}</p>
          </div>
          <span className="font-bold text-primary">{myProfile.eco_points || 0} pts</span>
        </div>
      )}
      <div className="space-y-2">
        {profiles.map((p, i) => (
          <div key={p.id} className={`glass orbital p-4 flex items-center gap-4 ${p.id === myProfile?.id ? "ring-2 ring-primary" : ""}`}>
            <span className="text-xl font-bold w-12 text-center">{MEDALS[i] || `#${i + 1}`}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{p.display_name || "Eco Hero"}</p>
              <p className="text-sm text-muted-foreground">Level {getLevel(p.xp)} • {p.items_recycled || 0} items</p>
            </div>
            <span className="font-bold text-primary whitespace-nowrap">{p.eco_points || 0} pts</span>
          </div>
        ))}
      </div>
      {profiles.length === 0 && <p className="text-center text-muted-foreground py-20">No profiles yet. Be the first!</p>}
    </div>
  );
}