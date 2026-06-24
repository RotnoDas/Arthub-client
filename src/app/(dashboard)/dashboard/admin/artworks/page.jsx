"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { FaPalette, FaTrash, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/artworks");
      const data = await res.json();
      setArtworks(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load artworks."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchArtworks(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Permanently delete this artwork?")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/artworks/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Artwork deleted."); fetchArtworks(); }
    } catch { toast.error("Delete failed."); }
  };

  const filtered = artworks.filter(a =>
    a.title?.toLowerCase().includes(search.toLowerCase()) ||
    a.artistName?.toLowerCase().includes(search.toLowerCase()) ||
    a.artistEmail?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-1">All Artworks</h1>
          <p className="text-slate-400">Moderate and manage every artwork on the platform.</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title or artist..."
            className="pl-8 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500/60 transition w-64"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 animate-pulse">Loading artworks...</div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <FaPalette className="mx-auto text-5xl text-slate-700 mb-4" />
            <p className="text-slate-400 font-medium">{search ? "No artworks match your search." : "No artworks found."}</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                {["Artwork", "Artist", "Category", "Price", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(art => (
                <tr key={art._id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {art.image
                        ? <img src={art.image} alt={art.title} className="w-11 h-11 rounded-xl object-cover shrink-0" />
                        : <div className="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center shrink-0"><FaPalette className="text-pink-400" /></div>
                      }
                      <span className="font-semibold text-white truncate max-w-[150px]">{art.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300 text-xs">{art.artistName || art.artistEmail}</td>
                  <td className="px-5 py-3.5 text-slate-300">{art.category || "—"}</td>
                  <td className="px-5 py-3.5 text-green-400 font-bold">${art.price}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${art.status === "sold" ? "bg-green-500/10 text-green-400" : "bg-blue-500/10 text-blue-400"}`}>
                      {art.status || "Available"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDelete(art._id)} className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 flex items-center justify-center transition-colors">
                      <FaTrash size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {!loading && <p className="text-slate-500 text-sm px-1">{filtered.length} of {artworks.length} artwork{artworks.length !== 1 ? "s" : ""}</p>}
    </div>
  );
}
