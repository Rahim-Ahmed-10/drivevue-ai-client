"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Car as CarIcon,
  Sparkles,
  SlidersHorizontal,
  RotateCcw,
  ArrowUpDown,
  X,
} from "lucide-react";

import api from "@/lib/api";
import type { Car, CarFilterState } from "@/types/car";
import { MOCK_CARS } from "@/lib/mockCars";
import CarCard from "@/components/cars/CarCard";
import CarFilter from "@/components/cars/CarFilter";

function CarsListingContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

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

  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Fetch vehicles from API
  useEffect(() => {
    let active = true;

    async function loadCars() {
      setLoading(true);

      try {
        const params: Record<string, string | boolean | number> = {};

        if (filters.search.trim()) {
          params.search = filters.search.trim();
        }

        if (filters.brand) params.brand = filters.brand;
        if (filters.category) params.category = filters.category;
        if (filters.fuelType) params.fuelType = filters.fuelType;

        if (filters.isAvailableOnly) {
          params.isAvailable = true;
        }

        const response = await api.get("/api/cars", { params });

        if (!active) return;

        const data = response.data;

        let loadedCars: Car[] = [];

        if (Array.isArray(data)) {
          loadedCars = data;
        } else if (Array.isArray(data?.data)) {
          loadedCars = data.data;
        } else if (Array.isArray(data?.cars)) {
          loadedCars = data.cars;
        }

        setCars(loadedCars);
      } catch (error) {
        if (!active) return;

        console.error("Failed to load vehicles:", error);
        setCars(MOCK_CARS);
      } finally {
        if (active) setLoading(false);
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

  // Update filters
  const handleFilterChange = (updated: Partial<CarFilterState>) => {
    setFilters((previous) => ({
      ...previous,
      ...updated,
    }));
  };

  // Reset all filters
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
    setIsMobileFilterOpen(false);
  };

  // Get available brands
  const availableBrands = useMemo(
    () =>
      Array.from(
        new Set(cars.map((car) => car.brand).filter(Boolean))
      ),
    [cars]
  );

  // Filter and sort vehicles
  const filteredAndSortedCars = useMemo(() => {
    let result = [...cars];

    if (filters.search.trim()) {
      const query = filters.search.trim().toLowerCase();

      result = result.filter((car) =>
        [car.name, car.brand, car.model, car.category].some(
          (value) => value?.toLowerCase().includes(query)
        )
      );
    }

    if (filters.category) {
      result = result.filter(
        (car) =>
          car.category?.toLowerCase() ===
          filters.category.toLowerCase()
      );
    }

    if (filters.brand) {
      result = result.filter(
        (car) =>
          car.brand?.toLowerCase() ===
          filters.brand.toLowerCase()
      );
    }

    if (filters.fuelType) {
      result = result.filter(
        (car) =>
          car.fuelType?.toLowerCase() ===
          filters.fuelType.toLowerCase()
      );
    }

    if (filters.transmission) {
      result = result.filter(
        (car) =>
          car.transmission?.toLowerCase() ===
          filters.transmission.toLowerCase()
      );
    }

    result = result.filter((car) => {
      const price = Number(car.pricePerDay) || 0;

      return (
        price >= (filters.minPrice || 0) &&
        price <= (filters.maxPrice ?? Infinity)
      );
    });

    if (filters.isAvailableOnly) {
      result = result.filter((car) => car.isAvailable);
    }

    switch (filters.sortBy) {
      case "price-asc":
        result.sort(
          (a, b) => a.pricePerDay - b.pricePerDay
        );
        break;

      case "price-desc":
        result.sort(
          (a, b) => b.pricePerDay - a.pricePerDay
        );
        break;

      case "year-desc":
        result.sort(
          (a, b) => (b.year || 0) - (a.year || 0)
        );
        break;

      default:
        break;
    }

    return result;
  }, [cars, filters]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#080c15] pb-16 pt-24 text-slate-100 sm:pt-28">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-1/4 top-20 h-80 w-80 rounded-full bg-blue-600/[0.07] blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-[500px] h-80 w-80 rounded-full bg-cyan-500/[0.05] blur-[130px]" />

      <div className="relative mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-8">
        {/* Page header */}
        <header className="mb-7 border-b border-slate-800/80 pb-6">
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/[0.08] px-3 py-1.5 text-xs font-semibold text-blue-300">
                <Sparkles size={14} />
                <span>Premium Fleet · Find Your Perfect Ride</span>
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Explore Our Fleet
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Discover premium SUVs, luxury cars, and electric
                vehicles. Compare features and find the perfect ride
                for your next journey.
              </p>
            </div>

            {/* Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  setIsMobileFilterOpen((previous) => !previous)
                }
                aria-expanded={isMobileFilterOpen}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3.5 text-sm font-semibold text-white transition hover:border-blue-500/50 lg:hidden"
              >
                <SlidersHorizontal
                  size={16}
                  className="text-blue-400"
                />
                Filters
                <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs">
                  {filteredAndSortedCars.length}
                </span>
              </button>

              <div className="flex min-h-10 items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/80 px-3.5">
                <ArrowUpDown
                  size={15}
                  className="shrink-0 text-blue-400"
                />

                <label
                  htmlFor="car-sort"
                  className="hidden text-xs text-slate-400 sm:inline"
                >
                  Sort by
                </label>

                <select
                  id="car-sort"
                  value={filters.sortBy}
                  onChange={(event) =>
                    handleFilterChange({
                      sortBy: event.target.value as CarFilterState["sortBy"],
                    })
                  }
                  className="max-w-[170px] cursor-pointer bg-transparent text-sm font-medium text-slate-100 outline-none"
                >
                  <option value="featured" className="bg-slate-900">
                    Featured First
                  </option>
                  <option value="price-asc" className="bg-slate-900">
                    Price: Low to High
                  </option>
                  <option value="price-desc" className="bg-slate-900">
                    Price: High to Low
                  </option>
                  <option value="year-desc" className="bg-slate-900">
                    Newest Year
                  </option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Main listing layout */}
        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[245px_minmax(0,1fr)] xl:grid-cols-[265px_minmax(0,1fr)] xl:gap-6">
          {/* Desktop filters */}
          <aside className="hidden min-w-0 lg:block">
            <div className="sticky top-24">
              <CarFilter
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
                availableBrands={availableBrands}
                totalResults={filteredAndSortedCars.length}
              />
            </div>
          </aside>

          {/* Mobile filter panel */}
          {isMobileFilterOpen && (
            <section className="min-w-0 lg:hidden">
              <div className="flex items-center justify-between rounded-t-2xl border border-slate-800 bg-[#0c1423] px-4 py-3">
                <h2 className="text-sm font-bold text-white">
                  Filter Vehicles
                </h2>

                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  aria-label="Close filters"
                  className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-800 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <CarFilter
                filters={filters}
                onChange={handleFilterChange}
                onReset={handleResetFilters}
                availableBrands={availableBrands}
                totalResults={filteredAndSortedCars.length}
              />
            </section>
          )}

          {/* Vehicle results */}
          <section className="min-w-0">
            {/* Results toolbar */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-bold text-white sm:text-lg">
                  Available Vehicles
                </h2>

                <p className="mt-1 text-xs text-slate-400 sm:text-sm">
                  {loading
                    ? "Finding your perfect ride..."
                    : `${filteredAndSortedCars.length} vehicles found`}
                </p>
              </div>

              <button
                type="button"
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-slate-400 transition hover:bg-slate-800 hover:text-white"
              >
                <RotateCcw size={13} />
                Reset filters
              </button>
            </div>

            {/* Loading skeletons */}
            {loading ? (
              <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="animate-pulse overflow-hidden rounded-2xl border border-slate-800/90 bg-[#0c1421]"
                  >
                    <div className="aspect-[16/10] bg-slate-800/80" />

                    <div className="space-y-3 p-4">
                      <div className="h-3 w-1/3 rounded bg-slate-800" />
                      <div className="h-5 w-4/5 rounded bg-slate-800" />

                      <div className="grid grid-cols-3 gap-2">
                        <div className="h-12 rounded-lg bg-slate-800/80" />
                        <div className="h-12 rounded-lg bg-slate-800/80" />
                        <div className="h-12 rounded-lg bg-slate-800/80" />
                      </div>

                      <div className="h-10 rounded-lg bg-slate-800/80" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredAndSortedCars.length === 0 ? (
              /* Empty state */
              <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-slate-800 bg-[#0c1421] px-5 py-12 text-center">
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/[0.08] text-blue-400">
                  <CarIcon size={27} />
                </div>

                <h3 className="text-lg font-bold text-white">
                  No Vehicles Found
                </h3>

                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                  No vehicles match your current filters. Try another
                  search or reset your filters.
                </p>

                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-500"
                >
                  <RotateCcw size={15} />
                  Reset All Filters
                </button>
              </div>
            ) : (
              /* Compact, responsive premium grid */
              <div className="grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredAndSortedCars.map((car, index) => (
                  <CarCard
                    key={String(car._id || car.id || index)}
                    car={car}
                    index={index}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#080c15] text-slate-400">
          <div className="flex items-center gap-3">
            <CarIcon
              size={23}
              className="animate-pulse text-blue-500"
            />
            <span className="text-sm">
              Loading DriveVue Fleet...
            </span>
          </div>
        </div>
      }
    >
      <CarsListingContent />
    </Suspense>
  );
}
