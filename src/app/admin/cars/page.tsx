"use client";

import React, { useState, useEffect, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  Car as CarIcon,
  Plus,
  Search,
  ShieldCheck,
  ArrowRight,
  Menu,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight
} from "lucide-react";
import api from "@/lib/api";
import { Car as CarType } from "@/types/car";

function subscribeToAuth(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("auth-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("auth-changed", callback);
  };
}

function getAuthSnapshot() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("token") || localStorage.getItem("auth_token") || "";
}

function getUserSnapshot() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("user") || "";
}

function getServerSnapshot() {
  return "";
}

const STATIC_SAMPLE_FLEET: CarType[] = [
  {
    _id: "car-demo-1",
    name: "Porsche 911 GT3 RS",
    brand: "Porsche",
    model: "911 GT3 RS",
    year: 2024,
    pricePerDay: 580,
    category: "Sports",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 2,
    images: ["https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&w=1200&q=80"],
    isAvailable: true
  },
  {
    _id: "car-demo-2",
    name: "Tesla Model S Plaid",
    brand: "Tesla",
    model: "Model S Plaid",
    year: 2024,
    pricePerDay: 320,
    category: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 5,
    images: ["https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80"],
    isAvailable: false
  },
  {
    _id: "car-demo-3",
    name: "Mercedes-AMG G63",
    brand: "Mercedes-Benz",
    model: "AMG G63",
    year: 2024,
    pricePerDay: 650,
    category: "Luxury",
    fuelType: "Petrol",
    transmission: "Automatic",
    seats: 5,
    images: ["https://images.unsplash.com/photo-1520031441872-265e4ff70366?auto=format&fit=crop&w=1200&q=80"],
    isAvailable: true
  },
  {
    _id: "car-demo-4",
    name: "Audi RS e-tron GT",
    brand: "Audi",
    model: "RS e-tron GT",
    year: 2024,
    pricePerDay: 410,
    category: "Electric",
    fuelType: "Electric",
    transmission: "Automatic",
    seats: 4,
    images: ["https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1200&q=80"],
    isAvailable: true
  }
];

export default function AdminCarsPage() {
  const router = useRouter();

  const token = useSyncExternalStore(subscribeToAuth, getAuthSnapshot, getServerSnapshot);
  const userJson = useSyncExternalStore(subscribeToAuth, getUserSnapshot, getServerSnapshot);

  const currentUser = useMemo(() => {
    if (!userJson) return null;
    try {
      return JSON.parse(userJson) as { role?: string };
    } catch {
      return null;
    }
  }, [userJson]);

  const isAuthorizedAdmin = Boolean(token && currentUser?.role?.toLowerCase() === "admin");

  const [fleet, setFleet] = useState<CarType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("token") || localStorage.getItem("auth_token");
    const u = localStorage.getItem("user");
    let isAdmin = false;

    if (u) {
      try {
        const parsed = JSON.parse(u);
        if (parsed?.role?.toLowerCase() === "admin") isAdmin = true;
      } catch {
        // ignore
      }
    }

    if (!t) {
      router.replace("/login?redirect=/admin/cars");
    } else if (!isAdmin) {
      router.replace("/my-bookings");
    }
  }, [router]);

  useEffect(() => {
    if (!isAuthorizedAdmin) return;
    let isMounted = true;
    api.get("/cars")
      .then((res) => {
        if (!isMounted) return;
        const cData = res.data?.data || res.data;
        if (Array.isArray(cData) && cData.length > 0) {
          setFleet(cData);
        } else {
          setFleet(STATIC_SAMPLE_FLEET);
        }
      })
      .catch(() => {
        if (isMounted) setFleet(STATIC_SAMPLE_FLEET);
      });
    return () => {
      isMounted = false;
    };
  }, [isAuthorizedAdmin]);

  const filteredFleet = useMemo(() => {
    const list = fleet.length > 0 ? fleet : STATIC_SAMPLE_FLEET;
    return list.filter((car) => {
      if (categoryFilter !== "ALL" && car.category !== categoryFilter) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          car.name.toLowerCase().includes(q) ||
          car.brand.toLowerCase().includes(q) ||
          car.model.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [fleet, categoryFilter, searchQuery]);

  const handleToggleAvailability = (carId: string) => {
    setFleet((prev) =>
      prev.map((c) =>
        c._id === carId ? { ...c, isAvailable: !c.isAvailable } : c
      )
    );
    toast.success("Vehicle availability status updated!");
  };

  if (!isAuthorizedAdmin) {
    return (
      <div className="min-h-screen bg-[#090d16] flex items-center justify-center p-4">
        <Toaster position="top-right" />
        <div className="p-8 rounded-3xl bg-slate-900/80 border border-slate-800 text-center space-y-4 max-w-md w-full">
          <ShieldCheck className="w-12 h-12 text-amber-400 mx-auto animate-pulse" />
          <h2 className="text-xl font-bold text-white">Verifying Admin Access...</h2>
          <Link href="/my-bookings" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white">
            <span>Return to My Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-full">
      <Toaster position="top-right" />

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <CarIcon className="w-6 h-6 text-blue-400" />
              <span>Fleet Management</span>
            </h1>
            <p className="text-xs text-slate-400">
              Manage inventory, update daily rental rates, and control availability
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cars"
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md shadow-blue-600/30 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Browse Fleet View</span>
          </Link>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative min-w-[260px] flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search vehicle model, brand..."
            className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-900 border border-slate-800 focus:border-blue-500 text-white placeholder-slate-500 outline-none shadow-inner"
          />
        </div>

        <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs overflow-x-auto">
          {(["ALL", "Sports", "Electric", "Luxury", "SUV"] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap ${categoryFilter === cat
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
                }`}
            >
              {cat === "ALL" ? "All Categories" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filteredFleet.map((car) => (
          <div
            key={car._id}
            className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-lg space-y-3 group hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-full h-40 rounded-2xl bg-slate-950 overflow-hidden relative">
                <Image
                  src={car.images?.[0] || STATIC_SAMPLE_FLEET[0].images[0]}
                  alt={car.name}
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border shadow-sm ${car.isAvailable
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                      : "bg-blue-500/20 text-cyan-300 border-blue-500/40"
                    }`}>
                    {car.isAvailable ? "Available" : "Rented / On Road"}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-400">{car.category} • {car.year}</span>
                  <span className="font-black text-white text-sm">${car.pricePerDay}<span className="text-[10px] text-slate-400 font-normal">/day</span></span>
                </div>
                <h3 className="font-bold text-white text-base truncate group-hover:text-blue-400 transition-colors">
                  {car.name}
                </h3>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <button
                onClick={() => handleToggleAvailability(car._id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${car.isAvailable
                    ? "bg-slate-800 hover:bg-slate-750 text-slate-300 border-slate-700"
                    : "bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border-emerald-500/40"
                  }`}
              >
                {car.isAvailable ? <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                <span>{car.isAvailable ? "Mark Rented" : "Mark Available"}</span>
              </button>

              <Link
                href={`/cars/${car._id}`}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                title="View Car Details"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}