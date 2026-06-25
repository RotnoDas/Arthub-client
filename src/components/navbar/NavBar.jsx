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
        <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${scrolled ? "bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-sm py-2 border-b border-slate-200 dark:border-slate-800/50" : "bg-slate-50 dark:bg-slate-950 py-4 border-b border-transparent"}`}>
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
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-slate-900 dark:text-white"
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
                            className={`text-sm transition-colors font-medium ${pathname === item.href ? "text-pink-600 dark:text-pink-400" : "text-slate-700 dark:text-slate-300 hover:text-pink-600 dark:hover:text-pink-400"}`}
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
                                />
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                    {/* User info */}
                                    <div className="px-4 py-2.5 border-b border-slate-200 dark:border-slate-800 mb-1.5 cursor-default bg-slate-50 dark:bg-slate-800/50 mx-2 rounded-lg">
                                        <p className="text-[10px] text-pink-600 dark:text-pink-400 font-bold uppercase tracking-wider mb-0.5">
                                            {user.role} Account
                                        </p>
                                        <p className="font-bold text-slate-900 dark:text-white text-sm truncate">{user.name}</p>
                                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">{user.email}</p>
                                    </div>

                                    {/* Actions */}
                                    <Link
                                        href={getDashboardLink()}
                                        onClick={() => setDropdownOpen(false)}
                                        className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                                    >
                                        <FaTachometerAlt className="text-slate-400 dark:text-slate-500 text-sm shrink-0" />
                                        <span>My Dashboard</span>
                                    </Link>

                                    <Link
                                        href="/settings"
                                        onClick={() => setDropdownOpen(false)}
                                        className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition cursor-pointer"
                                    >
                                        <FaCog className="text-slate-400 dark:text-slate-500 text-sm shrink-0" />
                                        <span>Account Settings</span>
                                    </Link>

                                    <div className="border-t border-slate-200 dark:border-slate-800 my-1.5" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-5 py-2.5 text-left text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 transition cursor-pointer"
                                    >
                                        <FaSignOutAlt className="text-sm shrink-0 text-red-500" />
                                        <span>Log Out</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link href="/login" className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-semibold text-sm transition-colors px-4 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">
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
                <div className="lg:hidden absolute top-16 left-0 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 p-6 shadow-lg z-40 animate-in slide-in-from-top-4 duration-200">
                    <div className="flex flex-col gap-4">
                        {menuItems.map((item) => (
                            <Link
                                key={item.name}
                                className={`text-lg font-semibold transition-colors ${pathname === item.href ? "text-pink-600 dark:text-pink-400" : "text-slate-900 dark:text-slate-100 hover:text-pink-600 dark:hover:text-pink-400"}`}
                                href={item.href}
                                onClick={closeMenu}
                            >
                                {item.name}
                            </Link>
                        ))}

                        {user && (
                            <Link
                                className={`text-lg font-semibold transition-colors ${pathname.includes("dashboard") ? "text-pink-600 dark:text-pink-400" : "text-slate-900 dark:text-slate-100 hover:text-pink-600 dark:hover:text-pink-400"}`}
                                href={getDashboardLink()}
                                onClick={closeMenu}
                            >
                                Dashboard
                            </Link>
                        )}

                        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 mt-2">
                            {!user ? (
                                <div className="flex flex-col gap-3">
                                    <Link href="/login" className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-semibold h-12 rounded-xl flex items-center justify-center text-md transition-colors" onClick={closeMenu}>
                                        Login
                                    </Link>
                                    <Link href="/register" className="relative overflow-hidden group w-full bg-linear-to-r from-pink-500 to-indigo-500 text-white font-semibold h-12 rounded-xl flex items-center justify-center text-md shadow-lg shadow-pink-500/30 hover:shadow-indigo-500/50 transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02]" onClick={closeMenu}>
                                        <span className="relative z-10">Sign Up</span>
                                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                                    </Link>
                                </div>
                            ) : (
                                <button onClick={() => { handleLogout(); closeMenu(); }} className="w-full bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 font-semibold h-12 rounded-xl flex items-center justify-center text-md transition-colors">
                                    Log Out
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default NavBar;