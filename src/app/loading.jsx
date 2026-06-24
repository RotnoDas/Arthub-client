import React from 'react';
import { Spinner } from '@heroui/react';

export default function Loading() {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center bg-slate-50/50">
            <div className="flex flex-col items-center gap-6">
                <Spinner size="lg" color="secondary" label="Loading..." />
                <p className="text-slate-500 font-medium tracking-wide">
                    Preparing your masterpiece...
                </p>
            </div>
        </div>
    );
}
