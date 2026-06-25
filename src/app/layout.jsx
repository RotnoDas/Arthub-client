import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import { Providers } from "@/components/providers/Providers";

export const metadata = {
  title: "ArtHub",
  description: "Marketplace for artists",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300">
        <Providers>
          <Toaster position="top-center" toastOptions={{
              className: '!bg-white dark:!bg-slate-900 !text-slate-900 dark:!text-white !border !border-slate-200 dark:!border-white/10 shadow-xl',
              style: {
                  borderRadius: '12px',
                  padding: '16px',
              }
          }} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
