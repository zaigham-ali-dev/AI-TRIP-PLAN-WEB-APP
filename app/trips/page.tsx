"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AddTripModal from "@/components/AddTripModal";
import { TripItem } from "@/components/RecentTrips";
import { ExpenseItem } from "@/components/TopExpenses";
import { createNotification } from "@/lib/notifications";
import {
  Compass,
  Plus,
  Search,
  Calendar,
  DollarSign,
  MapPin,
  Trash2,
  Plane,
  TrendingUp,
} from "lucide-react";

// Format date range helper
function formatDateRange(startDate?: string, endDate?: string, fallback?: string): string {
  if (!startDate) return fallback || "Dates pending";
  try {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;
    const startMonth = start.toLocaleString("default", { month: "short" });
    const endMonth = end.toLocaleString("default", { month: "short" });
    const startDay = start.getDate();
    const endDay = end.getDate();
    const year = end.getFullYear();

    if (startMonth === endMonth) {
      return `${startMonth} ${startDay} - ${endDay}, ${year}`;
    }
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${year}`;
  } catch {
    return fallback || startDate;
  }
}

export default function TripsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  const router = useRouter();

  // Auth Protection Listener
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

  // Real-time Firestore Listeners for Trips & Expenses
  useEffect(() => {
    if (!user) return;

    const tripsColRef = collection(db, "users", user.uid, "trips");
    const expensesColRef = collection(db, "users", user.uid, "expenses");

    const unsubTrips = onSnapshot(
      tripsColRef,
      (snapshot) => {
        const loadedTrips: TripItem[] = [];
        snapshot.forEach((docSnap) => {
          loadedTrips.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<TripItem, "id">),
          });
        });
        setTrips(loadedTrips);
      },
      (err) => {
        console.error("Error listening to trips:", err);
      }
    );

    const unsubExpenses = onSnapshot(
      expensesColRef,
      (snapshot) => {
        const loadedExpenses: ExpenseItem[] = [];
        snapshot.forEach((docSnap) => {
          loadedExpenses.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ExpenseItem, "id">),
          });
        });
        setExpenses(loadedExpenses);
      },
      (err) => {
        console.error("Error listening to expenses:", err);
      }
    );

    return () => {
      unsubTrips();
      unsubExpenses();
    };
  }, [user]);

  // Add Trip Handler
  const handleAddTrip = async (tripData: Omit<TripItem, "id">) => {
    if (!user) return;
    const tempId = `temp_trip_${Date.now()}`;
    const optimisticTrip: TripItem = {
      id: tempId,
      ...tripData,
    };
    // Optimistic UI update (0ms delay)
    setTrips((prev) => [optimisticTrip, ...prev]);

    try {
      await addDoc(collection(db, "users", user.uid, "trips"), {
        ...tripData,
        createdAt: serverTimestamp(),
      });
      // Automated notification trigger
      await createNotification(user.uid, {
        title: "Trip Created",
        message: `New trip to "${tripData.destination}" added with a budget of $${tripData.budget}.`,
        type: "trip_created",
      });
    } catch (err) {
      console.error("Failed to add trip:", err);
      setTrips((prev) => prev.filter((t) => t.id !== tempId));
    }
  };

  // Delete Trip Handler
  const handleDeleteTrip = async (tripId: string) => {
    if (!user) return;
    const previousTrips = [...trips];
    setTrips((prev) => prev.filter((t) => t.id !== tripId));

    try {
      await deleteDoc(doc(db, "users", user.uid, "trips", tripId));
    } catch (err) {
      console.error("Failed to delete trip:", err);
      setTrips(previousTrips);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Summary Metrics
  const totalBudget = trips.reduce((acc, t) => acc + (Number(t.budget) || 0), 0);
  const totalSpent = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);

  // Filtered trips
  const filteredTrips = useMemo(() => {
    return trips.filter((trip) => {
      const matchQuery =
        trip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (trip.destination &&
          trip.destination.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchQuery;
    });
  }, [trips, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">
            Loading your trips...
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
        <Sidebar activeTab="Trips" />
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
              activeTab="Trips"
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        {/* Header */}
        <DashboardHeader
          userName={formattedName}
          userEmail={user.email || ""}
          onSignOut={handleSignOut}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Page Title & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#0e1326] tracking-tight">
              My Trips
            </h2>
            <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
              Plan, manage, and track all your travel adventures
            </p>
          </div>

          <button
            onClick={() => setIsAddTripOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Trip</span>
          </button>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Trips
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                {trips.length}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                {trips.length === 1 ? "1 destination" : `${trips.length} destinations`}
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
              <Compass className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Budget
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${totalBudget.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                Allocated across all trips
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Expenses
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${totalSpent.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                {totalBudget > 0
                  ? `${((totalSpent / totalBudget) * 100).toFixed(1)}% of total budget`
                  : "0% of budget"}
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-3 mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title or destination..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="text-[12.5px] font-semibold text-[#94a3b8] self-end sm:self-auto">
            Showing <span className="text-[#0e1326] font-bold">{filteredTrips.length}</span>{" "}
            {filteredTrips.length === 1 ? "trip" : "trips"}
          </div>
        </div>

        {/* Trips Grid / Empty State */}
        {filteredTrips.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
              <Plane className="w-8 h-8" />
            </div>
            <h3 className="text-[18px] font-extrabold text-[#0e1326] tracking-tight">
              {searchQuery ? "No matching trips found" : "No trips created yet"}
            </h3>
            <p className="text-[13px] text-[#94a3b8] font-medium max-w-sm mt-1 mb-5">
              {searchQuery
                ? "Try searching for a different keyword or clear your search filter."
                : "Start planning your vacation! Add destinations, allocate budgets, and track your expenses."}
            </p>
            <button
              onClick={() => setIsAddTripOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              + Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTrips.map((trip, idx) => {
              const dateStr = formatDateRange(trip.startDate, trip.endDate, trip.dates);
              const durationStr =
                trip.duration ||
                (trip.durationDays ? `${trip.durationDays} Days` : "1 Day");

              const budgetVal = trip.budget || 0;
              const spentVal = trip.totalSpent || 0;
              const progressPct =
                budgetVal > 0
                  ? Math.min(100, Math.round((spentVal / budgetVal) * 100))
                  : 0;

              const imageSrc =
                trip.image ||
                (idx % 3 === 0
                  ? "/images/greece-thumb.jpg"
                  : idx % 3 === 1
                  ? "/images/bali-thumb.jpg"
                  : "/images/japan-thumb.jpg");

              return (
                <div
                  key={trip.id || idx}
                  className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all overflow-hidden flex flex-col justify-between group"
                >
                  {/* Trip Card Image & Header */}
                  <div>
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={imageSrc}
                        alt={trip.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      {/* Destination Badge Top Left */}
                      <div className="absolute top-3.5 left-3.5 px-2.5 py-1 bg-white/90 backdrop-blur-md rounded-lg text-[11px] font-bold text-[#0e1326] shadow-xs flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span className="truncate max-w-[120px]">
                          {trip.destination || "Destination"}
                        </span>
                      </div>

                      {/* Delete Button Top Right */}
                      {trip.id && (
                        <button
                          onClick={() => handleDeleteTrip(trip.id!)}
                          className="absolute top-3.5 right-3.5 p-2 bg-white/90 backdrop-blur-md rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-all shadow-xs cursor-pointer"
                          title="Delete trip"
                          aria-label="Delete trip"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Title & Dates on Bottom of Image */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                        <h4 className="text-[16px] font-extrabold leading-tight drop-shadow-sm truncate">
                          {trip.title}
                        </h4>
                        <div className="flex items-center gap-2 text-[11.5px] text-white/90 mt-0.5 font-medium drop-shadow-xs">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{dateStr}</span>
                          <span>•</span>
                          <span>{durationStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body Metrics */}
                    <div className="p-4 sm:p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider block">
                            Allocated Budget
                          </span>
                          <span className="text-[18px] font-extrabold text-[#0e1326]">
                            ${budgetVal.toLocaleString()}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider block">
                            Total Spent
                          </span>
                          <span className="text-[18px] font-extrabold text-blue-600">
                            ${spentVal.toLocaleString()}
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-[11.5px] font-bold mb-1.5">
                          <span className="text-[#64748b]">Budget Used</span>
                          <span className="text-[#0e1326]">{progressPct}%</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-blue-600 rounded-full transition-all duration-300"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11.5px] text-[#94a3b8] font-semibold">
                      Status:{" "}
                      <span className="text-emerald-600 font-bold">Active</span>
                    </span>
                    <span className="text-[11.5px] text-[#64748b] font-bold">
                      ${Math.max(0, budgetVal - spentVal).toLocaleString()} remaining
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Trip Modal */}
      <AddTripModal
        isOpen={isAddTripOpen}
        onClose={() => setIsAddTripOpen(false)}
        onSubmit={handleAddTrip}
      />
    </div>
  );
}
