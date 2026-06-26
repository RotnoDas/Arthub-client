'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { FaTimes } from 'react-icons/fa';

const CATEGORIES = [
    "All Categories", "Painting", "Digital Art", "Photography",
    "Sculpture", "Drawing", "Mixed Media"
];

const SearchBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
    const [category, setCategory] = useState(searchParams.get('category') || 'All Categories');
    const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
    const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

    const isMounted = useRef(false);

    useEffect(() => {
        // Prevent running on initial mount if state matches URL exactly
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const timer = setTimeout(() => {
            const params = new URLSearchParams();

            if (searchQuery.trim()) params.set('search', searchQuery.trim());

            if (category && category !== 'All Categories') params.set('category', category);

            if (minPrice.trim()) params.set('minPrice', minPrice.trim());

            if (maxPrice.trim()) params.set('maxPrice', maxPrice.trim());

            params.set('page', '1');

            router.push(`/artworks?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery, category, minPrice, maxPrice, router]);

    // Handle URL changes (e.g. user goes back/forward)
    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
        setCategory(searchParams.get('category') || 'All Categories');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setCategory('All Categories');
        setMinPrice('');
        setMaxPrice('');
        router.push('/artworks');
    };

    return (
        <div className="bg-background p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-border flex flex-col gap-4 transition-colors duration-500">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Search Bar */}
                <div className="flex-1 flex items-center pl-4 relative border-2 border-border rounded-2xl bg-background focus-within:ring-4 focus-within:ring-fuchsia-500/20 focus-within:border-fuchsia-300 dark:focus-within:border-fuchsia-500 transition-all">
                    <SearchIcon className="text-slate-400 dark:text-slate-500 w-5 h-5 mr-3 shrink-0" />
                    <input
                        type="text"
                        placeholder="Search by artwork title or artist name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-full min-h-[3rem] sm:min-h-[4rem] bg-transparent border-0 outline-none focus:ring-0 focus:outline-none text-foreground placeholder:text-slate-400 dark:placeholder:text-slate-500 text-lg font-medium pr-4"
                    />
                </div>

                {/* Category Select */}
                <div className="sm:w-64 shrink-0 relative">
                    <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-full min-h-[3rem] sm:min-h-[4rem] px-5 py-2 bg-background border-2 border-border rounded-2xl text-foreground font-bold focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 dark:focus:border-indigo-500 outline-none cursor-pointer appearance-none transition-all"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `3rem` }}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} className="font-semibold text-foreground bg-background">{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-border pt-4">
                {/* Price Range */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest text-xs">Price Range</span>
                    <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <input
                            type="number"
                            placeholder="Min $"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-24 px-4 py-2.5 bg-background border-2 border-border rounded-xl font-bold text-foreground focus:border-fuchsia-300 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            min="0"
                        />
                        <span className="text-slate-300 dark:text-slate-600 font-bold">-</span>
                        <input
                            type="number"
                            placeholder="Max $"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-24 px-4 py-2.5 bg-background border-2 border-border rounded-xl font-bold text-foreground focus:border-fuchsia-300 dark:focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-500/20 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            min="0"
                        />
                    </div>
                </div>

                {/* Clear Filters Button */}
                {(searchQuery || category !== 'All Categories' || minPrice || maxPrice) && (
                    <button
                        onClick={handleClearFilters}
                        className="w-full sm:w-auto sm:ml-auto px-6 py-2.5 font-bold tracking-wide rounded-xl bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all flex items-center justify-center gap-2"
                    >
                        <FaTimes size={12} /> Clear Filters
                    </button>
                )}
            </div>
        </div>
    );
};

export default SearchBar;
