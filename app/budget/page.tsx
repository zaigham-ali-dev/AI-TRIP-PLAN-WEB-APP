"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { auth, db, signOutUser } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AddTripModal from "@/components/AddTripModal";
import AddExpenseModal from "@/components/AddExpenseModal";
import { TripItem } from "@/components/RecentTrips";
import { ExpenseItem } from "@/components/TopExpenses";
import {
  Wallet,
  TrendingDown,
  DollarSign,
  PieChart as PieIcon,
  Home,
  Utensils,
  Car,
  Ticket,
  MoreHorizontal,
  ArrowUpRight,
  ShieldCheck,
  AlertTriangle,
  Plus,
  Compass,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { LucideIcon } from "lucide-react";

// Standard budget allocation percentage weights across categories
const CATEGORY_WEIGHTS: Record<string, { weight: number; icon: LucideIcon; color: string; bg: string; text: string }> = {
  Accommodation: { weight: 0.35, icon: Home, color: "#3b82f6", bg: "bg-blue-50", text: "text-blue-600" },
  "Food & Dining": { weight: 0.25, icon: Utensils, color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-600" },
  Transport: { weight: 0.15, icon: Car, color: "#f97316", bg: "bg-orange-50", text: "text-orange-600" },
  Activities: { weight: 0.15, icon: Ticket, color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-600" },
  Others: { weight: 0.10, icon: MoreHorizontal, color: "#a855f7", bg: "bg-purple-50", text: "text-purple-600" },
};

export default function BudgetPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

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

  // Real-time Firestore Listeners
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
    setTrips((prev) => [optimisticTrip, ...prev]);

    try {
      await addDoc(collection(db, "users", user.uid, "trips"), {
        ...tripData,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to add trip:", err);
      setTrips((prev) => prev.filter((t) => t.id !== tempId));
    }
  };

  // Add Expense Handler
  const handleAddExpense = async (expenseData: Omit<ExpenseItem, "id">) => {
    if (!user) return;
    const tempId = `temp_exp_${Date.now()}`;
    const optimisticExpense: ExpenseItem = {
      id: tempId,
      ...expenseData,
    };
    setExpenses((prev) => [optimisticExpense, ...prev]);

    try {
      await addDoc(collection(db, "users", user.uid, "expenses"), {
        ...expenseData,
        createdAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Failed to add expense:", err);
      setExpenses((prev) => prev.filter((e) => e.id !== tempId));
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

  // Total Summary Metrics
  const totalBudget = useMemo(() => {
    return trips.reduce((acc, t) => acc + (Number(t.budget) || 0), 0);
  }, [trips]);

  const totalSpent = useMemo(() => {
    return expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const remainingBalance = Math.max(0, totalBudget - totalSpent);
  const utilizationRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  // Category Breakdown Calculations
  const categoryBreakdown = useMemo(() => {
    const actualByCategory: Record<string, number> = {
      Accommodation: 0,
      "Food & Dining": 0,
      Transport: 0,
      Activities: 0,
      Others: 0,
    };

    expenses.forEach((exp) => {
      const cat = exp.category;
      const amt = Number(exp.amount) || 0;
      if (cat in actualByCategory) {
        actualByCategory[cat] += amt;
      } else {
        actualByCategory["Others"] += amt;
      }
    });

    const baselineBudget = totalBudget > 0 ? totalBudget : 2500;

    return Object.keys(CATEGORY_WEIGHTS).map((catName) => {
      const config = CATEGORY_WEIGHTS[catName];
      const allocated = Math.round(baselineBudget * config.weight);
      const actual = actualByCategory[catName] || 0;
      const pct = allocated > 0 ? Math.min(150, Math.round((actual / allocated) * 100)) : 0;
      const remaining = allocated - actual;

      return {
        name: catName,
        allocated,
        actual,
        remaining,
        percentage: pct,
        icon: config.icon,
        color: config.color,
        bg: config.bg,
        text: config.text,
      };
    });
  }, [totalBudget, expenses]);

  // Chart Data for Budget vs Actual Comparison
  const chartData = useMemo(() => {
    return categoryBreakdown.map((item) => ({
      name: item.name,
      budget: item.allocated,
      actual: item.actual,
    }));
  }, [categoryBreakdown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">
            Loading your budget...
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
        <Sidebar activeTab="Budget" />
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
              activeTab="Budget"
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
              Budget Management
            </h2>
            <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
              Monitor allocations, compare spending against limits, and manage your budget health
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAddTripOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200/80 text-slate-700 text-[13px] font-bold rounded-xl shadow-xs transition-all cursor-pointer"
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>Add Trip</span>
            </button>
            <button
              onClick={() => setIsAddExpenseOpen(true)}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Top 4 Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total Budget */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Budget
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${totalBudget.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                {trips.length} active {trips.length === 1 ? "trip" : "trips"}
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* Total Spent */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Spent
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${totalSpent.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                {expenses.length} transactions recorded
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-xs">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>

          {/* Remaining Balance */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Remaining Balance
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${remainingBalance.toLocaleString()}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1.5 inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Available funds
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          {/* Budget Utilization */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Utilization Rate
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                {utilizationRate.toFixed(1)}%
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                {utilizationRate <= 80 ? "Healthy spending" : "Approaching limit"}
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shadow-xs">
              <PieIcon className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Visual Comparison Chart & Budget Health Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          {/* Comparison Bar Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col min-h-[320px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0e1326] tracking-tight">
                  Budget Allocation vs Actual Spend
                </h3>
                <p className="text-[11px] text-[#94a3b8] font-medium mt-0.5">
                  Comparison by expense category
                </p>
              </div>

              <div className="flex items-center gap-3 text-[11.5px] font-semibold">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-200" />
                  <span className="text-[#94a3b8]">Budget</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                  <span className="text-[#0e1326]">Actual</span>
                </div>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{ top: 15, right: 10, left: -20, bottom: 0 }}
                  barGap={4}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0e1326] text-white p-2.5 rounded-xl shadow-md text-[11px]">
                            <p className="font-bold mb-1">{label}</p>
                            <p className="text-blue-200">
                              Allocated: <span className="font-bold">${payload[0]?.value?.toLocaleString()}</span>
                            </p>
                            <p className="text-blue-400">
                              Spent: <span className="font-bold">${payload[1]?.value?.toLocaleString()}</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="budget" fill="#bfdbfe" radius={[4, 4, 0, 0]} maxBarSize={24} />
                  <Bar dataKey="actual" fill="#2563eb" radius={[4, 4, 0, 0]} maxBarSize={24} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget Health & Insights (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col justify-between min-h-[320px]">
            <div>
              <h3 className="text-[14px] font-extrabold text-[#0e1326] tracking-tight">
                Budget Health & Advice
              </h3>
              <p className="text-[11px] text-[#94a3b8] font-medium mt-0.5">
                Real-time recommendations for your trips
              </p>

              <div className="flex flex-col gap-3 mt-4">
                <div className="p-3.5 bg-blue-50/60 border border-blue-100 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12.5px] font-extrabold text-[#0e1326]">
                      Overall Status: {utilizationRate < 90 ? "Safe & Controlled" : "High Utilization"}
                    </h4>
                    <p className="text-[11.5px] text-[#64748b] font-medium mt-0.5 leading-relaxed">
                      You have spent ${totalSpent.toLocaleString()} of your ${totalBudget.toLocaleString()} budget with ${remainingBalance.toLocaleString()} remaining.
                    </p>
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/60 border border-amber-100 rounded-xl flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-[12.5px] font-extrabold text-[#0e1326]">
                      Smart Tip
                    </h4>
                    <p className="text-[11.5px] text-[#64748b] font-medium mt-0.5 leading-relaxed">
                      Keep Accommodation and Dining below 60% of total trip costs to preserve budget for excursions and emergencies.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[12px] font-semibold text-blue-600">
              <span>View full financial report</span>
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Category-wise Budget Breakdown Cards/Table */}
        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden mb-6">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-[15px] font-extrabold text-[#0e1326] tracking-tight">
                Category Allocations & Limits
              </h3>
              <p className="text-[11.5px] text-[#94a3b8] font-medium mt-0.5">
                Detailed breakdown of allocated limits vs actual spending per category
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70 text-[11.5px] font-bold uppercase tracking-wider text-[#94a3b8]">
                  <th className="py-3.5 px-5">Category</th>
                  <th className="py-3.5 px-5 text-right">Allocated Limit</th>
                  <th className="py-3.5 px-5 text-right">Actual Spent</th>
                  <th className="py-3.5 px-5 text-right">Remaining</th>
                  <th className="py-3.5 px-5 text-center">Progress</th>
                  <th className="py-3.5 px-5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[13px]">
                {categoryBreakdown.map((item) => {
                  const Icon = item.icon;
                  const isOver = item.actual > item.allocated;
                  const isNear = item.percentage >= 80 && !isOver;

                  return (
                    <tr key={item.name} className="hover:bg-slate-50/80 transition-colors">
                      {/* Category */}
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center shrink-0 shadow-xs`}
                          >
                            <Icon className={`w-4.5 h-4.5 ${item.text}`} />
                          </div>
                          <span className="font-extrabold text-[#0e1326]">
                            {item.name}
                          </span>
                        </div>
                      </td>

                      {/* Allocated Limit */}
                      <td className="py-4 px-5 text-right font-bold text-[#0e1326]">
                        ${item.allocated.toLocaleString()}
                      </td>

                      {/* Actual Spent */}
                      <td className="py-4 px-5 text-right font-extrabold text-blue-600">
                        ${item.actual.toLocaleString()}
                      </td>

                      {/* Remaining */}
                      <td className="py-4 px-5 text-right font-semibold">
                        <span
                          className={
                            item.remaining < 0
                              ? "text-red-600 font-bold"
                              : "text-emerald-600 font-bold"
                          }
                        >
                          {item.remaining < 0
                            ? `-$${Math.abs(item.remaining).toLocaleString()}`
                            : `$${item.remaining.toLocaleString()}`}
                        </span>
                      </td>

                      {/* Progress */}
                      <td className="py-4 px-5 min-w-[140px]">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isOver
                                  ? "bg-red-500"
                                  : isNear
                                  ? "bg-amber-500"
                                  : "bg-blue-600"
                              }`}
                              style={{ width: `${Math.min(100, item.percentage)}%` }}
                            />
                          </div>
                          <span className="text-[11px] font-bold text-[#64748b] w-8 text-right">
                            {item.percentage}%
                          </span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-4 px-5 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                            isOver
                              ? "bg-red-50 text-red-600 border-red-100"
                              : isNear
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-emerald-50 text-emerald-600 border-emerald-100"
                          }`}
                        >
                          {isOver ? "Over Budget" : isNear ? "Near Limit" : "On Track"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trips Budget List Section */}
        {trips.length > 0 && (
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
            <h3 className="text-[15px] font-extrabold text-[#0e1326] tracking-tight mb-4">
              Trips Budget Allocation
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {trips.map((trip, idx) => {
                const bVal = Number(trip.budget) || 0;
                const sVal = Number(trip.totalSpent) || 0;
                const pVal = bVal > 0 ? Math.min(100, Math.round((sVal / bVal) * 100)) : 0;

                return (
                  <div
                    key={trip.id || idx}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-[13.5px] font-extrabold text-[#0e1326] truncate">
                        {trip.title}
                      </h4>
                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                        ${bVal.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-[11.5px] text-[#94a3b8] font-medium mb-3">
                      {trip.destination || "Destination"}
                    </p>
                    <div className="flex items-center justify-between text-[11px] font-bold text-[#64748b] mb-1">
                      <span>Spent: ${sVal.toLocaleString()}</span>
                      <span>{pVal}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full"
                        style={{ width: `${pVal}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <AddTripModal
        isOpen={isAddTripOpen}
        onClose={() => setIsAddTripOpen(false)}
        onSubmit={handleAddTrip}
      />

      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
}
