import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Users, Recycle, Coins, MapPin, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import StatCard from "@/components/admin/StatCard";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, actions: 0, ecoPoints: 0, centres: 0 });
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [users, logs, profiles, centres] = await Promise.all([
        base44.entities.User.list().catch(() => []),
        base44.entities.RecycleLog.list("", 500).catch(() => []),
        base44.entities.EcoProfile.list().catch(() => []),
        base44.entities.RecyclingCentre.list().catch(() => []),
      ]);
      const matCount = {};
      logs.forEach((l) => { matCount[l.material] = (matCount[l.material] || 0) + 1; });
      setStats({
        users: users.length,
        actions: logs.length,
        ecoPoints: profiles.reduce((s, p) => s + (p.eco_points || 0), 0),
        centres: centres.length,
      });
      setMaterials(Object.entries(matCount).map(([name, count]) => ({ name, count })));
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="text-muted-foreground">Loading analytics…</p>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and recycling analytics</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value={stats.users} color="primary" />
        <StatCard icon={Recycle} label="Recycling Actions" value={stats.actions} color="accent" />
        <StatCard icon={Coins} label="Eco Points Issued" value={stats.ecoPoints} color="amber" />
        <StatCard icon={MapPin} label="Recycling Centres" value={stats.centres} color="rose" />
      </div>
      <div className="glass orbital p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold">Recycling by Material</h2>
        </div>
        {materials.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={materials}>
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground py-12 text-center">No recycling data yet.</p>
        )}
      </div>
    </div>
  );
}