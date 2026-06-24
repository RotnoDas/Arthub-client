"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { FaUsers, FaPalette, FaChartLine, FaDollarSign, FaShoppingBag } from "react-icons/fa";
import Link from "next/link";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLORS = ["#ec4899", "#6366f1", "#22c55e", "#f59e0b", "#8b5cf6", "#06b6d4"];

const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2.5 shadow-xl">
      {label && <p className="text-slate-400 text-xs mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} className="text-white text-sm font-bold" style={{ color: p.color }}>
          {prefix}{typeof p.value === "number" ? p.value.toFixed(2) : p.value}
        </p>
      ))}
    </div>
  );
};

export default function AdminOverviewPage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === "admin") {
      Promise.all([
        fetch("http://localhost:5000/api/users").then(r => r.json()),
        fetch("http://localhost:5000/api/artworks").then(r => r.json()),
        fetch("http://localhost:5000/api/transactions").then(r => r.json()),
      ]).then(([u, a, t]) => {
        setUsers(Array.isArray(u) ? u : []);
        setArtworks(Array.isArray(a) ? a : []);
        setTransactions(Array.isArray(t) ? t : []);
        setLoading(false);
      }).catch(() => setLoading(false));
    }
  }, [user]);

  if (!user || user.role !== "admin") return <div className="text-white p-8">Access denied.</div>;

  // Derived stats
  const totalUsers = users.length;
  const totalArtists = users.filter(u => u.role === "artist").length;
  const soldArtworks = artworks.filter(a => a.status === "sold").length;
  const totalRevenue = transactions.reduce((s, t) => s + (Number(t.amount) || 0), 0);

  // Monthly Revenue – last 6 months
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const label = d.toLocaleString("default", { month: "short" });
    const revenue = transactions
      .filter(t => {
        const td = new Date(t.paidAt);
        return td.getFullYear() === d.getFullYear() && td.getMonth() === d.getMonth();
      })
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    return { month: label, revenue: parseFloat(revenue.toFixed(2)) };
  });

  // Artworks by category – Pie chart
  const categoryMap = {};
  artworks.forEach(a => {
    if (a.category) categoryMap[a.category] = (categoryMap[a.category] || 0) + 1;
  });
  const categoryData = Object.entries(categoryMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, value]) => ({ name, value }));

  // Artworks sold vs available – Bar chart
  const soldData = [
    { name: "Available", count: artworks.length - soldArtworks },
    { name: "Sold", count: soldArtworks },
  ];

  // User roles breakdown
  const userRoleData = [
    { name: "Users", value: users.filter(u => u.role === "user" || !u.role).length },
    { name: "Artists", value: totalArtists },
    { name: "Admins", value: users.filter(u => u.role === "admin").length },
  ].filter(d => d.value > 0);

  const statCards = [
    { label: "Total Users", value: totalUsers, icon: <FaUsers />, color: "blue", href: "/dashboard/admin/users" },
    { label: "Total Artists", value: totalArtists, icon: <FaPalette />, color: "pink", href: "/dashboard/admin/users" },
    { label: "Artworks Sold", value: soldArtworks, icon: <FaShoppingBag />, color: "green", href: "/dashboard/admin/artworks" },
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: <FaDollarSign />, color: "yellow", href: "/dashboard/admin/transactions" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-1">Admin Overview</h1>
        <p className="text-slate-400">Platform analytics, health metrics, and quick access.</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map(s => (
          <Link key={s.label} href={s.href}
            className={`rounded-2xl border border-white/10 bg-white/5 p-5 flex items-center gap-4 hover:border-${s.color}-500/30 hover:bg-${s.color}-500/5 transition-all duration-200 group`}>
            <div className={`w-12 h-12 rounded-xl bg-${s.color}-500/10 text-${s.color}-400 flex items-center justify-center text-xl shrink-0 group-hover:bg-${s.color}-500/20 transition-colors`}>
              {s.icon}
            </div>
            <div className="min-w-0">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{s.label}</p>
              {loading
                ? <div className="h-7 w-16 bg-white/10 rounded-lg animate-pulse mt-1" />
                : <p className="text-white font-bold text-xl truncate">{s.value}</p>}
            </div>
          </Link>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Revenue Area Chart */}
        <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaChartLine className="text-green-400" />
            <h2 className="text-white font-bold text-base">Monthly Revenue</h2>
          </div>
          {loading ? (
            <div className="h-52 bg-white/5 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `$${v}`} />
                <Tooltip content={<CustomTooltip prefix="$" />} />
                <Area type="monotone" dataKey="revenue" stroke="#22c55e" strokeWidth={2.5} fill="url(#revenueGrad)" dot={{ fill: "#22c55e", strokeWidth: 0, r: 4 }} activeDot={{ r: 6, fill: "#22c55e" }} />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* User Roles Pie */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaUsers className="text-blue-400" />
            <h2 className="text-white font-bold text-base">User Roles</h2>
          </div>
          {loading ? (
            <div className="h-52 bg-white/5 rounded-xl animate-pulse" />
          ) : userRoleData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-slate-500 text-sm">No data yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%" cy="50%"
                  innerRadius={55} outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {userRoleData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(val) => <span style={{ color: "#94a3b8", fontSize: 11 }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Artworks by Category Bar Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaPalette className="text-pink-400" />
            <h2 className="text-white font-bold text-base">Artworks by Category</h2>
          </div>
          {loading ? (
            <div className="h-52 bg-white/5 rounded-xl animate-pulse" />
          ) : categoryData.length === 0 ? (
            <div className="h-52 flex items-center justify-center text-slate-500 text-sm">No categories yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={categoryData} margin={{ top: 5, right: 5, bottom: 20, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 10 }} axisLine={false} tickLine={false} angle={-20} textAnchor="end" interval={0} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {categoryData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Sold vs Available Bar Chart */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaShoppingBag className="text-indigo-400" />
            <h2 className="text-white font-bold text-base">Artwork Status</h2>
          </div>
          {loading ? (
            <div className="h-52 bg-white/5 rounded-xl animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={210}>
              <BarChart data={soldData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  <Cell fill="#6366f1" />
                  <Cell fill="#22c55e" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Quick Nav */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { href: "/dashboard/admin/users", label: "Manage Users →", color: "blue" },
          { href: "/dashboard/admin/artworks", label: "All Artworks →", color: "pink" },
          { href: "/dashboard/admin/transactions", label: "Transactions →", color: "green" },
        ].map(n => (
          <Link key={n.href} href={n.href}
            className={`rounded-2xl border border-white/10 bg-white/5 hover:border-${n.color}-500/30 hover:bg-${n.color}-500/5 transition-all duration-200 p-4 text-center font-semibold text-sm text-slate-300 hover:text-white`}>
            {n.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
