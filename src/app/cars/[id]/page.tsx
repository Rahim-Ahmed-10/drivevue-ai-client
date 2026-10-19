
"use client";

import React, {
    useEffect,
    useMemo,
    useState,
    useSyncExternalStore,
    Suspense,
} from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
    ArrowLeft,
    ArrowUpRight,
    Sparkles,
    ShieldCheck,
    CreditCard,
    Zap,
    Fuel,
    Users,
    Gauge,
    CheckCircle2,
    Star,
    Calendar,
    Lock,
    Loader2,
    AlertCircle,
    Clock,
    Check,
    ChevronRight,
    BadgeCheck,
    CarFront,
    CircleGauge,
    Headphones,
    Wifi,
} from "lucide-react";

import api from "@/lib/api";
import { Car } from "@/types/car";
import { MOCK_CARS } from "@/lib/mockCars";

function subscribeToAuth(callback: () => void) {
    window.addEventListener("storage", callback);
    return () => window.removeEventListener("storage", callback);
}

function getAuthSnapshot() {
    return Boolean(
        localStorage.getItem("token") ||
        localStorage.getItem("auth_token")
    );
}

function getAuthServerSnapshot() {
    return false;
}

function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function addDays(dateString: string, days: number) {
    const date = new Date(`${dateString}T12:00:00`);
    date.setDate(date.getDate() + days);
    return formatDate(date);
}

function getDaysBetween(start: string, end: string) {
    const startTime = new Date(`${start}T12:00:00`).getTime();
    const endTime = new Date(`${end}T12:00:00`).getTime();

    return Math.round((endTime - startTime) / 86400000);
}

const features = [
    { icon: ShieldCheck, label: "Premium protection" },
    { icon: Zap, label: "Smart driving experience" },
    { icon: Wifi, label: "Connected technology" },
    { icon: Headphones, label: "24/7 customer support" },
    { icon: Sparkles, label: "Luxury interior" },
    { icon: CheckCircle2, label: "Flexible reservations" },
];

function CarDetailsContent() {
    const router = useRouter();
    const params = useParams();

    const carId = Array.isArray(params?.id)
        ? params.id[0]
        : params?.id || "mock-car-1";

    const initialCar = useMemo(
        () =>
            MOCK_CARS.find(
                (item) => item._id === carId || item.id === carId
            ) || MOCK_CARS[0],
        [carId]
    );

    const [car, setCar] = useState<Car>(initialCar);
    const [activeImageIndex, setActiveImageIndex] = useState(0);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [checkoutError, setCheckoutError] = useState("");

    const [pickupDate, setPickupDate] = useState(() => {
        const today = formatDate(new Date());
        return addDays(today, 1);
    });

    const [returnDate, setReturnDate] = useState(() => {
        const tomorrow = addDays(formatDate(new Date()), 1);
        return addDays(tomorrow, 3);
    });

    const isAuthenticated = useSyncExternalStore(
        subscribeToAuth,
        getAuthSnapshot,
        getAuthServerSnapshot
    );

    const today = formatDate(new Date());

    useEffect(() => {
        let active = true;

        setCar(initialCar);
        setActiveImageIndex(0);

        // Only query backend if carId looks like a valid 24-character hexadecimal MongoDB ObjectId
        const isMongoId = /^[0-9a-fA-F]{24}$/.test(String(carId));
        if (!isMongoId) {
            return () => {
                active = false;
            };
        }

        api
            .get(`/cars/${carId}`)
            .then((response) => {
                if (active && response.data?.data) {
                    setCar(response.data.data);
                }
            })
            .catch(() => {
                // Keep the mock vehicle as a fallback.
            });

        return () => {
            active = false;
        };
    }, [carId, initialCar]);

    const galleryImages = useMemo(() => {
        const images = (car.images || []).filter(
            (image): image is string =>
                typeof image === "string" && image.length > 0
        );

        if (images.length === 0) {
            return [
                "https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=1800&q=85",
            ];
        }

        return images;
    }, [car.images]);

    useEffect(() => {
        setActiveImageIndex(0);
    }, [car]);

    const rentalDays = getDaysBetween(pickupDate, returnDate);

    const dateError =
        !pickupDate ||
            !returnDate ||
            pickupDate < today ||
            returnDate <= pickupDate
            ? "Choose a valid pick-up and return date."
            : "";

    const safeDays = rentalDays > 0 ? rentalDays : 0;
    const subtotal = safeDays * car.pricePerDay;
    const tax = Math.round(subtotal * 0.08);
    const totalAmount = subtotal + tax;

    const isElectric =
        car.fuelType?.toLowerCase() === "electric" ||
        car.category?.toLowerCase() === "electric";

    const handleCheckout = async () => {
        setCheckoutError("");

        if (dateError || safeDays <= 0) {
            setCheckoutError(
                "Please select a valid pick-up and return date."
            );
            return;
        }

        if (!car.isAvailable) {
            setCheckoutError(
                "This vehicle is currently unavailable. Please choose another car."
            );
            return;
        }

        const rawCarId = car._id || car.id || carId;
        const isMongoId =
            /^[0-9a-fA-F]{24}$/.test(String(rawCarId));

        if (!isMongoId) {
            setCheckoutError(
                "This demo vehicle is not connected to the live fleet database."
            );
            return;
        }

        const targetCarId = String(rawCarId);

        if (!isAuthenticated) {
            router.push(
                `/login?redirect=${encodeURIComponent(`/cars/${targetCarId}`)}`
            );
            return;
        }

        setIsCheckingOut(true);

        try {
            const response = await api.post(
                "/api/payments/create-checkout-session",
                {
                    carId: targetCarId,
                    car: targetCarId,
                    startDate: pickupDate,
                    endDate: returnDate,
                    totalAmount,
                }
            );

            const checkoutUrl =
                response.data?.url ||
                response.data?.data?.url ||
                response.data?.sessionUrl ||
                response.data?.data?.sessionUrl;

            if (
                typeof checkoutUrl === "string" &&
                /^https:\/\/[^/]*stripe\.com\//i.test(checkoutUrl)
            ) {
                window.location.assign(checkoutUrl);
                return;
            }

            setCheckoutError(
                "Unable to retrieve a valid Stripe checkout URL."
            );
        } catch (error: unknown) {
            const apiError = error as {
                response?: {
                    status?: number;
                    data?: { message?: string };
                };
                message?: string;
            };

            if (apiError.response?.status === 401) {
                router.push(
                    `/login?redirect=${encodeURIComponent(`/cars/${targetCarId}`)}`
                );
                return;
            }

            setCheckoutError(
                apiError.response?.data?.message ||
                apiError.message ||
                "Payment connection failed. Please try again."
            );
        } finally {
            setIsCheckingOut(false);
        }
    };

    return (
        <main className="relative min-h-screen overflow-hidden bg-[#070A12] pb-20 pt-24 text-white selection:bg-blue-500/30 sm:pt-28">
            {/* Ambient lighting */}
            <div className="pointer-events-none absolute -left-40 top-40 h-[500px] w-[500px] rounded-full bg-blue-600/[0.12] blur-[150px]" />
            <div className="pointer-events-none absolute -right-40 top-[650px] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.08] blur-[150px]" />

            <div className="relative mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-10">
                {/* Navigation */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 flex flex-wrap items-center justify-between gap-4"
                >
                    <Link
                        href="/cars"
                        className="group inline-flex items-center gap-2.5 text-sm text-slate-400 transition hover:text-white"
                    >
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] transition group-hover:border-blue-400/40 group-hover:bg-blue-500/10">
                            <ArrowLeft size={16} />
                        </span>
                        Back to fleet
                    </Link>

                    <div className="flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-[11px] font-medium tracking-wide text-slate-400">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                        DRIVEVUE AI
                        <span className="text-slate-600">/</span>
                        VEHICLE DETAILS
                    </div>
                </motion.div>

                {/* Hero heading */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55 }}
                    className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end"
                >
                    <div>
                        <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
                            <Sparkles size={14} />
                            The premium collection
                        </div>

                        <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
                            Your next journey,
                            <span className="block bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500 bg-clip-text pb-1 text-transparent">
                                redefined.
                            </span>
                        </h1>

                        <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
                            Discover exceptional comfort, intelligent technology,
                            and a driving experience designed around you.
                        </p>
                    </div>

                    <div className="flex w-fit items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3.5">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400">
                            <Star size={20} fill="currentColor" />
                        </div>
                        <div>
                            <p className="text-lg font-bold">4.98 / 5</p>
                            <p className="text-xs text-slate-500">
                                Example rating · 142 trips
                            </p>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_390px] xl:grid-cols-[minmax(0,1fr)_420px] xl:gap-8">
                    {/* LEFT: Gallery and details */}
                    <div className="min-w-0 space-y-6">
                        <motion.section
                            initial={{ opacity: 0, scale: 0.985 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.55 }}
                            className="overflow-hidden rounded-[28px] border border-white/[0.09] bg-[#0C111D] shadow-2xl shadow-black/30"
                        >
                            <div className="group relative h-[280px] overflow-hidden bg-[#0A0E17] sm:h-[430px] xl:h-[490px]">
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={galleryImages[activeImageIndex]}
                                        src={galleryImages[activeImageIndex] || galleryImages[0]}
                                        alt={car.name || `${car.brand} ${car.model}`}
                                        initial={{ opacity: 0, scale: 1.035 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.35 }}
                                        className="absolute inset-0 h-full w-full object-cover"
                                    />
                                </AnimatePresence>

                                <div className="absolute inset-0 bg-gradient-to-t from-[#070A12] via-transparent to-black/35" />
                                <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent" />

                                <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2 sm:left-6 sm:top-6">
                                    <span className="rounded-full border border-white/15 bg-black/45 px-3.5 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white backdrop-blur-xl">
                                        {car.category || "Luxury"}
                                    </span>

                                    <span
                                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-[10px] font-semibold backdrop-blur-xl ${car.isAvailable
                                            ? "border-emerald-400/25 bg-emerald-950/60 text-emerald-300"
                                            : "border-amber-400/25 bg-amber-950/60 text-amber-300"
                                            }`}
                                    >
                                        <span
                                            className={`h-1.5 w-1.5 rounded-full ${car.isAvailable
                                                ? "bg-emerald-400"
                                                : "bg-amber-400"
                                                }`}
                                        />
                                        {car.isAvailable ? "Available to book" : "Reserved"}
                                    </span>
                                </div>

                                <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 sm:bottom-7 sm:left-7 sm:right-7">
                                    <div>
                                        <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-300">
                                            {car.brand} · {car.year}
                                        </p>
                                        <h2 className="text-2xl font-bold tracking-tight sm:text-4xl">
                                            {car.name || `${car.brand} ${car.model}`}
                                        </h2>
                                        <p className="mt-2 text-xs text-slate-300 sm:text-sm">
                                            Designed for the extraordinary.
                                        </p>
                                    </div>

                                    <div className="hidden items-center gap-1.5 rounded-xl border border-white/10 bg-black/40 px-3 py-2 text-xs text-slate-200 backdrop-blur-xl sm:flex">
                                        <ShieldCheck size={15} className="text-emerald-400" />
                                        Premium fleet
                                    </div>
                                </div>
                            </div>

                            {/* Gallery thumbnails */}
                            <div className="flex items-center gap-3 overflow-x-auto border-t border-white/[0.06] bg-[#0A0E17] p-4 sm:p-5">
                                {galleryImages.map((image, index) => (
                                    <button
                                        key={`${image}-${index}`}
                                        type="button"
                                        aria-label={`Show vehicle image ${index + 1}`}
                                        aria-pressed={activeImageIndex === index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`relative h-[58px] w-[82px] shrink-0 overflow-hidden rounded-xl border-2 transition duration-200 sm:h-[70px] sm:w-[105px] ${activeImageIndex === index
                                            ? "border-blue-400 shadow-lg shadow-blue-500/20"
                                            : "border-white/[0.06] opacity-55 hover:border-white/30 hover:opacity-100"
                                            }`}
                                    >
                                        <img
                                            src={image}
                                            alt={`Vehicle view ${index + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                        {activeImageIndex === index && (
                                            <span className="absolute inset-0 border border-white/20" />
                                        )}
                                    </button>
                                ))}

                                <span className="ml-auto shrink-0 text-[10px] text-slate-500">
                                    {String(activeImageIndex + 1).padStart(2, "0")} /{" "}
                                    {String(galleryImages.length).padStart(2, "0")}
                                </span>
                            </div>
                        </motion.section>

                        {/* Specifications */}
                        <motion.section
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.12 }}
                            className="rounded-[28px] border border-white/[0.08] bg-gradient-to-br from-[#111827] to-[#0B101B] p-5 sm:p-7"
                        >
                            <div className="mb-6 flex items-center justify-between gap-4">
                                <div>
                                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-blue-400">
                                        Vehicle overview
                                    </p>
                                    <h3 className="mt-2 text-xl font-semibold">
                                        Built around your journey
                                    </h3>
                                </div>

                                <div className="hidden h-12 w-12 items-center justify-center rounded-2xl border border-blue-400/20 bg-blue-500/10 text-blue-400 sm:flex">
                                    <CarFront size={24} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {[
                                    {
                                        icon: Users,
                                        label: "Passengers",
                                        value: `${car.seats || 5} seats`,
                                    },
                                    {
                                        icon: isElectric ? Zap : Fuel,
                                        label: "Fuel type",
                                        value: car.fuelType || "Electric",
                                    },
                                    {
                                        icon: Gauge,
                                        label: "Transmission",
                                        value: car.transmission || "Automatic",
                                    },
                                    {
                                        icon: CircleGauge,
                                        label: "Model year",
                                        value: String(car.year || "N/A"),
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.label}
                                        className="group rounded-2xl border border-white/[0.06] bg-white/[0.025] p-4 transition duration-300 hover:border-blue-400/25 hover:bg-blue-500/[0.05]"
                                    >
                                        <item.icon
                                            size={20}
                                            className="mb-4 text-blue-400 transition group-hover:scale-110"
                                        />
                                        <p className="text-[10px] uppercase tracking-wider text-slate-500">
                                            {item.label}
                                        </p>
                                        <p className="mt-1 break-words text-sm font-semibold text-slate-100">
                                            {item.value}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t border-white/[0.07] pt-6">
                                <h4 className="mb-4 text-sm font-semibold">
                                    Experience the difference
                                </h4>

                                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                    {features.map((feature) => (
                                        <div
                                            key={feature.label}
                                            className="flex items-center gap-3 text-sm text-slate-400"
                                        >
                                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/[0.06]">
                                                <feature.icon size={15} className="text-emerald-400" />
                                            </span>
                                            {feature.label}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.section>

                        {/* Trust section */}
                        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            {[
                                {
                                    icon: ShieldCheck,
                                    title: "Secure booking",
                                    description: "Protected checkout experience",
                                },
                                {
                                    icon: CreditCard,
                                    title: "Clear pricing",
                                    description: "Review your estimated total",
                                },
                                {
                                    icon: Headphones,
                                    title: "Here to help",
                                    description: "Support for your journey",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4"
                                >
                                    <item.icon
                                        size={19}
                                        className="mt-0.5 shrink-0 text-blue-400"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold">{item.title}</p>
                                        <p className="mt-1 text-xs leading-5 text-slate-500">
                                            {item.description}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </section>
                    </div>

                    {/* RIGHT: Sticky booking widget */}
                    <aside className="min-w-0 lg:sticky lg:top-28">
                        <motion.section
                            initial={{ opacity: 0, x: 18 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="overflow-hidden rounded-[28px] border border-white/[0.1] bg-[#0D1320]/95 shadow-2xl shadow-black/30 backdrop-blur-2xl"
                        >
                            <div className="relative overflow-hidden border-b border-white/[0.07] p-6 sm:p-7">
                                <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-blue-500/15 blur-[65px]" />

                                <div className="relative flex items-start justify-between gap-3">
                                    <div>
                                        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
                                            Your private getaway
                                        </p>

                                        <div className="mt-3 flex items-baseline gap-2">
                                            <span className="text-4xl font-bold tracking-tight">
                                                ${car.pricePerDay}
                                            </span>
                                            <span className="text-sm text-slate-500">/ day</span>
                                        </div>

                                        <p className="mt-2 text-xs text-slate-500">
                                            Choose your dates to calculate the price.
                                        </p>
                                    </div>

                                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300">
                                        <BadgeCheck size={13} />
                                        {car.isAvailable ? "Available" : "Reserved"}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6 p-5 sm:p-7">
                                {/* Dates */}
                                <div>
                                    <div className="mb-4 flex items-center gap-2">
                                        <Calendar size={17} className="text-blue-400" />
                                        <h3 className="text-sm font-semibold">Plan your trip</h3>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="rounded-2xl border border-white/[0.09] bg-[#080D17] p-4 transition focus-within:border-blue-400/50">
                                            <label
                                                htmlFor="pickup-date"
                                                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                                            >
                                                Pick-up date
                                            </label>

                                            <input
                                                id="pickup-date"
                                                type="date"
                                                min={today}
                                                value={pickupDate}
                                                onChange={(event) => {
                                                    const nextPickup = event.target.value;
                                                    setPickupDate(nextPickup);

                                                    if (returnDate <= nextPickup) {
                                                        setReturnDate(addDays(nextPickup, 1));
                                                    }

                                                    setCheckoutError("");
                                                }}
                                                className="w-full bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
                                            />
                                        </div>

                                        <div className="rounded-2xl border border-white/[0.09] bg-[#080D17] p-4 transition focus-within:border-blue-400/50">
                                            <label
                                                htmlFor="return-date"
                                                className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500"
                                            >
                                                Return date
                                            </label>

                                            <input
                                                id="return-date"
                                                type="date"
                                                min={addDays(pickupDate, 1)}
                                                value={returnDate}
                                                onChange={(event) => {
                                                    setReturnDate(event.target.value);
                                                    setCheckoutError("");
                                                }}
                                                className="w-full bg-transparent text-sm font-medium text-white outline-none [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    {dateError && (
                                        <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-red-300">
                                            <AlertCircle size={15} className="mt-0.5 shrink-0" />
                                            {dateError}
                                        </p>
                                    )}
                                </div>

                                {/* Rental duration */}
                                <div className="flex items-center justify-between rounded-2xl border border-blue-400/15 bg-blue-500/[0.06] p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                                            <Clock size={19} />
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold">Your reservation</p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                {safeDays} {safeDays === 1 ? "day" : "days"} selected
                                            </p>
                                        </div>
                                    </div>

                                    <ChevronRight size={17} className="text-slate-500" />
                                </div>

                                {/* Price summary */}
                                <div>
                                    <h3 className="mb-4 text-sm font-semibold">
                                        Price breakdown
                                    </h3>

                                    <div className="space-y-3 text-xs">
                                        <div className="flex justify-between gap-3 text-slate-400">
                                            <span>
                                                ${car.pricePerDay} × {safeDays}{" "}
                                                {safeDays === 1 ? "day" : "days"}
                                            </span>
                                            <span className="font-medium text-slate-200">
                                                ${subtotal.toLocaleString("en-US")}
                                            </span>
                                        </div>

                                        <div className="flex justify-between gap-3 text-slate-400">
                                            <span>Estimated tax (8%)</span>
                                            <span className="font-medium text-slate-200">
                                                ${tax.toLocaleString("en-US")}
                                            </span>
                                        </div>

                                        <div className="border-t border-dashed border-white/[0.12] pt-4">
                                            <div className="flex items-end justify-between gap-3">
                                                <div>
                                                    <p className="text-sm font-semibold text-white">
                                                        Estimated total
                                                    </p>
                                                    <p className="mt-1 text-[10px] text-slate-500">
                                                        Final amount subject to server validation
                                                    </p>
                                                </div>

                                                <span className="text-3xl font-bold tracking-tight text-blue-400">
                                                    ${totalAmount.toLocaleString("en-US")}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Errors */}
                                <AnimatePresence>
                                    {checkoutError && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div
                                                role="alert"
                                                className="flex gap-2 rounded-xl border border-red-400/20 bg-red-500/[0.07] p-3 text-xs leading-5 text-red-300"
                                            >
                                                <AlertCircle
                                                    size={16}
                                                    className="mt-0.5 shrink-0"
                                                />
                                                {checkoutError}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                {/* Checkout */}
                                <button
                                    type="button"
                                    disabled={
                                        isCheckingOut ||
                                        Boolean(dateError) ||
                                        safeDays <= 0 ||
                                        !car.isAvailable
                                    }
                                    onClick={handleCheckout}
                                    className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:from-blue-500 hover:to-cyan-500 hover:shadow-blue-500/30 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                                >
                                    <span className="absolute inset-0 translate-x-[-120%] bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]" />

                                    <span className="relative flex items-center gap-2">
                                        {isCheckingOut ? (
                                            <>
                                                <Loader2 size={17} className="animate-spin" />
                                                Connecting to Stripe...
                                            </>
                                        ) : (
                                            <>
                                                <Lock size={16} />
                                                Continue to secure checkout
                                                <ArrowUpRight
                                                    size={16}
                                                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                                                />
                                            </>
                                        )}
                                    </span>
                                </button>

                                <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500">
                                    <Lock size={12} />
                                    Secure payment powered by Stripe
                                </div>

                                <div className="flex items-start gap-3 border-t border-white/[0.07] pt-5">
                                    <ShieldCheck
                                        size={19}
                                        className="mt-0.5 shrink-0 text-emerald-400"
                                    />
                                    <div>
                                        <p className="text-xs font-semibold text-slate-200">
                                            A more confident way to travel
                                        </p>
                                        <p className="mt-1 text-[11px] leading-5 text-slate-500">
                                            Review your reservation details before completing
                                            payment. Availability is confirmed by the server.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.section>

                        <p className="px-3 pt-1 text-center text-[10px] leading-5 text-slate-600">
                            DriveVue AI · Premium mobility, thoughtfully designed.
                        </p>
                    </aside>
                </div>
            </div>
        </main>
    );
}

export default function CarDetailsPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#070A12] text-slate-400">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] px-6 py-4">
                        <Sparkles className="h-5 w-5 animate-pulse text-blue-400" />
                        <span className="text-sm">
                            Preparing your premium experience...
                        </span>
                    </div>
                </div>
            }
        >
            <CarDetailsContent />
        </Suspense>
    );
}