import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { useI18n, LANGS } from "@/lib/i18n";
import { getOrCreateProfile } from "@/lib/ecoProfile";
import ThemeToggle from "@/components/common/ThemeToggle";
import { User, Globe, Palette, LogOut, Save, Loader2, Check } from "lucide-react";

export default function Settings() {
  const { lang, setLang, t } = useI18n();
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { user: u, profile: p } = await getOrCreateProfile();
      setUser(u);
      setProfile(p);
      setName(p?.display_name || u?.full_name || "");
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    if (profile) {
      const updated = await base44.entities.EcoProfile.update(profile.id, { display_name: name });
      setProfile(updated);
    }
    if (user) {
      await base44.auth.updateMe({ full_name: name });
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) return <div className="max-w-2xl mx-auto px-6 py-20 flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading…</div>;

  return (
    <div className="max-w-2xl mx-auto px-6 pb-10 space-y-6">
      <div>
        <h1 className="text-4xl font-bold">{t("settings")}</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>
      <div className="glass orbital p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary"><User className="w-5 h-5" /><h2 className="font-semibold">Profile</h2></div>
        <div>
          <label className="block text-sm font-medium mb-2">Display Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-12 px-4 rounded-2xl border border-border bg-background" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input value={user?.email || ""} disabled className="w-full h-12 px-4 rounded-2xl border border-border bg-muted text-muted-foreground" />
        </div>
        <button onClick={save} disabled={saving} className="h-12 px-6 rounded-full bg-primary text-primary-foreground font-semibold inline-flex items-center gap-2 disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>
      <div className="glass orbital p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary"><Globe className="w-5 h-5" /><h2 className="font-semibold">Language</h2></div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(LANGS).map(([code, info]) => (
            <button key={code} onClick={() => setLang(code)} className={`h-12 rounded-2xl font-medium transition ${lang === code ? "bg-primary text-primary-foreground" : "glass"}`}>
              {info.label}
            </button>
          ))}
        </div>
      </div>
      <div className="glass orbital p-6 space-y-4">
        <div className="flex items-center gap-2 text-primary"><Palette className="w-5 h-5" /><h2 className="font-semibold">Appearance</h2></div>
        <div className="flex items-center justify-between">
          <span>Dark / Light Mode</span>
          <ThemeToggle />
        </div>
      </div>
      <button onClick={() => base44.auth.logout("/")} className="w-full h-12 rounded-full border border-destructive/30 text-destructive font-semibold inline-flex items-center justify-center gap-2 hover:bg-destructive/5">
        <LogOut className="w-4 h-4" /> Logout
      </button>
    </div>
  );
}