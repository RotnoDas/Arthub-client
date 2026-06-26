import Image from "next/image";
import { FaTag, FaCheckCircle, FaUser } from "react-icons/fa";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CommentSection from "@/components/comment-section/CommentSection";
import PurchaseButton from "@/components/purchase-button/PurchaseButton";
import ArtistControls from "@/components/artist-controls/ArtistControls";

async function fetchArtwork(id) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/single-artworks/${id}`, { cache: 'no-store' });
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
    // Fetch auth session (this allows public read access, but gives us user data if logged in)
    const session = await auth.api.getSession({
        headers: await headers()
    });

    const artwork = await fetchArtwork(id);

    if (!artwork) {
        return notFound();
    }

    const isArtist = session?.user?.email === artwork.artistEmail;

    let isPurchased = false;
    if (session?.user?.email) {
        try {
            const purchaseRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/artworks/purchase/${session.user.email}`, {
                cache: 'no-store',
                headers: { 'x-internal-secret': process.env.INTERNAL_API_SECRET || 'dev-internal-secret' }
            });
            if (purchaseRes.ok) {
                const purchases = await purchaseRes.json();
                isPurchased = purchases.some(p => p.artworkId === id);
            }
        } catch (e) {
            console.error("Failed to fetch purchase history", e);
        }
    }

    return (
        <div className="min-h-screen bg-background py-16 px-6 lg:px-8 transition-colors duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="bg-background rounded-[3rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-border overflow-hidden mb-12 transition-colors duration-500">
                    <div className="grid grid-cols-1 lg:grid-cols-2">
                        {/* Left side: Image */}
                        <div className="relative aspect-square lg:aspect-auto lg:h-full bg-slate-100 dark:bg-slate-950 p-8 flex items-center justify-center">
                            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-fuchsia-100 via-transparent to-transparent opacity-50"></div>
                            {artwork.image ? (
                                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl shadow-slate-300 group">
                                    <Image
                                        src={artwork.image}
                                        alt={artwork.title}
                                        fill
                                        className="object-cover transform transition-transform duration-700 group-hover:scale-105"
                                        priority
                                        sizes="(max-width: 1024px) 100vw, 50vw"
                                    />
                                    {artwork.status === 'sold' && (
                                        <div className="absolute top-4 right-4 bg-red-600 text-white font-black px-4 py-2 rounded-full shadow-lg transform rotate-3">
                                            SOLD
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="text-slate-400 font-medium">No Image Available</div>
                            )}
                        </div>

                        {/* Right side: Details */}
                        <div className="p-10 lg:p-16 flex flex-col justify-center">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-700 dark:text-fuchsia-400 text-xs font-bold uppercase tracking-widest w-fit mb-6 shadow-sm border border-fuchsia-100 dark:border-fuchsia-500/20">
                                <FaTag /> {artwork.category || "Original Art"}
                            </div>
                            
                            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
                                {artwork.title}
                            </h1>

                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center text-accent-secondary shadow-inner">
                                    <FaUser />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-foreground">Artist</p>
                                    <Link href={`/artworks?search=${encodeURIComponent(artwork.artistEmail)}`} className="text-sm text-accent hover:text-indigo-600 dark:hover:text-indigo-400 font-bold transition-colors">
                                        {artwork.artistEmail}
                                    </Link>
                                </div>
                                <div className="ml-auto text-right">
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest">Uploaded</p>
                                    <p className="text-sm font-semibold text-foreground">
                                        {new Date(artwork.createdAt).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>

                            <div className="prose prose-slate dark:prose-invert mb-10">
                                <h3 className="text-xl font-bold text-foreground mb-3">About this piece</h3>
                                <p className="text-muted leading-relaxed text-lg">
                                    {artwork.description || "No description provided by the artist."}
                                </p>
                            </div>

                            <div className="mt-auto border-t border-border pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Price</p>
                                    <p className="text-4xl font-black bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                                        ${Number(artwork.price).toFixed(2)}
                                    </p>
                                </div>

                                <PurchaseButton artwork={artwork} session={session} isArtist={isArtist} />
                            </div>

                            {/* Artist Controls (Only visible to the owner) */}
                            {isArtist && (
                                <ArtistControls artworkId={artwork._id} />
                            )}

                        </div>
                    </div>
                </div>

                {/* Comment Section below the artwork card */}
                <div className="bg-background rounded-[3rem] shadow-xl shadow-slate-200/40 dark:shadow-none border border-border overflow-hidden p-8 lg:p-16 transition-colors duration-500">
                    <CommentSection artworkId={artwork._id} session={session} isPurchased={isPurchased} />
                </div>
            </div>
        </div>
    );
}
