"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Car,
  Sparkles,
  CalendarDays,
  Menu,
  X,
  LogIn,
  LogOut,
  User,
  ChevronRight,
  Info,
  LayoutDashboard,
  ShieldCheck,
  ChevronDown,
  UserCircle,
  AlertTriangle,
  Loader2
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfilePopupOpen, setIsProfilePopupOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; role?: string } | null>(null);

  const pathname = usePathname();
  const popupRef = useRef<HTMLDivElement>(null);

  // 🔴 1. Hide Navbar completely when inside Admin / Dashboard routes
  const isAdminRoute = pathname?.startsWith("/admin") || pathname === "/dashboard";

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Sync auth state from localStorage
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token") || localStorage.getItem("auth_token");
        const userStr = localStorage.getItem("user");
        if (token && userStr) {
          try {
            setCurrentUser(JSON.parse(userStr));
          } catch {
            setCurrentUser({ name: "Driver", email: "", role: "USER" });
          }
        } else if (token) {
          setCurrentUser({ name: "Driver", email: "", role: "USER" });
        } else {
          setCurrentUser(null);
        }
      }
    };

    checkAuth();
    window.addEventListener("auth-changed", checkAuth);
    window.addEventListener("storage", checkAuth);
    return () => {
      window.removeEventListener("auth-changed", checkAuth);
      window.removeEventListener("storage", checkAuth);
    };
  }, [pathname]);

  // Close profile dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsProfilePopupOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openLogoutModal = () => {
    setIsProfilePopupOpen(false);
    setIsMobileMenuOpen(false);
    setIsLogoutModalOpen(true);
  };

  const confirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        setCurrentUser(null);
        window.dispatchEvent(new Event("auth-changed"));
      }
      setIsLoggingOut(false);
      setIsLogoutModalOpen(false);
    }, 1000);
  };

  // 🔴 2. Return null if current route is Admin/Dashboard
  if (isAdminRoute) {
    return null;
  }

  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  // Clean Navigation Bar Links
  const navLinks = [
    { name: "Home", href: "/", icon: null },
    { name: "Cars", href: "/cars", icon: Car },
    {
      name: "AI Assistant",
      href: "/ai-assistant",
      icon: Sparkles,
      highlight: true
    },
    { name: "My Bookings", href: "/my-bookings", icon: CalendarDays },
    { name: "About Us", href: "/about-us", icon: Info },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? "bg-[#060913]/90 backdrop-blur-2xl border-b border-slate-800/80 shadow-2xl shadow-black/70 py-3"
            : "bg-gradient-to-b from-[#060913]/90 to-transparent py-5"
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">

            {/* Extremely Clear Ultra-Sharp Logo */}
            <Link
              href="/"
              className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
            >
              <div className="relative w-11 h-11 p-0.5 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-400 to-indigo-600 shadow-lg shadow-blue-500/25 group-hover:shadow-cyan-400/40 transition-all">
                <div className="w-full h-full bg-[#090d16] rounded-[14px] flex items-center justify-center overflow-hidden p-1">
                  <Image
                    src="/DriveVue AI_ Neon Motion Logo.png"
                    alt="DriveVue AI"
                    width={90}
                    height={90}
                    className="object-contain w-full h-full filter drop-shadow-[0_0_6px_rgba(59,130,246,0.8)]"
                    priority
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-white font-sans">
                  Drive<span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Vue</span>
                </span>
                <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-widest bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 rounded-lg shadow-[0_0_12px_rgba(6,182,212,0.25)]">
                  AI
                </span>
              </div>
            </Link>

            {/* Centered Modern Pill Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 bg-[#0d1322]/80 border border-slate-800/90 rounded-full px-4 py-1.5 backdrop-blur-xl shadow-inner shadow-black/50">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`relative flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all duration-200 ${isActive
                        ? "text-white bg-gradient-to-r from-blue-600 to-blue-500 shadow-md shadow-blue-500/30 border border-blue-400/40"
                        : link.highlight
                          ? "text-cyan-300 hover:text-white hover:bg-cyan-500/10"
                          : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                      }`}
                  >
                    {Icon && (
                      <Icon
                        className={`w-3.5 h-3.5 ${link.highlight
                            ? "text-cyan-400 animate-pulse"
                            : isActive
                              ? "text-white"
                              : "text-slate-400"
                          }`}
                      />
                    )}
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Profile / Admin Popup Access */}
            <div className="hidden md:flex items-center gap-3">
              {currentUser ? (
                <div className="relative" ref={popupRef}>
                  <button
                    type="button"
                    onClick={() => setIsProfilePopupOpen(!isProfilePopupOpen)}
                    className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-2xl bg-[#0d1322] hover:bg-[#131b2e] border ${isAdmin ? "border-amber-500/40 shadow-lg shadow-amber-500/10 hover:border-amber-500/70" : "border-slate-800 hover:border-slate-700"
                      } text-xs text-slate-200 transition-all focus:outline-none`}
                  >
                    <div className={`w-7 h-7 rounded-xl ${isAdmin
                        ? "bg-amber-500/20 border border-amber-500/50 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                        : "bg-blue-600/25 border border-blue-500/40 text-blue-400"
                      } flex items-center justify-center font-bold`}>
                      {isAdmin ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-100 max-w-[110px] truncate">{currentUser.name}</span>
                      {isAdmin && (
                        <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isProfilePopupOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Profile Popup Menu with Dashboard Option */}
                  {isProfilePopupOpen && (
                    <div className="absolute right-0 mt-2.5 w-64 rounded-2xl bg-[#090d16]/95 border border-slate-800 backdrop-blur-2xl p-2 shadow-2xl shadow-black z-50 animate-in fade-in slide-in-from-top-2 duration-150">

                      {/* User Info Header */}
                      <div className="px-3.5 py-3 mb-1.5 rounded-xl bg-[#0f172a]/90 border border-slate-800/80">
                        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Account</p>
                        <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                        <p className="text-xs text-slate-400 truncate">{currentUser.email || "admin@drivevue.com"}</p>
                      </div>

                      <div className="space-y-1">
                        {/* Single Primary Dashboard Option */}
                        {isAdmin && (
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsProfilePopupOpen(false)}
                            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 transition-all shadow-sm"
                          >
                            <LayoutDashboard className="w-4 h-4 text-amber-400" />
                            <span>Admin Dashboard</span>
                          </Link>
                        )}

                        <Link
                          href="/profile"
                          onClick={() => setIsProfilePopupOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all"
                        >
                          <UserCircle className="w-4 h-4 text-blue-400" />
                          <span>My Profile</span>
                        </Link>

                        <Link
                          href="/my-bookings"
                          onClick={() => setIsProfilePopupOpen(false)}
                          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all"
                        >
                          <CalendarDays className="w-4 h-4 text-cyan-400" />
                          <span>My Bookings</span>
                        </Link>

                        <div className="border-t border-slate-800/80 my-1"></div>

                        <button
                          type="button"
                          onClick={openLogoutModal}
                          className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-500/10 transition-all"
                        >
                          <LogOut className="w-4 h-4 text-red-400" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all flex items-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5 text-slate-400" />
                    <span>Sign In</span>
                  </Link>

                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-lg shadow-blue-500/25 hover:shadow-cyan-400/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-1.5"
                  >
                    <span>Sign Up</span>
                    <ChevronRight className="w-3.5 h-3.5 opacity-90" />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Toggle Button */}
            <div className="flex md:hidden items-center gap-2">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2.5 rounded-xl bg-[#0d1322] border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5 text-red-400" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="md:hidden mt-3 rounded-2xl bg-[#090d16]/95 border border-slate-800/90 backdrop-blur-2xl p-4 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex flex-col gap-1.5">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-xs font-medium transition-colors ${isActive
                          ? "bg-blue-600/20 text-cyan-300 border border-blue-500/30"
                          : "text-slate-300 hover:bg-slate-900 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        {Icon && <Icon className={`w-4 h-4 ${link.highlight ? "text-cyan-400" : "text-slate-400"}`} />}
                        <span>{link.name}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    </Link>
                  );
                })}
              </div>

              <div className="border-t border-slate-800/80 my-3 pt-3 flex flex-col gap-2">
                {currentUser ? (
                  <div className="flex flex-col gap-2 p-3 rounded-xl bg-[#0d1322] border border-slate-800">
                    <p className="text-xs font-bold text-white">{currentUser.name}</p>
                    {isAdmin && (
                      <Link
                        href="/admin/dashboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center gap-2 py-2 px-3 rounded-lg bg-amber-500/10 text-amber-300 text-xs font-semibold"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={openLogoutModal}
                      className="flex items-center gap-2 py-2 px-3 rounded-lg bg-red-500/10 text-red-400 text-xs font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 shadow-md"
                  >
                    <span>Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Confirmation Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-3xl bg-[#0d1322] border border-slate-800 p-6 shadow-2xl text-center">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
              <AlertTriangle className="w-7 h-7 animate-bounce" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">Confirm Sign Out</h3>
            <p className="text-xs text-slate-400 mb-6">Are you sure you want to sign out?</p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700/80 transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLoggingOut}
                onClick={confirmLogout}
                className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2"
              >
                {isLoggingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign Out"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}