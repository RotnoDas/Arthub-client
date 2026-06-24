"use client";
import React, { useState, useEffect } from "react";
import { FaExchangeAlt, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/transactions")
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
    if (type.includes("subscription")) return "bg-purple-500/10 text-purple-400";
    if (type.includes("purchase")) return "bg-blue-500/10 text-blue-400";
    return "bg-slate-500/10 text-slate-400";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">All Transactions</h1>
          <p className="text-slate-400">Every payment processed on the ArtHub platform.</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="rounded-2xl border border-green-500/20 bg-green-500/5 px-5 py-2.5 text-right">
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Total Revenue</p>
            <p className="text-xl font-bold text-green-400">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search..."
              className="pl-8 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-green-500/60 transition w-56"
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 animate-pulse">Loading transactions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <FaExchangeAlt className="mx-auto text-5xl text-slate-700 mb-4" />
            <p className="text-slate-400 font-medium">{search ? "No results found." : "No transactions yet."}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {["Transaction ID", "Type", "User / Artist", "Amount", "Date"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-slate-400">{t.transactionId || t._id?.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${typeBadge(t)}`}>
                      {t.paymentFor || t.paymentType || "Purchase"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{t.userEmail}</td>
                  <td className="px-5 py-4">
                    <span className="font-bold text-green-400">${Number(t.amount).toFixed(2)}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    {t.paidAt ? new Date(t.paidAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!loading && (
        <div className="flex justify-between items-center text-sm text-slate-500 px-1">
          <span>{filtered.length} of {transactions.length} transaction{transactions.length !== 1 ? "s" : ""}</span>
        </div>
      )}
    </div>
  );
}
