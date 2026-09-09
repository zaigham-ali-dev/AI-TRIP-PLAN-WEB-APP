"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { auth, db, signOutUser } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
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
import AddAccommodationModal, {
  AccommodationItem,
} from "@/components/AddAccommodationModal";
import { createNotification } from "@/lib/notifications";
import {
  Building2,
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  Trash2,
  BedDouble,
  ShieldCheck,
  AlertCircle,
  XCircle,
} from "lucide-react";

// Format date range helper
function formatStayDates(checkIn?: string, checkOut?: string): string {
  if (!checkIn) return "Dates pending";
  try {
    const start = new Date(checkIn);
    const end = checkOut ? new Date(checkOut) : start;
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
    return checkIn;
  }
}

// Calculate nights duration helper
function calculateNights(checkIn?: string, checkOut?: string): number {
  if (!checkIn || !checkOut) return 1;
  try {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  } catch {
    return 1;
  }
}

export default function AccommodationPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stays, setStays] = useState<AccommodationItem[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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

  // Real-time Firestore Listener for Accommodation
  useEffect(() => {
    if (!user) return;

    const accomColRef = collection(db, "users", user.uid, "accommodation");

    const unsub = onSnapshot(
      accomColRef,
      (snapshot) => {
        const loadedStays: AccommodationItem[] = [];
        snapshot.forEach((docSnap) => {
          loadedStays.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<AccommodationItem, "id">),
          });
        });
        setStays(loadedStays);
      },
      (err) => {
        console.error("Error listening to accommodation:", err);
      }
    );

    return () => unsub();
  }, [user]);

  // Add Accommodation Handler
  const handleAddAccommodation = async (data: Omit<AccommodationItem, "id">) => {
    if (!user) return;
    const tempId = `temp_stay_${Date.now()}`;
    const optimisticStay: AccommodationItem = {
      id: tempId,
      ...data,
    };
    setStays((prev) => [optimisticStay, ...prev]);

    try {
      await addDoc(collection(db, "users", user.uid, "accommodation"), {
        ...data,
        createdAt: serverTimestamp(),
      });
      // Automated notification trigger
      await createNotification(user.uid, {
        title: "Accommodation Booked",
        message: `Stay at "${data.name}" in ${data.location} recorded ($${data.cost}).`,
        type: "accommodation_created",
      });
    } catch (err) {
      console.error("Failed to add accommodation:", err);
      setStays((prev) => prev.filter((s) => s.id !== tempId));
    }
  };

  // Delete Accommodation Handler
  const handleDeleteAccommodation = async (stayId: string) => {
    if (!user) return;
    const previousStays = [...stays];
    setStays((prev) => prev.filter((s) => s.id !== stayId));

    try {
      await deleteDoc(doc(db, "users", user.uid, "accommodation", stayId));
    } catch (err) {
      console.error("Failed to delete accommodation:", err);
      setStays(previousStays);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Top Metrics
  const totalCost = stays.reduce((acc, s) => acc + (Number(s.cost) || 0), 0);
  const confirmedCount = stays.filter((s) => s.status === "Confirmed").length;
  const pendingCount = stays.filter((s) => s.status === "Pending").length;

  // Filtered Stays
  const filteredStays = useMemo(() => {
    return stays.filter((stay) => {
      const matchSearch =
        stay.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        stay.roomType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus =
        statusFilter === "All" ||
        stay.status.toLowerCase() === statusFilter.toLowerCase();

      return matchSearch && matchStatus;
    });
  }, [stays, searchQuery, statusFilter]);

  const statusOptions = ["All", "Confirmed", "Pending", "Cancelled"];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">
            Loading your accommodations...
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
        <Sidebar activeTab="Accommodation" />
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
              activeTab="Accommodation"
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
              Accommodation & Stays
            </h2>
            <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
              Manage hotel bookings, resort stays, check-in dates, and lodging budgets
            </p>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Accommodation</span>
          </button>
        </div>

        {/* Top 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Stays */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Stays
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                {stays.length}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                {stays.length === 1 ? "1 property booked" : `${stays.length} properties booked`}
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
          </div>

          {/* Confirmed Bookings */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Confirmed Bookings
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                {confirmedCount}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1.5 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Voucher secured
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Pending Confirmations */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Pending Stays
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                {pendingCount}
              </div>
              <span className="text-[11px] text-amber-600 font-bold mt-1.5 inline-flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                Awaiting confirmation
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>

          {/* Total Accommodation Spent */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Lodging Cost
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${totalCost.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                Across all hotel reservations
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search hotel name, city, or room..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {statusOptions.map((opt) => {
              const isSelected = statusFilter === opt;
              return (
                <button
                  key={opt}
                  onClick={() => setStatusFilter(opt)}
                  className={`px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-50 text-[#64748b] hover:bg-slate-100 hover:text-[#0e1326]"
                  }`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>

        {/* Stays Grid & Table / Empty State */}
        {filteredStays.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
              <Building2 className="w-8 h-8" />
            </div>
            <h3 className="text-[18px] font-extrabold text-[#0e1326] tracking-tight">
              {searchQuery || statusFilter !== "All"
                ? "No matching stays found"
                : "No accommodations recorded yet"}
            </h3>
            <p className="text-[13px] text-[#94a3b8] font-medium max-w-sm mt-1 mb-5">
              {searchQuery || statusFilter !== "All"
                ? "Try adjusting your search terms or clearing your status filter."
                : "Record your luxury suites, oceanfront villas, and hotel reservations to organize your trip stays."}
            </p>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              + Add Your First Stay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredStays.map((stay, idx) => {
              const nights = calculateNights(stay.checkIn, stay.checkOut);
              const dateStr = formatStayDates(stay.checkIn, stay.checkOut);

              const imageSrc =
                stay.image ||
                (idx % 3 === 0
                  ? "/images/greece-thumb.jpg"
                  : idx % 3 === 1
                  ? "/images/bali-thumb.jpg"
                  : "/images/japan-thumb.jpg");

              const isConfirmed = stay.status === "Confirmed";
              const isPending = stay.status === "Pending";

              return (
                <div
                  key={stay.id || idx}
                  className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)] transition-all overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Stay Image & Badges */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={imageSrc}
                        alt={stay.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                      {/* Status Badge Top Left */}
                      <div className="absolute top-3.5 left-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold shadow-xs backdrop-blur-md ${
                            isConfirmed
                              ? "bg-emerald-500/90 text-white"
                              : isPending
                              ? "bg-amber-500/90 text-white"
                              : "bg-red-500/90 text-white"
                          }`}
                        >
                          {isConfirmed ? (
                            <CheckCircle2 className="w-3 h-3" />
                          ) : isPending ? (
                            <AlertCircle className="w-3 h-3" />
                          ) : (
                            <XCircle className="w-3 h-3" />
                          )}
                          {stay.status}
                        </span>
                      </div>

                      {/* Delete Button Top Right */}
                      {stay.id && (
                        <button
                          onClick={() => handleDeleteAccommodation(stay.id!)}
                          className="absolute top-3.5 right-3.5 p-2 bg-white/90 backdrop-blur-md rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-all shadow-xs cursor-pointer"
                          title="Delete booking"
                          aria-label="Delete booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Property Details on Image */}
                      <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                        <h4 className="text-[16px] font-extrabold leading-tight drop-shadow-sm truncate">
                          {stay.name}
                        </h4>
                        <div className="flex items-center gap-1.5 text-[11.5px] text-white/90 mt-0.5 font-medium drop-shadow-xs">
                          <MapPin className="w-3.5 h-3.5 text-blue-400" />
                          <span className="truncate">{stay.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-5 flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-[12px] text-[#64748b] font-medium">
                          <BedDouble className="w-4 h-4 text-slate-400" />
                          <span>{stay.roomType}</span>
                        </div>
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                          {nights} {nights === 1 ? "night" : "nights"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <div className="flex items-center gap-1.5 text-[11.5px] text-[#94a3b8] font-medium">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{dateStr}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-[16px] font-extrabold text-[#0e1326]">
                            ${Number(stay.cost).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11.5px] font-semibold text-[#94a3b8]">
                    <span>Booking Reference</span>
                    <span className="font-mono text-slate-600 font-bold uppercase">
                      TRIP-{stay.id ? stay.id.slice(-5) : "HOTEL"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Add Accommodation Modal */}
      <AddAccommodationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddAccommodation}
      />
    </div>
  );
}
