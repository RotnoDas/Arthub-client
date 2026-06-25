"use client";
import { apiFetch } from "@/lib/api";
import React, { useState, useEffect } from "react";
import { Button } from "@heroui/react";
import { authClient } from "@/lib/auth-client";
import { FaUpload, FaSave, FaTimes } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dbdj8yyjn";
const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "arthub";
const inputClass = "w-full px-4 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500/60 dark:focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 transition shadow-sm dark:shadow-none";

const CATEGORIES = ["Painting", "Digital Art", "Photography", "Sculpture", "Drawing", "Mixed Media"];

export default function AddArtworkPage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [formData, setFormData] = useState({ title: "", description: "", price: "", category: "", image: "" });
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Load existing artwork for editing
  useEffect(() => {
    if (editId) {
      apiFetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/single-artworks/${editId}`)
        .then(async (r) => {
          if (!r.ok) throw new Error("Not found");
          return r.json();
        })
        .then(data => {
          if (data) setFormData({ title: data.title || "", description: data.description || "", price: data.price || "", category: data.category || "", image: data.image || "" });
        })
        .catch(() => toast.error("Failed to load artwork"));
    }
  }, [editId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    
    const fd = new FormData();
    fd.append("file", file);
    fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      
      if (res.ok && data.secure_url) {
        setFormData(prev => ({ ...prev, image: data.secure_url }));
        toast.success("Image uploaded successfully!");
      } else {
        toast.error("Upload failed: " + (data.error?.message || "Unknown error"));
      }
    } catch (err) {
      toast.error("Cloudinary upload error.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) return toast.error("Title, price, and category are required.");
    setSubmitting(true);
    try {
      const payload = { ...formData, artistEmail: user.email, artistName: user.name };
      const url = editId ? `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/artworks/${editId}` : `${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}`}/api/artworks`;
      const method = editId ? "PATCH" : "POST";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) {
        toast.success(editId ? "Artwork updated!" : "Artwork posted!");
        router.push("/dashboard/artist/manage-artworks");
      } else toast.error("Save failed.");
    } catch { toast.error("Something went wrong."); }
    finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{editId ? "Edit Artwork" : "Add New Artwork"}</h1>
        <p className="text-slate-500 dark:text-slate-400">{editId ? "Update your artwork details below." : "List a new artwork on the ArtHub marketplace."}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload */}
        <div className="rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6 text-center hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-colors duration-500">
          {formData.image ? (
            <div className="space-y-4">
              <img src={formData.image} alt="Preview" className="w-full max-h-64 object-contain rounded-xl mx-auto" />
              <div className="flex gap-3 justify-center">
                <label className="cursor-pointer px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-sm font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition flex items-center gap-2">
                  <FaUpload size={12} /> Change Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                <button type="button" onClick={() => setFormData(p => ({ ...p, image: "" }))} className="px-4 py-2 rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-sm font-semibold hover:bg-red-100 dark:hover:bg-red-500/20 transition flex items-center gap-2">
                  <FaTimes size={12} /> Remove
                </button>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer block">
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              <div className="space-y-3 py-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl mx-auto transition-colors">
                  <FaUpload />
                </div>
                <div>
                  <p className="text-slate-900 dark:text-white font-semibold transition-colors">{uploading ? "Uploading..." : "Upload Artwork Image"}</p>
                  <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 transition-colors">Click to browse · PNG, JPG, WEBP · Max 10MB</p>
                </div>
                {uploading && <div className="w-48 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full mx-auto overflow-hidden"><div className="h-full bg-indigo-500 rounded-full animate-pulse w-3/4" /></div>}
              </div>
            </label>
          )}
        </div>

        {/* Title */}
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Artwork Title *</label>
          <input value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} placeholder="E.g. Neon Sunset in Tokyo" className={inputClass} />
        </div>

        {/* Description */}
        <div>
          <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
          <textarea value={formData.description} onChange={e => setFormData(p => ({ ...p, description: e.target.value }))} rows={4} placeholder="Describe your artwork — techniques, inspiration, story..." className={`${inputClass} resize-none`} />
        </div>

        {/* Price + Category */}
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Price (USD) *</label>
            <input type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} placeholder="0.00" className={inputClass} />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Category *</label>
            <select value={formData.category} onChange={e => setFormData(p => ({ ...p, category: e.target.value }))} className={`${inputClass} cursor-pointer`}>
              <option value="" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">Select category...</option>
              {CATEGORIES.map(c => <option key={c} value={c} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">{c}</option>)}
            </select>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="submit" isLoading={submitting} color="primary" startContent={!submitting && <FaSave size={13} />} className="font-semibold shadow-lg shadow-primary/20 px-8">
            {editId ? "Save Changes" : "Post Artwork"}
          </Button>
          <button type="button" onClick={() => router.push("/dashboard/artist/manage-artworks")} className="px-6 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 text-sm font-semibold transition-colors flex items-center gap-2">
            <FaTimes size={12} /> Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
