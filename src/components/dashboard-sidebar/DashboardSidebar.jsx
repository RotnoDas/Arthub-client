"use client";
import React from "react";
import Logo from "../logo/Logo";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaHome, FaPalette, FaHistory, FaUser, FaUsers, FaSignOutAlt,
  FaPlus, FaChartLine, FaLayerGroup, FaExchangeAlt, FaShoppingBag, FaTimes
} from "react-icons/fa";
import { authClient, useSession } from "@/lib/auth-client";
import toast from "react-hot-toast";

const DashboardSidebar = ({ isOpen, setIsOpen }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const id = toast.loading("Signing out...");
    await authClient.signOut();
    toast.success("Signed out!", { id });
    router.push("/login");
  };

  const artistMenu = [
    { key: "overview", label: "Overview", icon: FaHome, href: "/dashboard/artist" },
    { key: "add-artwork", label: "Add Artwork", icon: FaPlus, href: "/dashboard/artist/add-artwork" },
    { key: "manage-artworks", label: "Manage Artworks", icon: FaLayerGroup, href: "/dashboard/artist/manage-artworks" },
    { key: "sales-history", label: "Sales History", icon: FaHistory, href: "/dashboard/artist/sales" },
    { key: "profile", label: "Profile", icon: FaUser, href: "/dashboard/artist/profile" },
  ];

  const userMenu = [
    { key: "overview", label: "Overview", icon: FaHome, href: "/dashboard/user" },
    { key: "purchases", label: "Purchase History", icon: FaShoppingBag, href: "/dashboard/user/purchases" },
    { key: "collection", label: "My Collection", icon: FaPalette, href: "/dashboard/user/collection" },
    { key: "profile", label: "Profile Settings", icon: FaUser, href: "/dashboard/user/profile" },
  ];

  const adminMenu = [
    { key: "analytics", label: "Analytics", icon: FaChartLine, href: "/dashboard/admin" },
    { key: "users", label: "Manage Users", icon: FaUsers, href: "/dashboard/admin/users" },
    { key: "artworks", label: "All Artworks", icon: FaLayerGroup, href: "/dashboard/admin/artworks" },
    { key: "transactions", label: "Transactions", icon: FaExchangeAlt, href: "/dashboard/admin/transactions" },
  ];

  const role = session?.user?.role;
  const menuItems = role === "artist" ? artistMenu : role === "admin" ? adminMenu : userMenu;

  const isActive = (href) => {
    if (href === `/dashboard/${role}` || href === `/dashboard/admin`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const roleColor = role === "admin" ? "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-500/10" : role === "artist" ? "text-accent-secondary bg-indigo-100 dark:bg-indigo-500/10" : "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-500/10";
  const activeBg = role === "admin" ? "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30" : role === "artist" ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-200 dark:border-indigo-500/30" : "bg-pink-50 dark:bg-pink-500/10 text-pink-700 dark:text-pink-400 border-pink-200 dark:border-pink-500/30";
  const activeIcon = role === "admin" ? "bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400" : role === "artist" ? "bg-indigo-100 dark:bg-indigo-500/20 text-accent-secondary" : "bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside className={`fixed lg:sticky top-0 inset-y-0 left-0 z-50 w-64 h-screen shrink-0 border-r border-border bg-background transition-transform duration-300 lg:translate-x-0 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="h-full flex flex-col bg-background transition-colors duration-300">

          {/* Brand */}
          <div className="px-6 py-5 border-b border-border flex items-center justify-between">
            <Logo />
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-2 -mr-2 rounded-xl text-muted hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="px-4 py-4 border-b border-border">
            <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-surface-solid border border-slate-100 dark:border-slate-700/50">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-pink-200 dark:border-pink-500/30 shrink-0">
                <Image
                  width={40}
                  height={40}
                  unoptimized
                  src={session?.user?.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(session?.user?.name || "U")}&background=fbcfe8&color=be185d&bold=true`}
                  alt="Avatar"
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="overflow-hidden flex-1">
                <p className="text-foreground text-sm font-bold truncate leading-tight">{session?.user?.name}</p>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md ${roleColor}`}>
                  {role}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest px-3 pb-3">Menu</p>
            {menuItems.map(({ key, label, icon: Icon, href }) => {
              const active = isActive(href);
              return (
                <Link
                  key={key}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 border ${active
                    ? `${activeBg}`
                    : "text-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 border-transparent"
                    }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${active ? activeIcon : "bg-surface-solid text-muted"}`}>
                    <Icon size={15} />
                  </span>
                  <span>{label}</span>
                  {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-current opacity-70 shrink-0" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom Links */}
          <div className="px-3 py-4 border-t border-border space-y-1">
            <Link href="/" onClick={() => setIsOpen(false)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-150 border border-transparent">
              <span className="w-8 h-8 rounded-lg bg-surface-solid flex items-center justify-center shrink-0">
                <FaHome size={13} />
              </span>
              Back to Site
            </Link>
            <button
              onClick={() => {
                setIsOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-muted hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all duration-150 cursor-pointer border border-transparent"
            >
              <span className="w-8 h-8 rounded-lg bg-surface-solid flex items-center justify-center shrink-0">
                <FaSignOutAlt size={13} />
              </span>
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;