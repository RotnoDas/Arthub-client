'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search as SearchIcon } from 'lucide-react';
import { Button } from '@heroui/react';

const CATEGORIES = [
    "All Categories", "Painting", "Digital Art", 
    "Photography", "Sculpture", "Drawing", "Mixed Media"
];

const SearchBar = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState('All Categories');

    useEffect(() => {
        const initialSearch = searchParams.get('search') || '';
        setSearchQuery(initialSearch);
        const initialCategory = searchParams.get('category') || 'All Categories';
        setCategory(initialCategory);
    }, [searchParams]);

    const handleSearch = (e) => {
        if(e) e.preventDefault();
        const params = new URLSearchParams(searchParams);
        if (searchQuery.trim()) {
            params.set('search', searchQuery);
        } else {
            params.delete('search');
        }
        
        if (category && category !== 'All Categories') {
            params.set('category', category);
        } else {
            params.delete('category');
        }
        
        router.push(`/artworks?${params.toString()}`);
    };

    const handleCategoryChange = (e) => {
        const newCategory = e.target.value;
        setCategory(newCategory);
        
        const params = new URLSearchParams(searchParams);
        if (searchQuery.trim()) params.set('search', searchQuery);
        else params.delete('search');
        
        if (newCategory !== 'All Categories') params.set('category', newCategory);
        else params.delete('category');
        
        router.push(`/artworks?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2 relative shadow-lg shadow-slate-200/50 border-2 border-slate-200 rounded-2xl bg-white p-2 focus-within:ring-4 focus-within:ring-fuchsia-500/20 focus-within:border-fuchsia-300 transition-all">
                <div className="flex-1 flex items-center pl-4">
                    <SearchIcon className="text-slate-400 w-5 h-5 mr-3" />
                    <input
                        type="text"
                        placeholder="Search for artworks by title..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full h-full bg-transparent border-0 outline-none focus:ring-0 focus:outline-none text-slate-900 placeholder:text-slate-400 text-lg py-2 font-medium"
                    />
                </div>
                <Button 
                    type="submit" 
                    className="px-8 font-bold rounded-xl bg-slate-900 text-white shadow-md hover:bg-fuchsia-600 transition-colors h-full min-h-[3rem]"
                >
                    Search
                </Button>
            </form>
            
            <div className="sm:w-64 shrink-0 relative">
                <select 
                    value={category}
                    onChange={handleCategoryChange}
                    className="w-full h-full min-h-[4rem] px-5 py-2 bg-white border-2 border-slate-200 rounded-2xl text-slate-700 font-bold shadow-lg shadow-slate-200/50 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none cursor-pointer appearance-none transition-all"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23475569' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 1rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em`, paddingRight: `3rem` }}
                >
                    {CATEGORIES.map(cat => (
                        <option key={cat} value={cat} className="font-semibold text-slate-800">{cat}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};

export default SearchBar;
