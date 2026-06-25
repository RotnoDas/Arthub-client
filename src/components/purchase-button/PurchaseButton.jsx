'use client';
import { apiFetch } from "@/lib/api";

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
                <Button className="w-full sm:w-auto bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold px-8 h-14 rounded-2xl shadow-xl shadow-slate-900/20 dark:shadow-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all">
                    <FaLock /> Log In to Purchase
                </Button>
            </Link>
        );
    }

    if (isArtist) {
        return (
            <Button disabled className="w-full sm:w-auto bg-slate-100 dark:bg-slate-800/50 text-slate-400 dark:text-slate-500 font-bold px-8 h-14 rounded-2xl cursor-not-allowed border border-slate-200 dark:border-slate-800">
                You own this artwork
            </Button>
        );
    }

    if (artwork.status === 'sold') {
        return (
            <Button disabled className="w-full sm:w-auto bg-red-50 dark:bg-red-500/10 text-red-400 dark:text-red-500 font-bold px-8 h-14 rounded-2xl cursor-not-allowed border border-red-200 dark:border-red-500/20">
                Out of Stock / Sold
            </Button>
        );
    }

    const handlePurchase = async () => {
        setIsLoading(true);
        const loadingToast = toast.loading('Redirecting to secure Stripe checkout...');
        
        try {
            const purchaseData = {
                amount: artwork.price,
                artworkId: artwork._id,
                artworkTitle: artwork.title,
                artistEmail: artwork.artistEmail,
                buyerEmail: session.user.email,
                origin: window.location.origin
            };

            const res = await apiFetch('http://localhost:5000/api/checkout/artwork', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(purchaseData)
            });

            const data = await res.json();

            if (res.ok && data.url) {
                toast.success('Redirecting...', { id: loadingToast });
                window.location.href = data.url; // Redirect to Stripe Checkout
            } else {
                toast.error(data.message || data.error || 'Checkout failed.', { id: loadingToast, duration: 5000 });
                setIsLoading(false);
            }
        } catch (error) {
            toast.error('An error occurred connecting to checkout.', { id: loadingToast });
            setIsLoading(false);
        }
    };

    return (
        <Button 
            onPress={handlePurchase}
            isLoading={isLoading}
            className="w-full sm:w-auto bg-gradient-to-r from-fuchsia-600 to-indigo-600 dark:from-fuchsia-500 dark:to-indigo-500 text-white font-bold px-8 h-14 rounded-2xl shadow-xl shadow-fuchsia-500/20 dark:shadow-fuchsia-500/10 hover:shadow-2xl hover:shadow-fuchsia-500/30 hover:-translate-y-1 transition-all"
        >
            {!isLoading && <FaShoppingCart className="mr-2" />} 
            Purchase via Stripe
        </Button>
    );
};

export default PurchaseButton;
