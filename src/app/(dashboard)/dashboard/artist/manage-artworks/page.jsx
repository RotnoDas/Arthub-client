"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FaPalette, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ManageArtworksPage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchArtworks = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/artworks/artist/${user.email}`);
      const data = await res.json();
      setArtworks(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load artworks"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchArtworks(); }, [user]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this artwork? This cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/artworks/${id}`, { method: "DELETE" });
      if (res.ok) { toast.success("Artwork deleted."); fetchArtworks(); }
    } catch { toast.error("Delete failed."); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Manage Artworks</h1>
          <p className="text-slate-500 dark:text-slate-400">Edit, delete, or review your listed artworks.</p>
        </div>
        <Link href="/dashboard/artist/add-artwork">
          <Button color="primary" startContent={<FaPlus size={12} />} className="font-semibold shadow-lg shadow-primary/20">
            Add New
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden transition-colors duration-500">
        {loading ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 animate-pulse">Loading artworks...</div>
        ) : artworks.length === 0 ? (
          <div className="p-14 text-center">
            <FaPalette className="mx-auto text-5xl text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-slate-500 dark:text-slate-400 font-semibold text-lg">No artworks yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 mb-5">Post your first artwork and start selling.</p>
            <Link href="/dashboard/artist/add-artwork">
              <Button color="primary" startContent={<FaPlus size={12} />} className="font-semibold shadow-lg shadow-primary/20">Post Artwork</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                {["Image", "Title", "Category", "Price", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {artworks.map(art => (
                <tr key={art._id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                  <td className="px-5 py-3.5">
                    {art.image
                      ? <img src={art.image} alt={art.title} className="w-12 h-12 rounded-xl object-cover" />
                      : <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"><FaPalette className="text-indigo-600 dark:text-indigo-400" /></div>
                    }
                  </td>
                  <td className="px-5 py-3.5 font-semibold text-slate-900 dark:text-white max-w-[180px]">
                    <span className="truncate block">{art.title}</span>
                    {art.description && <span className="text-slate-500 dark:text-slate-400 text-xs truncate block mt-0.5">{art.description}</span>}
                  </td>
                  <td className="px-5 py-3.5 text-slate-600 dark:text-slate-400">{art.category || "—"}</td>
                  <td className="px-5 py-3.5 text-green-600 dark:text-emerald-400 font-bold">${art.price}</td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${art.status === "sold" ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400" : "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"}`}>
                      {art.status || "Available"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <Link href={`/dashboard/artist/add-artwork?edit=${art._id}`}>
                        <button className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                          <FaEdit size={13} />
                        </button>
                      </Link>
                      <button onClick={() => handleDelete(art._id)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors">
                        <FaTrash size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            </table>
          </div>
        )}
      </div>
      {artworks.length > 0 && (
        <p className="text-slate-500 text-sm px-1">{artworks.length} artwork{artworks.length !== 1 ? "s" : ""} listed</p>
      )}
    </div>
  );
}
