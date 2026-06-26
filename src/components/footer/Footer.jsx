import React from 'react';
import Link from 'next/link';
import { Mail } from 'lucide-react';
import Logo from '../logo/Logo';
import { FaGithub, FaInstagram } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
    return (
        <footer className="bg-background border-t border-border pt-16 pb-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                    <div className="space-y-4">
                        <Logo />
                        <p className="text-muted text-sm leading-relaxed max-w-xs pt-2">
                            A global community platform to discover, share, and appreciate stunning artworks from independent artists.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold text-foreground mb-4">Platform</h3>
                        <ul className="space-y-3">
                            <li><Link href="/artworks" className="text-sm font-medium text-muted hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Explore Artworks</Link></li>
                            <li><Link href="/dashboard" className="text-sm font-medium text-muted hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Dashboard</Link></li>
                            <li><Link href="/login" className="text-sm font-medium text-muted hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Sign In</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-foreground mb-4">Categories</h3>
                        <ul className="space-y-3">
                            <li><Link href="/artworks?category=Digital+Art" className="text-sm font-medium text-muted hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Digital Art</Link></li>
                            <li><Link href="/artworks?category=Photography" className="text-sm font-medium text-muted hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Photography</Link></li>
                            <li><Link href="/artworks?category=Painting" className="text-sm font-medium text-muted hover:text-pink-600 dark:hover:text-pink-400 transition-colors">Painting</Link></li>
                            <li><Link href="/artworks?category=3D+Models" className="text-sm font-medium text-muted hover:text-pink-600 dark:hover:text-pink-400 transition-colors">3D Models</Link></li>
                            <li><Link href="/artworks?category=AI+Art" className="text-sm font-medium text-muted hover:text-pink-600 dark:hover:text-pink-400 transition-colors">AI Art</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold text-foreground mb-4">Connect</h3>
                        <div className="flex items-center gap-4 mb-4">
                            <a href="#" className="text-muted hover:text-foreground transition-colors" aria-label="X (Twitter)">
                                <FaXTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted hover:text-foreground transition-colors" aria-label="Instagram">
                                <FaInstagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-muted hover:text-foreground transition-colors" aria-label="GitHub">
                                <FaGithub className="w-5 h-5" />
                            </a>
                            <a href="mailto:contact@arthub.com" className="text-muted hover:text-foreground transition-colors" aria-label="Email">
                                <Mail className="w-5 h-5" />
                            </a>
                        </div>
                        <a href="mailto:contact@arthub.com" className="text-sm font-medium text-muted hover:text-pink-600 dark:hover:text-pink-400 transition-colors">
                            contact@arthub.com
                        </a>
                    </div>
                </div>

                <div className="pt-8 border-t border-border flex flex-col justify-center items-center">
                    <p className="text-sm font-medium text-muted text-center">
                        © {new Date().getFullYear()} ArtHub. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;