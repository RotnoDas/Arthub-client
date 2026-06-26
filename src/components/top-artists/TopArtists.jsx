import Image from "next/image";
import Link from "next/link";
import { FaPaintBrush, FaStar } from "react-icons/fa";

const MOCK_ARTISTS = [
    { id: 1, name: "Elena Rodriguez", role: "Digital Illustrator", image: "https://i.pravatar.cc/150?img=47", followers: "12.4k" },
    { id: 2, name: "Marcus Chen", role: "3D Generalist", image: "https://i.pravatar.cc/150?img=11", followers: "8.2k" },
    { id: 3, name: "Sophia Martinez", role: "Concept Artist", image: "https://i.pravatar.cc/150?img=5", followers: "15.1k" },
    { id: 4, name: "David Kim", role: "UI/UX Designer", image: "https://i.pravatar.cc/150?img=14", followers: "6.7k" },
];

export default function TopArtists() {
    return (
        <section className="relative py-32 bg-slate-50/50 dark:bg-transparent overflow-hidden border-t border-border/50">
            {/* Background Decoration */}
            <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-sky-100/50 dark:bg-sky-900/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-100/50 dark:bg-fuchsia-900/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 text-xs font-bold uppercase tracking-widest mx-auto">
                        <FaStar className="text-sky-500" /> Creators of the Week
                    </div>
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-foreground">
                        Meet Our <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Top Artists</span>
                    </h2>
                    <p className="text-muted font-medium text-lg">
                        Discover the visionary minds behind the most captivating artworks on our platform. Support their journey and get inspired.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {MOCK_ARTISTS.map((artist, index) => (
                        <div key={artist.id} className="group relative bg-background border border-border rounded-3xl p-6 text-center hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-500 hover:-translate-y-2 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-sky-50/50 dark:to-sky-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            <div className="relative mx-auto w-24 h-24 mb-6 rounded-full p-1 bg-gradient-to-tr from-sky-400 to-indigo-500">
                                <div className="w-full h-full rounded-full overflow-hidden bg-background border-2 border-background relative">
                                    <Image
                                        src={artist.image}
                                        alt={artist.name}
                                        fill
                                        sizes="96px"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                </div>
                            </div>

                            <div className="relative z-10">
                                <h3 className="text-xl font-bold text-foreground mb-1">{artist.name}</h3>
                                <p className="text-sm font-medium text-muted mb-4 flex items-center justify-center gap-1">
                                    <FaPaintBrush size={12} className="text-sky-500" /> {artist.role}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                                    <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Followers</span>
                                    <span className="font-extrabold text-foreground">{artist.followers}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
