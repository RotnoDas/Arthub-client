import Image from "next/image";
import { FaShoppingCart, FaPalette, FaTag, FaCheckCircle, FaUser } from "react-icons/fa";
import Link from "next/link";
import { notFound } from "next/navigation";

async function fetchArtwork(id) {
    try {
        const res = await fetch(`http://localhost:5000/api/single-artworks/${id}`, { cache: 'no-store' });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Failed to fetch artwork:", error);
        return null;
    }
}

export default async function ArtworkDetails({ params }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const artwork = await fetchArtwork(id);

    if (!artwork) {
        return notFound();
    }

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left side: Image */}
                    <div className="relative aspect-square lg:aspect-auto lg:h-full bg-slate-100 p-8 flex items-center justify-center">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-100 via-transparent to-transparent opacity-50"></div>
                        {artwork.image ? (
                            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-slate-300">
                                <Image
                                    src={artwork.image}
                                    alt={artwork.title}
                                    fill
                                    className="object-cover"
                                    priority
                                />
                            </div>
                        ) : (
                            <div className="text-slate-400 font-medium">No Image Available</div>
                        )}
                    </div>

                    {/* Right side: Details */}
                    <div className="p-10 lg:p-16 flex flex-col justify-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-50 text-fuchsia-700 text-xs font-bold uppercase tracking-widest w-fit mb-6">
                            <FaTag /> {artwork.category || "Original Art"}
                        </div>
                        
                        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                            {artwork.title}
                        </h1>

                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                <FaUser />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-slate-900">Artist</p>
                                <p className="text-xs text-slate-500">{artwork.artistEmail}</p>
                            </div>
                        </div>

                        <div className="prose prose-slate mb-10">
                            <h3 className="text-lg font-bold text-slate-900 mb-2">About this piece</h3>
                            <p className="text-slate-600 leading-relaxed">
                                {artwork.description || "No description provided by the artist."}
                            </p>
                        </div>

                        <div className="mt-auto border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">Price</p>
                                <p className="text-4xl font-black bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                                    ${Number(artwork.price).toFixed(2)}
                                </p>
                            </div>

                            <button className="group relative w-full sm:w-auto overflow-hidden rounded-2xl bg-slate-900 px-8 py-4 font-bold text-white shadow-xl hover:shadow-2xl hover:shadow-fuchsia-500/20 transition-all active:scale-95">
                                <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                <span className="relative flex items-center justify-center gap-3">
                                    <FaShoppingCart /> Purchase Artwork
                                </span>
                            </button>
                        </div>

                        {/* Authenticity Guarantee */}
                        <div className="mt-8 flex items-center gap-2 text-sm text-slate-500 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <FaCheckCircle className="text-green-500 text-lg" />
                            <span className="font-medium">100% Authentic Digital Original. Secure transaction via Stripe.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
