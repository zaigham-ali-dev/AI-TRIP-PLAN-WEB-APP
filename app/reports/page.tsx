"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { TripItem } from "@/components/RecentTrips";
import { ExpenseItem } from "@/components/TopExpenses";
import {
  BarChart3,
  DollarSign,
  TrendingUp,
  Layers,
  Download,
  Search,
  Calendar,
  Home,
  Utensils,
  Car,
  Ticket,
  MoreHorizontal,
  CreditCard,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
} from "recharts";

// Category config
const CATEGORY_CONFIG: Record<
  string,
  { icon: any; color: string; bg: string; text: string }
> = {
  Accommodation: { icon: Home, color: "#3b82f6", bg: "bg-blue-50", text: "text-blue-600" },
  "Food & Dining": { icon: Utensils, color: "#10b981", bg: "bg-emerald-50", text: "text-emerald-600" },
  Transport: { icon: Car, color: "#f97316", bg: "bg-orange-50", text: "text-orange-600" },
  Activities: { icon: Ticket, color: "#f59e0b", bg: "bg-amber-50", text: "text-amber-600" },
  Others: { icon: MoreHorizontal, color: "#a855f7", bg: "bg-purple-50", text: "text-purple-600" },
};

const PIE_COLORS = ["#3b82f6", "#10b981", "#f97316", "#f59e0b", "#a855f7"];

function formatExpenseDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function ReportsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

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

  // Real-time Firestore Listeners
  useEffect(() => {
    if (!user) return;

    const tripsColRef = collection(db, "users", user.uid, "trips");
    const expensesColRef = collection(db, "users", user.uid, "expenses");

    const unsubTrips = onSnapshot(tripsColRef, (snapshot) => {
      const loaded: TripItem[] = [];
      snapshot.forEach((docSnap) => {
        loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<TripItem, "id">) });
      });
      setTrips(loaded);
    });

    const unsubExpenses = onSnapshot(expensesColRef, (snapshot) => {
      const loaded: ExpenseItem[] = [];
      snapshot.forEach((docSnap) => {
        loaded.push({ id: docSnap.id, ...(docSnap.data() as Omit<ExpenseItem, "id">) });
      });
      setExpenses(loaded);
    });

    return () => {
      unsubTrips();
      unsubExpenses();
    };
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // --- Computed Analytics ---

  const totalLifetimeSpent = useMemo(
    () => expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0),
    [expenses]
  );

  const highestSingleExpense = useMemo(
    () => (expenses.length > 0 ? Math.max(...expenses.map((e) => Number(e.amount) || 0)) : 0),
    [expenses]
  );

  const mostExpensiveCategory = useMemo(() => {
    if (expenses.length === 0) return "—";
    const catTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      const cat = e.category || "Others";
      catTotals[cat] = (catTotals[cat] || 0) + (Number(e.amount) || 0);
    });
    let maxCat = "Others";
    let maxVal = 0;
    Object.entries(catTotals).forEach(([cat, val]) => {
      if (val > maxVal) {
        maxCat = cat;
        maxVal = val;
      }
    });
    return maxCat;
  }, [expenses]);

  const monthlyAverage = useMemo(() => {
    if (expenses.length === 0) return 0;
    const months = new Set<string>();
    expenses.forEach((e) => {
      if (e.date) {
        try {
          const d = new Date(e.date);
          months.add(`${d.getFullYear()}-${d.getMonth()}`);
        } catch { /* skip */ }
      }
    });
    const monthCount = Math.max(1, months.size);
    return Math.round(totalLifetimeSpent / monthCount);
  }, [expenses, totalLifetimeSpent]);

  // Category Pie Chart Data
  const categoryPieData = useMemo(() => {
    const catTotals: Record<string, number> = {
      Accommodation: 0,
      "Food & Dining": 0,
      Transport: 0,
      Activities: 0,
      Others: 0,
    };
    expenses.forEach((e) => {
      const cat = e.category in catTotals ? e.category : "Others";
      catTotals[cat] += Number(e.amount) || 0;
    });
    return Object.entries(catTotals)
      .map(([name, value]) => ({ name, value }))
      .filter((d) => d.value > 0);
  }, [expenses]);

  // Monthly Area Chart Data
  const monthlyChartData = useMemo(() => {
    const monthMap: Record<string, number> = {};
    expenses.forEach((e) => {
      if (!e.date) return;
      try {
        const d = new Date(e.date);
        const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
        monthMap[key] = (monthMap[key] || 0) + (Number(e.amount) || 0);
      } catch { /* skip */ }
    });

    // Sort chronologically
    const sorted = Object.entries(monthMap)
      .map(([month, total]) => ({ month, total }));

    return sorted.length > 0
      ? sorted
      : [
          { month: "Jan", total: 0 },
          { month: "Feb", total: 0 },
          { month: "Mar", total: 0 },
        ];
  }, [expenses]);

  // Filtered Expenses for Table
  const filteredExpenses = useMemo(() => {
    return expenses.filter((exp) => {
      const matchSearch =
        exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exp.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCategory =
        categoryFilter === "All" ||
        exp.category.toLowerCase() === categoryFilter.toLowerCase();
      return matchSearch && matchCategory;
    });
  }, [expenses, searchQuery, categoryFilter]);

  // CSV Export Handler
  const handleExportCSV = () => {
    if (expenses.length === 0) return;
    const header = "Title,Category,Amount,Date\n";
    const rows = expenses
      .map(
        (e) =>
          `"${e.title}","${e.category}",${e.amount},"${e.date || "N/A"}"`
      )
      .join("\n");
    const csv = header + rows;
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "triply_expenses_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const categories = ["All", "Accommodation", "Food & Dining", "Transport", "Activities", "Others"];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">Loading reports...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userName = user.displayName || (user.email ? user.email.split("@")[0] : "Traveler");
  const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[240px] shrink-0 h-screen sticky top-0 z-30">
        <Sidebar activeTab="Reports" />
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-[260px] max-w-[80vw] h-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <Sidebar activeTab="Reports" onCloseMobile={() => setMobileMenuOpen(false)} />
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

        {/* Page Title & Export Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#0e1326] tracking-tight">
              Analytics & Reports
            </h2>
            <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
              Financial insights, spending trends, and detailed expense history
            </p>
          </div>

          <button
            onClick={handleExportCSV}
            disabled={expenses.length === 0}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Top 4 Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Lifetime Spent
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${totalLifetimeSpent.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                {expenses.length} transactions
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Highest Single Expense
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${highestSingleExpense.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                Peak transaction
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-xs">
              <CreditCard className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Top Category
              </span>
              <div className="text-[20px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                {mostExpensiveCategory}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                Most spending by volume
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Monthly Average
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                ${monthlyAverage.toLocaleString()}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                Avg. per active month
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          {/* Monthly Spending Area Chart (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col min-h-[340px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-[14px] font-extrabold text-[#0e1326] tracking-tight">
                  Monthly Spending Trend
                </h3>
                <p className="text-[11px] text-[#94a3b8] font-medium mt-0.5">
                  Expense volume across months
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-[11.5px] font-semibold">
                <span className="w-2.5 h-2.5 rounded-xs bg-blue-600" />
                <span className="text-[#94a3b8]">Spent ($)</span>
              </div>
            </div>

            <div className="flex-1 w-full min-h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                    dy={8}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 10, fontWeight: 500 }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    cursor={{ stroke: "#e2e8f0", strokeWidth: 1 }}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-[#0e1326] text-white p-2.5 rounded-xl shadow-md text-[11px]">
                            <p className="font-bold">{label}</p>
                            <p className="text-blue-300">Spent: <span className="font-bold">${payload[0]?.value?.toLocaleString()}</span></p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="#3b82f6"
                    strokeWidth={2.5}
                    fill="url(#areaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Category Pie Chart (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col min-h-[340px]">
            <div className="mb-3">
              <h3 className="text-[14px] font-extrabold text-[#0e1326] tracking-tight">
                Category Breakdown
              </h3>
              <p className="text-[11px] text-[#94a3b8] font-medium mt-0.5">
                Spending distribution by category
              </p>
            </div>

            {categoryPieData.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center">
                <Layers className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-[13px] font-bold text-[#0e1326]">No expense data yet</p>
                <p className="text-[11.5px] text-[#94a3b8] font-medium">Add expenses to see your spending breakdown</p>
              </div>
            ) : (
              <div className="flex-1 w-full min-h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="45%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {categoryPieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-[#0e1326] text-white p-2.5 rounded-xl shadow-md text-[11px]">
                              <p className="font-bold">{payload[0]?.name}</p>
                              <p className="text-blue-300">Amount: <span className="font-bold">${payload[0]?.value?.toLocaleString()}</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend
                      verticalAlign="bottom"
                      align="center"
                      iconType="circle"
                      iconSize={8}
                      formatter={(value: string) => (
                        <span className="text-[11px] font-semibold text-[#64748b]">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Spending Log Table */}
        <div className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-[15px] font-extrabold text-[#0e1326] tracking-tight">
                Detailed Spending Log
              </h3>
              <p className="text-[11.5px] text-[#94a3b8] font-medium mt-0.5">
                Complete chronological history of all recorded expenses
              </p>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 pl-8 pr-3 w-44 bg-slate-50 border border-slate-200/80 rounded-xl text-[12px] text-slate-700 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                      categoryFilter === cat
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-50 text-[#64748b] hover:bg-slate-100"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {filteredExpenses.length === 0 ? (
            <div className="p-10 flex flex-col items-center justify-center text-center">
              <BarChart3 className="w-8 h-8 text-slate-300 mb-2" />
              <p className="text-[13px] font-bold text-[#0e1326]">
                {searchQuery || categoryFilter !== "All" ? "No matching expenses" : "No expenses recorded yet"}
              </p>
              <p className="text-[11.5px] text-[#94a3b8] font-medium">
                {searchQuery || categoryFilter !== "All"
                  ? "Try adjusting your search or category filter."
                  : "Start adding expenses to build your financial history."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/70 text-[11.5px] font-bold uppercase tracking-wider text-[#94a3b8]">
                    <th className="py-3 px-5">Date</th>
                    <th className="py-3 px-5">Description</th>
                    <th className="py-3 px-5">Category</th>
                    <th className="py-3 px-5 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-[13px]">
                  {filteredExpenses.map((exp, idx) => {
                    const cfg = CATEGORY_CONFIG[exp.category] || CATEGORY_CONFIG["Others"];
                    const CatIcon = cfg.icon;

                    return (
                      <tr key={exp.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-5 text-[#64748b] font-medium">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{formatExpenseDate(exp.date)}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5 font-bold text-[#0e1326]">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center shrink-0 shadow-xs`}>
                              <CatIcon className={`w-4 h-4 ${cfg.text}`} />
                            </div>
                            <span className="truncate max-w-[220px]">{exp.title}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-5">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border ${cfg.bg} ${cfg.text}`}>
                            <CatIcon className="w-3 h-3" />
                            {exp.category}
                          </span>
                        </td>
                        <td className="py-3.5 px-5 text-right font-extrabold text-[#0e1326] text-[14px]">
                          ${Number(exp.amount).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
    </div>
  );
}
