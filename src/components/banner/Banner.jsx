"use client";
import React from 'react';
import { Button } from "@heroui/react";
import { ArrowRight, Sparkles, Palette, Globe } from "lucide-react";
import Image from "next/image";
import { Swiper, SwiperSlide } from 'swiper/react';
import { motion } from "motion/react";
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation, Autoplay, EffectFade } from 'swiper/modules';

const slideData = [
    {
        tag: "The Premier Art Hub",
        tagIcon: <Palette className="w-4 h-4" />,
        title: "Discover & Buy ",
        highlight: "Original Art",
        titleEnd: "",
        desc: "Welcome to ArtHub. Browse stunning digital creations from independent artists, purchase exclusive masterpieces, and discover premium talent.",
        img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
        primaryBtn: "Browse Artworks",
        primaryLink: "/artworks",
        secondaryBtn: "Login to ArtHub",
        secondaryLink: "/login"
    },
    {
        tag: "Empowering Creators",
        tagIcon: <Sparkles className="w-4 h-4 text-fuchsia-600" />,
        title: "Upload & Monetize ",
        highlight: "Your Talent",
        titleEnd: "",
        desc: "Join thousands of artists globally. Upload your portfolio, set your own prices, and earn directly from collectors without any hassle.",
        img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop",
        primaryBtn: "Upload Artwork",
        primaryLink: "/dashboard",
        secondaryBtn: "Register as Artist",
        secondaryLink: "/register"
    },
    {
        tag: "A Vibrant Community",
        tagIcon: <Globe className="w-4 h-4 text-violet-600" />,
        title: "Support Independent ",
        highlight: "Visionaries",
        titleEnd: "",
        desc: "ArtHub connects you directly with creators. Purchase their original digital art, explore fresh drops, and build your ultimate personal collection.",
        img: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop",
        primaryBtn: "Explore Gallery",
        primaryLink: "/artworks",
        secondaryBtn: "Create Account",
        secondaryLink: "/register"
    }
];

const Banner = () => {
    return (
        <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-white dark:bg-transparent">
            {/* Soft Light Theme Background with Pastel Blurs */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 -z-20" />
            <div className="absolute top-[-10%] right-[-5%] w-150 h-150 bg-fuchsia-200/50 dark:bg-fuchsia-900/20 rounded-full blur-[120px] -z-10 animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-5%] w-150 h-150 bg-indigo-200/50 dark:bg-indigo-900/20 rounded-full blur-[120px] -z-10" />

            <Swiper
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 6000, disableOnInteraction: false }}
                modules={[Pagination, Navigation, Autoplay]}
                className="w-full h-full"
            >
                {slideData.map((slide, index) => (
                    <SwiperSlide key={index} className="flex items-center pt-24 pb-32">
                        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 w-full">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                {/* Left Content: Text & Buttons */}
                                <div className="space-y-8 text-center lg:text-left">
                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8 }}
                                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-fuchsia-200 dark:border-fuchsia-500/30 bg-fuchsia-50 dark:bg-fuchsia-500/10 text-fuchsia-800 dark:text-fuchsia-400 text-xs font-bold uppercase tracking-widest mx-auto lg:mx-0 shadow-sm"
                                    >
                                        {slide.tagIcon} {slide.tag}
                                    </motion.div>

                                    <motion.h1
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.1 }}
                                        className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter text-foreground leading-[1.15]"
                                    >
                                        {slide.title}
                                        <span className="bg-linear-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block mt-2">
                                            {slide.highlight}
                                        </span>
                                        {slide.titleEnd}
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="text-muted text-lg md:text-xl leading-relaxed max-w-xl mx-auto lg:mx-0 font-medium"
                                    >
                                        {slide.desc}
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 30 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: 0.3 }}
                                        className="flex flex-col sm:flex-row justify-center lg:justify-start items-center gap-5 pt-4"
                                    >
                                        <Link href={slide.primaryLink}>
                                            <Button
                                                className="bg-linear-to-r from-fuchsia-600 to-indigo-600 text-white font-bold h-14 px-8 text-md shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-105 transition-all w-full sm:w-auto"
                                                radius="full"
                                            >
                                                {slide.primaryBtn} <ArrowRight className="ml-2 w-5 h-5" />
                                            </Button>
                                        </Link>
                                        <Link href={slide.secondaryLink}>
                                            <Button
                                                variant="bordered"
                                                className="border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-400 dark:hover:border-slate-600 text-foreground font-semibold h-14 px-8 text-md w-full sm:w-auto border-2 group transition-all"
                                                radius="full"
                                            >
                                                {slide.secondaryBtn}
                                            </Button>
                                        </Link>
                                    </motion.div>
                                </div>

                                {/* Right Content: Image */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="relative group hidden lg:block"
                                >
                                    <div className="absolute -inset-2 bg-linear-to-r from-fuchsia-200 to-indigo-300 rounded-[3rem] blur-xl opacity-50 dark:opacity-20 group-hover:opacity-80 transition duration-1000"></div>
                                    <div className="relative bg-background p-2 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-4/5 border border-border">
                                        <Image
                                            src={slide.img}
                                            alt={slide.tag}
                                            fill
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            priority={index === 0}
                                            className="rounded-[2rem] object-cover transform transition duration-1000 group-hover:scale-110"
                                        />
                                        
                                        {/* Minimalist Floating Overlay */}
                                        <div className="absolute bottom-6 left-6 right-6 bg-surface backdrop-blur-xl p-5 rounded-2xl border border-white/40 dark:border-slate-800 shadow-2xl">
                                            <div className="flex items-center gap-4">
                                                <div className="flex -space-x-4">
                                                    {[1, 2, 3].map((i) => (
                                                        <Image
                                                            key={i}
                                                            src={`https://i.pravatar.cc/100?img=${i + 30}`}
                                                            width={44}
                                                            height={44}
                                                            className="w-11 h-11 rounded-full border-2 border-white dark:border-slate-900 shadow-sm"
                                                            alt="avatar"
                                                        />
                                                    ))}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-foreground tracking-wide">Join 50k+ Collectors</p>
                                                    <p className="text-xs text-accent-secondary font-semibold mt-0.5">Discover new art daily</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </section>
    );
};

export default Banner;