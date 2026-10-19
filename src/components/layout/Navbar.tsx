"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CarFront,
  Sparkles,
  CalendarDays,
  Info,
  Menu,
  X,
  LogIn,
  LogOut,
  UserRound,
  ChevronDown,
  LayoutDashboard,
  ShieldCheck,
  UserCircle,
  ArrowRight,
} from "lucide-react";

type CurrentUser = {
  name: string;
  email: string;
  role?: string;
};

const navLinks = [
  { name: "Home", href: "/", icon: null },
  { name: "Cars", href: "/cars", icon: CarFront },
  { name: "AI Assistant", href: "/ai-assistant", icon: Sparkles },
  { name: "My Bookings", href: "/my-bookings", icon: CalendarDays },
  { name: "About Us", href: "/about-us", icon: Info },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);

  const profileRef = useRef<HTMLDivElement>(null);

  const isAdminRoute =
    pathname?.startsWith("/admin") || pathname === "/dashboard";

  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Authentication state
  useEffect(() => {
    const checkAuth = () => {
      const token =
        localStorage.getItem("token") || localStorage.getItem("auth_token");

      const userStr = localStorage.getItem("user");

      if (!token) {
        setCurrentUser(null);
        return;
      }

      if (userStr) {
        try {
          const user = JSON.parse(userStr);

          setCurrentUser({
            name: user.name || user.fullName || "Driver",
            email: user.email || "",
            role: user.role,
          });
        } catch {
          setCurrentUser({
            name: "Driver",
            email: "",
            role: "USER",
          });
        }
      } else {
        setCurrentUser({
          name: "Driver",
          email: "",
          role: "USER",
        });
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

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  // Logout modal: close with ESC + lock page scroll while open
  useEffect(() => {
    if (!logoutModalOpen) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLogoutModalOpen(false);
    };

    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [logoutModalOpen]);

  if (isAdminRoute) return null;

  // Opens the confirmation modal
  const openLogoutModal = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    setLogoutModalOpen(true);
  };

  // Actual logout
  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");

    setCurrentUser(null);
    setLogoutModalOpen(false);

    window.dispatchEvent(new Event("auth-changed"));
    router.push("/");
  };

  return (
    <>
      <header
        className={[
          "fixed inset-x-0 top-0 z-50",
          "transition-all duration-300",
          isScrolled
            ? "border-b border-slate-800/80 bg-[#070b14]/95 py-3 shadow-lg shadow-black/20 backdrop-blur-2xl"
            : "border-b border-white/[0.06] bg-[#070b14]/75 py-4 backdrop-blur-xl",
        ].join(" ")}
      >
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="flex h-12 items-center justify-between gap-4">
            {/* Logo */}
            <Link
              href="/"
              aria-label="DriveVue AI Home"
              className="group flex shrink-0 items-center gap-2"
            >
              <span className="text-[25px] font-black tracking-tight text-white sm:text-[27px]">
                Drive
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Vue
                </span>
              </span>

              <span className="rounded-md border border-cyan-500/30 bg-cyan-500/10 px-1.5 py-1 text-[10px] font-extrabold text-cyan-300 transition-colors group-hover:bg-cyan-500/20">
                AI
              </span>
            </Link>

            {/* Desktop navigation */}
            <nav
              aria-label="Main navigation"
              className="hidden items-center gap-1 lg:flex"
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={[
                      "relative flex items-center gap-2 rounded-lg px-3 py-2.5",
                      "text-[13px] font-semibold transition-all duration-200 xl:px-4",
                      active
                        ? "bg-blue-600 text-white shadow-md shadow-blue-600/20"
                        : link.href === "/ai-assistant"
                          ? "text-cyan-300 hover:bg-cyan-400/[0.08] hover:text-cyan-200"
                          : "text-slate-300 hover:bg-white/[0.05] hover:text-white",
                    ].join(" ")}
                  >
                    {Icon && (
                      <Icon
                        size={16}
                        className={
                          active
                            ? "text-white"
                            : link.href === "/ai-assistant"
                              ? "text-cyan-400"
                              : "text-slate-400"
                        }
                      />
                    )}
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop account actions */}
            <div className="hidden shrink-0 items-center gap-3 lg:flex">
              {currentUser ? (
                <div className="relative" ref={profileRef}>
                  <button
                    type="button"
                    onClick={() => setProfileOpen(!profileOpen)}
                    aria-expanded={profileOpen}
                    className={[
                      "flex items-center gap-2.5 rounded-xl border px-3 py-2",
                      "transition-all duration-200",
                      profileOpen
                        ? "border-cyan-500/40 bg-slate-800"
                        : "border-slate-700/70 bg-slate-900/70 hover:border-slate-600 hover:bg-slate-800/80",
                    ].join(" ")}
                  >
                    <span
                      className={[
                        "flex h-9 w-9 items-center justify-center rounded-lg border",
                        isAdmin
                          ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                          : "border-blue-500/30 bg-blue-500/10 text-blue-300",
                      ].join(" ")}
                    >
                      {isAdmin ? (
                        <ShieldCheck size={19} />
                      ) : (
                        <UserRound size={19} />
                      )}
                    </span>

                    <span className="max-w-[100px] truncate text-sm font-semibold text-white">
                      {currentUser.name}
                    </span>

                    <ChevronDown
                      size={15}
                      className={[
                        "text-slate-400 transition-transform",
                        profileOpen ? "rotate-180" : "",
                      ].join(" ")}
                    />
                  </button>

                  {/* Profile dropdown */}
                  {profileOpen && (
                    <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-2xl border border-slate-700/80 bg-[#0b1120] p-2 shadow-2xl shadow-black/50">
                      <div className="mb-2 rounded-xl border border-slate-800 bg-slate-900/80 p-3">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                          Signed in as
                        </p>
                        <p className="mt-1 truncate text-sm font-bold text-white">
                          {currentUser.name}
                        </p>
                        <p className="mt-1 truncate text-xs text-slate-400">
                          {currentUser.email}
                        </p>
                      </div>

                      {isAdmin && (
                        <Link
                          href="/admin/dashboard"
                          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-amber-300 hover:bg-amber-500/10"
                        >
                          <LayoutDashboard size={17} />
                          Admin Dashboard
                        </Link>
                      )}

                      <Link
                        href="/profile"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white"
                      >
                        <UserCircle size={17} />
                        My Profile
                      </Link>

                      <Link
                        href="/my-bookings"
                        className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05] hover:text-white"
                      >
                        <CalendarDays size={17} />
                        My Bookings
                      </Link>

                      <div className="my-2 border-t border-slate-800" />

                      <button
                        type="button"
                        onClick={openLogoutModal}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-red-400 hover:bg-red-500/10"
                      >
                        <LogOut size={17} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-300 transition-colors hover:text-white"
                  >
                    <LogIn size={16} />
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    className="group flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cyan-500/20"
                  >
                    Get Started
                    <ArrowRight
                      size={15}
                      className="transition-transform group-hover:translate-x-0.5"
                    />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-slate-200 transition-colors hover:border-cyan-500/40 hover:text-cyan-300 lg:hidden"
            >
              {mobileOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>

          {/* Responsive mobile navigation */}
          {mobileOpen && (
            <div className="mt-3 rounded-2xl border border-slate-800 bg-[#0a101d]/98 p-3 shadow-2xl shadow-black/30 lg:hidden">
              <nav
                aria-label="Mobile navigation"
                className="flex flex-col gap-1"
              >
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = pathname === link.href;

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      onClick={() => setMobileOpen(false)}
                      className={[
                        "flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium transition-colors",
                        active
                          ? "bg-blue-600/15 text-blue-300"
                          : "text-slate-300 hover:bg-white/[0.05] hover:text-white",
                      ].join(" ")}
                    >
                      <span className="flex items-center gap-3">
                        {Icon && (
                          <Icon
                            size={18}
                            className={
                              link.href === "/ai-assistant"
                                ? "text-cyan-400"
                                : active
                                  ? "text-blue-300"
                                  : "text-slate-400"
                            }
                          />
                        )}
                        {link.name}
                      </span>

                      {active && (
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="my-3 border-t border-slate-800" />

              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-3 rounded-xl bg-slate-900/80 p-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-300">
                      {isAdmin ? (
                        <ShieldCheck size={20} />
                      ) : (
                        <UserRound size={20} />
                      )}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {currentUser.name}
                      </p>
                      <p className="truncate text-xs text-slate-400">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>

                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-amber-300 hover:bg-amber-500/10"
                    >
                      <LayoutDashboard size={17} />
                      Admin Dashboard
                    </Link>
                  )}

                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 hover:bg-white/[0.05]"
                  >
                    <UserCircle size={17} />
                    My Profile
                  </Link>

                  <button
                    type="button"
                    onClick={openLogoutModal}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10"
                  >
                    <LogOut size={17} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-slate-700 py-3 text-sm font-semibold text-slate-200 hover:bg-white/[0.05]"
                  >
                    <LogIn size={16} />
                    Sign In
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 py-3 text-sm font-bold text-white"
                  >
                    Sign Up
                    <ArrowRight size={15} />
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Logout confirmation modal (outside header to avoid backdrop-filter issues) */}
      {logoutModalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
          onClick={() => setLogoutModalOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-title"
        >
          <div
            className="w-full max-w-sm rounded-2xl border border-slate-700/80 bg-[#0b1120] p-6 shadow-2xl shadow-black/50"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">
              <LogOut size={22} />
            </div>

            <h2 id="logout-title" className="text-lg font-bold text-white">
              Sign out?
            </h2>
            <p className="mt-1.5 text-sm text-slate-400">
              Are you sure you want to sign out of your account?
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setLogoutModalOpen(false)}
                className="rounded-xl border border-slate-700 py-2.5 text-sm font-semibold text-slate-200 transition-colors hover:bg-white/[0.05]"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmLogout}
                className="rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition-colors hover:bg-red-500"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}