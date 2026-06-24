'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const ArtworkPagination = ({ totalPages }) => {
    const router = useRouter();
    const searchParams = useSearchParams();
    
    // Default to at least 1 page for display purposes if totalPages is 0
    const safeTotalPages = Math.max(totalPages || 1, 1);
    const currentPage = parseInt(searchParams.get('page')) || 1;

    const handlePageChange = (page) => {
        if (page < 1 || page > safeTotalPages) return;
        const params = new URLSearchParams(searchParams);
        params.set('page', page);
        router.push(`/artworks?${params.toString()}`);
    };

    // Generate page numbers to show
    const pages = [];
    for (let i = 1; i <= safeTotalPages; i++) {
        pages.push(i);
    }

    return (
        <div className="flex justify-center mt-16 pt-8 border-t border-slate-200 pb-16">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 font-extrabold px-4 py-2 rounded-xl transition-colors mr-2 text-sm ${
                        currentPage === 1 
                            ? 'text-slate-300 cursor-not-allowed' 
                            : 'bg-transparent hover:bg-slate-200 text-slate-900'
                    }`}
                >
                    <FaChevronLeft size={10} /> Previous
                </button>

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center font-extrabold rounded-full transition-all text-sm ${
                            currentPage === page
                                ? "bg-slate-900 text-white shadow-xl shadow-slate-900/20"
                                : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                        }`}
                    >
                        {page}
                    </button>
                ))}

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === safeTotalPages}
                    className={`flex items-center gap-1 font-extrabold px-4 py-2 rounded-xl transition-colors ml-2 text-sm ${
                        currentPage === safeTotalPages 
                            ? 'text-slate-300 cursor-not-allowed' 
                            : 'bg-transparent hover:bg-slate-200 text-slate-900'
                    }`}
                >
                    Next <FaChevronRight size={10} />
                </button>
            </div>
        </div>
    );
};

export default ArtworkPagination;
