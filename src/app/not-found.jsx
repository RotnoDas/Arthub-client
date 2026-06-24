import Link from 'next/link';
import { Button } from '@heroui/react';
import React from 'react';
import { FaPaintBrush } from 'react-icons/fa';

export default function NotFound() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 text-center bg-slate-50/50">
            <div className="space-y-8 max-w-2xl mx-auto">
                <div className="relative">
                    <div className="text-[150px] sm:text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-fuchsia-600 to-indigo-300 leading-none select-none drop-shadow-sm flex justify-center items-center gap-4">
                        4<FaPaintBrush className="text-[120px] sm:text-[160px] text-indigo-400 rotate-12" />4
                    </div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex items-center justify-center -z-10 opacity-30 blur-3xl rounded-full bg-fuchsia-400"></div>
                </div>

                <div className="space-y-4 relative z-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900">
                        Blank Canvas! Page not found
                    </h1>
                    <p className="text-lg text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                        The artwork or gallery you are looking for might have been sold, removed, or is temporarily unavailable. Or perhaps, the creative vision was just too avant-garde for this URL!
                    </p>
                </div>

                <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center items-center relative z-10">
                    <Link href="/">
                        <Button className="font-bold bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:shadow-fuchsia-500/30 hover:-translate-y-1 transition-all h-14 px-8 rounded-2xl">
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/artworks">
                        <Button className="font-bold bg-white text-fuchsia-600 border-2 border-fuchsia-100 shadow-sm hover:border-fuchsia-300 hover:bg-fuchsia-50 h-14 px-8 rounded-2xl transition-all">
                            Browse Gallery
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
