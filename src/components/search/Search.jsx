import React from 'react';
import SearchBar from "./SearchBar";

const Search = () => {
    return (
        <header className="bg-slate-50 border-b border-slate-200 py-20 relative overflow-hidden">
            {/* Subtle premium background effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-100/60 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white shadow-sm border border-slate-100 text-slate-600 text-xs font-bold uppercase tracking-widest mb-2">
                    Start Exploring
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-slate-900 leading-tight">
                    Discover{' '}
                    <span className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">Original</span>{' '}
                    Masterpieces
                </h1>
                
                <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
                    Explore breathtaking digital creations, validate your aesthetic, and connect with visionary independent artists globally.
                </p>

                <div className="max-w-3xl mx-auto pt-8">
                    <SearchBar />
                </div>
            </div>
        </header>
    );
};

export default Search;
