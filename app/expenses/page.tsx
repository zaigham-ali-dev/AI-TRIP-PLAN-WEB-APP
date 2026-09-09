"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
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
import AddExpenseModal from "@/components/AddExpenseModal";
import { ExpenseItem } from "@/components/TopExpenses";
import { TripItem } from "@/components/RecentTrips";
import { checkAndTriggerBudgetAlert } from "@/lib/notifications";
import type { LucideIcon } from "lucide-react";
import {
  Receipt,
  Plus,
  Search,
  Calendar,
  DollarSign,
  Trash2,
  Home,
  Utensils,
  Car,
  Ticket,
  MoreHorizontal,
  CreditCard,
  Layers,
} from "lucide-react";

// Category config mapping for icons and badges
const categoryBadgeConfig: Record<
  string,
  { icon: LucideIcon; bg: string; text: string; border: string }
> = {
  Accommodation: {
    icon: Home,
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-100",
  },
  "Food & Dining": {
    icon: Utensils,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-100",
  },
  Transport: {
    icon: Car,
    bg: "bg-orange-50",
    text: "text-orange-600",
    border: "border-orange-100",
  },
  Activities: {
    icon: Ticket,
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-100",
  },
  Others: {
    icon: MoreHorizontal,
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-100",
  },
};

// Format date helper
function formatExpenseDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ExpensesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  // Real-time Firestore Listeners for Expenses & Trips
  useEffect(() => {
    if (!user) return;

    const expensesColRef = collection(db, "users", user.uid, "expenses");
    const tripsColRef = collection(db, "users", user.uid, "trips");

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

    return () => {
      unsubExpenses();
      unsubTrips();
    };
  }, [user]);

  // Add Expense Handler
  const handleAddExpense = async (expenseData: Omit<ExpenseItem, "id">) => {
    if (!user) return;
    const tempId = `temp_exp_${Date.now()}`;
    const optimisticExpense: ExpenseItem = {
      id: tempId,
      ...expenseData,
    };
    // Optimistic UI update (0ms delay)
    setExpenses((prev) => [optimisticExpense, ...prev]);

    try {
      await addDoc(collection(db, "users", user.uid, "expenses"), {
        ...expenseData,
        createdAt: serverTimestamp(),
      });

      // Automated budget alert check
      const currentSpent = expenses.reduce(
        (acc, e) => acc + (Number(e.amount) || 0),
        0
      );
      const totalBudget = trips.reduce(
        (acc, t) => acc + (Number(t.budget) || 0),
        0
      );
      await checkAndTriggerBudgetAlert(
        user.uid,
        expenseData.amount,
        currentSpent,
        totalBudget
      );
    } catch (err) {
      console.error("Failed to add expense:", err);
      setExpenses((prev) => prev.filter((e) => e.id !== tempId));
    }
  };

  // Delete Expense Handler
  const handleDeleteExpense = async (expenseId: string) => {
    if (!user) return;
    const previousExpenses = [...expenses];
    setExpenses((prev) => prev.filter((e) => e.id !== expenseId));

    try {
      await deleteDoc(doc(db, "users", user.uid, "expenses", expenseId));
    } catch (err) {
      console.error("Failed to delete expense:", err);
      setExpenses(previousExpenses);
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

  // Summary Metrics
  const totalSpent = expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  const highestExpense = expenses.length > 0 ? Math.max(...expenses.map((e) => Number(e.amount) || 0)) : 0;
  const averageExpense = expenses.length > 0 ? totalSpent / expenses.length : 0;

  // Filtered expenses
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchSearch =
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === "All" ||
        exp.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchSearch && matchCategory;
    });
  }, [expenses, searchQuery, selectedCategory]);

  const categories = [
    "All",
    "Accommodation",
    "Food & Dining",
    "Transport",
    "Activities",
    "Others",
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">
            Loading your expenses...
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
        <Sidebar activeTab="Expenses" />
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
              activeTab="Expenses"
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
              Expenses Management
            </h2>
            <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
              Track, organize, and monitor all your trip expenditures
            </p>
          </div>

          <button
            onClick={() => setIsAddExpenseOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Expense</span>
          </button>
        </div>

        {/* Stat Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Expenses
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${totalSpent.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                All time spending
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Transactions
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                {expenses.length}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                {expenses.length === 1 ? "1 item recorded" : `${expenses.length} items recorded`}
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-xs">
              <Receipt className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Highest Expense
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${highestExpense.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                Single transaction peak
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Average Expense
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${Math.round(averageExpense).toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                Per transaction average
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="bg-white rounded-2xl p-4 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search expenses by title or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 bg-slate-50 border border-slate-200/80 rounded-xl text-[13px] text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-[12px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-xs"
                      : "bg-slate-50 text-[#64748b] hover:bg-slate-100 hover:text-[#0e1326]"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Structured Expenses Table */}
        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          {filteredExpenses.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-3xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 shadow-xs">
                <Receipt className="w-8 h-8" />
              </div>
              <h3 className="text-[18px] font-extrabold text-[#0e1326] tracking-tight">
                {searchQuery || selectedCategory !== "All"
                  ? "No matching expenses found"
                  : "No expenses recorded yet"}
              </h3>
              <p className="text-[13px] text-[#94a3b8] font-medium max-w-sm mt-1 mb-5">
                {searchQuery || selectedCategory !== "All"
                  ? "Try resetting your search query or selecting a different category filter."
                  : "Start logging your daily purchases, hotel stays, food, transport, and activities."}
              </p>
              <button
                onClick={() => setIsAddExpenseOpen(true)}
                className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
              >
                + Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11.5px] font-bold uppercase tracking-wider text-[#94a3b8]">
                    <th className="py-3.5 px-5">Description</th>
                    <th className="py-3.5 px-5">Category</th>
                    <th className="py-3.5 px-5">Date</th>
                    <th className="py-3.5 px-5 text-right">Amount</th>
                    <th className="py-3.5 px-5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13.5px]">
                  {filteredExpenses.map((exp, idx) => {
                    const cfg =
                      categoryBadgeConfig[exp.category] ||
                      categoryBadgeConfig["Others"];
                    const CategoryIcon = cfg.icon;

                    return (
                      <tr
                        key={exp.id || idx}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Description */}
                        <td className="py-4 px-5 font-bold text-[#0e1326]">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 shadow-xs`}
                            >
                              <CategoryIcon className={`w-4.5 h-4.5 ${cfg.text}`} />
                            </div>
                            <span className="truncate max-w-[240px]">
                              {exp.title}
                            </span>
                          </div>
                        </td>

                        {/* Category Badge */}
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[12px] font-bold border ${cfg.bg} ${cfg.text} ${cfg.border}`}
                          >
                            <CategoryIcon className="w-3.5 h-3.5" />
                            {exp.category}
                          </span>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-5 text-[#64748b] font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formatExpenseDate(exp.date)}</span>
                          </div>
                        </td>

                        {/* Amount */}
                        <td className="py-4 px-5 text-right font-extrabold text-[#0e1326] text-[14px]">
                          ${Number(exp.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>

                        {/* Action Column */}
                        <td className="py-4 px-5 text-center">
                          {exp.id && (
                            <button
                              onClick={() => handleDeleteExpense(exp.id!)}
                              className="p-2 rounded-xl text-slate-300 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer opacity-80 group-hover:opacity-100"
                              title="Delete expense"
                              aria-label="Delete expense"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSubmit={handleAddExpense}
      />
    </div>
  );
}
