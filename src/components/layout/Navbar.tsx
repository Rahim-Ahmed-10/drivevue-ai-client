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
  UserPlus, 
  ChevronRight
} from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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

  const navLinks = [
    { name: "Home", href: "/", icon: null },
    { name: "Cars", href: "/cars", icon: Car },
    { 
      name: "AI Assistant", 
      href: "/ai-assistant", 
      icon: Sparkles,
      highlight: true 
    },
    { name: "My Bookings", href: "/bookings", icon: CalendarDays },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/30 py-3.5"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02]"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Car className="w-5 h-5 text-cyan-400 group-hover:text-blue-400 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black tracking-tight text-white">
                  Drive<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-cyan-400">Vue</span>
                </span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-md">
                  AI
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 border border-slate-800/80 rounded-full px-3 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              const Icon = link.icon;

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "text-white bg-indigo-600/30 border border-indigo-500/40 shadow-sm"
                      : link.highlight
                      ? "text-cyan-300 hover:text-cyan-200 hover:bg-cyan-500/10"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`w-4 h-4 ${
                        link.highlight
                          ? "text-cyan-400 animate-pulse"
                          : isActive
                          ? "text-indigo-400"
                          : "text-slate-400"
                      }`}
                    />
                  )}
                  <span>{link.name}</span>
                  {link.highlight && (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Auth CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-900 transition-colors flex items-center gap-1.5"
            >
              <LogIn className="w-4 h-4 text-slate-400" />
              <span>Login</span>
            </Link>

            <Link
              href="/register"
              className="relative group overflow-hidden px-4 py-2 rounded-xl text-sm font-semibold text-white shadow-md shadow-indigo-600/30 transition-all duration-300 hover:shadow-indigo-500/50 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 transition-all duration-300 group-hover:opacity-90"></div>
              <span className="relative flex items-center gap-1.5">
                <UserPlus className="w-4 h-4" />
                <span>Register</span>
              </span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
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
          <div className="md:hidden mt-3 rounded-2xl bg-slate-950/95 border border-slate-800/90 backdrop-blur-2xl p-4 shadow-2xl shadow-black/70 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="flex flex-col gap-1.5">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-indigo-600/20 text-cyan-300 border border-indigo-500/30"
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
                      <span className="px-2 py-0.5 text-[10px] font-semibold uppercase bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30">
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
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-medium text-slate-200 bg-slate-900 hover:bg-slate-850 border border-slate-800 transition-colors"
              >
                <LogIn className="w-4 h-4 text-slate-400" />
                <span>Login</span>
              </Link>
              <Link
                href="/register"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 shadow-md shadow-indigo-600/30 hover:opacity-95 transition-opacity"
              >
                <UserPlus className="w-4 h-4" />
                <span>Register / Get Started</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
