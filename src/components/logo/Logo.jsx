import Link from 'next/link';
import React from 'react';
import { FaArtstation } from 'react-icons/fa';

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
            <div className="bg-gradient-to-tr from-pink-500 to-indigo-500 p-1.5 sm:p-2 rounded-lg text-white shadow-md shadow-pink-500/20 transition-transform group-hover:scale-105">
                <FaArtstation className="text-lg sm:text-xl" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 dark:from-white dark:via-slate-200 dark:to-white bg-clip-text text-transparent transition-colors">
                Arthub
            </span>
        </Link>
    );
};

export default Logo;