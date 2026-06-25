"use client";
import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FaPalette, FaDollarSign, FaShoppingBag, FaUser, FaCrown } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function UserDashboard() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;

  const [purchases, setPurchases] = useState([]);
  const [dbUser, setDbUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      Promise.all([
        apiFetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/artworks/purchase/${user.email}`).then(res => res.json()),
        apiFetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/users/${user.email}`).then(res => res.json())
      ])
      .then(([purchasesData, userData]) => {
        setPurchases(Array.isArray(purchasesData) ? purchasesData : []);
        setDbUser(userData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
    }
  }, [user]);

  const handleUpgrade = async (tier) => {
    setCheckoutLoading(true);
    const loadingToast = toast.loading(`Redirecting to Stripe...`);
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/checkout/subscription`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buyerEmail: user.email, tier, origin: window.location.origin })
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        toast.error("Failed to initiate checkout", { id: loadingToast });
        setCheckoutLoading(false);
      }
    } catch {
      toast.error("Error connecting to server", { id: loadingToast });
      setCheckoutLoading(false);
    }
  };

  if (!user || loading) return <div className="text-slate-500 dark:text-slate-400 p-8">Loading...</div>;

  const tier = dbUser?.subscriptionTier || "free";
  let maxPurchases = 3;
  if (tier === "pro") maxPurchases = 9;
  if (tier === "premium") maxPurchases = "Unlimited";

  const totalSpent = purchases.reduce((sum, p) => sum + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        {user.image && (
          <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full object-cover ring-2 ring-pink-500/60 ring-offset-2 ring-offset-slate-50" />
        )}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, {user.name} 🎨</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Your personal ArtHub collection dashboard.</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {[
          { label: "Artworks Owned", value: purchases.length, icon: <FaPalette />, color: "pink" },
          { label: "Total Spent", value: `$${totalSpent.toFixed(2)}`, icon: <FaDollarSign />, color: "green" },
          { label: "Recent Purchase", value: purchases[0]?.artworkTitle || "—", icon: <FaShoppingBag />, color: "indigo" },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 flex items-center gap-4 hover:border-${s.color}-500/30 transition-colors shadow-sm`}>
            <div className={`w-12 h-12 rounded-xl bg-${s.color}-50 dark:bg-${s.color}-500/10 text-${s.color}-600 dark:text-${s.color}-400 flex items-center justify-center text-xl`}>
              {s.icon}
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              <p className="text-slate-900 dark:text-white font-bold text-xl truncate max-w-[140px]">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Subscription Tier Overview */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6 sm:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] dark:opacity-[0.05] text-slate-900 dark:text-white">
          <FaCrown size={120} />
        </div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              Subscription Status: <span className="text-pink-600 dark:text-pink-400 capitalize">{tier}</span>
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              You have purchased {purchases.length} out of {maxPurchases} allowed artworks.
            </p>
          </div>
          <div className="flex gap-3">
            {tier === "free" && (
              <Button isLoading={checkoutLoading} onPress={() => handleUpgrade("pro")} className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold px-6 shadow-lg">
                Upgrade to Pro ($9.99)
              </Button>
            )}
            {tier !== "premium" && (
              <Button isLoading={checkoutLoading} onPress={() => handleUpgrade("premium")} className="bg-gradient-to-r from-pink-500 to-rose-600 text-white font-bold px-6 shadow-lg">
                Upgrade to Premium ($19.99)
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link href="/dashboard/user/purchases" className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-pink-50 dark:hover:bg-pink-500/10 hover:border-pink-200 dark:hover:border-pink-500/30 transition-all duration-200 p-6 flex flex-col gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center text-lg group-hover:bg-pink-200 dark:group-hover:bg-pink-500/20 transition-colors">
            <FaShoppingBag />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Purchase History</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">View all your past artwork purchases.</p>
          </div>
        </Link>
        <Link href="/dashboard/user/collection" className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 hover:border-indigo-200 dark:hover:border-indigo-500/30 transition-all duration-200 p-6 flex flex-col gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-lg group-hover:bg-indigo-200 dark:group-hover:bg-indigo-500/20 transition-colors">
            <FaPalette />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">My Collection</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Browse your gallery of owned artworks.</p>
          </div>
        </Link>
        <Link href="/dashboard/user/profile" className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-purple-50 dark:hover:bg-purple-500/10 hover:border-purple-200 dark:hover:border-purple-500/30 transition-all duration-200 p-6 flex flex-col gap-3 shadow-sm">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center text-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-500/20 transition-colors">
            <FaUser />
          </div>
          <div>
            <p className="font-bold text-slate-900 dark:text-white">Profile Settings</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Edit your profile and change password.</p>
          </div>
        </Link>
      </div>

      {/* Recent Purchases Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Purchases</h2>
          <Link href="/dashboard/user/purchases" className="text-xs font-semibold text-pink-600 hover:text-pink-700 dark:text-pink-400 transition-colors">View All →</Link>
        </div>
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-slate-500 dark:text-slate-400 animate-pulse">Loading...</div>
          ) : purchases.length === 0 ? (
            <div className="p-10 text-center">
              <FaPalette className="mx-auto text-4xl text-slate-300 dark:text-slate-700 mb-3" />
              <p className="text-slate-500 dark:text-slate-400 font-medium">No purchases yet.</p>
              <Link href="/artworks" className="inline-block mt-3 text-pink-600 dark:text-pink-400 text-sm font-semibold hover:text-pink-700">Browse Artworks →</Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                  {["Artwork", "Artist", "Price", "Date"].map((h) => (
                    <th key={h} className="text-left px-5 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {purchases.slice(0, 5).map((p) => (
                  <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{p.artworkTitle}</td>
                    <td className="px-5 py-4 text-slate-600 dark:text-slate-400 text-xs">{p.artistName || p.artistEmail}</td>
                    <td className="px-5 py-4 text-green-600 dark:text-green-400 font-bold">${p.amount}</td>
                    <td className="px-5 py-4 text-slate-500 dark:text-slate-400 text-xs">{new Date(p.purchaseDate).toLocaleDateString()}</td>
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