'use client';
import { apiFetch } from "@/lib/api";

import React, { useEffect, useState } from 'react';
import { FaUsers, FaPaintBrush, FaCheckCircle, FaWallet, FaChartLine } from 'react-icons/fa';
import { 
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
    PieChart, Pie, Legend
} from 'recharts';

export default function AdminDashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        apiFetch('http://localhost:5000/api/admin/analytics')
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch analytics", err);
                setLoading(false);
            });
    }, []);

    if (loading || !data) {
        return (
            <div className="py-20 flex justify-center">
                <div className="text-slate-500 dark:text-slate-400 animate-pulse text-sm font-medium">Loading analytics...</div>
            </div>
        );
    }

    const COLORS = ['#a21caf', '#4f46e5', '#db2777', '#7c3aed', '#0d9488', '#d97706'];

    const stats = [
        { title: 'Total Users', value: data.totalUsers, icon: FaUsers, gradient: 'from-blue-500 to-cyan-400', ring: 'ring-blue-100' },
        { title: 'Total Artists', value: data.totalArtists, icon: FaPaintBrush, gradient: 'from-fuchsia-500 to-pink-400', ring: 'ring-fuchsia-100' },
        { title: 'Artworks Sold', value: data.artworksSold, icon: FaCheckCircle, gradient: 'from-emerald-500 to-teal-400', ring: 'ring-emerald-100' },
        { title: 'Total Revenue', value: `$${(data.totalRevenue || 0).toFixed(2)}`, icon: FaWallet, gradient: 'from-amber-500 to-yellow-400', ring: 'ring-amber-100' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Analytics Overview</h1>
                <p className="text-slate-500 dark:text-slate-400">A high-level snapshot of the ArtHub platform.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className={`rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-5 ring-1 ${stat.ring} dark:ring-0`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white shadow-md shrink-0`}>
                                    <Icon size={18} />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.title}</p>
                                    <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{stat.value}</h3>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Area Chart */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <FaChartLine className="text-fuchsia-500 dark:text-fuchsia-400" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Revenue Over Time</h3>
                    </div>
                    <div className="h-80 w-full">
                        {data.salesData && data.salesData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={data.salesData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                                    <defs>
                                        <linearGradient id="adminColorRevenue" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#c026d3" stopOpacity={0.45}/>
                                            <stop offset="100%" stopColor="#c026d3" stopOpacity={0.03}/>
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="date" stroke="#64748b" fontSize={12} fontWeight={600} tickLine={false} axisLine={false} />
                                    <YAxis stroke="#64748b" fontSize={12} fontWeight={600} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '13px', fontWeight: '600', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)' }}
                                        formatter={(value) => [`$${value}`, 'Revenue']}
                                        labelStyle={{ color: '#64748b', fontWeight: '700', marginBottom: '4px' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#a21caf" strokeWidth={3} fillOpacity={1} fill="url(#adminColorRevenue)" dot={{ r: 4, fill: '#a21caf', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, fill: '#a21caf', strokeWidth: 2, stroke: '#fff' }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-500 font-medium text-sm">No sales data available yet.</div>
                        )}
                    </div>
                </div>

                {/* Category Pie Chart */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <FaPaintBrush className="text-indigo-500 dark:text-indigo-400" />
                        <h3 className="text-base font-bold text-slate-900 dark:text-white">Artworks by Category</h3>
                    </div>
                    <div className="h-80 w-full">
                        {data.categoryData && data.categoryData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={data.categoryData.map((entry, index) => ({
                                            ...entry,
                                            fill: COLORS[index % COLORS.length]
                                        }))}
                                        cx="50%"
                                        cy="45%"
                                        innerRadius={70}
                                        outerRadius={110}
                                        paddingAngle={data.categoryData.length > 1 ? 3 : 0}
                                        dataKey="value"
                                        stroke="#fff"
                                        strokeWidth={2}
                                        label={data.categoryData.length > 1
                                            ? ({ name, value }) => `${name} (${value})`
                                            : false
                                        }
                                        labelLine={data.categoryData.length > 1 ? { stroke: '#94a3b8', strokeWidth: 1 } : false}
                                    />
                                    <RechartsTooltip 
                                        contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '13px', fontWeight: '600', boxShadow: '0 10px 25px -5px rgb(0 0 0 / 0.15)' }}
                                        formatter={(value, name) => [`${value} artworks`, name]}
                                    />
                                    <Legend 
                                        iconType="circle"
                                        iconSize={10}
                                        formatter={(value, entry) => {
                                            const item = data.categoryData.find(d => d.name === value);
                                            return `${value} — ${item ? item.value : 0} artworks`;
                                        }}
                                        wrapperStyle={{ fontSize: '12px', fontWeight: '700', color: '#334155', paddingTop: '12px' }} 
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-slate-400 dark:text-slate-500 font-medium text-sm">No category data available yet.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
