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

    // Generate page numbers to show with ellipsis
    const getPageNumbers = () => {
        const delta = 1; // Number of pages to show around current page
        const range = [];
        const rangeWithDots = [];
        let l;

        for (let i = 1; i <= safeTotalPages; i++) {
            if (i === 1 || i === safeTotalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
                range.push(i);
            }
        }

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };
    
    const pages = getPageNumbers();

    return (
        <div className="flex justify-center mt-16 pt-8 border-t border-border pb-16 transition-colors duration-500">
            <div className="flex items-center gap-2">
                <button 
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`flex items-center gap-1 font-extrabold px-4 py-2 rounded-xl transition-colors mr-2 text-sm ${
                        currentPage === 1 
                            ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
                            : 'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800 text-foreground'
                    }`}
                >
                    <FaChevronLeft size={10} /> Previous
                </button>

                {pages.map((page, index) => (
                    page === '...' ? (
                        <span key={`ellipsis-${index}`} className="w-10 flex items-center justify-center text-slate-400 font-bold">...</span>
                    ) : (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`w-10 h-10 flex items-center justify-center font-extrabold rounded-full transition-all text-sm ${
                                currentPage === page
                                    ? "bg-foreground text-background shadow-xl shadow-slate-900/20 dark:shadow-white/20"
                                    : "bg-surface-solid text-foreground hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                        >
                            {page}
                        </button>
                    )
                ))}

                <button 
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === safeTotalPages}
                    className={`flex items-center gap-1 font-extrabold px-4 py-2 rounded-xl transition-colors ml-2 text-sm ${
                        currentPage === safeTotalPages 
                            ? 'text-slate-300 dark:text-slate-700 cursor-not-allowed' 
                            : 'bg-transparent hover:bg-slate-200 dark:hover:bg-slate-800 text-foreground'
                    }`}
                >
                    Next <FaChevronRight size={10} />
                </button>
            </div>
        </div>
    );
};

export default ArtworkPagination;
