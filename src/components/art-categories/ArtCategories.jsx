import React from 'react';
import { Palette, Camera, Box, Sparkles, PenTool, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';

const categories = [
    { name: 'Painting', icon: Palette, color: 'text-rose-500', bg: 'bg-rose-100/50', border: 'border-rose-200' },
    { name: 'Digital Art', icon: Sparkles, color: 'text-fuchsia-600', bg: 'bg-fuchsia-100/50', border: 'border-fuchsia-200' },
    { name: 'Photography', icon: Camera, color: 'text-blue-500', bg: 'bg-blue-100/50', border: 'border-blue-200' },
    { name: 'Sculpture', icon: Box, color: 'text-amber-500', bg: 'bg-amber-100/50', border: 'border-amber-200' },
    { name: 'Drawing', icon: PenTool, color: 'text-emerald-500', bg: 'bg-emerald-100/50', border: 'border-emerald-200' },
    { name: 'Mixed Media', icon: ImageIcon, color: 'text-indigo-500', bg: 'bg-indigo-100/50', border: 'border-indigo-200' },
];

const ArtCategories = () => {
    return (
        <section className="py-24 relative overflow-hidden border-t border-slate-200 dark:border-slate-800/50">
            {/* Subtle background blurs */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-fuchsia-100/40 dark:bg-fuchsia-900/10 rounded-full blur-[100px] -z-10" />
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-100/40 dark:bg-indigo-900/10 rounded-full blur-[100px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-slate-900 dark:text-white mb-4">
                        Explore by <span className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">Category</span>
                    </h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg font-medium max-w-2xl mx-auto">
                        Find exactly what you're looking for by browsing our curated collections of diverse artistic mediums.
                    </p>
                </div>
                
                <div className="flex flex-wrap justify-center gap-6">
                    {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                            <Link href={`/artworks?category=${encodeURIComponent(category.name)}`} key={category.name}>
                                <div 
                                    className={`group flex flex-col items-center justify-center bg-white dark:bg-slate-900 w-36 h-36 md:w-44 md:h-44 rounded-[2.5rem] border-2 border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-300/50 dark:shadow-none hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden`}
                                >
                                    {/* Glass reflection */}
                                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                    <div className={`p-4 rounded-full bg-white dark:bg-slate-950 shadow-md mb-3 group-hover:scale-110 transition-transform duration-300 border-slate-100 dark:border-slate-800 border-2`}>
                                        <Icon className={`w-8 h-8 ${category.color}`} />
                                    </div>
                                    <span className="font-bold text-slate-800 dark:text-slate-200 text-sm md:text-base group-hover:text-slate-900 dark:group-hover:text-white relative z-10">{category.name}</span>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default ArtCategories;
