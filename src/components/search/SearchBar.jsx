'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { Button } from '@heroui/react';
import { FaFilter } from 'react-icons/fa';

const CATEGORIES = [
    "All Categories", "Painting", "Digital Art", 
    "Photography", "Sculpture", "Drawing", "Mixed Media"
];

const SearchBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All Categories');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');

    useEffect(() => {
        setSearchQuery(searchParams.get('search') || '');
        setCategory(searchParams.get('category') || 'All Categories');
        setMinPrice(searchParams.get('minPrice') || '');
        setMaxPrice(searchParams.get('maxPrice') || '');
    }, [searchParams]);

    const handleApplyFilters = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        
        if (searchQuery.trim()) params.set('search', searchQuery.trim());
        else params.delete('search');
        
        if (category && category !== 'All Categories') params.set('category', category);
        else params.delete('category');

        if (minPrice.trim()) params.set('minPrice', minPrice.trim());
        else params.delete('minPrice');

        if (maxPrice.trim()) params.set('maxPrice', maxPrice.trim());
        else params.delete('maxPrice');
        
        router.push(`/artworks?${params.toString()}`);
    };

    return (
        <form onSubmit={handleApplyFilters} className="bg-white p-6 rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                {/* Search Bar */}
                <div className="flex-1 flex gap-2 relative border-2 border-slate-200 rounded-2xl bg-slate-50 p-1 focus-within:ring-4 focus-within:ring-fuchsia-500/20 focus-within:border-fuchsia-300 transition-all">
                    <div className="flex-1 flex items-center pl-4">
                        <SearchIcon className="text-slate-400 w-5 h-5 mr-3" />
                        <input
                            type="text"
                            placeholder="Search by artwork title or artist name..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-full bg-transparent border-0 outline-none focus:ring-0 focus:outline-none text-slate-900 placeholder:text-slate-400 text-lg py-2 font-medium"
                        />
                    </div>
                    <Button 
                        type="submit" 
                        className="px-6 font-bold rounded-xl bg-slate-900 text-white shadow-md hover:bg-fuchsia-600 transition-colors h-full min-h-[3rem]"
                    >
                        Search
                    </Button>
                </div>
                
                {/* Category Select */}
                <div className="sm:w-64 shrink-0 relative">
                    <select 
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full h-full min-h-[4rem] px-5 py-2 bg-slate-50 border-2 border-slate-200 rounded-2xl text-slate-700 font-bold focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none cursor-pointer appearance-none transition-all"
                        style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `3rem` }}
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat} className="font-semibold text-slate-800">{cat}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 border-t border-slate-100 pt-4">
                {/* Price Range */}
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="font-bold text-slate-400 uppercase tracking-widest text-xs">Price Range</span>
                    <div className="flex items-center gap-2 flex-1 sm:flex-none">
                        <input 
                            type="number" 
                            placeholder="Min $" 
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                            className="w-24 px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-700 focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-500/20 outline-none transition-all"
                            min="0"
                        />
                        <span className="text-slate-300 font-bold">-</span>
                        <input 
                            type="number" 
                            placeholder="Max $" 
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                            className="w-24 px-4 py-2 bg-slate-50 border-2 border-slate-200 rounded-xl font-bold text-slate-700 focus:border-fuchsia-300 focus:ring-4 focus:ring-fuchsia-500/20 outline-none transition-all"
                            min="0"
                        />
                    </div>
                </div>

                {/* Apply Button */}
                <Button 
                    type="submit" 
                    className="w-full sm:w-auto sm:ml-auto px-8 font-black tracking-wide rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-fuchsia-500/30 hover:-translate-y-0.5 transition-all h-12"
                >
                    <FaFilter className="mr-2" /> Apply Filters
                </Button>
            </div>
        </form>
    );
};

export default SearchBar;
