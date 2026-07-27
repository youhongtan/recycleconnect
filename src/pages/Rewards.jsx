import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { getOrCreateProfile } from "@/lib/ecoProfile";
import { Coins, Gift, Check, Loader2 } from "lucide-react";

export default function Rewards() {
  const [rewards, setRewards] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    (async () => {
      const [rewardsData, { profile: p }] = await Promise.all([
        base44.entities.Reward.filter({ available: true }),
        getOrCreateProfile(),
      ]);
      setRewards(rewardsData);
      setProfile(p);
      setLoading(false);
    })();
  }, []);

  const redeem = async (reward) => {
    if ((profile.eco_points || 0) < reward.eco_points_cost) return;
    setRedeeming(reward.id);
    const redeemed = new Set(profile.redeemed_rewards || []);
    redeemed.add(reward.id);
    const updated = await base44.entities.EcoProfile.update(profile.id, {
      eco_points: (profile.eco_points || 0) - reward.eco_points_cost,
      redeemed_rewards: [...redeemed],
    });
    setProfile(updated);
    setRedeeming(null);
  };

  if (loading) return <div className="max-w-4xl mx-auto px-6 py-20 flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto px-6 pb-10 space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl font-bold">Eco Rewards</h1>
          <p className="text-muted-foreground mt-1">Redeem your Eco Points for sustainable rewards.</p>
        </div>
        <div className="glass orbital px-6 py-4 flex items-center gap-3">
          <Coins className="w-8 h-8 text-primary" />
          <div>
            <p className="text-2xl font-bold">{profile?.eco_points || 0}</p>
            <p className="text-xs text-muted-foreground">Eco Points</p>
          </div>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards.map((r) => {
          const redeemed = (profile?.redeemed_rewards || []).includes(r.id);
          const canAfford = (profile?.eco_points || 0) >= r.eco_points_cost;
          return (
            <div key={r.id} className="glass orbital overflow-hidden flex flex-col">
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-accent/20 grid place-items-center">
                <Gift className="w-12 h-12 text-primary" />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <span className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">{r.category}</span>
                <h3 className="font-bold text-lg">{r.name}</h3>
                <p className="text-sm text-muted-foreground mt-1 flex-1">{r.description}</p>
                <div className="flex items-center gap-1 mt-3 mb-3">
                  <Coins className="w-4 h-4 text-primary" />
                  <span className="font-bold">{r.eco_points_cost} points</span>
                </div>
                <button
                  disabled={redeemed || !canAfford || redeeming === r.id}
                  onClick={() => redeem(r)}
                  className={`w-full h-11 rounded-full font-semibold transition ${redeemed ? "bg-muted text-muted-foreground" : canAfford ? "bg-primary text-primary-foreground hover:brightness-110" : "bg-muted text-muted-foreground cursor-not-allowed"}`}
                >
                  {redeemed ? <span className="inline-flex items-center gap-1"><Check className="w-4 h-4" /> Redeemed</span> : redeeming === r.id ? "Processing…" : canAfford ? "Redeem" : "Not enough points"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {rewards.length === 0 && <p className="text-center text-muted-foreground py-20">No rewards available yet. Check back soon!</p>}
    </div>
  );
}