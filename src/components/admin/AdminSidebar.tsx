"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Car,
  CalendarDays,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ShieldCheck,
  X,
  Sparkles
} from "lucide-react";

export interface AdminSidebarProps {
  isCollapsed?: boolean;
  setIsCollapsed?: (collapsed: boolean) => void;
  mobileOpen?: boolean;
  setMobileOpen?: (open: boolean) => void;
  bookingBadgeCount?: number;
}

export default function AdminSidebar({
  isCollapsed: controlledCollapsed,
  setIsCollapsed: setControlledCollapsed,
  mobileOpen: controlledMobileOpen,
  setMobileOpen: setControlledMobileOpen,
  bookingBadgeCount = 0,
}: AdminSidebarProps) {
  const pathname = usePathname();

  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [internalMobileOpen, setInternalMobileOpen] = useState(false);

  const isCollapsed = controlledCollapsed !== undefined ? controlledCollapsed : internalCollapsed;
  const toggleCollapse = () => {
    if (setControlledCollapsed) {
      setControlledCollapsed(!isCollapsed);
    } else {
      setInternalCollapsed(!isCollapsed);
    }
  };

  const isMobileOpen = controlledMobileOpen !== undefined ? controlledMobileOpen : internalMobileOpen;
  const closeMobile = () => {
    if (setControlledMobileOpen) {
      setControlledMobileOpen(false);
    } else {
      setInternalMobileOpen(false);
    }
  };

  const navItems = [
    {
      name: "Overview",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      name: "Fleet Management",
      href: "/admin/cars",
      icon: Car,
      badge: "Fleet",
    },
    {
      name: "Booking Requests",
      href: "/admin/bookings",
      icon: CalendarDays,
      badge: bookingBadgeCount > 0 ? String(bookingBadgeCount) : null,
      badgeColor: "bg-blue-500/20 text-cyan-300 border-blue-500/30",
    },
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
      badge: null,
    },
    {
      name: "System Settings",
      href: "/admin/settings",
      icon: Settings,
      badge: null,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between">
      <div>
        {/* Header Block - Logo & Toggle Button Fixed Layout */}
        <div className={`flex items-center border-b border-white/10 transition-all duration-300 ${isCollapsed ? "p-3 flex-col gap-3 justify-center" : "p-4 justify-between"
          }`}>
          {/* Logo Icon & Title */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-[1.5px] shadow-lg shadow-amber-500/20 shrink-0">
              <div className="w-full h-full bg-[#050b18] rounded-[10px] flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
            </div>

            {!isCollapsed && (
              <div className="transition-all duration-300 truncate">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-white text-sm tracking-tight">DriveVue</span>
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    Admin
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 truncate">Fleet Control Center</p>
              </div>
            )}
          </div>

          {/* Desktop Toggle Button */}
          <button
            onClick={toggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile Close Button */}
          <button
            onClick={closeMobile}
            className="md:hidden p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-400 hover:text-white transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Back to Main Site Navigation */}
        <div className="p-3">
          <Link
            href="/"
            onClick={closeMobile}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all group ${isCollapsed ? "justify-center" : ""
              }`}
            title="Back to Home"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-blue-400 group-hover:-translate-x-0.5 transition-transform" />
            {!isCollapsed && <span>Back to Main Site</span>}
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/admin/dashboard" && pathname === "/dashboard");
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={closeMobile}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 group ${isActive
                  ? "bg-gradient-to-r from-blue-600/30 to-cyan-600/20 text-white border border-cyan-400/40 shadow-md shadow-blue-500/10"
                  : "text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent"
                  } ${isCollapsed ? "justify-center" : ""}`}
                title={item.name}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-gradient-to-b from-blue-500 to-cyan-400 rounded-r-full shadow-sm" />
                )}

                <Icon
                  className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                />

                {!isCollapsed && (
                  <div className="flex-1 flex items-center justify-between truncate">
                    <span className="truncate">{item.name}</span>
                    {item.badge && (
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${item.badgeColor || "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info Widget */}
      <div className="p-3 border-t border-white/10">
        {!isCollapsed ? (
          <div className="p-3 rounded-2xl bg-blue-950/30 border border-blue-500/20">
            <div className="flex items-center gap-2 text-cyan-400 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[10px] font-bold uppercase tracking-wider">AI Operations</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-snug">
              Smart fleet matching engine active with 99.8% uptime.
            </p>
          </div>
        ) : (
          <div className="flex justify-center p-2" title="DriveVue AI Shield">
            <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-cyan-400">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={`hidden md:block fixed left-0 top-0 bottom-0 z-40 bg-[#050b18]/95 backdrop-blur-2xl border-r border-white/10 transition-all duration-300 ease-in-out shadow-2xl ${isCollapsed ? "w-20" : "w-64"
          }`}
      >
        {sidebarContent}
      </aside>

      {isMobileOpen && (
        <div
          onClick={closeMobile}
          className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        />
      )}

      <aside
        className={`md:hidden fixed inset-y-0 left-0 z-50 w-72 bg-[#050b18] border-r border-white/10 shadow-2xl transition-transform duration-300 ease-in-out ${isMobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}