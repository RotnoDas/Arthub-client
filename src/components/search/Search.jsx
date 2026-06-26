import React from 'react';
import SearchBar from "./SearchBar";

const Search = () => {
    return (
        <header className="bg-background border-b border-border py-20 relative overflow-hidden transition-colors duration-500">
            {/* Subtle premium background effects */}
            <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-100/60 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[120px] -z-10" />

            <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-background shadow-sm border border-border text-muted text-xs font-bold uppercase tracking-widest mb-2 transition-colors duration-500">
                    Start Exploring
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tighter text-foreground leading-tight transition-colors duration-500">
                    Discover{' '}
                    <span className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 bg-clip-text text-transparent">Original</span>{' '}
                    Masterpieces
                </h1>
                
                <p className="text-lg md:text-xl text-muted font-medium max-w-2xl mx-auto transition-colors duration-500">
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
