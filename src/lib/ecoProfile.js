import { base44 } from "@/api/base44Client";

export async function getOrCreateProfile() {
  const me = await base44.auth.me().catch(() => null);
  if (!me) return { user: null, profile: null };
  const existing = await base44.entities.EcoProfile.filter({ created_by_id: me.id });
  if (existing[0]) return { user: me, profile: existing[0] };
  const profile = await base44.entities.EcoProfile.create({
    display_name: me.full_name || "Eco Hero",
    xp: 0,
    eco_points: 0,
    items_recycled: 0,
    plastic_saved_kg: 0,
    co2_reduced_kg: 0,
    streak_days: 1,
    badges: [],
    redeemed_rewards: [],
    favourite_centres: [],
  });
  return { user: me, profile };
}