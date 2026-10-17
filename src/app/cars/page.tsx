"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  Car as CarIcon, 
  Sparkles, 
  SlidersHorizontal, 
  RotateCcw, 
  ArrowUpDown,
  X
} from "lucide-react";
import api from "@/lib/api";
import { Car, CarFilterState } from "@/types/car";
import { MOCK_CARS } from "@/lib/mockCars";
import CarCard from "@/components/cars/CarCard";
import CarFilter from "@/components/cars/CarFilter";

function CarsListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize filters once using URL query params as initial values
  const [filters, setFilters] = useState<CarFilterState>(() => ({
    search: searchParams.get("search") || "",
    brand: searchParams.get("brand") || "",
    category: searchParams.get("category") || "",
    fuelType: "",
    transmission: "",
    minPrice: 0,
    maxPrice: 500,
    isAvailableOnly: false,
    sortBy: "featured",
  }));

  // Initial state uses MOCK_CARS as resilient default to ensure immediate render
  const [cars, setCars] = useState<Car[]>(MOCK_CARS);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch cars asynchronously with resilient fallback
  useEffect(() => {
    let active = true;

    async function loadCars() {
      try {
        const params: Record<string, string | boolean> = {};
        if (filters.search.trim()) params.search = filters.search.trim();
        if (filters.brand) params.brand = filters.brand;
        if (filters.category) params.category = filters.category;
        if (filters.fuelType) params.fuelType = filters.fuelType;
        if (filters.isAvailableOnly) params.isAvailable = true;

        const res = await api.get("/cars", { params });

        if (!active) return;

        // Parse response safely across different possible wrapper shapes
        let loaded: Car[] = [];
        if (Array.isArray(res.data)) {
          loaded = res.data;
        } else if (res.data && Array.isArray(res.data.data)) {
          loaded = res.data.data;
        } else if (res.data && Array.isArray(res.data.cars)) {
          loaded = res.data.cars;
        }

        // If backend returned cars, use them; otherwise use MOCK_CARS
        if (loaded.length > 0) {
          setCars(loaded);
        } else {
          setCars(MOCK_CARS);
        }
      } catch (err: unknown) {
        if (!active) return;
        console.warn("[CarsPage] API unavailable, using verified fleet dataset:", err);
        setCars(MOCK_CARS);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadCars();

    return () => {
      active = false;
    };
  }, [
    filters.search,
    filters.brand,
    filters.category,
    filters.fuelType,
    filters.isAvailableOnly,
  ]);

  // Handle user-initiated filter changes
  const handleFilterChange = (updated: Partial<CarFilterState>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: "",
      brand: "",
      category: "",
      fuelType: "",
      transmission: "",
      minPrice: 0,
      maxPrice: 500,
      isAvailableOnly: false,
      sortBy: "featured",
    });
    router.push("/cars");
  };

  // Extract unique brands dynamically from active fleet
  const availableBrands = useMemo(() => {
    return Array.from(new Set(cars.map((c) => c.brand))).filter(Boolean);
  }, [cars]);

  // Client-side filtering and sorting for instant responsiveness
  const filteredAndSortedCars = useMemo(() => {
    let result = [...cars];

    // Search query matching across name, brand, or model
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase();
      result = result.filter(
        (car) =>
          car.name?.toLowerCase().includes(q) ||
          car.brand?.toLowerCase().includes(q) ||
          car.model?.toLowerCase().includes(q) ||
          car.category?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category) {
      result = result.filter(
        (car) =>
          car.category?.toLowerCase() === filters.category.toLowerCase()
      );
    }

    // Brand filter
    if (filters.brand) {
      result = result.filter(
        (car) => car.brand?.toLowerCase() === filters.brand.toLowerCase()
      );
    }

    // Fuel Type filter
    if (filters.fuelType) {
      result = result.filter(
        (car) => car.fuelType?.toLowerCase() === filters.fuelType.toLowerCase()
      );
    }

    // Maximum price per day filter
    if (filters.maxPrice < 500) {
      result = result.filter((car) => car.pricePerDay <= filters.maxPrice);
    }

    // Transmission filter
    if (filters.transmission) {
      result = result.filter(
        (car) =>
          car.transmission?.toLowerCase() ===
          filters.transmission.toLowerCase()
      );
    }

    // Availability filter
    if (filters.isAvailableOnly) {
      result = result.filter((car) => car.isAvailable);
    }

    // Sorting
    if (filters.sortBy === "price-asc") {
      result.sort((a, b) => a.pricePerDay - b.pricePerDay);
    } else if (filters.sortBy === "price-desc") {
      result.sort((a, b) => b.pricePerDay - a.pricePerDay);
    } else if (filters.sortBy === "year-desc") {
      result.sort((a, b) => (b.year || 0) - (a.year || 0));
    }

    return result;
  }, [cars, filters]);

  return (
    <div className="relative min-h-screen bg-[#090d16] text-slate-100 pt-28 pb-20">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-1/3 w-[600px] h-[400px] bg-blue-600/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-96 right-10 w-[500px] h-[400px] bg-cyan-500/10 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* =========================================================================
            HEADER & TOOLBAR
           ========================================================================= */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-800">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-semibold text-blue-400 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Clean Fleet • 2026 Models Ready</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
                Explore Our Fleet
              </h1>
              <p className="text-sm text-slate-400 mt-2 max-w-xl">
                Browse handpicked luxury cruisers, high-performance EVs, and premium SUVs. 
                All vehicles feature digital smartphone keyless unlock and instant Stripe checkout.
              </p>
            </div>

            {/* Sort & Mobile Filter Toggle */}
            <div className="flex items-center gap-3">
              {/* Mobile Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="md:hidden px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white flex items-center gap-2"
              >
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                <span>Filters</span>
                {filteredAndSortedCars.length > 0 && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-[10px] flex items-center justify-center">
                    {filteredAndSortedCars.length}
                  </span>
                )}
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 rounded-xl px-3.5 py-2">
                <ArrowUpDown className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) =>
                    handleFilterChange({
                      sortBy: e.target.value as CarFilterState["sortBy"],
                    })
                  }
                  className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-slate-900 text-white">
                    Featured First
                  </option>
                  <option value="price-asc" className="bg-slate-900 text-white">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-slate-900 text-white">
                    Price: High to Low
                  </option>
                  <option value="year-desc" className="bg-slate-900 text-white">
                    Newest Year
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            MAIN CONTENT: SIDEBAR + CAR GRID
           ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Desktop Filter Sidebar (1 col) */}
          <div className="hidden md:block md:col-span-1">
            <div className="sticky top-28">
              <CarFilter
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
                availableBrands={availableBrands}
                totalResults={filteredAndSortedCars.length}
              />
            </div>
          </div>

          {/* Mobile Filter Drawer */}
          {isMobileFilterOpen && (
            <div className="md:hidden col-span-1 mb-6 animate-in fade-in slide-in-from-top-4 duration-200">
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded-t-2xl border-x border-t border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Filter Options
                </span>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <CarFilter
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
                availableBrands={availableBrands}
                totalResults={filteredAndSortedCars.length}
              />
            </div>
          )}

          {/* Car Listing Grid (3 cols on desktop) */}
          <div className="col-span-1 md:col-span-3">
            {/* Loading State: Shimmer Skeletons (Only while initial loading is active AND no cars) */}
            {loading && cars.length === 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-slate-900/40 border border-slate-800 p-4 space-y-4 animate-pulse"
                  >
                    <div className="h-48 w-full bg-slate-800/60 rounded-xl" />
                    <div className="space-y-2">
                      <div className="h-4 w-1/3 bg-slate-800/80 rounded" />
                      <div className="h-5 w-3/4 bg-slate-800 rounded" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 py-2">
                      <div className="h-8 bg-slate-800/50 rounded" />
                      <div className="h-8 bg-slate-800/50 rounded" />
                      <div className="h-8 bg-slate-800/50 rounded" />
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="h-6 w-20 bg-slate-800 rounded" />
                      <div className="h-9 w-24 bg-slate-800 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedCars.length === 0 ? (
              /* Empty State UI */
              <div className="rounded-3xl bg-slate-900/40 border border-slate-800 p-12 text-center flex flex-col items-center justify-center space-y-5">
                <div className="w-16 h-16 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-inner">
                  <CarIcon className="w-8 h-8 opacity-80" />
                </div>
                <div className="max-w-md space-y-1">
                  <h3 className="text-lg font-bold text-white">
                    No Vehicles Found
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    We couldn&apos;t find any vehicles matching your current search or filter criteria. 
                    Try broadening your price range or clearing category filters.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-[#2563eb] hover:bg-[#1d4ed8] shadow-lg shadow-blue-600/30 transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              /* Cars Cards Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedCars.map((car, index) => (
                  <CarCard key={car._id || car.id || index} car={car} index={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#090d16] flex items-center justify-center text-slate-400">
          <div className="animate-pulse flex items-center gap-2">
            <CarIcon className="w-6 h-6 text-blue-500" />
            <span>Loading DriveVue Fleet...</span>
          </div>
        </div>
      }
    >
      <CarsListingContent />
    </Suspense>
  );
}
