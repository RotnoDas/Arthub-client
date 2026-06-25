"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { FaPalette } from "react-icons/fa";
import Link from "next/link";

export default function PurchaseHistoryPage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/artworks/purchase/${user.email}`)
        .then((res) => res.json())
        .then((data) => { setPurchases(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Purchase History</h1>
        <p className="text-slate-500">Every artwork you've bought on ArtHub.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">Loading purchases...</div>
        ) : purchases.length === 0 ? (
          <div className="p-14 text-center">
            <FaPalette className="mx-auto text-5xl text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium text-lg">No purchases yet.</p>
            <p className="text-slate-500 text-sm mt-1 mb-4">Start collecting beautiful artworks from our artists.</p>
            <Link href="/artworks" className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-semibold text-sm hover:opacity-90 transition shadow-md shadow-pink-500/20">
              Browse Artworks
            </Link>
          </div>
        ) : (
            <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                {["Artwork Name", "Artist", "Price", "Purchase Date"].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {purchases.map((p) => (
                <tr key={p._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors group">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center shrink-0">
                        <FaPalette className="text-pink-600 text-sm" />
                      </div>
                      <span className="font-semibold text-slate-900 group-hover:text-pink-600 transition-colors">{p.artworkTitle}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-600">{p.artistEmail}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-green-600">${p.amount}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500">{new Date(p.purchaseDate).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {purchases.length > 0 && (
        <div className="flex justify-between items-center text-sm text-slate-500 px-1">
          <span>{purchases.length} purchase{purchases.length !== 1 ? "s" : ""} total</span>
          <span className="text-green-600 font-bold">
            Total: ${purchases.reduce((s, p) => s + (Number(p.amount) || 0), 0).toFixed(2)}
          </span>
        </div>
      )}
    </div>
  );
}
