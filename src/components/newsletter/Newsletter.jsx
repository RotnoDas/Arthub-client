"use client";

import { FaEnvelope, FaPaperPlane } from "react-icons/fa";

export default function Newsletter() {
    return (
        <section className="relative py-24 bg-slate-50/50 dark:bg-transparent overflow-hidden border-t border-border/50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full relative z-10">
                <div className="bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 dark:from-indigo-950 dark:via-slate-950 dark:to-black rounded-[3rem] overflow-hidden relative shadow-2xl">
                    {/* Decorative Elements */}
                    <div className="absolute top-[-50%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/30 rounded-full blur-[120px] pointer-events-none" />
                    <div className="absolute bottom-[-50%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[100px] pointer-events-none" />

                    <div className="relative z-10 px-8 py-16 md:px-16 md:py-24 flex flex-col lg:flex-row items-center justify-between gap-12">
                        <div className="max-w-2xl text-center lg:text-left space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-widest mx-auto lg:mx-0 border border-indigo-500/30">
                                <FaEnvelope /> Stay Updated
                            </div>
                            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter text-white">
                                Join the ArtHub <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">Community</span>
                            </h2>
                            <p className="text-indigo-200/80 font-medium text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                                Subscribe to our weekly newsletter for exclusive early access to new artworks, featured artist interviews, and creative insights delivered straight to your inbox.
                            </p>
                        </div>

                        <div className="w-full max-w-md">
                            <form className="bg-white/10 backdrop-blur-xl p-2 rounded-2xl border border-white/10 flex flex-col sm:flex-row gap-2 shadow-2xl" onSubmit={(e) => e.preventDefault()}>
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    className="w-full bg-transparent text-white placeholder:text-white/50 px-6 py-4 outline-none text-sm font-medium focus:ring-0 rounded-xl"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-indigo-500/25 whitespace-nowrap"
                                >
                                    Subscribe <FaPaperPlane size={14} />
                                </button>
                            </form>
                            <p className="text-xs text-indigo-300/60 mt-4 text-center lg:text-left font-medium">
                                We respect your privacy. Unsubscribe at any time.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
