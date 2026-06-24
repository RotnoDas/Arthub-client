import { Skeleton } from "@heroui/react";

export default function Loading() {
    return (
        <div className="min-h-screen bg-slate-50 py-16 px-6 lg:px-8">
            <div className="max-w-7xl mx-auto bg-white rounded-[3rem] shadow-xl border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left side: Image Skeleton */}
                    <div className="relative aspect-square lg:aspect-auto lg:h-full bg-slate-50 p-8 flex items-center justify-center">
                        <Skeleton className="w-full h-full rounded-2xl" />
                    </div>

                    {/* Right side: Details Skeleton */}
                    <div className="p-10 lg:p-16 flex flex-col justify-center space-y-8">
                        <Skeleton className="w-32 h-8 rounded-full" />
                        
                        <div className="space-y-4">
                            <Skeleton className="w-full h-12 rounded-lg" />
                            <Skeleton className="w-3/4 h-12 rounded-lg" />
                        </div>

                        <div className="flex items-center gap-4 pt-4">
                            <Skeleton className="w-12 h-12 rounded-full" />
                            <div className="space-y-2">
                                <Skeleton className="w-24 h-4 rounded-md" />
                                <Skeleton className="w-32 h-4 rounded-md" />
                            </div>
                        </div>

                        <div className="space-y-3 pt-4">
                            <Skeleton className="w-48 h-6 rounded-md mb-2" />
                            <Skeleton className="w-full h-4 rounded-md" />
                            <Skeleton className="w-full h-4 rounded-md" />
                            <Skeleton className="w-5/6 h-4 rounded-md" />
                        </div>

                        <div className="mt-auto border-t border-slate-100 pt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                            <div className="space-y-2">
                                <Skeleton className="w-16 h-4 rounded-md" />
                                <Skeleton className="w-32 h-10 rounded-md" />
                            </div>
                            <Skeleton className="w-full sm:w-48 h-14 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
