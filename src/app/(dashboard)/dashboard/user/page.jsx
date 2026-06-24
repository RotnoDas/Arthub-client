"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FaPalette, FaDollarSign, FaShoppingBag, FaUser } from "react-icons/fa";
import Link from "next/link";

export default function UserDashboard() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;

  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/artworks/purchase/${user.email}`)
        .then((res) => res.json())
        .then((data) => {
          setPurchases(Array.isArray(data) ? data : []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [user]);

  if (!user) return <div className="text-white p-8">Loading...</div>;

  const totalSpent = purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        {user.image && (
          <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-pink-500/60 ring-offset-2 ring-offset-[#080c16]" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-white">Welcome back, {user.name} 🎨</h1>
          <p className="text-slate-400 mt-1">Your personal ArtHub collection dashboard.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Artworks Owned", value: purchases.length, icon: <FaPalette />, color: "pink" },
          { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: <FaDollarSign />, color: "green" },
          { label: "Recent Purchase", value: purchases[0]?.artworkTitle || "—", icon: <FaShoppingBag />, color: "indigo" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4 hover:border-${s.color}-500/30 transition-colors`}>
            <div className={`w-12 h-12 rounded-xl bg-${s.color}-500/10 text-${s.color}-400 flex items-center justify-center text-xl`}>
              {s.icon}
            </div>
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-white font-bold text-xl truncate max-w-[140px]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link href="/dashboard/user/purchases" className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-pink-500/5 hover:border-pink-500/30 transition-all duration-200 p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-pink-500/10 text-pink-400 flex items-center justify-center text-lg group-hover:bg-pink-500/20 transition-colors">
            <FaShoppingBag />
          </div>
          <div>
            <p className="font-bold text-white">Purchase History</p>
            <p className="text-slate-400 text-xs mt-1">View all your past artwork purchases.</p>
          </div>
        </Link>
        <Link href="/dashboard/user/collection" className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-indigo-500/5 hover:border-indigo-500/30 transition-all duration-200 p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-lg group-hover:bg-indigo-500/20 transition-colors">
            <FaPalette />
          </div>
          <div>
            <p className="font-bold text-white">My Collection</p>
            <p className="text-slate-400 text-xs mt-1">Browse your gallery of owned artworks.</p>
          </div>
        </Link>
        <Link href="/dashboard/user/profile" className="group rounded-2xl border border-white/10 bg-white/5 hover:bg-purple-500/5 hover:border-purple-500/30 transition-all duration-200 p-6 flex flex-col gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center text-lg group-hover:bg-purple-500/20 transition-colors">
            <FaUser />
          </div>
          <div>
            <p className="font-bold text-white">Profile Settings</p>
            <p className="text-slate-400 text-xs mt-1">Edit your profile and change password.</p>
          </div>
        </Link>
      </div>

      {/* Recent Purchases Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Recent Purchases</h2>
          <Link href="/dashboard/user/purchases" className="text-xs font-semibold text-pink-400 hover:text-pink-300 transition-colors">View All →</Link>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-400 animate-pulse">Loading...</div>
          ) : purchases.length === 0 ? (
            <div className="p-10 text-center">
              <FaPalette className="mx-auto text-4xl text-slate-600 mb-3" />
              <p className="text-slate-400 font-medium">No purchases yet.</p>
              <Link href="/artworks" className="inline-block mt-3 text-pink-400 text-sm font-semibold hover:text-pink-300">Browse Artworks →</Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {["Artwork", "Artist", "Price", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchases.slice(0, 5).map((p) => (
                  <tr key={p._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">{p.artworkTitle}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{p.artistEmail}</td>
                    <td className="px-4 py-3 text-green-400 font-bold">${p.amount}</td>
                    <td className="px-4 py-3 text-slate-300 text-xs">{new Date(p.purchaseDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}