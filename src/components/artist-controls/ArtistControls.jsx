'use client';
import { apiFetch } from "@/lib/api";

import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

const ArtistControls = ({ artworkId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await apiFetch(`http://localhost:5000/api/artworks/${artworkId}`, {
                method: 'DELETE',
            });
            
            if (res.ok) {
                toast.success('Artwork deleted successfully.');
                router.push('/dashboard/artist/manage-artworks');
            } else {
                toast.error('Failed to delete artwork.');
            }
        } catch (error) {
            toast.error('An error occurred.');
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="mt-8 p-6 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/50 rounded-2xl relative transition-colors duration-500">
            <h4 className="text-amber-900 dark:text-amber-500 font-bold mb-4 flex items-center gap-2">
                Artist Controls
            </h4>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/dashboard/artist/add-artwork?edit=${artworkId}`} className="flex-1">
                    <Button className="w-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 text-amber-700 dark:text-amber-500 font-bold hover:bg-amber-100 dark:hover:bg-amber-900/40 shadow-sm transition-all">
                        <FaEdit /> Edit Details
                    </Button>
                </Link>
                <Button 
                    color="danger" 
                    variant="flat"
                    className="flex-1 font-bold"
                    onPress={() => setIsOpen(true)}
                >
                    <FaTrash /> Delete Artwork
                </Button>
            </div>

            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200 border border-transparent dark:border-slate-800">
                        <h3 className="text-xl font-bold text-red-600 dark:text-red-500 mb-2">Delete Artwork</h3>
                        <p className="text-slate-600 dark:text-slate-400 font-medium mb-8">
                            Are you sure you want to permanently delete this artwork? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="light" onPress={() => setIsOpen(false)} className="font-bold text-slate-500 dark:text-slate-400">
                                Cancel
                            </Button>
                            <Button className="bg-red-600 hover:bg-red-700 text-white font-bold shadow-md shadow-red-500/20" isLoading={isDeleting} onPress={handleDelete}>
                                Yes, Delete
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ArtistControls;
