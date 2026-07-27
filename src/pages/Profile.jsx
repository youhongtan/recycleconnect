import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import SectionHeading from "@/components/common/SectionHeading";
import Reveal from "@/components/common/Reveal";
import ProfileStats from "@/components/profile/ProfileStats";
import Badges from "@/components/profile/Badges";
import Missions from "@/components/profile/Missions";
import Leaderboard from "@/components/profile/Leaderboard";
import LogRecycleForm from "@/components/profile/LogRecycleForm";
import { Loader2 } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const me = await base44.auth.me().catch(() => null);
      setUser(me);
      if (me) {
        const existing = await base44.entities.EcoProfile.filter({ created_by_id: me.id });
        const p = existing[0] || (await base44.entities.EcoProfile.create({
          display_name: me.full_name, xp: 0, items_recycled: 0, plastic_saved_kg: 0,
          co2_reduced_kg: 0, streak_days: 1, badges: [],
        }));
        setProfile(p);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-20 flex items-center gap-2 text-muted-foreground">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading your eco profile…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-6 pb-10 text-center">
        <SectionHeading
          eyebrow="Profile"
          title="Track your impact"
          subtitle="Sign in to log recycled items, earn XP, unlock badges and climb the leaderboard."
        />
        <button
          onClick={() => base44.auth.redirectToLogin()}
          className="mt-10 h-14 px-8 rounded-full bg-primary text-primary-foreground font-semibold soft-shadow hover:brightness-110 active:scale-[0.98] transition"
        >
          Sign in to continue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 pb-10 space-y-8">
      <SectionHeading
        align="left"
        eyebrow="Profile"
        title={`Hello, ${profile.display_name || user.full_name || "Eco Hero"}`}
        subtitle="Every item you log turns into XP, badges and a measurable carbon saving."
      />
      <Reveal><ProfileStats profile={profile} /></Reveal>
      <Reveal delay={0.05}><LogRecycleForm profile={profile} onUpdate={setProfile} /></Reveal>
      <Reveal delay={0.1}><Missions /></Reveal>
      <Reveal delay={0.1}><Badges earned={profile.badges || []} /></Reveal>
      <Reveal delay={0.1}><Leaderboard you={profile.xp || 0} /></Reveal>
    </div>
  );
}