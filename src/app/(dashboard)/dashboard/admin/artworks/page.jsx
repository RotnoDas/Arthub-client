"use client";
import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { FaPalette, FaTrash, FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";

export default function AdminArtworksPage() {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/artworks?limit=500`);
      const data = await res.json();
      setArtworks(Array.isArray(data) ? data : (data.artworks || []));
    } catch { toast.error("Failed to load artworks."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchArtworks(); }, []);

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/artworks/${itemToDelete}`, { method: "DELETE" });
      if (res.ok) { 
        toast.success("Artwork deleted."); 
        fetchArtworks(); 
        setDeleteModalOpen(false);
      } else {
        toast.error("Delete failed.");
      }
    } catch { 
      toast.error("Delete failed."); 
    } finally {
      setIsDeleting(false);
      setItemToDelete(null);
    }
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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">All Artworks</h1>
          <p className="text-slate-500 dark:text-slate-400">Moderate and manage every artwork on the platform.</p>
        </div>
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 text-xs" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search title or artist..."
            className="pl-8 pr-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-pink-500/60 dark:focus:border-pink-500 focus:ring-1 focus:ring-pink-500/60 dark:focus:ring-pink-500/30 transition w-64 shadow-sm dark:shadow-none"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors duration-500">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 animate-pulse">Loading artworks...</div>
        ) : filtered.length === 0 ? (
          <div className="p-14 text-center">
            <FaPalette className="mx-auto text-5xl text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-medium">{search ? "No artworks match your search." : "No artworks found."}</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                {["Artwork", "Artist", "Category", "Price", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(art => (
                <tr key={art._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {art.image
                        ? <img src={art.image} alt={art.title} className="w-11 h-11 rounded-xl object-cover shrink-0 border border-slate-200 dark:border-slate-700" />
                        : <div className="w-11 h-11 rounded-xl bg-pink-50 dark:bg-pink-500/10 border border-pink-100 dark:border-pink-500/20 flex items-center justify-center shrink-0"><FaPalette className="text-pink-400" /></div>
                      }
                      <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[150px]">{art.title}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400 text-xs">{art.artistName || art.artistEmail}</td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{art.category || "—"}</td>
                  <td className="px-5 py-3.5 text-emerald-600 dark:text-emerald-400 font-bold">${art.price}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${art.status === "sold" ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"}`}>
                      {art.status || "Available"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <button onClick={() => handleDeleteClick(art._id)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors">
                      <FaTrash size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>
      {!loading && <p className="text-slate-500 dark:text-slate-400 text-sm px-1">{filtered.length} of {artworks.length} artwork{artworks.length !== 1 ? "s" : ""}</p>}

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
                <h3 className="text-xl font-bold text-red-600 dark:text-red-500 mb-2">Delete Artwork</h3>
                <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">
                    Are you sure you want to permanently delete this artwork? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-3">
                    <button onClick={() => setDeleteModalOpen(false)} className="px-4 py-2 rounded-xl font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                        Cancel
                    </button>
                    <button onClick={confirmDelete} disabled={isDeleting} className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20 transition-colors disabled:opacity-50">
                        {isDeleting ? "Deleting..." : "Yes, Delete"}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
