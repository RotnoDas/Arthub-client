import Link from 'next/link';
import React from 'react';
import { FaArtstation, FaTicketAlt } from 'react-icons/fa';

const Logo = () => {
    return (
        <Link href="/" className="flex items-center gap-2">
            <div className="bg-linear-to-tr from-pink-500 to-indigo-500 p-2 rounded-lg text-white shadow-md shadow-pink-500/20">
                <FaArtstation className="text-xl" />
            </div>
            <span className="font-extrabold text-xl tracking-tight bg-linear-to-r from-slate-800 via-slate-600 to-pink-500 dark:from-white dark:via-slate-200 dark:to-pink-500 bg-clip-text text-transparent">
                Arthub
            </span>
        </Link>
    );
};

export default Logo;