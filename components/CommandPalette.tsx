"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";
import {
  Search,
  LayoutGrid,
  Compass,
  Wallet,
  Receipt,
  Route,
  Building2,
  RefreshCw,
  Coins,
  Sparkles,
  BarChart3,
  Settings,
  DollarSign,
  MapPin,
  Calendar,
  Tag,
  ArrowRight,
  CornerDownLeft,
  X,
} from "lucide-react";

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: "Pages" | "Trips" | "Expenses" | "Accommodation";
  href: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  badge?: string;
}

const STATIC_PAGES: CommandItem[] = [
  {
    id: "page-dashboard",
    title: "Dashboard",
    subtitle: "Overview metrics, spending breakdown & charts",
    category: "Pages",
    href: "/dashboard",
    icon: LayoutGrid,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "page-trips",
    title: "Trips Management",
    subtitle: "View and manage all travel itineraries",
    category: "Pages",
    href: "/trips",
    icon: Compass,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "page-budget",
    title: "Budget & Allocations",
    subtitle: "Category budget limits and spending progress",
    category: "Pages",
    href: "/budget",
    icon: Wallet,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
  },
  {
    id: "page-expenses",
    title: "Expenses Tracker",
    subtitle: "Record, filter, and track all travel expenses",
    category: "Pages",
    href: "/expenses",
    icon: Receipt,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    id: "page-routes",
    title: "Travel Routes & Itineraries",
    subtitle: "Interactive world map and waypoint paths",
    category: "Pages",
    href: "/routes",
    icon: Route,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    id: "page-accommodation",
    title: "Accommodation & Stays",
    subtitle: "Hotel bookings, check-in dates, and costs",
    category: "Pages",
    href: "/accommodation",
    icon: Building2,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
  },
  {
    id: "page-currency",
    title: "Currency Converter",
    subtitle: "Real-time exchange rate calculator & pairs",
    category: "Pages",
    href: "/currency",
    icon: RefreshCw,
    iconBg: "bg-cyan-50",
    iconColor: "text-cyan-600",
  },
  {
    id: "page-cost-of-living",
    title: "Cost of Living Estimator",
    subtitle: "City expense benchmarks & trip calculator",
    category: "Pages",
    href: "/cost-of-living",
    icon: Coins,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
  },
  {
    id: "page-ai-planner",
    title: "AI Travel Planner",
    subtitle: "Generate smart day-by-day itineraries",
    category: "Pages",
    href: "/ai-planner",
    icon: Sparkles,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
  },
  {
    id: "page-reports",
    title: "Analytics & Reports",
    subtitle: "Financial trends, lifetime stats & CSV export",
    category: "Pages",
    href: "/reports",
    icon: BarChart3,
    iconBg: "bg-indigo-50",
    iconColor: "text-indigo-600",
  },
  {
    id: "page-settings",
    title: "Settings & Profile",
    subtitle: "Profile, currency defaults & security",
    category: "Pages",
    href: "/settings",
    icon: Settings,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
  },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({
  isOpen,
  onClose,
}: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Firestore Data State
  const [tripsData, setTripsData] = useState<CommandItem[]>([]);
  const [expensesData, setExpensesData] = useState<CommandItem[]>([]);
  const [accommodationsData, setAccommodationsData] = useState<CommandItem[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Sync Auth User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Collections for live search index
  useEffect(() => {
    if (!currentUser) {
      setTripsData([]);
      setExpensesData([]);
      setAccommodationsData([]);
      return;
    }

    const unsubTrips = onSnapshot(
      collection(db, "users", currentUser.uid, "trips"),
      (snap) => {
        const items: CommandItem[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          items.push({
            id: `trip-${docSnap.id}`,
            title: d.title || d.destination || "Untitled Trip",
            subtitle: `${d.destination || "Destination"} • Budget: $${(
              Number(d.budget) || 0
            ).toLocaleString()}`,
            category: "Trips",
            href: "/trips",
            icon: Compass,
            iconBg: "bg-blue-50",
            iconColor: "text-blue-600",
            badge: d.destination,
          });
        });
        setTripsData(items);
      }
    );

    const unsubExpenses = onSnapshot(
      collection(db, "users", currentUser.uid, "expenses"),
      (snap) => {
        const items: CommandItem[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          items.push({
            id: `expense-${docSnap.id}`,
            title: d.title || "Untitled Expense",
            subtitle: `$${(Number(d.amount) || 0).toLocaleString()} • ${
              d.category || "General"
            }${d.date ? ` • ${d.date}` : ""}`,
            category: "Expenses",
            href: "/expenses",
            icon: Receipt,
            iconBg: "bg-purple-50",
            iconColor: "text-purple-600",
            badge: `$${Number(d.amount) || 0}`,
          });
        });
        setExpensesData(items);
      }
    );

    const unsubAccommodations = onSnapshot(
      collection(db, "users", currentUser.uid, "accommodation"),
      (snap) => {
        const items: CommandItem[] = [];
        snap.forEach((docSnap) => {
          const d = docSnap.data();
          items.push({
            id: `stay-${docSnap.id}`,
            title: d.name || "Hotel Stay",
            subtitle: `${d.location || "Location"} • ${d.roomType || "Room"} • $${
              Number(d.cost) || 0
            }`,
            category: "Accommodation",
            href: "/accommodation",
            icon: Building2,
            iconBg: "bg-emerald-50",
            iconColor: "text-emerald-600",
            badge: d.status || "Stay",
          });
        });
        setAccommodationsData(items);
      }
    );

    return () => {
      unsubTrips();
      unsubExpenses();
      unsubAccommodations();
    };
  }, [currentUser]);

  // Global Keyboard Shortcut (Cmd+K / Ctrl+K / Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Trigger open via custom event or header state
          const event = new CustomEvent("toggle-command-palette");
          window.dispatchEvent(event);
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setSearchQuery("");
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Filter and Combine Results
  const filteredResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (!q) {
      // Default: show pages and recent items
      return [
        ...STATIC_PAGES,
        ...tripsData.slice(0, 3),
        ...expensesData.slice(0, 3),
        ...accommodationsData.slice(0, 2),
      ];
    }

    const matchItem = (item: CommandItem) =>
      item.title.toLowerCase().includes(q) ||
      (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
      (item.badge && item.badge.toLowerCase().includes(q));

    return [
      ...STATIC_PAGES.filter(matchItem),
      ...tripsData.filter(matchItem),
      ...expensesData.filter(matchItem),
      ...accommodationsData.filter(matchItem),
    ];
  }, [searchQuery, tripsData, expensesData, accommodationsData]);

  // Reset selected index if results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredResults.length]);

  // Handle Key Navigation inside dialog
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (filteredResults.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex(
        (prev) => (prev - 1 + filteredResults.length) % filteredResults.length
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = filteredResults[selectedIndex];
      if (target) {
        handleNavigate(target.href);
      }
    }
  };

  const handleNavigate = (href: string) => {
    onClose();
    router.push(href);
  };

  // Group filtered results by Category
  const groupedResults = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredResults.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [filteredResults]);

  if (!isOpen) return null;

  let flatIndexCounter = 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={onClose}
      />

      {/* Palette Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100/90 z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-5 py-4 border-b border-slate-100 bg-white">
          <Search className="w-5 h-5 text-blue-600 shrink-0 mr-3.5" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search pages, trips, expenses, or hotels... (Type or use ↑↓)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="w-full bg-transparent text-[15px] font-bold text-[#0e1326] placeholder-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 mr-2 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center px-2 py-1 bg-slate-100 border border-slate-200/80 rounded-lg text-[11px] font-bold text-slate-500">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 space-y-4 max-h-[460px] scrollbar-thin scrollbar-thumb-slate-200"
        >
          {filteredResults.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-[14px] font-extrabold text-[#0e1326]">
                No matching results found
              </h4>
              <p className="text-[12px] text-[#94a3b8] font-medium mt-0.5 max-w-xs">
                No trips, expenses, or pages matched &quot;{searchQuery}&quot;. Try a different keyword.
              </p>
            </div>
          ) : (
            Object.entries(groupedResults).map(([category, items]) => (
              <div key={category} className="space-y-1">
                {/* Category Header */}
                <div className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-[#94a3b8] flex items-center justify-between">
                  <span>{category}</span>
                  <span className="text-[10px] font-medium text-slate-400">
                    {items.length} {items.length === 1 ? "result" : "results"}
                  </span>
                </div>

                {/* Items in this Category */}
                {items.map((item) => {
                  const currentIndex = flatIndexCounter++;
                  const isSelected = currentIndex === selectedIndex;
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.href)}
                      onMouseEnter={() => setSelectedIndex(currentIndex)}
                      className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all text-left cursor-pointer ${
                        isSelected
                          ? "bg-blue-50/70 border border-blue-200/80 shadow-xs"
                          : "hover:bg-slate-50 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div
                          className={`w-9 h-9 rounded-xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0 shadow-xs`}
                        >
                          <Icon className="w-4.5 h-4.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`text-[13.5px] font-bold truncate ${
                                isSelected ? "text-blue-700" : "text-[#0e1326]"
                              }`}
                            >
                              {item.title}
                            </span>
                            {item.badge && (
                              <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md shrink-0">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-[11.5px] text-[#64748b] font-medium truncate mt-0.5">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0 ml-3">
                        {isSelected ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 bg-white px-2 py-1 rounded-lg border border-blue-200 shadow-2xs">
                            <span>Open</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </span>
                        ) : (
                          <ArrowRight className="w-4 h-4 text-slate-300" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between text-[11px] text-[#94a3b8] font-medium">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600">
                ↑
              </kbd>
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600">
                ↓
              </kbd>{" "}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-[10px] font-bold text-slate-600">
                ↵
              </kbd>{" "}
              Select
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <span className="font-bold text-slate-600">Triply Search</span>
          </div>
        </div>
      </div>
    </div>
  );
}
