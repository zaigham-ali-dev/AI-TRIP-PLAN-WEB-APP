"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { auth, db, signOutUser } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { collection, onSnapshot } from "firebase/firestore";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { ExpenseItem } from "@/components/TopExpenses";
import {
  RefreshCw,
  ArrowRightLeft,
  TrendingUp,
  TrendingDown,
  Globe,
  Wallet,
  ShieldCheck,
  Zap,
  Info,
} from "lucide-react";

interface CurrencyInfo {
  code: string;
  name: string;
  symbol: string;
  flag: string;
  rateAgainstUSD: number; // 1 USD = X Currency
}

const CURRENCIES: Record<string, CurrencyInfo> = {
  USD: { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rateAgainstUSD: 1.0 },
  EUR: { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rateAgainstUSD: 0.92 },
  GBP: { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rateAgainstUSD: 0.79 },
  JPY: { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rateAgainstUSD: 154.5 },
  CAD: { code: "CAD", name: "Canadian Dollar", symbol: "CA$", flag: "🇨🇦", rateAgainstUSD: 1.37 },
  AUD: { code: "AUD", name: "Australian Dollar", symbol: "AU$", flag: "🇦🇺", rateAgainstUSD: 1.52 },
  AED: { code: "AED", name: "UAE Dirham", symbol: "AED", flag: "🇦🇪", rateAgainstUSD: 3.67 },
  SAR: { code: "SAR", name: "Saudi Riyal", symbol: "SAR", flag: "🇸🇦", rateAgainstUSD: 3.75 },
  PKR: { code: "PKR", name: "Pakistani Rupee", symbol: "Rs", flag: "🇵🇰", rateAgainstUSD: 278.5 },
  INR: { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rateAgainstUSD: 83.4 },
  CHF: { code: "CHF", name: "Swiss Franc", symbol: "CHF", flag: "🇨🇭", rateAgainstUSD: 0.91 },
  SGD: { code: "SGD", name: "Singapore Dollar", symbol: "SG$", flag: "🇸🇬", rateAgainstUSD: 1.35 },
  TRY: { code: "TRY", name: "Turkish Lira", symbol: "₺", flag: "🇹🇷", rateAgainstUSD: 32.8 },
  THB: { code: "THB", name: "Thai Baht", symbol: "฿", flag: "🇹🇭", rateAgainstUSD: 36.6 },
  IDR: { code: "IDR", name: "Indonesian Rupiah", symbol: "Rp", flag: "🇮🇩", rateAgainstUSD: 16250.0 },
};

const POPULAR_PAIRS = [
  { from: "USD", to: "EUR", trend: "+0.32%", isUp: true },
  { from: "USD", to: "GBP", trend: "-0.15%", isUp: false },
  { from: "USD", to: "AED", trend: "0.00%", isUp: true },
  { from: "USD", to: "JPY", trend: "+0.58%", isUp: true },
  { from: "USD", to: "PKR", trend: "+0.22%", isUp: true },
  { from: "USD", to: "INR", trend: "-0.08%", isUp: false },
];

export default function CurrencyPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  // Converter state
  const [amount, setAmount] = useState<string>("100");
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [isSwapping, setIsSwapping] = useState(false);

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

  // Real-time Firestore Listener for Expenses
  useEffect(() => {
    if (!user) return;

    const expensesColRef = collection(db, "users", user.uid, "expenses");
    const unsub = onSnapshot(
      expensesColRef,
      (snapshot) => {
        const loaded: ExpenseItem[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<ExpenseItem, "id">),
          });
        });
        setExpenses(loaded);
      },
      (err) => {
        console.error("Error listening to expenses for currency:", err);
      }
    );

    return () => unsub();
  }, [user]);

  // Currency Conversion Calculations
  const fromInfo = CURRENCIES[fromCurrency] || CURRENCIES.USD;
  const toInfo = CURRENCIES[toCurrency] || CURRENCIES.EUR;

  // 1 FromCurrency in USD = 1 / fromInfo.rateAgainstUSD
  // Rate = (1 / fromInfo.rateAgainstUSD) * toInfo.rateAgainstUSD
  const exchangeRate = useMemo(() => {
    const fromInUSD = 1 / fromInfo.rateAgainstUSD;
    return fromInUSD * toInfo.rateAgainstUSD;
  }, [fromInfo, toInfo]);

  const convertedResult = useMemo(() => {
    const num = parseFloat(amount);
    if (isNaN(num) || num < 0) return 0;
    return num * exchangeRate;
  }, [amount, exchangeRate]);

  // Swap Currencies Handler
  const handleSwap = () => {
    setIsSwapping(true);
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
    setTimeout(() => setIsSwapping(false), 200);
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Converted Total Expenses
  const totalExpensesUSD = useMemo(() => {
    return expenses.reduce((acc, e) => acc + (Number(e.amount) || 0), 0);
  }, [expenses]);

  const convertedTotalExpenses = totalExpensesUSD * toInfo.rateAgainstUSD;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">
            Loading currency exchange...
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
        <Sidebar activeTab="Currency" />
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
              activeTab="Currency"
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

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#0e1326] tracking-tight">
              Currency Exchange & Rates
            </h2>
            <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
              Live multi-currency conversion, popular travel pairs, and foreign spending tracker
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-100/80 rounded-xl text-emerald-700 text-[12px] font-bold shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Mid-Market Rates</span>
          </div>
        </div>

        {/* Interactive Converter Section (Main 7 cols + Side Tracker 5 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          {/* Main Converter Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                    <RefreshCw className="w-5 h-5" />
                  </div>
                  <h3 className="text-[16px] font-extrabold text-[#0e1326] tracking-tight">
                    Instant Currency Calculator
                  </h3>
                </div>

                <span className="text-[11.5px] text-[#94a3b8] font-semibold">
                  Zero conversion fees
                </span>
              </div>

              {/* Amount Input */}
              <div className="mb-4">
                <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-1.5">
                  Amount to Convert
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[18px] font-bold text-slate-400">
                    {fromInfo.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter amount..."
                    className="w-full h-13 pl-11 pr-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-[20px] font-extrabold text-[#0e1326] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                  />
                </div>
              </div>

              {/* Quick Amount Pills */}
              <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-none">
                {["10", "50", "100", "500", "1000"].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`px-3 py-1 rounded-xl text-[12px] font-bold transition-all cursor-pointer ${
                      amount === val
                        ? "bg-blue-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                    }`}
                  >
                    {fromInfo.symbol}
                    {val}
                  </button>
                ))}
              </div>

              {/* From / Swap / To Selectors Row */}
              <div className="grid grid-cols-1 sm:grid-cols-11 gap-3 items-center mb-6">
                {/* From Currency Selector (5 cols) */}
                <div className="sm:col-span-5 flex flex-col gap-1">
                  <label className="text-[11.5px] font-bold text-[#94a3b8] uppercase tracking-wider">
                    From
                  </label>
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-[14px] font-bold text-[#0e1326] focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all cursor-pointer"
                  >
                    {Object.values(CURRENCIES).map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code} - {curr.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Swap Button (1 col) */}
                <div className="sm:col-span-1 flex items-center justify-center pt-5">
                  <button
                    onClick={handleSwap}
                    className={`w-10 h-10 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer shadow-xs ${
                      isSwapping ? "rotate-180" : ""
                    }`}
                    title="Swap Currencies"
                    aria-label="Swap base and target currencies"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                {/* To Currency Selector (5 cols) */}
                <div className="sm:col-span-5 flex flex-col gap-1">
                  <label className="text-[11.5px] font-bold text-[#94a3b8] uppercase tracking-wider">
                    To
                  </label>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="w-full h-12 px-3.5 bg-slate-50 border border-slate-200/90 rounded-2xl text-[14px] font-bold text-[#0e1326] focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all cursor-pointer"
                  >
                    {Object.values(CURRENCIES).map((curr) => (
                      <option key={curr.code} value={curr.code}>
                        {curr.flag} {curr.code} - {curr.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Conversion Result Box */}
            <div className="p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl text-white shadow-lg shadow-blue-600/20 flex flex-col justify-between">
              <div>
                <span className="text-[12px] font-medium text-blue-100 block">
                  {amount || "0"} {fromInfo.code} =
                </span>
                <div className="text-[28px] sm:text-[34px] font-extrabold tracking-tight leading-tight mt-0.5">
                  {toInfo.symbol}{" "}
                  {convertedResult.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  <span className="text-[18px] text-blue-200 font-bold">{toInfo.code}</span>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-white/15 flex items-center justify-between text-[11.5px] text-blue-100 font-medium">
                <span>
                  1 {fromInfo.code} = {exchangeRate.toFixed(4)} {toInfo.code}
                </span>
                <span className="inline-flex items-center gap-1 text-white/90">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Real-time rate
                </span>
              </div>
            </div>
          </div>

          {/* Multi-Currency Expenses Tracker & Advice (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            {/* Converted Trip Expenses Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                      <Wallet className="w-4 h-4" />
                    </div>
                    <h3 className="text-[15px] font-extrabold text-[#0e1326] tracking-tight">
                      Trip Spending Value
                    </h3>
                  </div>
                  <span className="text-[11px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                    In {toInfo.code}
                  </span>
                </div>

                <p className="text-[12px] text-[#94a3b8] font-medium mb-3">
                  Your total recorded expenses converted into {toInfo.name}:
                </p>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl mb-4">
                  <span className="text-[11px] font-semibold text-[#94a3b8] uppercase tracking-wider block">
                    Base Total (USD)
                  </span>
                  <div className="text-[20px] font-extrabold text-[#0e1326] mb-1">
                    ${totalExpensesUSD.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>

                  <span className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider block mt-2">
                    Converted to {toInfo.code}
                  </span>
                  <div className="text-[24px] font-extrabold text-purple-600 leading-tight">
                    {toInfo.symbol}{" "}
                    {convertedTotalExpenses.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </div>
                </div>
              </div>

              <div className="text-[11.5px] text-[#64748b] font-medium flex items-center gap-1.5">
                <Info className="w-4 h-4 text-slate-400 shrink-0" />
                <span>Automatically updates with your real-time expenses</span>
              </div>
            </div>

            {/* Smart Travel Tips Card */}
            <div className="bg-gradient-to-br from-slate-900 to-[#0e1326] rounded-3xl p-5 text-white shadow-lg flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 flex items-center justify-center">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h4 className="text-[13.5px] font-extrabold">Smart Exchange Tips</h4>
                </div>

                <ul className="space-y-2 text-[12px] text-slate-300 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Always pay in <strong>local currency</strong> on card terminals to avoid dynamic currency conversion markups.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 font-bold">•</span>
                    <span>Use fee-free travel cards to save 3-5% on foreign transaction fees.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Popular Travel Currency Pairs Grid */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] mb-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-[16px] font-extrabold text-[#0e1326] tracking-tight">
                  Popular Travel Currency Pairs
                </h3>
                <p className="text-[12px] text-[#94a3b8] font-medium mt-0.5">
                  Click any pair to immediately populate the calculator above
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {POPULAR_PAIRS.map((pair) => {
              const f = CURRENCIES[pair.from];
              const t = CURRENCIES[pair.to];
              const pairRate = (1 / f.rateAgainstUSD) * t.rateAgainstUSD;

              return (
                <div
                  key={`${pair.from}-${pair.to}`}
                  onClick={() => {
                    setFromCurrency(pair.from);
                    setToCurrency(pair.to);
                  }}
                  className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[13px] font-extrabold text-[#0e1326]">
                      {f.flag} {pair.from} / {t.flag} {pair.to}
                    </span>
                    <span
                      className={`text-[10px] font-bold flex items-center gap-0.5 ${
                        pair.isUp ? "text-emerald-600" : "text-rose-600"
                      }`}
                    >
                      {pair.isUp ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      {pair.trend}
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] text-[#94a3b8] font-semibold block">
                      1 {pair.from} =
                    </span>
                    <span className="text-[15px] font-extrabold text-[#0e1326] group-hover:text-blue-600 transition-colors">
                      {pairRate.toFixed(2)} {pair.to}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
