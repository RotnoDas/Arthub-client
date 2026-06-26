import { stripe } from '@/lib/stripe';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { FaCheckCircle, FaArrowRight } from 'react-icons/fa';

export default async function PaymentSuccessPage({ searchParams }) {
    const { session_id } = await searchParams;

    if (!session_id) {
        throw new Error('Please provide a valid session_id from Stripe.');
    }

    // Retrieve session and metadata from Stripe
    const session = await stripe.checkout.sessions.retrieve(session_id, {
        expand: ['payment_intent']
    });

    const meta = session?.metadata;
    let heading = "Payment Successful!";
    let message = "Your transaction has been securely processed.";
    let buttonHref = "/dashboard/user";
    let buttonText = "Go to Dashboard";

    if (meta?.type === 'artwork') {
        heading = "Artwork Purchased!";
        message = `You are now the proud owner of "${meta.artworkTitle}".`;

        const purchaseData = {
            amount: meta.amount,
            artworkId: meta.artworkId,
            artworkTitle: meta.artworkTitle,
            artistEmail: meta.artistEmail,
            buyerEmail: meta.buyerEmail,
            paymentType: 'card',
            transactionId: session?.payment_intent?.id || session_id,
            paymentStatus: session?.payment_status
        };

        // Record purchase to backend (server-to-server, no browser session available)
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/artworks/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-secret': process.env.INTERNAL_API_SECRET || 'dev-internal-secret'
                },
                body: JSON.stringify(purchaseData)
            });
        } catch (e) {
            console.error("Failed to record artwork purchase:", e);
        }

    } else if (meta?.type === 'subscription') {
        heading = "Subscription Upgraded!";
        message = `You have successfully upgraded to the ${meta.tier.toUpperCase()} tier.`;

        const subData = {
            amount: meta.amount,
            transactionId: session?.payment_intent?.id || session_id,
            paymentStatus: session?.payment_status,
            paymentType: 'card',
            tier: meta.tier
        };

        // Upgrade subscription on backend (server-to-server, no browser session available)
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/users/upgrade-subscription/${meta.buyerEmail}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-internal-secret': process.env.INTERNAL_API_SECRET || 'dev-internal-secret'
                },
                body: JSON.stringify(subData)
            });
        } catch (e) {
            console.error("Failed to upgrade subscription:", e);
        }
    }

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-background px-6 py-12 transition-colors duration-500">
            <div className="w-full max-w-lg bg-background rounded-3xl shadow-xl dark:shadow-none border border-border p-8 text-center transition-colors duration-500">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 rounded-full bg-green-50 dark:bg-emerald-500/10 flex items-center justify-center text-green-500 dark:text-emerald-400 mb-2">
                        <FaCheckCircle size={40} className="animate-bounce" />
                    </div>
                </div>

                <h1 className="text-3xl font-extrabold text-foreground mb-2">
                    {heading}
                </h1>

                <p className="text-muted mb-8">
                    {message}
                </p>

                <div className="bg-background/50 p-6 rounded-2xl mb-8 text-left space-y-3 border border-border transition-colors">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted">Email:</span>
                        <span className="font-semibold text-foreground">{session?.customer_email}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted">Amount Paid:</span>
                        <span className="font-bold text-accent-secondary">${Number(meta?.amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-muted">Transaction ID:</span>
                        <span className="font-mono text-xs text-slate-400 dark:text-slate-500 truncate max-w-[150px]">
                            {session?.payment_intent?.id || session_id}
                        </span>
                    </div>
                </div>

                <Link href={buttonHref} className="block w-full">
                    <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12 rounded-xl shadow-lg shadow-indigo-600/20" endContent={<FaArrowRight />}>
                        {buttonText}
                    </Button>
                </Link>
            </div>
        </div>
    );
}
