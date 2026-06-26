"use client";
import { apiFetch } from "@/lib/api";
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
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchArtworks = async () => {
    if (!user?.email) return;
    setLoading(true);
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/artworks/artist/${user.email}`);
      const data = await res.json();
      setArtworks(Array.isArray(data) ? data : []);
    } catch { toast.error("Failed to load artworks"); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchArtworks(); }, [user]);

  const handleDeleteClick = (id) => {
    setItemToDelete(id);
    setDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      const res = await apiFetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/artworks/${itemToDelete}`, { method: "DELETE" });
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-1">Manage Artworks</h1>
          <p className="text-muted">Edit, delete, or review your listed artworks.</p>
        </div>
        <Link href="/dashboard/artist/add-artwork">
          <Button color="primary" startContent={<FaPlus size={12} />} className="font-semibold shadow-lg shadow-primary/20">
            Add New
          </Button>
        </Link>
      </div>

      <div className="rounded-2xl border border-border bg-background shadow-sm overflow-hidden transition-colors duration-500">
        {loading ? (
          <div className="p-12 text-center text-muted animate-pulse">Loading artworks...</div>
        ) : artworks.length === 0 ? (
          <div className="p-14 text-center">
            <FaPalette className="mx-auto text-5xl text-slate-300 dark:text-slate-700 mb-4" />
            <p className="text-muted font-semibold text-lg">No artworks yet</p>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 mb-5">Post your first artwork and start selling.</p>
            <Link href="/dashboard/artist/add-artwork">
              <Button color="primary" startContent={<FaPlus size={12} />} className="font-semibold shadow-lg shadow-primary/20">Post Artwork</Button>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm whitespace-nowrap">
              <thead>
                <tr className="border-b border-border bg-slate-50 dark:bg-slate-900/50">
                  {["Image", "Title", "Category", "Price", "Status", "Actions"].map(h => (
                    <th key={h} className="text-left px-5 py-3.5 text-xs font-bold text-muted uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {artworks.map(art => (
                  <tr key={art._id} className="border-b border-border hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
                    <td className="px-5 py-3.5">
                      {art.image
                        ? <img src={art.image} alt={art.title} className="w-12 h-12 rounded-xl object-cover" />
                        : <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center"><FaPalette className="text-accent-secondary" /></div>
                      }
                    </td>
                    <td className="px-5 py-3.5 font-semibold text-foreground max-w-[180px]">
                      <span className="truncate block">{art.title}</span>
                      {art.description && <span className="text-muted text-xs truncate block mt-0.5">{art.description}</span>}
                    </td>
                    <td className="px-5 py-3.5 text-muted">{art.category || "—"}</td>
                    <td className="px-5 py-3.5 text-green-600 dark:text-emerald-400 font-bold">${art.price}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${art.status === "sold" ? "bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400" : "bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400"}`}>
                        {art.status || "Available"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/artist/add-artwork?edit=${art._id}`}>
                          <button className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 text-accent-secondary hover:bg-indigo-100 dark:hover:bg-indigo-500/20 flex items-center justify-center transition-colors">
                            <FaEdit size={13} />
                          </button>
                        </Link>
                        <button onClick={() => handleDeleteClick(art._id)} className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 flex items-center justify-center transition-colors">
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

      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-background rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
            <h3 className="text-xl font-bold text-red-600 dark:text-red-500 mb-2">Delete Artwork</h3>
            <p className="text-muted font-medium mb-8">
              Are you sure you want to permanently delete this artwork? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="light" onPress={() => setDeleteModalOpen(false)} className="font-bold text-muted">
                Cancel
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20" isLoading={isDeleting} onPress={confirmDelete}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
