"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  doc,
  deleteDoc,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import StatCards, { DashboardStats } from "@/components/StatCard";
import SpendingChart from "@/components/SpendingChart";
import TopExpenses, { ExpenseItem } from "@/components/TopExpenses";
import RecentTrips, { TripItem } from "@/components/RecentTrips";
import SpendingOverview from "@/components/SpendingOverview";
import BudgetVsActual from "@/components/BudgetVsActual";
import AddTripModal from "@/components/AddTripModal";
import AddExpenseModal from "@/components/AddExpenseModal";
import {
  createNotification,
  checkAndTriggerBudgetAlert,
} from "@/lib/notifications";

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  const router = useRouter();

  // Auth Listener
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

  // Real-Time Firestore Listeners for Trips and Expenses
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
        console.error("Error listening to trips collection:", err);
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
        console.error("Error listening to expenses collection:", err);
      }
    );

    return () => {
      unsubTrips();
      unsubExpenses();
    };
  }, [user]);

  // Add Trip Handler with Instant Optimistic UI Update
  const handleAddTrip = async (tripData: Omit<TripItem, "id">) => {
    if (!user) return;
    const tempId = `temp_${Date.now()}`;
    const optimisticTrip: TripItem = {
      id: tempId,
      ...tripData,
    };
    // Update local state instantly (0ms delay)
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
      // Revert optimistic update on error
      setTrips((prev) => prev.filter((t) => t.id !== tempId));
    }
  };

  // Delete Trip Handler with Instant Optimistic UI Update
  const handleDeleteTrip = async (tripId: string) => {
    if (!user) return;
    // Optimistic removal
    const previousTrips = [...trips];
    setTrips((prev) => prev.filter((t) => t.id !== tripId));

    try {
      await deleteDoc(doc(db, "users", user.uid, "trips", tripId));
    } catch (err) {
      console.error("Failed to delete trip:", err);
      // Revert on error
      setTrips(previousTrips);
    }
  };

  // Add Expense Handler with Instant Optimistic UI Update
  const handleAddExpense = async (expenseData: Omit<ExpenseItem, "id">) => {
    if (!user) return;
    const tempId = `temp_exp_${Date.now()}`;
    const optimisticExpense: ExpenseItem = {
      id: tempId,
      ...expenseData,
    };
    // Update local state instantly (0ms delay)
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
      // Revert on error
      setExpenses((prev) => prev.filter((e) => e.id !== tempId));
    }
  };

  // Delete Category Expenses Handler with Instant Optimistic UI Update
  const handleDeleteCategory = async (categoryName: string) => {
    if (!user) return;
    const previousExpenses = [...expenses];
    setExpenses((prev) => prev.filter((e) => e.category !== categoryName));

    try {
      const q = query(
        collection(db, "users", user.uid, "expenses"),
        where("category", "==", categoryName)
      );
      const snapshot = await getDocs(q);
      const deletePromises = snapshot.docs.map((docSnap) =>
        deleteDoc(doc(db, "users", user.uid, "expenses", docSnap.id))
      );
      await Promise.all(deletePromises);
    } catch (err) {
      console.error("Failed to delete category expenses:", err);
      setExpenses(previousExpenses);
    }
  };

  // Delete Individual Expense Handler
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

  // Computed Trips with Dynamic Spent Amounts
  const computedTrips: TripItem[] = useMemo(() => {
    const totalOverallSpent = expenses.reduce(
      (acc, e) => acc + (Number(e.amount) || 0),
      0
    );

    return trips.map((trip, idx) => {
      // If trip has only 1 trip in list, assign total spent to it; otherwise use trip's proportion or actual
      const tripSpent =
        trip.totalSpent !== undefined && trip.totalSpent > 0
          ? trip.totalSpent
          : idx === 0
          ? totalOverallSpent
          : 0;

      const progress =
        trip.budget && trip.budget > 0
          ? Math.min(100, Math.round((tripSpent / trip.budget) * 100))
          : 0;

      return {
        ...trip,
        totalSpent: tripSpent,
        progress,
      };
    });
  }, [trips, expenses]);

  // Computed Dashboard Stats from Live Data (Defaults to 0 when empty)
  const stats: DashboardStats = useMemo(() => {
    if (trips.length === 0 && expenses.length === 0) {
      return {
        totalBudget: 0,
        totalSpent: 0,
        daysLeft: 0,
        destination: "No Active Trip",
        dailyAverage: 0,
        spentPercentage: 0,
      };
    }

    // 1. Total Budget = sum of budgets from trips collection
    const totalBudget = trips.reduce((acc, t) => acc + (Number(t.budget) || 0), 0);

    // 2. Total Spent = sum of amounts from expenses collection
    const totalSpent = expenses.reduce(
      (acc, e) => acc + (Number(e.amount) || 0),
      0
    );

    // 3. Days Left & Destination
    let daysLeft = 0;
    let destination = "No Active Trip";

    if (trips.length > 0) {
      const activeTrip = trips[0];
      destination =
        activeTrip.destination ||
        activeTrip.title.replace(" Trip", "") ||
        "Active Trip";
      daysLeft = activeTrip.durationDays || 0;
    }

    // 4. Daily Average = Total Spent / Duration Days (or 1)
    const activeDuration = trips[0]?.durationDays || 1;
    const dailyAverage =
      totalSpent > 0 ? totalSpent / (activeDuration || 1) : 0;

    // 5. Spent percentage of budget
    const spentPercentage =
      totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    return {
      totalBudget,
      totalSpent,
      daysLeft,
      destination,
      dailyAverage,
      spentPercentage,
    };
  }, [trips, expenses]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">
            Loading your dashboard...
          </span>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userName =
    user.displayName ||
    (user.email ? user.email.split("@")[0] : "Alex");
  const formattedName =
    userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700">
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden lg:block w-[240px] shrink-0 h-screen sticky top-0 z-30">
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </aside>

      {/* Mobile / Tablet Drawer Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          {/* Drawer Content */}
          <div className="relative w-[260px] max-w-[80vw] h-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <Sidebar
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                setMobileMenuOpen(false);
              }}
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

        {/* 4 Summary Stat Cards bound to Firestore (defaults to 0 when empty) */}
        <StatCards stats={stats} />

        {/* Middle Section (Daily Spending, Top Expenses, Recent Trips) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          {/* Daily Spending Chart (5 cols) */}
          <div className="lg:col-span-5">
            <SpendingChart
              expenses={expenses}
              dailyAverage={stats.dailyAverage}
            />
          </div>

          {/* Top Expenses (3 cols) with Add Expense & Delete Category */}
          <div className="lg:col-span-3">
            <TopExpenses
              expenses={expenses}
              onAddExpense={() => setIsAddExpenseOpen(true)}
              onDeleteCategory={handleDeleteCategory}
              onDeleteExpense={handleDeleteExpense}
            />
          </div>

          {/* Recent Trips (4 cols) with Add Trip & Delete Trip */}
          <div className="lg:col-span-4">
            <RecentTrips
              trips={computedTrips}
              onAddTrip={() => setIsAddTripOpen(true)}
              onDeleteTrip={handleDeleteTrip}
            />
          </div>
        </div>

        {/* Bottom Section (Spending Overview Donut + Budget vs Actual Bar Chart) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Spending Overview (5 cols) */}
          <div className="lg:col-span-5">
            <SpendingOverview expenses={expenses} />
          </div>

          {/* Budget vs Actual (7 cols) */}
          <div className="lg:col-span-7">
            <BudgetVsActual expenses={expenses} />
          </div>
        </div>
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
