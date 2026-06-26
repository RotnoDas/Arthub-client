'use client';

import React, { useEffect } from 'react';
import { Button } from '@heroui/react';
import { FaExclamationTriangle, FaRedo } from 'react-icons/fa';

export default function Error({ error, reset }) {
    useEffect(() => {
        // Log the error to an error reporting service if available
        console.error("Runtime Error Boundary caught:", error);
    }, [error]);

    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50/50 p-6">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-red-500/10 border-2 border-red-100 p-8 md:p-12 max-w-lg w-full text-center">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <FaExclamationTriangle size={36} />
                </div>

                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Something went wrong!
                </h2>

                <p className="text-slate-500 font-medium leading-relaxed mb-8">
                    An unexpected error occurred while rendering this view. Our team has been notified.
                    You can try reloading the page to see if that resolves the issue.
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <Button
                        onPress={() => reset()}
                        className="w-full sm:w-auto font-bold bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-xl shadow-red-500/20 hover:shadow-2xl hover:shadow-red-500/40 transition-all h-14 px-8 rounded-2xl"
                    >
                        <FaRedo className="mr-2" /> Try again
                    </Button>
                </div>
            </div>
        </div>
    );
}
