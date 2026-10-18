"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import toast, { Toaster } from "react-hot-toast";
import {
    Car,
    DollarSign,
    Tag,
    Calendar,
    Users,
    Fuel,
    Settings,
    Image as ImageIcon,
    Save,
    ArrowLeft
} from "lucide-react";
import api from "@/lib/api";

// 1. Inner Form Component (using search params)
function ManageCarForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const carId = searchParams.get("id"); // URL Query Param (e.g. ?id=123)

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        model: "",
        year: new Date().getFullYear(),
        pricePerDay: 250,
        category: "Luxury",
        fuelType: "Petrol",
        transmission: "Automatic",
        seats: 5,
        images: "",
        isAvailable: true,
    });

    // Fetch Car Details for Editing
    useEffect(() => {
        if (carId) {
            setIsEditing(true);
            setFetching(true);
            api.get(`/cars/${carId}`)
                .then((res) => {
                    const car = res.data?.data || res.data;
                    if (car) {
                        setFormData({
                            name: car.name || "",
                            brand: car.brand || "",
                            model: car.model || "",
                            year: car.year || 2024,
                            pricePerDay: car.pricePerDay || 250,
                            category: car.category || "Luxury",
                            fuelType: car.fuelType || "Petrol",
                            transmission: car.transmission || "Automatic",
                            seats: car.seats || 5,
                            images: Array.isArray(car.images) ? car.images[0] : car.images || "",
                            isAvailable: car.isAvailable ?? true,
                        });
                    }
                    setFetching(false);
                })
                .catch(() => {
                    toast.error("Failed to load vehicle details for editing.");
                    setFetching(false);
                });
        }
    }, [carId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === "checkbox") {
            const { checked } = e.target as HTMLInputElement;
            setFormData((prev) => ({ ...prev, [name]: checked }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            ...formData,
            year: Number(formData.year),
            pricePerDay: Number(formData.pricePerDay),
            seats: Number(formData.seats),
            images: [formData.images],
        };

        try {
            if (isEditing && carId) {
                await api.put(`/cars/${carId}`, payload);
                toast.success("Vehicle updated successfully!");
            } else {
                await api.post("/cars", payload);
                toast.success("New vehicle added to fleet successfully!");
            }

            setTimeout(() => {
                router.push("/admin/cars");
            }, 1000);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to save vehicle data.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <div className="p-12 text-center text-slate-400 font-semibold text-xs animate-pulse">
                Fetching vehicle details...
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl mx-auto pb-12">
            {/* Top Navigation Header */}
            <div className="flex items-center justify-between p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
                <div className="flex items-center gap-4">
                    <Link
                        href="/admin/cars"
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-all"
                    >
                        <ArrowLeft className="w-4 h-4" />
                    </Link>
                    <div>
                        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                            {isEditing ? "Edit Vehicle Configuration" : "Add New Fleet Vehicle"}
                        </h1>
                        <p className="text-xs text-slate-400">
                            {isEditing ? `Modifying specifications for ID: ${carId}` : "Register a new luxury or electric vehicle"}
                        </p>
                    </div>
                </div>
            </div>

            {/* Form Container */}
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-2xl space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                    {/* Name */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <Car className="w-3.5 h-3.5 text-blue-400" />
                            <span>Vehicle Name / Title</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Porsche 911 GT3 RS"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-white placeholder-slate-600 outline-none"
                        />
                    </div>

                    {/* Brand */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Manufacturer Brand</span>
                        </label>
                        <input
                            type="text"
                            name="brand"
                            required
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="e.g. Porsche"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-white placeholder-slate-600 outline-none"
                        />
                    </div>

                    {/* Model */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Model Edition</label>
                        <input
                            type="text"
                            name="model"
                            required
                            value={formData.model}
                            onChange={handleChange}
                            placeholder="e.g. GT3 RS"
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-white placeholder-slate-600 outline-none"
                        />
                    </div>

                    {/* Year */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            <span>Manufacturing Year</span>
                        </label>
                        <input
                            type="number"
                            name="year"
                            required
                            value={formData.year}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none"
                        />
                    </div>

                    {/* Price Per Day */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                            <span>Daily Rental Rate ($)</span>
                        </label>
                        <input
                            type="number"
                            name="pricePerDay"
                            required
                            value={formData.pricePerDay}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none"
                        />
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none"
                        >
                            <option value="Luxury">Luxury</option>
                            <option value="Sports">Sports</option>
                            <option value="Electric">Electric</option>
                            <option value="SUV">SUV</option>
                        </select>
                    </div>

                    {/* Fuel Type */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <Fuel className="w-3.5 h-3.5 text-purple-400" />
                            <span>Fuel / Power Type</span>
                        </label>
                        <select
                            name="fuelType"
                            value={formData.fuelType}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none"
                        >
                            <option value="Petrol">Petrol</option>
                            <option value="Electric">Electric</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="Diesel">Diesel</option>
                        </select>
                    </div>

                    {/* Transmission */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <Settings className="w-3.5 h-3.5 text-blue-400" />
                            <span>Transmission</span>
                        </label>
                        <select
                            name="transmission"
                            value={formData.transmission}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none"
                        >
                            <option value="Automatic">Automatic</option>
                            <option value="Manual">Manual</option>
                        </select>
                    </div>

                    {/* Seats */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Seating Capacity</span>
                        </label>
                        <input
                            type="number"
                            name="seats"
                            required
                            value={formData.seats}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-white outline-none"
                        />
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center space-x-3 pt-6">
                        <input
                            type="checkbox"
                            id="isAvailable"
                            name="isAvailable"
                            checked={formData.isAvailable}
                            onChange={handleChange}
                            className="w-4 h-4 rounded bg-slate-950 border-slate-800 text-blue-600 focus:ring-0 cursor-pointer"
                        />
                        <label htmlFor="isAvailable" className="text-xs font-semibold text-slate-200 cursor-pointer">
                            Vehicle is Available for Instant Booking
                        </label>
                    </div>

                </div>

                {/* Image URL */}
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                        <span>Vehicle Image URL</span>
                    </label>
                    <input
                        type="url"
                        name="images"
                        required
                        value={formData.images}
                        onChange={handleChange}
                        placeholder="https://images.unsplash.com/photo-..."
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 focus:border-blue-500 text-xs text-white placeholder-slate-600 outline-none"
                    />
                </div>

                {/* Action Button */}
                <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
                    <Link
                        href="/admin/cars"
                        className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-all"
                    >
                        Cancel
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                    >
                        <Save className="w-4 h-4" />
                        <span>{loading ? "Saving..." : isEditing ? "Update Vehicle" : "Publish Vehicle"}</span>
                    </button>
                </div>

            </form>
        </div>
    );
}

// 2. Main Page Component wrapped in <Suspense> boundary
export default function ManageCarPage() {
    return (
        <>
            <Toaster position="top-right" />
            <Suspense fallback={
                <div className="p-12 text-center text-slate-400 text-xs font-semibold animate-pulse">
                    Loading Page...
                </div>
            }>
                <ManageCarForm />
            </Suspense>
        </>
    );
}