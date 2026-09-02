"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Coins,
  Search,
  MapPin,
  Utensils,
  Car,
  Building2,
  Coffee,
  Ticket,
  TrendingUp,
  Calculator,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";

interface CityData {
  name: string;
  country: string;
  flag: string;
  costIndex: "Budget Friendly" | "Moderate" | "Premium" | "Expensive";
  cheapMeal: number;
  fineDining: number;
  localTransport: number;
  taxiRate: number;
  hotelNight: number;
  coffee: number;
  entertainment: number;
  dailyBudget: { backpacker: number; midrange: number; luxury: number };
  image: string;
}

const CITIES: CityData[] = [
  {
    name: "Bangkok",
    country: "Thailand",
    flag: "🇹🇭",
    costIndex: "Budget Friendly",
    cheapMeal: 3,
    fineDining: 25,
    localTransport: 1,
    taxiRate: 4,
    hotelNight: 35,
    coffee: 2.5,
    entertainment: 8,
    dailyBudget: { backpacker: 30, midrange: 65, luxury: 180 },
    image: "/images/japan-thumb.jpg",
  },
  {
    name: "Bali",
    country: "Indonesia",
    flag: "🇮🇩",
    costIndex: "Budget Friendly",
    cheapMeal: 3,
    fineDining: 22,
    localTransport: 1.5,
    taxiRate: 5,
    hotelNight: 40,
    coffee: 2,
    entertainment: 10,
    dailyBudget: { backpacker: 28, midrange: 60, luxury: 200 },
    image: "/images/bali-thumb.jpg",
  },
  {
    name: "Dubai",
    country: "UAE",
    flag: "🇦🇪",
    costIndex: "Premium",
    cheapMeal: 10,
    fineDining: 75,
    localTransport: 3,
    taxiRate: 10,
    hotelNight: 150,
    coffee: 5,
    entertainment: 30,
    dailyBudget: { backpacker: 70, midrange: 180, luxury: 500 },
    image: "/images/greece-thumb.jpg",
  },
  {
    name: "Tokyo",
    country: "Japan",
    flag: "🇯🇵",
    costIndex: "Premium",
    cheapMeal: 8,
    fineDining: 60,
    localTransport: 4,
    taxiRate: 12,
    hotelNight: 120,
    coffee: 4,
    entertainment: 22,
    dailyBudget: { backpacker: 60, midrange: 150, luxury: 400 },
    image: "/images/japan-thumb.jpg",
  },
  {
    name: "Paris",
    country: "France",
    flag: "🇫🇷",
    costIndex: "Expensive",
    cheapMeal: 14,
    fineDining: 80,
    localTransport: 2,
    taxiRate: 15,
    hotelNight: 180,
    coffee: 5,
    entertainment: 25,
    dailyBudget: { backpacker: 65, midrange: 170, luxury: 450 },
    image: "/images/greece-thumb.jpg",
  },
  {
    name: "London",
    country: "UK",
    flag: "🇬🇧",
    costIndex: "Expensive",
    cheapMeal: 15,
    fineDining: 90,
    localTransport: 3.5,
    taxiRate: 18,
    hotelNight: 200,
    coffee: 5.5,
    entertainment: 30,
    dailyBudget: { backpacker: 70, midrange: 190, luxury: 520 },
    image: "/images/greece-thumb.jpg",
  },
  {
    name: "New York",
    country: "USA",
    flag: "🇺🇸",
    costIndex: "Expensive",
    cheapMeal: 16,
    fineDining: 95,
    localTransport: 2.9,
    taxiRate: 15,
    hotelNight: 220,
    coffee: 6,
    entertainment: 35,
    dailyBudget: { backpacker: 75, midrange: 200, luxury: 550 },
    image: "/images/japan-thumb.jpg",
  },
  {
    name: "Rome",
    country: "Italy",
    flag: "🇮🇹",
    costIndex: "Moderate",
    cheapMeal: 10,
    fineDining: 55,
    localTransport: 2,
    taxiRate: 10,
    hotelNight: 110,
    coffee: 2,
    entertainment: 18,
    dailyBudget: { backpacker: 50, midrange: 120, luxury: 350 },
    image: "/images/greece-thumb.jpg",
  },
  {
    name: "Istanbul",
    country: "Turkey",
    flag: "🇹🇷",
    costIndex: "Budget Friendly",
    cheapMeal: 4,
    fineDining: 30,
    localTransport: 1,
    taxiRate: 4,
    hotelNight: 50,
    coffee: 2,
    entertainment: 8,
    dailyBudget: { backpacker: 30, midrange: 70, luxury: 200 },
    image: "/images/bali-thumb.jpg",
  },
  {
    name: "Singapore",
    country: "Singapore",
    flag: "🇸🇬",
    costIndex: "Premium",
    cheapMeal: 5,
    fineDining: 65,
    localTransport: 2,
    taxiRate: 10,
    hotelNight: 160,
    coffee: 5,
    entertainment: 25,
    dailyBudget: { backpacker: 55, midrange: 150, luxury: 420 },
    image: "/images/japan-thumb.jpg",
  },
];

const COST_INDEX_CONFIG: Record<
  string,
  { bg: string; text: string; border: string; icon: any }
> = {
  "Budget Friendly": {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
    icon: ShieldCheck,
  },
  Moderate: {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    icon: Star,
  },
  Premium: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
    icon: Sparkles,
  },
  Expensive: {
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
    icon: Zap,
  },
};

export default function CostOfLivingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<CityData>(CITIES[2]); // Default to Dubai
  const [tripDays, setTripDays] = useState<string>("7");
  const [travelStyle, setTravelStyle] = useState<
    "backpacker" | "midrange" | "luxury"
  >("midrange");

  const router = useRouter();

  // Auth Protection
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        setUser(null);
        setLoading(false);
        router.push("/signin");
      }
    });
    return () => unsubscribe();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // City search filter
  const filteredCities = useMemo(() => {
    if (!searchQuery.trim()) return CITIES;
    const q = searchQuery.toLowerCase();
    return CITIES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.country.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  // Trip estimate calculation
  const days = parseInt(tripDays) || 0;
  const dailyRate = selectedCity.dailyBudget[travelStyle];
  const estimatedTotal = days * dailyRate;

  const indexCfg =
    COST_INDEX_CONFIG[selectedCity.costIndex] ||
    COST_INDEX_CONFIG["Moderate"];
  const IndexIcon = indexCfg.icon;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">
            Loading cost data...
          </span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userName =
    user.displayName ||
    (user.email ? user.email.split("@")[0] : "Traveler");
  const formattedName =
    userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[240px] shrink-0 h-screen sticky top-0 z-30">
        <Sidebar activeTab="Cost of Living" />
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-[260px] max-w-[80vw] h-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <Sidebar
              activeTab="Cost of Living"
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <DashboardHeader
          userName={formattedName}
          userEmail={user.email || ""}
          onSignOut={handleSignOut}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#0e1326] tracking-tight">
              Cost of Living Estimator
            </h2>
            <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
              Compare daily expenses across world destinations and estimate your trip budget
            </p>
          </div>
        </div>

        {/* City Selector Grid */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-[14px] font-extrabold text-[#0e1326] tracking-tight">
                Select Destination
              </h3>
              <p className="text-[11.5px] text-[#94a3b8] font-medium mt-0.5">
                Choose a city to see a detailed daily cost breakdown
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search city or country..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {filteredCities.map((city) => {
              const isActive = city.name === selectedCity.name;
              return (
                <button
                  key={city.name}
                  onClick={() => setSelectedCity(city)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-[13px] font-bold whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                      : "bg-white text-[#0e1326] border-slate-200/80 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <span className="text-[16px]">{city.flag}</span>
                  <span>{city.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected City Header */}
        <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs text-[24px]">
              {selectedCity.flag}
            </div>
            <div>
              <h3 className="text-[18px] font-extrabold text-[#0e1326] tracking-tight flex items-center gap-2">
                {selectedCity.name}
                <span className="text-[13px] text-[#94a3b8] font-medium">
                  {selectedCity.country}
                </span>
              </h3>
              <div className="flex items-center gap-1.5 mt-0.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[12px] text-[#64748b] font-medium">
                  Average daily costs for travelers
                </span>
              </div>
            </div>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[12.5px] font-bold ${indexCfg.bg} ${indexCfg.text} ${indexCfg.border}`}
          >
            <IndexIcon className="w-3.5 h-3.5" />
            {selectedCity.costIndex}
          </div>
        </div>

        {/* Daily Budget Breakdown Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-6">
          {[
            {
              label: "Cheap Meal",
              value: selectedCity.cheapMeal,
              icon: Utensils,
              bg: "bg-emerald-50",
              text: "text-emerald-600",
            },
            {
              label: "Fine Dining",
              value: selectedCity.fineDining,
              icon: Utensils,
              bg: "bg-orange-50",
              text: "text-orange-600",
            },
            {
              label: "Local Transport",
              value: selectedCity.localTransport,
              icon: Car,
              bg: "bg-blue-50",
              text: "text-blue-600",
            },
            {
              label: "Taxi Rate",
              value: selectedCity.taxiRate,
              icon: Car,
              bg: "bg-indigo-50",
              text: "text-indigo-600",
            },
            {
              label: "Hotel / Night",
              value: selectedCity.hotelNight,
              icon: Building2,
              bg: "bg-purple-50",
              text: "text-purple-600",
            },
            {
              label: "Coffee",
              value: selectedCity.coffee,
              icon: Coffee,
              bg: "bg-amber-50",
              text: "text-amber-600",
            },
            {
              label: "Entertainment",
              value: selectedCity.entertainment,
              icon: Ticket,
              bg: "bg-rose-50",
              text: "text-rose-600",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col items-center text-center gap-2 hover:shadow-[0_4px_16px_rgba(0,0,0,0.04)] transition-shadow"
              >
                <div
                  className={`w-10 h-10 rounded-xl ${item.bg} ${item.text} flex items-center justify-center shadow-xs`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider leading-tight">
                  {item.label}
                </span>
                <span className="text-[20px] font-extrabold text-[#0e1326] tracking-tight leading-none">
                  ${item.value}
                </span>
              </div>
            );
          })}
        </div>

        {/* Trip Budget Estimator & Travel Style Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-6">
          {/* Trip Budget Calculator (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[16px] font-extrabold text-[#0e1326] tracking-tight">
                  Trip Budget Estimator
                </h3>
                <p className="text-[12px] text-[#94a3b8] font-medium mt-0.5">
                  Calculate total estimated cost for {selectedCity.name}
                </p>
              </div>
            </div>

            {/* Days Input */}
            <div className="mb-5">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-1.5">
                Number of Days
              </label>
              <input
                type="number"
                min="1"
                max="365"
                value={tripDays}
                onChange={(e) => setTripDays(e.target.value)}
                className="w-full h-12 px-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-[16px] font-extrabold text-[#0e1326] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                placeholder="e.g. 7"
              />

              <div className="flex items-center gap-2 mt-2.5 overflow-x-auto scrollbar-none pb-1">
                {["3", "5", "7", "10", "14", "30"].map((d) => (
                  <button
                    key={d}
                    onClick={() => setTripDays(d)}
                    className={`px-3 py-1 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                      tripDays === d
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                    }`}
                  >
                    {d} days
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Style Selector */}
            <div className="mb-6">
              <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-2">
                Travel Style
              </label>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    {
                      key: "backpacker" as const,
                      label: "Backpacker",
                      desc: "Hostels & street food",
                      daily: selectedCity.dailyBudget.backpacker,
                      color: "emerald",
                    },
                    {
                      key: "midrange" as const,
                      label: "Mid-Range",
                      desc: "Hotels & restaurants",
                      daily: selectedCity.dailyBudget.midrange,
                      color: "blue",
                    },
                    {
                      key: "luxury" as const,
                      label: "Luxury",
                      desc: "5-star & fine dining",
                      daily: selectedCity.dailyBudget.luxury,
                      color: "amber",
                    },
                  ] as const
                ).map((style) => {
                  const isSelected = travelStyle === style.key;
                  return (
                    <button
                      key={style.key}
                      onClick={() => setTravelStyle(style.key)}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/60 border-blue-500 shadow-xs"
                          : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-50"
                      }`}
                    >
                      <span
                        className={`text-[13px] font-extrabold block ${
                          isSelected ? "text-blue-600" : "text-[#0e1326]"
                        }`}
                      >
                        {style.label}
                      </span>
                      <span className="text-[11px] text-[#94a3b8] font-medium block mt-0.5">
                        {style.desc}
                      </span>
                      <span className="text-[14px] font-extrabold text-[#0e1326] mt-1.5 block">
                        ${style.daily}
                        <span className="text-[11px] text-[#94a3b8] font-medium">
                          /day
                        </span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Estimated Total Result */}
            <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-blue-600/20">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12px] text-blue-100 font-medium">
                  Estimated Total for {days} days in {selectedCity.name}
                </span>
                <span className="text-[11px] text-blue-200 font-semibold capitalize">
                  {travelStyle} style
                </span>
              </div>

              <div className="text-[32px] sm:text-[38px] font-extrabold tracking-tight leading-tight">
                ${estimatedTotal.toLocaleString()}
              </div>

              <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/15">
                <span className="text-[11.5px] text-blue-100 font-medium">
                  ${dailyRate}/day × {days} days
                </span>
                <Link
                  href="/budget"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/15 hover:bg-white/25 backdrop-blur-md rounded-lg text-[12px] font-bold text-white transition-colors"
                >
                  Apply to Budget
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Travel Style Comparison Panel (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <h3 className="text-[15px] font-extrabold text-[#0e1326] tracking-tight">
                  Style Comparison for {selectedCity.name}
                </h3>
              </div>

              <p className="text-[12px] text-[#94a3b8] font-medium mb-4">
                Estimated total for {days || 0} days across all travel styles
              </p>

              <div className="flex flex-col gap-3.5">
                {[
                  {
                    label: "Backpacker",
                    daily: selectedCity.dailyBudget.backpacker,
                    color: "bg-emerald-600",
                    light: "bg-emerald-50",
                    textColor: "text-emerald-700",
                  },
                  {
                    label: "Mid-Range",
                    daily: selectedCity.dailyBudget.midrange,
                    color: "bg-blue-600",
                    light: "bg-blue-50",
                    textColor: "text-blue-700",
                  },
                  {
                    label: "Luxury",
                    daily: selectedCity.dailyBudget.luxury,
                    color: "bg-amber-500",
                    light: "bg-amber-50",
                    textColor: "text-amber-700",
                  },
                ].map((style) => {
                  const total = (days || 0) * style.daily;
                  const maxVal =
                    (days || 0) * selectedCity.dailyBudget.luxury || 1;
                  const pct = Math.round((total / maxVal) * 100);

                  return (
                    <div key={style.label}>
                      <div className="flex items-center justify-between text-[12px] mb-1.5">
                        <span className="font-bold text-[#0e1326]">
                          {style.label}
                        </span>
                        <span className="font-extrabold text-[#0e1326]">
                          ${total.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${style.color} rounded-full transition-all duration-300`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-[#94a3b8] font-medium mt-0.5 block">
                        ${style.daily}/day
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Smart Tip Card */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0e1326] rounded-3xl p-5 text-white shadow-lg">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h4 className="text-[13.5px] font-extrabold">
                  Money-Saving Tip
                </h4>
              </div>

              <p className="text-[12.5px] text-slate-300 font-medium leading-relaxed">
                In <strong>{selectedCity.name}</strong>, you can save up to{" "}
                <strong>
                  $
                  {(
                    (days || 0) *
                    (selectedCity.dailyBudget.luxury -
                      selectedCity.dailyBudget.midrange)
                  ).toLocaleString()}
                </strong>{" "}
                by opting for mid-range accommodation and dining instead of
                luxury — without sacrificing comfort or quality.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
