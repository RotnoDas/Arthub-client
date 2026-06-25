"use client";
import React, { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { FaPalette, FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

export default function CollectionPage() {
  const { data: sessionData } = authClient.useSession();
  const user = sessionData?.user;
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/artworks/purchase/${user.email}`)
        .then((res) => res.json())
        .then((data) => { setPurchases(Array.isArray(data) ? data : []); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [user]);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">My Collection</h1>
        <p className="text-slate-500 dark:text-slate-400">A gallery of all the artworks you own.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 aspect-square animate-pulse" />
          ))}
        </div>
      ) : purchases.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm p-16 text-center transition-colors duration-500">
          <FaPalette className="mx-auto text-5xl text-slate-300 dark:text-slate-700 mb-4" />
          <p className="text-slate-900 dark:text-white font-semibold text-lg">Your collection is empty</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 mb-6">Discover and collect unique artworks from talented artists.</p>
          <Link href="/artworks" className="inline-block px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-indigo-500 text-white font-semibold text-sm hover:opacity-90 transition shadow-md shadow-pink-500/20">
            Explore Artworks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {purchases.map((item) => (
            <div key={item._id} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:border-pink-300 dark:hover:border-pink-500/50 hover:shadow-lg hover:shadow-pink-500/5 dark:hover:shadow-pink-500/10 transition-all duration-300 overflow-hidden">
              {/* Artwork Image / Placeholder */}
              <div className="aspect-square relative overflow-hidden bg-gradient-to-br from-pink-500/5 via-slate-50 to-indigo-500/5 dark:from-pink-500/10 dark:via-slate-900/50 dark:to-indigo-500/10">
                {item.artworkImage ? (
                  <img src={item.artworkImage} alt={item.artworkTitle} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FaPalette className="text-4xl text-slate-300 dark:text-slate-700 group-hover:text-pink-500/50 transition-colors duration-300" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <Link href={`/artworks/${item.artworkId || "#"}`} className="flex items-center gap-2 text-white text-xs font-semibold bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-lg hover:bg-white/30 transition">
                    View Details <FaExternalLinkAlt size={10} />
                  </Link>
                </div>
              </div>

              {/* Card Info */}
              <div className="p-4">
                <p className="font-bold text-slate-900 dark:text-white text-sm truncate group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">{item.artworkTitle}</p>
                <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 truncate">by {item.artistEmail}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-green-600 dark:text-emerald-400 font-bold text-sm">${item.amount}</span>
                  <span className="text-slate-400 dark:text-slate-500 text-[10px]">{new Date(item.purchaseDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {purchases.length > 0 && (
        <p className="text-slate-500 dark:text-slate-400 text-sm text-center">{purchases.length} artwork{purchases.length !== 1 ? "s" : ""} in your collection</p>
      )}
    </div>
  );
}
