'use client';

import React, { useState } from 'react';
import { Button } from '@heroui/react';
import { FaShoppingCart, FaLock } from 'react-icons/fa';
import Link from 'next/link';
import toast from 'react-hot-toast';

const PurchaseButton = ({ artwork, session, isArtist }) => {
    const [isLoading, setIsLoading] = useState(false);

    if (!session) {
        return (
            <Link href={`/login?redirect=/artworks/${artwork._id}`} className="w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-slate-900 text-white font-bold px-8 h-14 rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all">
                    <FaLock /> Log In to Purchase
                </Button>
            </Link>
        );
    }

    if (isArtist) {
        return (
            <Button disabled className="w-full sm:w-auto bg-slate-100 text-slate-400 font-bold px-8 h-14 rounded-2xl cursor-not-allowed border border-slate-200">
                You own this artwork
            </Button>
        );
    }

    if (artwork.status === 'sold') {
        return (
            <Button disabled className="w-full sm:w-auto bg-red-50 text-red-400 font-bold px-8 h-14 rounded-2xl cursor-not-allowed border border-red-200">
                Out of Stock / Sold
            </Button>
        );
    }

    const handlePurchase = async () => {
        setIsLoading(true);
        // Mock Stripe Redirect
        toast.loading('Redirecting to secure Stripe checkout...', { duration: 2000 });
        
        setTimeout(async () => {
            try {
                // Mocking the purchase API call directly for this phase
                const purchaseData = {
                    amount: artwork.price,
                    artworkId: artwork._id,
                    artworkTitle: artwork.title,
                    artistEmail: artwork.artistEmail,
                    buyerEmail: session.user.email,
                    paymentType: 'card',
                    transactionId: `mock_txn_${Math.random().toString(36).substring(7)}`,
                    paymentStatus: 'completed'
                };

                const res = await fetch('http://localhost:5000/api/artworks/purchase', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(purchaseData)
                });

                if (res.ok) {
                    toast.success('Payment successful! Artwork purchased.');
                    window.location.reload(); // Reload to update status
                } else {
                    toast.error('Payment processing failed.');
                }
            } catch (error) {
                toast.error('An error occurred during checkout.');
            } finally {
                setIsLoading(false);
            }
        }, 2000);
    };

    return (
        <Button 
            onPress={handlePurchase}
            isLoading={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold px-8 h-14 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-fuchsia-500/30 hover:-translate-y-1 transition-all"
        >
            {!isLoading && <FaShoppingCart className="mr-2" />} 
            Purchase via Stripe
        </Button>
    );
};

export default PurchaseButton;
