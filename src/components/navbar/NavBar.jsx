"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from '@/components/logo/Logo';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import { FaChevronDown, FaBars, FaTimes, FaCog, FaSignOutAlt, FaPalette, FaUserShield, FaTachometerAlt, FaUser, FaThLarge } from 'react-icons/fa';
import Image from 'next/image';
import { ThemeSwitcher } from '@/components/theme-switcher/ThemeSwitcher';

const NavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const pathname = usePathname();
    const router = useRouter();

    // Extract session dynamically from BetterAuth
    const { data: sessionData, isPending } = authClient.useSession();
    const user = sessionData?.user;

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const [scrolled, setScrolled] = useState(false);
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const menuItems = [
        { name: "Home", href: "/" },
        { name: "Browse Artworks", href: "/artworks" },
    ];

    const handleLogout = async () => {
        const loadingToast = toast.loading("Logging out...");
        await authClient.signOut();
        toast.success("Logged out successfully", { id: loadingToast });
        window.location.href = "/login";
    };

    const closeMenu = () => setIsMenuOpen(false);

    const getDashboardLink = () => {
        return "/dashboard";
    };

    return (
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm shadow-slate-200/50 dark:shadow-none py-3 border-b border-slate-200/80 dark:border-slate-800/80" : "bg-transparent py-5 border-b border-transparent"}`}>
            <nav className="mx-auto flex h-full max-w-7xl items-center justify-between px-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1" onClick={closeMenu}>
                    <div className="-m-1.5 p-1.5 flex items-center transition-transform hover:scale-105 active:scale-95 cursor-pointer">
                        <Logo />
                    </div>
                </div>

                <div className="flex lg:hidden items-center gap-4">
                    <ThemeSwitcher />
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <span className="sr-only">Open main menu</span>
                        {isMenuOpen ? <FaTimes className="h-6 w-6" aria-hidden="true" /> : <FaBars className="h-6 w-6" aria-hidden="true" />}
                    </button>
                </div>

                <div className="hidden lg:flex lg:gap-x-8 items-center">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`text-sm transition-colors font-medium ${pathname === item.href ? "text-pink-600 dark:text-pink-400" : "text-foreground hover:text-pink-600 dark:hover:text-pink-400"}`}
                        >
                            {item.name}
                        </Link>
                    ))}

                    {user && (
                        <Link
                            href={getDashboardLink()}
                            className={`text-sm transition-colors ${pathname.includes('dashboard') ? "text-pink-500 font-semibold" : "text-foreground/80 hover:text-foreground font-medium"}`}
                        >
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="hidden lg:flex lg:flex-1 lg:justify-end items-center gap-4">
                    <ThemeSwitcher />
                    {isPending ? (
                        <div className="w-24 h-9 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-full"></div>
                    ) : user ? (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center transition-transform hover:scale-105 outline-none focus:outline-none cursor-pointer"
                            >
                                <Image
                                    unoptimized
                                    width={36}
                                    height={36}
                                    className="w-9 h-9 rounded-full object-cover ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 ring-pink-500 dark:ring-pink-400 shadow-md shadow-pink-500/20"
                                    src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                    alt="avatar"
                                    referrerPolicy="no-referrer"
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-4 w-72 bg-white/95 backdrop-blur-xl dark:bg-slate-950/95 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] dark:shadow-none p-2 z-50 animate-in fade-in slide-in-from-top-3 duration-200">
                                    {/* User info */}
                                    <div className="px-4 py-4 mb-2 cursor-default bg-gradient-to-br from-slate-50 to-slate-100/80 dark:from-slate-900/50 dark:to-slate-900/20 rounded-xl border border-slate-100 dark:border-slate-800/50 flex flex-col items-center text-center">
                                        <Image
                                            unoptimized
                                            width={48}
                                            height={48}
                                            className="w-12 h-12 rounded-full object-cover ring-2 ring-white dark:ring-slate-900 shadow-md mb-2"
                                            src={user.image || `https://ui-avatars.com/api/?name=${user.name}&background=random`}
                                            alt="avatar"
                                            referrerPolicy="no-referrer"
                                        />
                                        <p className="font-extrabold text-slate-800 dark:text-white text-base truncate w-full">{user.name}</p>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate w-full font-medium mt-0.5">{user.email}</p>
                                        <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 text-[10px] font-bold uppercase tracking-widest shadow-sm">
                                            {user.role} Account
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="space-y-1">
                                        <Link
                                            href={getDashboardLink()}
                                            onClick={() => setDropdownOpen(false)}
                                            className="group w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-xl transition-all cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-pink-100 dark:group-hover:bg-pink-500/20 flex items-center justify-center transition-colors">
                                                <FaTachometerAlt className="text-slate-400 dark:text-slate-500 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors" />
                                            </div>
                                            <span>My Dashboard</span>
                                        </Link>

                                        <Link
                                            href="/settings"
                                            onClick={() => setDropdownOpen(false)}
                                            className="group w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-500/10 rounded-xl transition-all cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 group-hover:bg-pink-100 dark:group-hover:bg-pink-500/20 flex items-center justify-center transition-colors">
                                                <FaCog className="text-slate-400 dark:text-slate-500 group-hover:text-pink-500 dark:group-hover:text-pink-400 transition-colors" />
                                            </div>
                                            <span>Account Settings</span>
                                        </Link>

                                        <div className="h-px w-full bg-slate-100 dark:bg-slate-800/80 my-2" />

                                        <button
                                            onClick={handleLogout}
                                            className="group w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all cursor-pointer"
                                        >
                                            <div className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-500/10 group-hover:bg-red-100 dark:group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
                                                <FaSignOutAlt className="text-red-500 dark:text-red-400" />
                                            </div>
                                            <span>Log Out</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-muted hover:text-slate-900 dark:hover:text-white font-semibold text-sm transition-colors px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
                                Login
                            </Link>
                            <Link href="/register" className="relative overflow-hidden group bg-linear-to-r from-pink-500 to-indigo-500 text-white font-semibold text-sm px-6 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:scale-105">
                                <span className="relative z-10">Sign Up</span>
                                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="lg:hidden absolute top-full left-0 w-full bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl border-b border-slate-200 dark:border-slate-800 px-6 py-8 shadow-2xl shadow-slate-200/50 dark:shadow-none z-40 animate-in slide-in-from-top-2 duration-300">
                    <div className="flex flex-col gap-2">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                className={`flex items-center text-lg font-semibold transition-all duration-200 px-4 py-3.5 rounded-2xl ${pathname === item.href ? "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"}`}
                                href={item.href}
                                onClick={closeMenu}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {user && (
                            <Link
                                className={`flex items-center text-lg font-semibold transition-all duration-200 px-4 py-3.5 rounded-2xl ${pathname.includes("dashboard") ? "bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400" : "text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white"}`}
                                href={getDashboardLink()}
                                onClick={closeMenu}
                            >
                                Dashboard
                            </Link>
                        )}

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-slate-200 dark:via-slate-800 to-transparent my-6 opacity-80"></div>
                        <div>
                            {!user ? (
                                <div className="flex flex-col gap-3 px-2">
                                    <Link href="/login" className="w-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold h-14 rounded-2xl flex items-center justify-center text-md transition-all duration-300" onClick={closeMenu}>
                                        Login
                                    </Link>
                                    <Link href="/register" className="relative overflow-hidden group w-full bg-linear-to-r from-pink-500 to-indigo-500 text-white font-semibold h-14 rounded-2xl flex items-center justify-center text-md shadow-lg shadow-pink-500/25 hover:shadow-indigo-500/40 transition-all duration-300 hover:-translate-y-0.5" onClick={closeMenu}>
                                        <span className="relative z-10">Sign Up</span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                    </Link>
                                </div>
                            ) : (
                                <div className="px-2">
                                    <button onClick={() => { handleLogout(); closeMenu(); }} className="w-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 font-semibold h-14 rounded-2xl flex items-center justify-center text-md transition-all duration-300">
                                        Log Out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default NavBar;