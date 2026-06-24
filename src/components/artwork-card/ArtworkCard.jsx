import { Chip } from '@heroui/react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { FaShoppingCart } from 'react-icons/fa';

const ArtworkCard = ({ artwork, index = 2 }) => {
    return (
        <div className="group flex flex-col bg-slate-100 rounded-3xl border-2 border-slate-300 shadow-xl shadow-slate-300/50 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-fuchsia-500/30">
            <div className="relative overflow-hidden aspect-[4/3]">
                {artwork.image ? (
                    <Image 
                        src={artwork.image} 
                        alt={artwork.title || "Artwork"} 
                        className="object-cover group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-out" 
                        fill 
                        priority={index <= 1}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-50 text-slate-400 text-sm font-medium">No Image Available</div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                <div className="absolute top-4 right-4 z-10">
                    <Chip size="sm" className="font-bold shadow-lg shadow-black/20 bg-white/90 backdrop-blur-md text-fuchsia-600 border border-white/50">
                        {artwork.category || "Uncategorized"}
                    </Chip>
                </div>
            </div>
            
            <div className="p-6 flex flex-col grow">
                <div className="space-y-2 mb-4">
                    <Link href={`/artworks/${artwork._id}`} className="block">
                        <h3 className="text-xl font-extrabold leading-tight line-clamp-1 text-slate-900 group-hover:text-fuchsia-600 transition-colors">
                            {artwork.title}
                        </h3>
                    </Link>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                        {artwork.description || "An amazing piece of art by an independent creator."}
                    </p>
                </div>
                
                <div className="pt-4 mt-auto border-t border-slate-100 flex justify-between items-center">
                    <span className="text-2xl font-black bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">
                        ${Number(artwork.price).toFixed(2)}
                    </span>
                    <Link href={`/artworks/${artwork._id}`} className="flex items-center gap-2 font-bold text-sm bg-slate-900 text-white rounded-xl px-5 py-2.5 shadow-lg shadow-slate-900/20 hover:bg-fuchsia-600 hover:shadow-fuchsia-600/30 transition-all active:scale-95">
                        <FaShoppingCart /> Buy Now
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ArtworkCard;