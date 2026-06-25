'use client';
import DashboardSidebar from '@/components/dashboard-sidebar/DashboardSidebar';
import { useSession } from '@/lib/auth-client';
import React, { useState } from 'react';
import { FaBars } from 'react-icons/fa';
import Logo from '@/components/logo/Logo';

const DashboardLayout = ({children}) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (    
        <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            {/* Mobile Header */}
            <div className="lg:hidden flex items-center justify-between p-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 transition-colors duration-300">
                <Logo />
                <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="p-2 -mr-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                    <FaBars size={20} />
                </button>
            </div>

            <DashboardSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
            
            <div className="flex-1 overflow-x-hidden">
                <div className="px-4 sm:px-6 lg:px-8 py-8 lg:py-10 max-w-5xl w-full mx-auto">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;