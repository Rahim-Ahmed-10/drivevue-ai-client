"use client";

import React from "react";
import {
  Search,
  RotateCcw,
  X,
  SlidersHorizontal,
  Zap,
  Car as CarIcon
} from "lucide-react";
import { CarFilterState } from "@/types/car";

interface CarFilterProps {
  filters: CarFilterState;
  onChange: (updated: Partial<CarFilterState>) => void;
  onReset: () => void;
  availableBrands?: string[];
  totalResults: number;
}

export default function CarFilter({
  filters,
  onChange,
  onReset,
  availableBrands = [],
  totalResults,
}: CarFilterProps) {
  const categories = [
    { id: "", label: "All Categories" },
    { id: "Electric", label: "Electric" },
    { id: "SUV", label: "SUV" },
    { id: "Sedan", label: "Sedan" },
    { id: "Luxury", label: "Luxury" },
    { id: "Sports", label: "Sports" },
  ];

  const fuelTypes = [
    { id: "", label: "All Fuels" },
    { id: "Electric", label: "Electric" },
    { id: "Hybrid", label: "Hybrid" },
    { id: "Petrol", label: "Petrol" },
    { id: "Diesel", label: "Diesel" },
  ];

  const transmissions = [
    { id: "", label: "All Transmissions" },
    { id: "Automatic", label: "Automatic" },
    { id: "Manual", label: "Manual" },
  ];

  // Distinct brand list merging default luxury brands with dynamically available ones
  const popularBrands = [
    "Tesla",
    "Porsche",
    "BMW",
    "Mercedes-Benz",
    "Audi",
    "Range Rover",
    "Lamborghini",
  ];
  const allBrands = Array.from(new Set([...popularBrands, ...availableBrands])).filter(Boolean);

  const hasActiveFilters =
    Boolean(filters.search) ||
    Boolean(filters.brand) ||
    Boolean(filters.category) ||
    Boolean(filters.fuelType) ||
    Boolean(filters.transmission) ||
    filters.maxPrice < 500 ||
    filters.isAvailableOnly;

  return (
    <div className="rounded-2xl bg-slate-900/70 border border-slate-800/80 p-5 sm:p-6 backdrop-blur-xl shadow-xl shadow-black/40 space-y-6">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Filter Vehicles
            </h3>
            <p className="text-[11px] text-slate-400">
              {totalResults} {totalResults === 1 ? "car" : "cars"} found
            </p>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:underline transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* 1. Search by Keywords */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Search className="w-3.5 h-3.5 text-blue-400" />
          Search
        </label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search brand, model, or keywords..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {filters.search && (
            <button
              type="button"
              onClick={() => onChange({ search: "" })}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Vehicle Category Pills */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <CarIcon className="w-3.5 h-3.5 text-cyan-400" />
          Vehicle Category
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isSelected =
              filters.category.toLowerCase() === cat.id.toLowerCase();
            return (
              <button
                key={cat.id || "all"}
                type="button"
                onClick={() => onChange({ category: cat.id })}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${isSelected
                  ? "bg-[#2563eb] text-white shadow-md shadow-blue-600/30"
                  : "bg-slate-950/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-850"
                  }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Brand Select */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Brand / Manufacturer
        </label>
        <select
          value={filters.brand}
          onChange={(e) => onChange({ brand: e.target.value })}
          className="w-full bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
        >
          <option value="">All Brands</option>
          {allBrands.map((brand) => (
            <option key={brand} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* 4. Maximum Price Per Day Slider */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold uppercase tracking-wider text-slate-300">
            Daily Budget
          </label>
          <span className="font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded-md">
            Up to ${filters.maxPrice}/day
          </span>
        </div>
        <input
          type="range"
          min="50"
          max="500"
          step="10"
          value={filters.maxPrice}
          onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
          className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg appearance-none"
        />
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>$50/day</span>
          <span>$250/day</span>
          <span>$500+/day</span>
        </div>
      </div>

      {/* 5. Fuel Type Selector */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          Powertrain / Fuel
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          {fuelTypes.map((fuel) => {
            const isSelected =
              filters.fuelType.toLowerCase() === fuel.id.toLowerCase();
            return (
              <button
                key={fuel.id || "all-fuels"}
                type="button"
                onClick={() => onChange({ fuelType: fuel.id })}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-medium text-left truncate transition-colors ${isSelected
                  ? "bg-indigo-600/30 text-cyan-300 border border-indigo-500/40"
                  : "bg-slate-950/60 text-slate-400 hover:bg-slate-800 border border-slate-850"
                  }`}
              >
                {fuel.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 6. Transmission Type */}
      <div className="space-y-2">
        <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
          Transmission
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {transmissions.map((trans) => {
            const isSelected =
              filters.transmission.toLowerCase() === trans.id.toLowerCase();
            return (
              <button
                key={trans.id || "all-trans"}
                type="button"
                onClick={() => onChange({ transmission: trans.id })}
                className={`py-1.5 rounded-lg text-[11px] font-medium text-center truncate transition-colors ${isSelected
                  ? "bg-blue-600/30 text-white border border-blue-500/40"
                  : "bg-slate-950/60 text-slate-400 hover:bg-slate-800 border border-slate-850"
                  }`}
              >
                {trans.label.replace("All Transmissions", "All")}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Available Only Toggle */}
      <div className="pt-2 border-t border-slate-800">
        <label className="flex items-center justify-between cursor-pointer group">
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors">
              Available Only
            </span>
            <span className="text-[10px] text-slate-400">
              Hide booked vehicles
            </span>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={filters.isAvailableOnly}
            onClick={() =>
              onChange({ isAvailableOnly: !filters.isAvailableOnly })
            }
            className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${filters.isAvailableOnly ? "bg-blue-600" : "bg-slate-800"
              }`}
          >
            <span
              className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${filters.isAvailableOnly ? "translate-x-4" : "translate-x-0"
                }`}
            />
          </button>
        </label>
      </div>
    </div>
  );
}
