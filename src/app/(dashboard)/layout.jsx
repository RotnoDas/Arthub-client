'use client';
import DashboardSidebar from '@/components/dashboard-sidebar/DashboardSidebar';
import { useSession } from '@/lib/auth-client';
import React from 'react';

const DashboardLayout = ({children}) => {
    return (    
        <div className="min-h-screen flex bg-slate-50">
            <DashboardSidebar></DashboardSidebar>
            <div className="px-6 py-10 max-w-5xl w-full">
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;