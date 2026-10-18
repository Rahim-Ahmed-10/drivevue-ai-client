"use client";

import React, { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex relative overflow-x-hidden">
            {/* 1. Fixed Admin Sidebar */}
            <AdminSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* 2. Main Admin Dashboard Content Area */}
            <div
                className={`flex-1 flex flex-col transition-all duration-300 min-h-screen ${isCollapsed ? "md:ml-20" : "md:ml-64"
                    } w-full`}
            >
                {/* Top Navbar Header */}
                <AdminNavbar />

                {/* Page View Body */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}