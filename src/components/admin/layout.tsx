"use client";

import React, { useState } from "react";
import AdminSidebar from "./AdminSidebar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-[#030712] text-slate-100 flex">
            {/* Admin Sidebar Component */}
            <AdminSidebar
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
            />

            {/* Main Admin Dashboard Content Area with Dynamic Padding */}
            <main
                className={`flex-1 transition-all duration-300 min-h-screen ${isCollapsed ? "md:pl-20" : "md:pl-64"
                    } pt-6 pb-12 px-4 sm:px-6 lg:px-8`}
            >
                {children}
            </main>
        </div>
    );
}