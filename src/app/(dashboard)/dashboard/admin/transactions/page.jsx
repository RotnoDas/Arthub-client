"use client";
import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { FaExchangeAlt, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    apiFetch("http://localhost:5000/api/transactions")
      .then(r => r.json())
      .then(data => { setTransactions(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => { toast.error("Failed to load transactions."); setLoading(false); });
  }, []);

  const filtered = transactions.filter(t =>
    t.userEmail?.toLowerCase().includes(search.toLowerCase()) ||
    t.transactionId?.toLowerCase().includes(search.toLowerCase()) ||
    (t.paymentFor || t.paymentType || "").toLowerCase().includes(search.toLowerCase())
  );

  const totalRevenue = transactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);

  const typeBadge = (t) => {
    const type = (t.paymentFor || t.paymentType || "purchase").toLowerCase();
    if (type.includes("subscription")) return "bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400 border border-fuchsia-100 dark:border-fuchsia-500/20";
    if (type.includes("purchase")) return "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20";
    return "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">All Transactions</h1>
          <p className="text-slate-500 dark:text-slate-400">Every payment processed on the ArtHub platform.</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="rounded-2xl border border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10 px-5 py-2.5 text-right shadow-sm">
            <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Total Revenue</p>
            <p className="text-xl font-bold text-emerald-700 dark:text-emerald-400">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 dark:focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/60 dark:focus:ring-emerald-500/30 transition w-56 shadow-sm dark:shadow-none"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors duration-500">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 animate-pulse">Loading transactions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <FaExchangeAlt className="mx-auto text-5xl text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">{search ? "No results found." : "No transactions yet."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                {["Transaction ID", "Type", "User / Artist", "Amount", "Date"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-slate-600 dark:text-slate-400">{t.transactionId || t._id?.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${typeBadge(t)}`}>
                      {t.paymentFor || t.paymentType || "Purchase"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-700 dark:text-slate-300 font-medium">{t.userEmail}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">${Number(t.amount).toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-500 dark:text-slate-500 font-medium">
                    {t.paidAt ? new Date(t.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>
      {!loading && (
        <div className="flex justify-between items-center text-sm text-slate-500 dark:text-slate-400 px-1">
          <span>{filtered.length} of {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
}
