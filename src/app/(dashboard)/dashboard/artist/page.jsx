"use client";
import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FaPalette, FaDollarSign, FaLayerGroup, FaHistory, FaPlus } from "react-icons/fa";
import Link from "next/link";

export default function ArtistDashboardOverview() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      apiFetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/artworks/artist/${user.email}`, { cache: 'no-store' })
        .then(r => r.json())
        .then(d => { setArtworks(Array.isArray(d) ? d : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (!user) return <div className="text-muted p-8">Loading...</div>;

  const totalRevenue = artworks.filter(a => a.status === "sold").reduce((s, a) => s + (Number(a.price) || 0), 0);
  const soldCount = artworks.filter(a => a.status === "sold").length;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        {user.image && <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-indigo-500/60 ring-offset-2 ring-offset-slate-50 dark:ring-offset-slate-950" />}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Artist Studio, {user.name} 🎨</h1>
          <p className="text-muted mt-1">Manage your portfolio and track your sales.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        {[
          { label: "Total Artworks", value: artworks.length, icon: <FaLayerGroup />, color: "indigo" },
          { label: "Artworks Sold", value: soldCount, icon: <FaPalette />, color: "pink" },
          { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: <FaDollarSign />, color: "green" },
          { label: "Available", value: artworks.length - soldCount, icon: <FaLayerGroup />, color: "blue" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border bg-background p-5 flex items-center gap-4 hover:border-slate-300 dark:hover:border-slate-700 transition-colors shadow-sm">
            <div className={`w-12 h-12 rounded-xl bg-${s.color}-50 dark:bg-${s.color}-500/10 text-${s.color}-600 dark:text-${s.color}-400 flex items-center justify-center text-xl shrink-0`}>{s.icon}</div>
            <div className="min-w-0">
              <p className="text-muted text-xs font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-foreground font-bold text-xl truncate">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { href: "/dashboard/artist/add-artwork", icon: <FaPlus />, color: "pink", label: "Add Artwork", desc: "Post a new artwork to the marketplace." },
          { href: "/dashboard/artist/manage-artworks", icon: <FaLayerGroup />, color: "indigo", label: "Manage Artworks", desc: "Edit or delete your existing artworks." },
          { href: "/dashboard/artist/sales", icon: <FaHistory />, color: "green", label: "Sales History", desc: "See who bought your artworks and when." },
          { href: "/dashboard/artist/profile", icon: <FaPalette />, color: "purple", label: "Profile", desc: "Update your artist profile details." },
        ].map(c => (
          <Link key={c.href} href={c.href} className={`group rounded-2xl border border-border bg-background hover:bg-${c.color}-50 dark:hover:bg-${c.color}-500/10 hover:border-${c.color}-200 dark:hover:border-${c.color}-500/30 transition-all duration-200 p-6 flex flex-col gap-3 shadow-sm`}>
            <div className={`w-10 h-10 rounded-xl bg-${c.color}-100 dark:bg-${c.color}-500/10 text-${c.color}-600 dark:text-${c.color}-400 flex items-center justify-center text-lg group-hover:bg-${c.color}-200 dark:group-hover:bg-${c.color}-500/20 transition-colors`}>{c.icon}</div>
            <div>
              <p className="font-bold text-foreground">{c.label}</p>
              <p className="text-muted text-xs mt-1">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Artworks */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Recent Artworks</h2>
          <Link href="/dashboard/artist/manage-artworks" className="text-xs font-semibold text-accent-secondary hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">View All →</Link>
        </div>
        <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-muted animate-pulse">Loading artworks...</div>
          ) : artworks.length === 0 ? (
            <div className="p-10 text-center">
              <FaPalette className="mx-auto text-4xl text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-muted font-medium">No artworks posted yet.</p>
              <Link href="/dashboard/artist/add-artwork" className="inline-block mt-3 px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white text-sm font-semibold hover:opacity-90 transition shadow-md shadow-indigo-500/20">
                Post Your First Artwork
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm whitespace-nowrap">
                <thead>
                  <tr className="border-b border-border bg-surface-solid">
                    {["Title", "Category", "Price", "Status"].map(h => (
                      <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {artworks.slice(0, 5).map(a => (
                    <tr key={a._id} className="border-b border-border/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="px-5 py-3.5 font-semibold text-foreground flex items-center gap-3">
                        {a.image ? <img src={a.image} alt={a.title} className="w-9 h-9 rounded-lg object-cover shrink-0" /> : <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center shrink-0"><FaPalette className="text-accent-secondary text-xs" /></div>}
                        <span className="truncate max-w-[180px]">{a.title}</span>
                      </td>
                      <td className="px-5 py-3.5 text-muted">{a.category || "—"}</td>
                      <td className="px-5 py-3.5 text-green-600 dark:text-green-400 font-bold">${a.price}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${a.status === "sold" ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400" : "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"}`}>{a.status || "Available"}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}