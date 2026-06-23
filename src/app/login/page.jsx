"use client";

import Logo from '@/components/logo/Logo';
import { Button, Input, Form, TextField, Label, FieldError } from '@heroui/react';
import Link from 'next/link';
import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        const { data: signInData, error: signInError } = await authClient.signIn.email({
            email: data.email,
            password: data.password
        });

        if (signInError) {
            toast.error(signInError.message || "Invalid credentials. Please try again.");
            setIsLoading(false);
        } else {
            toast.success("Welcome back!");
            // Role-based redirection
            const userRole = signInData?.user?.role;
            if (userRole === "artist") {
                window.location.href = "/artist-dashboard";
            } else if (userRole === "admin") {
                window.location.href = "/admin-dashboard";
            } else {
                window.location.href = "/";
            }
        }
        // }
    };

    const handleGoogleSignIn = async () => {
        const loadingToast = toast.loading("Redirecting to Google...");
        const { data, error } = await authClient.signIn.social({
            provider: "google",
        });

        if (error) {
            toast.error(error.message || "Google sign in failed.", { id: loadingToast });
        } else {
            // Because the page immediately redirects to Google, the success toast is brief.
            toast.success("Redirecting...", { id: loadingToast });
        }
    };

    return (
        <div className="flex min-h-screen bg-background">
            {/* Left Panel - High-End Abstract Art Showcase */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center bg-zinc-950">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=2671&auto=format&fit=crop"
                        alt="Art Gallery Exhibit"
                        className="w-full h-full object-cover opacity-50 transition-transform duration-[20s] hover:scale-110"
                        fill
                        priority
                    />
                    {/* Gradient Overlay for text readability */}
                    <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent"></div>
                </div>

                <div className="relative z-10 p-12 xl:p-20 flex flex-col items-center text-center mt-auto mb-16 xl:mb-24">
                    <div className="backdrop-blur-xl bg-black/20 p-8 xl:p-12 rounded-[2rem] xl:rounded-[3rem] border border-white/10 shadow-2xl">
                        <h2 className="text-4xl xl:text-5xl font-semibold text-white tracking-tight leading-tight">
                            Welcome back to <br /> <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-indigo-400 italic">brilliance</span>
                        </h2>
                        <p className="mt-5 xl:mt-8 text-zinc-300/80 max-w-md xl:max-w-lg text-lg xl:text-xl font-medium leading-relaxed">
                            Log in to access your curated collection, follow your favorite artists, and discover new masterpieces.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Panel - Minimalist Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 lg:p-20 xl:p-32 relative">
                <div className="w-full max-w-sm sm:max-w-md xl:max-w-lg">
                    <div className="mb-10 sm:mb-12 lg:hidden flex justify-center">
                        <Logo />
                    </div>

                    <div className="mb-8 sm:mb-10 xl:mb-12">
                        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-foreground">Welcome back</h1>
                        <p className="text-default-500 mt-2 sm:mt-3 text-sm sm:text-base">Enter your credentials to access your account.</p>
                    </div>

                    <Form validationBehavior="native" onSubmit={onSubmit} className="space-y-6 w-full">
                        <TextField
                            isRequired
                            name="email"
                            type="email"
                            className="w-full"
                            validate={(value) => {
                                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                                    return "Please enter a valid email address";
                                }
                                return null;
                            }}
                        >
                            <Label className="text-sm font-medium text-foreground mb-1 block">Email Address</Label>
                            <Input placeholder="e.g. john@example.com" className="w-full bg-transparent border-b-2 border-default-200 hover:border-default-400 focus-within:border-foreground py-2 outline-none transition-colors text-foreground" />
                            <FieldError className="text-danger text-xs mt-1 block" />
                        </TextField>

                        <TextField
                            isRequired
                            name="password"
                            type="password"
                            className="w-full"
                        >
                            <Label className="text-sm font-medium text-foreground mb-1 block">Password</Label>
                            <Input placeholder="Enter your password" type="password" className="w-full bg-transparent border-b-2 border-default-200 hover:border-default-400 focus-within:border-foreground py-2 outline-none transition-colors text-foreground" />
                            <FieldError className="text-danger text-xs mt-1 block" />
                        </TextField>

                        <div className="flex justify-end pt-1">
                            <Link href="/forgot-password" className="text-sm text-foreground font-medium hover:underline transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-foreground text-background font-medium h-12 mt-8 transition-all hover:scale-[1.01] active:scale-95"
                            radius="full"
                            isLoading={isLoading}
                        >
                            Log In
                        </Button>
                    </Form>

                    <div className="flex items-center my-8">
                        <div className="flex-1 border-t border-default-200" />
                        <span className="mx-4 text-xs text-default-400 uppercase tracking-widest font-medium">Or continue with</span>
                        <div className="flex-1 border-t border-default-200" />
                    </div>

                    <Button
                        onClick={handleGoogleSignIn}
                        variant="bordered"
                        className="w-full border-default-200 hover:bg-default-50 text-foreground font-medium h-12 transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2"
                        radius="full"
                    >
                        <FcGoogle className="text-2xl" />
                        Continue with Google
                    </Button>

                    <p className="text-center text-sm text-default-500 mt-10">
                        Do not have an account?{" "}
                        <Link href="/register" className="text-foreground font-semibold hover:underline transition-colors ml-1">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;