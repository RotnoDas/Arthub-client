import ArtworkCard from '@/components/artwork-card/ArtworkCard';
import Search from '@/components/search/Search';
import { fetchArtworks } from '@/lib/fetchArtworks';
import React from 'react';
import { FaGhost } from 'react-icons/fa';

export async function generateMetadata({ searchParams }) {
    const params = await searchParams;
    const search = params?.search || '';
    const category = params?.category || '';
    
    if (search) {
        return { title: `Search: ${search}` };
    }
    if (category && category !== 'All Categories') {
        return { title: `${category} Artworks` };
    }
    return { title: 'Browse Artworks' };
}

const ArtworksPage = async ({ searchParams }) => {
    const searchParamsData = await searchParams;
    const searchTerm = searchParamsData.search || '';
    const category = searchParamsData.category || '';
    const data = await fetchArtworks(searchTerm, category);

    return (
        <div className="min-h-screen bg-slate-50">
            <Search />
            
            <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
                <div className="flex justify-between items-center mb-12">
                    <h2 className="text-3xl font-extrabold flex items-center gap-2 text-slate-900 tracking-tight">
                        {searchTerm ? `Search Results for "${searchTerm}"` : (category && category !== 'All Categories' ? `${category} Collection` : 'All Artworks')}
                        <span className="text-lg font-bold text-slate-400 bg-slate-200/50 px-3 py-1 rounded-full ml-2">
                            {data.length}
                        </span>
                    </h2>
                </div>

                {data.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
                        {data.map((artwork, index) => (
                            <div key={artwork._id} className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both" style={{ animationDelay: `${index * 100}ms` }}>
                                <ArtworkCard artwork={artwork} index={index} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 shadow-sm">
                        <div className="flex justify-center mb-6">
                            <div className="p-6 bg-slate-50 rounded-full text-slate-300">
                                <FaGhost size={64} />
                            </div>
                        </div>
                        <h3 className="text-3xl font-extrabold text-slate-900 mb-3">No artworks found</h3>
                        <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">
                            We could not find any artworks matching your current filters. Try adjusting your search or clearing the category.
                        </p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default ArtworksPage;