"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Info
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const pathname = usePathname();

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

  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        const userStr = localStorage.getItem("user");
        if (token && userStr) {
          try {
            setCurrentUser(JSON.parse(userStr));
          } catch {
            setCurrentUser({ name: "Driver", email: "" });
          }
        } else if (token) {
          setCurrentUser({ name: "Driver", email: "" });
        } else {
          setCurrentUser(null);
        }
      }
    };

    checkAuth();
    window.addEventListener("auth-changed", checkAuth);
    return () => window.removeEventListener("auth-changed", checkAuth);
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setCurrentUser(null);
      window.dispatchEvent(new Event("auth-changed"));
    }
  };

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
    { name: "About Us", href: "/about", icon: Info },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/40 py-3"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo on the Left */}
          <Link
            href="/"
            className="flex items-center gap-3 group transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-blue-500/25">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Car className="w-5 h-5 text-blue-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                Drive<span className="text-blue-500">Vue</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-md">
                AI
              </span>
            </div>
          </Link>

          {/* Centered Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/70 border border-slate-800/90 rounded-full px-4 py-1.5 backdrop-blur-md shadow-inner shadow-black/20">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href === "/my-bookings" && pathname === "/bookings");
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-blue-600/30 border border-blue-500/40 shadow-sm"
                      : link.highlight
                      ? "text-blue-300 hover:text-white hover:bg-blue-500/10"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/70"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-3.5 h-3.5 ${
                        link.highlight
                          ? "text-cyan-400 animate-pulse"
                          : isActive
                          ? "text-blue-400"
                          : "text-slate-400"
                      }`}
                    />
                  )}
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="relative flex h-2 w-2 ml-0.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons on the Right */}
          <div className="hidden md:flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-sm text-slate-200">
                  <div className="w-6 h-6 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-bold">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="font-medium max-w-[120px] truncate">{currentUser.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-slate-800 hover:border-red-500/30 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900/80 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-4 h-4 text-slate-400" />
                  <span>Sign In</span>
                </Link>

                <Link
                  href="/register"
                  className="relative px-5 py-2 rounded-xl text-sm font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center gap-1.5"
                >
                  <span>Sign Up</span>
                  <ChevronRight className="w-4 h-4 opacity-80" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-red-400" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-3 rounded-2xl bg-slate-950/95 border border-slate-800/90 backdrop-blur-2xl p-4 shadow-2xl shadow-black/80 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href === "/my-bookings" && pathname === "/bookings");
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-600/20 text-cyan-300 border border-blue-500/30"
                        : "text-slate-300 hover:bg-slate-900 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {Icon && (
                        <Icon
                          className={`w-4 h-4 ${
                            link.highlight ? "text-cyan-400" : "text-slate-400"
                          }`}
                        />
                      )}
                      <span>{link.name}</span>
                    </div>
                    {link.highlight ? (
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-blue-500/20 text-blue-300 rounded border border-blue-500/30">
                        AI
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-slate-500" />
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-slate-800/80 my-3 pt-3 flex flex-col gap-2">
              {currentUser ? (
                <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400 text-xs font-bold">
                      <User className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-white">{currentUser.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="text-xs text-red-400 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors"
                  >
                    <LogIn className="w-4 h-4 text-slate-400" />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-md shadow-blue-600/30 transition-all"
                  >
                    <span>Sign Up / Register</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
