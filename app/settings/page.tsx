"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth, db, signOutUser } from "@/lib/firebase";
import {
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
  User,
} from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { getErrorMessage } from "@/lib/errorUtils";
import {
  Settings as SettingsIcon,
  User as UserIcon,
  Mail,
  Calendar,
  Shield,
  Bell,
  Coins,
  Sun,
  Moon,
  Monitor,
  Check,
  AlertCircle,
  LogOut,
  KeyRound,
  Save,
  Loader2,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Profile state
  const [fullName, setFullName] = useState("");
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState<string | null>(null);
  const [profileErrorMsg, setProfileErrorMsg] = useState<string | null>(null);

  // Preferences state
  const [currency, setCurrency] = useState("USD ($)");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [budgetWarnings, setBudgetWarnings] = useState(true);
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [prefsSuccessMsg, setPrefsSuccessMsg] = useState<string | null>(null);

  // Password reset state
  const [sendingReset, setSendingReset] = useState(false);
  const [resetSuccessMsg, setResetSuccessMsg] = useState<string | null>(null);
  const [resetErrorMsg, setResetErrorMsg] = useState<string | null>(null);

  const router = useRouter();

  // Auth Protection & Profile Loading
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setFullName(currentUser.displayName || "");

        // Fetch additional profile data from Firestore if available
        try {
          const userDocRef = doc(db, "users", currentUser.uid);
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            const data = snap.data();
            if (data.fullName && !currentUser.displayName) {
              setFullName(data.fullName);
            }
            if (data.currency) setCurrency(data.currency);
            if (typeof data.emailAlerts === "boolean") setEmailAlerts(data.emailAlerts);
            if (typeof data.budgetWarnings === "boolean") setBudgetWarnings(data.budgetWarnings);
            if (data.theme) setTheme(data.theme);
          }
        } catch (err) {
          console.error("Error fetching user settings doc:", err);
        }

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
      await signOutUser();
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Update Display Name
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!fullName.trim()) {
      setProfileErrorMsg("Display name cannot be empty.");
      return;
    }

    setUpdatingProfile(true);
    setProfileSuccessMsg(null);
    setProfileErrorMsg(null);

    try {
      // Update Firebase Auth profile
      await updateProfile(user, { displayName: fullName.trim() });

      // Update Firestore user document
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          fullName: fullName.trim(),
          name: fullName.trim(),
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setProfileSuccessMsg("Profile updated successfully!");
      setTimeout(() => setProfileSuccessMsg(null), 4000);
    } catch (err: unknown) {
      console.error("Error updating profile:", err);
      setProfileErrorMsg(getErrorMessage(err, "Failed to update profile. Please try again."));
    } finally {
      setUpdatingProfile(false);
    }
  };

  // Save App Preferences
  const handleSavePreferences = async () => {
    if (!user) return;
    setSavingPrefs(true);
    setPrefsSuccessMsg(null);

    try {
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(
        userDocRef,
        {
          currency,
          emailAlerts,
          budgetWarnings,
          theme,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setPrefsSuccessMsg("Preferences saved!");
      setTimeout(() => setPrefsSuccessMsg(null), 4000);
    } catch (err) {
      console.error("Error saving preferences:", err);
    } finally {
      setSavingPrefs(false);
    }
  };

  // Password Reset Email
  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setSendingReset(true);
    setResetSuccessMsg(null);
    setResetErrorMsg(null);

    try {
      await sendPasswordResetEmail(auth, user.email);
      setResetSuccessMsg(`Password reset link sent to ${user.email}`);
      setTimeout(() => setResetSuccessMsg(null), 5000);
    } catch (err: unknown) {
      console.error("Error sending reset email:", err);
      setResetErrorMsg(getErrorMessage(err, "Failed to send reset email. Please try again."));
    } finally {
      setSendingReset(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">Loading settings...</span>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const userInitial = (
    fullName?.[0] ||
    user.displayName?.[0] ||
    user.email?.[0] ||
    "U"
  ).toUpperCase();

  const formattedCreationDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Recently";

  return (
    <div className="min-h-screen bg-[#f8fafc] flex text-slate-800 antialiased selection:bg-blue-100 selection:text-blue-700">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-[240px] shrink-0 h-screen sticky top-0 z-30">
        <Sidebar activeTab="Settings" />
      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="relative w-[260px] max-w-[80vw] h-full bg-white shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            <Sidebar activeTab="Settings" onCloseMobile={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-[1440px] mx-auto">
        <DashboardHeader
          userName={fullName || user.displayName || user.email?.split("@")[0] || "Traveler"}
          userEmail={user.email || ""}
          onSignOut={handleSignOut}
          onToggleMobileMenu={() => setMobileMenuOpen(true)}
        />

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#0e1326] tracking-tight flex items-center gap-2">
              <SettingsIcon className="w-5 h-5 text-blue-600" />
              Settings & Profile
            </h2>
            <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
              Manage your personal information, currency defaults, and security preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Account Profile & Preferences (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Account Profile Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs">
                  <UserIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-[#0e1326] tracking-tight">
                    Account Profile
                  </h3>
                  <p className="text-[11.5px] text-[#94a3b8] font-medium">
                    Personal information & display preferences
                  </p>
                </div>
              </div>

              {/* Avatar & Summary Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-slate-100 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-[24px] font-extrabold shadow-md shadow-blue-600/20 shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-[16px] font-extrabold text-[#0e1326] tracking-tight truncate">
                    {fullName || user.displayName || "Traveler"}
                  </h4>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-1 text-[12px] text-[#64748b] font-medium">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Member since {formattedCreationDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Edit Form */}
              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-1.5">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200/90 rounded-xl text-[13.5px] font-medium text-[#0e1326] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full h-11 px-4 bg-slate-100/70 border border-slate-200/60 rounded-xl text-[13.5px] font-medium text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[11px] text-[#94a3b8] font-medium mt-1 block">
                    Email cannot be changed directly for security purposes.
                  </span>
                </div>

                {profileSuccessMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12.5px] font-semibold">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {profileErrorMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[12.5px] font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{profileErrorMsg}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer disabled:opacity-60"
                  >
                    {updatingProfile ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Updating...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Update Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Preferences & App Settings Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-xs">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-[#0e1326] tracking-tight">
                    Preferences & Defaults
                  </h3>
                  <p className="text-[11.5px] text-[#94a3b8] font-medium">
                    Customize your experience and notification alerts
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                {/* Default Currency Selection */}
                <div>
                  <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-1.5 flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-slate-400" />
                    Default Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200/90 rounded-xl text-[13.5px] font-semibold text-[#0e1326] focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all cursor-pointer"
                  >
                    <option value="USD ($)">USD ($) — US Dollar</option>
                    <option value="EUR (€)">EUR (€) — Euro</option>
                    <option value="GBP (£)">GBP (£) — British Pound</option>
                    <option value="PKR (₨)">PKR (₨) — Pakistani Rupee</option>
                    <option value="AED (د.إ)">AED (د.إ) — UAE Dirham</option>
                    <option value="JPY (¥)">JPY (¥) — Japanese Yen</option>
                    <option value="CAD ($)">CAD ($) — Canadian Dollar</option>
                    <option value="AUD ($)">AUD ($) — Australian Dollar</option>
                    <option value="SAR (﷼)">SAR (﷼) — Saudi Riyal</option>
                  </select>
                </div>

                {/* Theme Selector */}
                <div>
                  <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-2 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5 text-slate-400" />
                    Theme Mode
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { key: "light" as const, label: "Light", icon: Sun },
                      { key: "dark" as const, label: "Dark", icon: Moon },
                      { key: "system" as const, label: "System", icon: Monitor },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isSelected = theme === item.key;
                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setTheme(item.key)}
                          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border text-[12.5px] font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-blue-50/70 border-blue-500 text-blue-600 shadow-xs"
                              : "bg-slate-50/60 border-slate-200/80 text-[#64748b] hover:bg-slate-100"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Notification Toggles */}
                <div>
                  <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-2 flex items-center gap-1.5">
                    <Bell className="w-3.5 h-3.5 text-slate-400" />
                    Notifications & Alerts
                  </label>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                      <div>
                        <span className="text-[13px] font-bold text-[#0e1326] block">
                          Email Summary Reports
                        </span>
                        <span className="text-[11px] text-[#94a3b8] font-medium">
                          Receive weekly travel expense digests
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setEmailAlerts(!emailAlerts)}
                        className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                          emailAlerts ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs absolute top-[3px] transition-transform ${
                            emailAlerts ? "left-[23px]" : "left-[3px]"
                          }`}
                        />
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-3.5 bg-slate-50/70 border border-slate-100 rounded-xl">
                      <div>
                        <span className="text-[13px] font-bold text-[#0e1326] block">
                          Budget Limit Warnings
                        </span>
                        <span className="text-[11px] text-[#94a3b8] font-medium">
                          Alert when spending exceeds 85% of allocated trip budget
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setBudgetWarnings(!budgetWarnings)}
                        className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative ${
                          budgetWarnings ? "bg-blue-600" : "bg-slate-300"
                        }`}
                      >
                        <div
                          className={`w-4.5 h-4.5 rounded-full bg-white shadow-xs absolute top-[3px] transition-transform ${
                            budgetWarnings ? "left-[23px]" : "left-[3px]"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {prefsSuccessMsg && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12.5px] font-semibold">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{prefsSuccessMsg}</span>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={handleSavePreferences}
                    disabled={savingPrefs}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-60"
                  >
                    {savingPrefs ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save Preferences</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Security & Danger Zone (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Security Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shadow-xs">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-[#0e1326] tracking-tight">
                    Security & Password
                  </h3>
                  <p className="text-[11.5px] text-[#94a3b8] font-medium">
                    Manage authentication & password recovery
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-100 mb-5">
                <div className="flex items-start gap-2.5">
                  <KeyRound className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                  <div>
                    <span className="text-[13px] font-bold text-[#0e1326] block">
                      Reset Password
                    </span>
                    <p className="text-[11.5px] text-[#64748b] font-medium mt-0.5 leading-relaxed">
                      We&apos;ll send a secure password reset link to your registered email address ({user.email}).
                    </p>
                  </div>
                </div>
              </div>

              {resetSuccessMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-[12.5px] font-semibold mb-4">
                  <Check className="w-4 h-4 shrink-0" />
                  <span>{resetSuccessMsg}</span>
                </div>
              )}

              {resetErrorMsg && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[12.5px] font-semibold mb-4">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{resetErrorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handlePasswordReset}
                disabled={sendingReset}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[13px] font-bold rounded-xl border border-indigo-200/80 transition-all cursor-pointer disabled:opacity-60"
              >
                {sendingReset ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Reset Link...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Send Password Reset Email</span>
                  </>
                )}
              </button>
            </div>

            {/* Triply Info Card */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/20">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-300" />
                <h4 className="text-[15px] font-extrabold">Triply Pro Status</h4>
              </div>
              <p className="text-[12.5px] text-blue-100 font-medium leading-relaxed mb-4">
                Your account is fully synced with Firebase Cloud Firestore. All your itineraries, route maps, and budgets are backed up in real time.
              </p>
              <div className="flex items-center justify-between pt-3 border-t border-white/15 text-[11.5px] text-blue-200">
                <span>Version 1.0.0</span>
                <span>Production Ready</span>
              </div>
            </div>

            {/* Danger Zone Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-rose-200/80 shadow-[0_4px_24px_rgba(244,63,94,0.04)]">
              <div className="flex items-center gap-2.5 mb-3 text-rose-600">
                <AlertCircle className="w-5 h-5" />
                <h3 className="text-[16px] font-extrabold tracking-tight">
                  Danger Zone
                </h3>
              </div>

              <p className="text-[12px] text-[#64748b] font-medium leading-relaxed mb-5">
                Signing out will end your current session. You can sign back in anytime with your credentials.
              </p>

              <button
                type="button"
                onClick={handleSignOut}
                className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 text-[13px] font-bold rounded-xl border border-rose-200 transition-all cursor-pointer active:scale-98 shadow-xs"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out of Account</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
