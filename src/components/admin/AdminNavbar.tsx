"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Bell,
    Search,
    ShieldCheck,
    Sparkles,
    Globe,
    Car,
    CalendarDays,
    Users,
    Settings,
    LayoutDashboard,
    ChevronRight,
    X
} from "lucide-react";

export default function AdminNavbar() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [adminUser, setAdminUser] = useState<{ name: string; email: string } | null>(null);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const u = localStorage.getItem("user");
            if (u) {
                try {
                    setAdminUser(JSON.parse(u));
                } catch {
                    setAdminUser({ name: "Md Rahim Miah", email: "admin@drivevue.ai" });
                }
            }
        }
    }, []);

    // Close search dropdown on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Sidebar navigation mapping for live search
    const searchableRoutes = [
        { name: "Overview Dashboard", description: "Telemetry, earnings, & system stats", href: "/admin/dashboard", icon: LayoutDashboard, category: "Navigation" },
        { name: "Fleet Management", description: "Manage cars, status & pricing", href: "/admin/cars", icon: Car, category: "Navigation" },
        { name: "Booking Requests", description: "Approve, cancel & review trips", href: "/admin/bookings", icon: CalendarDays, category: "Navigation" },
        { name: "User Management", description: "Driver accounts & privileges", href: "/admin/users", icon: Users, category: "Navigation" },
        { name: "System Settings", description: "Stripe, AI engine & notifications", href: "/admin/settings", icon: Settings, category: "Navigation" },
    ];

    const filteredResults = searchableRoutes.filter(
        (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSelect = (href: string) => {
        setIsOpen(false);
        setSearchQuery("");
        router.push(href);
    };

    return (
        <header className="sticky top-0 z-30 w-full h-16 bg-[#060b19]/90 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-6 flex items-center justify-between shadow-2xl">

            {/* Search Input Bar with Auto-Dropdown */}
            <div className="relative flex-1 max-w-md" ref={searchRef}>
                <div className="relative w-full">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setIsOpen(true);
                        }}
                        onFocus={() => setIsOpen(true)}
                        placeholder="Search fleet, bookings, users or sidebar settings..."
                        className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all shadow-inner"
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery("");
                                setIsOpen(false);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                        >
                            <X className="w-3.5 h-3.5" />
                        </button>
                    )}
                </div>

                {/* Live Search Suggestions Dropdown */}
                {isOpen && searchQuery.trim().length > 0 && (
                    <div className="absolute left-0 right-0 mt-2 rounded-2xl bg-[#090f20]/95 border border-slate-800 backdrop-blur-2xl shadow-2xl z-50 p-2 overflow-hidden animate-in fade-in duration-150">
                        <div className="px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 border-b border-slate-800/80 mb-1">
                            Sidebar Matching Items ({filteredResults.length})
                        </div>

                        {filteredResults.length > 0 ? (
                            <div className="space-y-1">
                                {filteredResults.map((result) => {
                                    const Icon = result.icon;
                                    return (
                                        <button
                                            key={result.href}
                                            onClick={() => handleSelect(result.href)}
                                            className="w-full text-left flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-600/20 hover:border-blue-500/30 border border-transparent transition-all group"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700/80 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400/50">
                                                    <Icon className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white group-hover:text-cyan-300">{result.name}</p>
                                                    <p className="text-[10px] text-slate-400">{result.description}</p>
                                                </div>
                                            </div>
                                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all" />
                                        </button>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="p-4 text-center text-xs text-slate-400">
                                No matching section found for <span className="text-white font-semibold">"{searchQuery}"</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Top Bar Badges */}
            <div className="flex items-center gap-3 sm:gap-4">
                <Link
                    href="/"
                    className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs font-semibold text-slate-300 hover:text-white transition-all shadow-sm"
                >
                    <Globe className="w-3.5 h-3.5 text-blue-400" />
                    <span>Live Site</span>
                </Link>

                <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-medium text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                    <span className="font-extrabold text-[10px] uppercase tracking-wider">AI Active</span>
                </div>

                <button
                    type="button"
                    className="relative p-2 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 hover:text-white hover:bg-slate-800 transition-all"
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
                </button>

                <div className="h-5 w-px bg-slate-800" />

                <div className="flex items-center gap-2.5 bg-slate-900/90 border border-amber-500/30 p-1 pr-3 rounded-2xl">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center justify-center font-bold text-xs">
                        <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="hidden sm:block text-left">
                        <p className="text-xs font-bold text-white leading-tight truncate">{adminUser?.name || "Md Rahim Miah"}</p>
                        <p className="text-[9px] text-amber-400 font-black uppercase tracking-wider">Super Admin</p>
                    </div>
                </div>
            </div>
        </header>
    );
}