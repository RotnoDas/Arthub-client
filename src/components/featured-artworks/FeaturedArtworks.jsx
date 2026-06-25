import { apiFetch } from "@/lib/api";
import Link from "next/link";
import { FaChevronRight } from "react-icons/fa";
import ArtworkCard from "@/components/artwork-card/ArtworkCard";

async function fetchFeaturedArtworks() {
    try {
        const res = await apiFetch("http://localhost:5000/api/artworks?limit=6", {
            cache: 'no-store' // ensures auto-refresh on page reload
        });
        if (!res.ok) return [];
        const data = await res.json();
        return data.artworks || (Array.isArray(data) ? data : []);
    } catch (error) {
        console.error("Failed to fetch featured artworks:", error);
        return [];
    }
}

export default async function FeaturedArtworks() {
    const artworks = await fetchFeaturedArtworks();

    if (!artworks || artworks.length === 0) {
        return null;
    }

    return (
        <section className="relative py-32 bg-slate-50/50 dark:bg-transparent overflow-hidden border-t border-slate-100 dark:border-slate-800/50">
            {/* Elegant Background Decoration for Light Theme */}
            <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-fuchsia-100/50 dark:bg-fuchsia-900/10 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-indigo-100/50 dark:bg-indigo-900/10 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-100 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 text-xs font-bold uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-fuchsia-600 dark:bg-fuchsia-500 animate-pulse"></span>
                            Trending Now
                        </div>
                        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900 dark:text-white">
                            Featured <span className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">Artworks</span>
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400 font-medium max-w-2xl text-lg">
                            Explore the newest and most breathtaking creations uploaded by our global community of independent artists.
                        </p>
                    </div>
                    <Link href="/artworks" className="group flex items-center gap-2 text-fuchsia-600 dark:text-fuchsia-400 hover:text-white dark:hover:text-white font-bold px-6 py-3 rounded-xl border-2 border-fuchsia-100 dark:border-fuchsia-500/30 hover:border-fuchsia-600 dark:hover:border-fuchsia-500 hover:bg-fuchsia-600 dark:hover:bg-fuchsia-600 transition-all shadow-sm">
                        View Full Gallery <FaChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                    {artworks.map((artwork, index) => (
                        <div key={artwork._id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${index * 150}ms` }}>
                            <ArtworkCard artwork={artwork} index={index} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
