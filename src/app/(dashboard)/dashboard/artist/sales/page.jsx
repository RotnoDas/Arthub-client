"use client";
import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { FaHistory } from "react-icons/fa";
import Link from "next/link";

export default function SalesHistoryPage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      // Fetch sales for this artist from purchases collection
      apiFetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/purchases/artist/${user.email}`)
        .then(r => r.json())
        .then(d => { setSales(Array.isArray(d) ? d : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  const totalEarned = sales.reduce((s, p) => s + (Number(p.amount) || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Sales History</h1>
          <p className="text-slate-500 dark:text-slate-400">All purchases made on your artworks.</p>
        </div>
        {sales.length > 0 && (
          <div className="rounded-2xl border border-green-200 dark:border-green-500/30 bg-green-50 dark:bg-green-500/10 px-5 py-3 text-right shadow-sm">
            <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Total Earned</p>
            <p className="text-2xl font-bold text-green-600 dark:text-emerald-400">${totalEarned.toFixed(2)}</p>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors duration-500">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 animate-pulse">Loading sales...</div>
        ) : sales.length === 0 ? (
          <div className="p-14 text-center">
            <FaHistory className="mx-auto text-5xl text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg">No sales yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 mb-5">Once buyers purchase your artworks, they'll appear here.</p>
            <Link href="/dashboard/artist/add-artwork" className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-semibold text-sm hover:opacity-90 transition shadow-md shadow-indigo-500/20">
              Add More Artworks
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                {["Artwork Title", "Buyer", "Purchase Date", "Amount"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sales.map(sale => (
                <tr key={sale._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{sale.artworkTitle}</td>
                  <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{sale.buyerName || sale.buyerEmail}</td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-500">{new Date(sale.purchaseDate || sale.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-green-600 dark:text-emerald-400 text-base">+${sale.amount}</span>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>

      {sales.length > 0 && (
        <p className="text-slate-500 dark:text-slate-400 text-sm px-1">{sales.length} sale{sales.length !== 1 ? "s" : ""} total</p>
      )}
    </div>
  );
}
