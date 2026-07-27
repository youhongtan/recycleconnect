import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Shield, User as UserIcon, Loader2 } from "lucide-react";

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.User.list()
      .then((u) => { setUsers(u); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = users.filter((u) =>
    (u.full_name || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleRole = async (u) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    await base44.entities.User.update(u.id, { role: newRole });
    setUsers((prev) => prev.map((x) => (x.id === u.id ? { ...x, role: newRole } : x)));
  };

  if (loading) return <p className="flex items-center gap-2 text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Loading users…</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">{users.length} registered users</p>
      </div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full h-12 pl-12 pr-4 rounded-2xl border border-border bg-background"
        />
      </div>
      <div className="glass orbital overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border">
            <tr className="text-left text-muted-foreground">
              <th className="p-4 font-medium">Name</th>
              <th className="p-4 font-medium hidden sm:table-cell">Email</th>
              <th className="p-4 font-medium">Role</th>
              <th className="p-4 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-primary/5">
                <td className="p-4 font-medium">{u.full_name || "—"}</td>
                <td className="p-4 hidden sm:table-cell text-muted-foreground">{u.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-accent/12 text-accent" : "bg-muted text-muted-foreground"}`}>
                    {u.role || "user"}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button
                    onClick={() => toggleRole(u)}
                    className="inline-flex items-center gap-1 h-8 px-3 rounded-full text-xs font-medium border border-border hover:bg-primary/8"
                  >
                    {u.role === "admin" ? <><UserIcon className="w-3 h-3" /> Make User</> : <><Shield className="w-3 h-3" /> Make Admin</>}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}