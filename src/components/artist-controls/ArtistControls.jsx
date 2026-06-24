'use client';

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
            const res = await fetch(`http://localhost:5000/api/artworks/${artworkId}`, {
                method: 'DELETE',
            });
            
            if (res.ok) {
                toast.success('Artwork deleted successfully.');
                router.push('/dashboard/artist/my-artworks');
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
        <div className="mt-8 p-6 bg-amber-50 border border-amber-200 rounded-2xl relative">
            <h4 className="text-amber-900 font-bold mb-4 flex items-center gap-2">
                Artist Controls
            </h4>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href={`/dashboard/artist/edit-artwork/${artworkId}`} className="flex-1">
                    <Button className="w-full bg-white border border-amber-200 text-amber-700 font-bold hover:bg-amber-100 shadow-sm transition-all">
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
                    <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-6 animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-red-600 mb-2">Delete Artwork</h3>
                        <p className="text-slate-600 font-medium mb-8">
                            Are you sure you want to permanently delete this artwork? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-3">
                            <Button variant="light" onPress={() => setIsOpen(false)} className="font-bold text-slate-500">
                                Cancel
                            </Button>
                            <Button color="danger" className="font-bold shadow-md" isLoading={isDeleting} onPress={handleDelete}>
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
