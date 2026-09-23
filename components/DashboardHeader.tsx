"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Bell,
  Menu,
  LogOut,
  ChevronDown,
  BellOff,
  CheckCheck,
  Trash2,
  AlertTriangle,
  Compass,
  Building2,
  Sparkles,
} from "lucide-react";
import { auth, db, signOutUser } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  query,
  limit,
} from "firebase/firestore";
import {
  AppNotification,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  clearAllNotifications,
} from "@/lib/notifications";
import CommandPalette from "@/components/CommandPalette";
import type { LucideIcon } from "lucide-react";

interface DashboardHeaderProps {
  userName?: string;
  userEmail?: string;
  onSignOut?: () => void;
  onToggleMobileMenu?: () => void;
}

function getNotificationDate(timestamp: AppNotification["createdAt"]): Date | null {
  if (!timestamp) return null;
  if (timestamp instanceof Date) return timestamp;
  if (typeof timestamp === "string" || typeof timestamp === "number") return new Date(timestamp);
  if (typeof timestamp.toDate === "function") return timestamp.toDate();
  return null;
}

function getNotificationTime(timestamp: AppNotification["createdAt"]): number {
  if (
    timestamp &&
    typeof timestamp === "object" &&
    "toMillis" in timestamp &&
    typeof timestamp.toMillis === "function"
  ) {
    return timestamp.toMillis();
  }

  return getNotificationDate(timestamp)?.getTime() || 0;
}

function formatNotificationTime(timestamp: AppNotification["createdAt"]): string {
  if (!timestamp) return "Just now";
  try {
    const date = getNotificationDate(timestamp);
    if (!date || Number.isNaN(date.getTime())) return "Recently";
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return "Recently";
  }
}

const NOTIFICATION_ICONS: Record<
  string,
  { icon: LucideIcon; bg: string; text: string }
> = {
  budget_alert: {
    icon: AlertTriangle,
    bg: "bg-amber-50",
    text: "text-amber-600",
  },
  trip_created: {
    icon: Compass,
    bg: "bg-blue-50",
    text: "text-blue-600",
  },
  accommodation_created: {
    icon: Building2,
    bg: "bg-purple-50",
    text: "text-purple-600",
  },
  system: {
    icon: Sparkles,
    bg: "bg-emerald-50",
    text: "text-emerald-600",
  },
};

export default function DashboardHeader({
  userName = "Alex",
  userEmail = "alex@example.com",
  onSignOut,
  onToggleMobileMenu,
}: DashboardHeaderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Listen to custom toggle-command-palette event from global shortcut
  useEffect(() => {
    const handleToggle = () => setSearchPaletteOpen((prev) => !prev);
    window.addEventListener("toggle-command-palette", handleToggle);
    return () => window.removeEventListener("toggle-command-palette", handleToggle);
  }, []);

  // Sync Auth User
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  // Real-time Notifications Listener from Firestore
  useEffect(() => {
    if (!currentUser) {
      const clearNotifications = window.setTimeout(() => setNotifications([]), 0);
      return () => window.clearTimeout(clearNotifications);
    }

    const notifColRef = collection(db, "users", currentUser.uid, "notifications");
    // Listen to notifications ordered by createdAt if indexed, fallback gracefully
    const q = query(notifColRef, limit(30));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loaded: AppNotification[] = [];
        snapshot.forEach((docSnap) => {
          loaded.push({
            id: docSnap.id,
            ...(docSnap.data() as Omit<AppNotification, "id">),
          });
        });

        // Client-side sort by createdAt descending
        loaded.sort((a, b) => {
          const timeA = getNotificationTime(a.createdAt);
          const timeB = getNotificationTime(b.createdAt);
          return timeB - timeA;
        });

        setNotifications(loaded);
      },
      (err) => {
        console.error("Error listening to notifications:", err);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close dropdowns on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setProfileOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAsRead = async (notifId?: string) => {
    if (!currentUser || !notifId) return;
    await markNotificationAsRead(currentUser.uid, notifId);
  };

  const handleMarkAllRead = async () => {
    if (!currentUser) return;
    await markAllNotificationsAsRead(currentUser.uid);
  };

  const handleClearAll = async () => {
    if (!currentUser) return;
    await clearAllNotifications(currentUser.uid);
  };

  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Greeting & Subtitle */}
      <div className="flex items-center gap-3">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl border border-slate-200/80 bg-white text-slate-600 hover:bg-slate-50 cursor-pointer"
            aria-label="Open navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-extrabold text-[#0e1326] flex items-center gap-2 leading-tight tracking-tight">
            Good morning, {userName} <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="text-[12.5px] text-[#94a3b8] font-medium mt-0.5">
            Here&apos;s your travel overview
          </p>
        </div>
      </div>

      {/* Header Actions (Search, Notification, Profile Dropdown) */}
      <div className="flex items-center gap-2.5 sm:gap-3 self-end sm:self-auto">
        {/* Mobile Search Trigger Icon */}
        <button
          onClick={() => setSearchPaletteOpen(true)}
          className="md:hidden w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
          aria-label="Open Command Search"
        >
          <Search className="w-4.5 h-4.5 text-slate-600" />
        </button>

        {/* Desktop Search Bar Trigger */}
        <button
          onClick={() => setSearchPaletteOpen(true)}
          className="relative hidden md:flex items-center h-10 pl-9 pr-14 bg-white border border-slate-200/80 hover:border-slate-300 rounded-xl text-[13px] text-slate-400 focus:outline-none transition-all w-56 lg:w-64 cursor-pointer text-left shadow-2xs"
        >
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
          <span>Search anything...</span>
          <kbd className="absolute right-2.5 px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-[10px] font-bold text-slate-500">
            ⌘ K
          </kbd>
        </button>

        {/* Notification Icon & Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              setProfileOpen(false);
            }}
            className="relative w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white rounded-full text-[9.5px] font-bold flex items-center justify-center border-2 border-white animate-in zoom-in-50 duration-200">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {/* Notification Dropdown */}
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-slate-100 rounded-2xl shadow-xl z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
              {/* Header */}
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[13.5px] font-extrabold text-[#0e1326] tracking-tight">
                    Notifications
                  </span>
                  {unreadCount > 0 ? (
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                      {unreadCount} new
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      All caught up
                    </span>
                  )}
                </div>

                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mb-2.5">
                      <BellOff className="w-5 h-5" />
                    </div>
                    <p className="text-[13px] font-bold text-[#0e1326]">
                      No notifications yet
                    </p>
                    <p className="text-[11.5px] text-[#94a3b8] font-medium mt-0.5 max-w-[220px]">
                      You&apos;ll be notified about budget alerts and trip updates in real-time.
                    </p>
                  </div>
                ) : (
                  notifications.map((notif) => {
                    const cfg =
                      NOTIFICATION_ICONS[notif.type] ||
                      NOTIFICATION_ICONS.system;
                    const Icon = cfg.icon;

                    return (
                      <div
                        key={notif.id}
                        onClick={() => !notif.read && handleMarkAsRead(notif.id)}
                        className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer ${
                          notif.read ? "bg-white hover:bg-slate-50/70" : "bg-blue-50/40 hover:bg-blue-50/60"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-xl ${cfg.bg} ${cfg.text} flex items-center justify-center shrink-0 shadow-xs mt-0.5`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <h4
                              className={`text-[12.5px] font-bold truncate ${
                                notif.read ? "text-[#0e1326]" : "text-blue-950 font-extrabold"
                              }`}
                            >
                              {notif.title}
                            </h4>
                            <span className="text-[10px] text-slate-400 font-medium shrink-0">
                              {formatNotificationTime(notif.createdAt)}
                            </span>
                          </div>
                          <p className="text-[11.5px] text-[#64748b] font-medium mt-0.5 line-clamp-2 leading-relaxed">
                            {notif.message}
                          </p>
                        </div>

                        {!notif.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
                        )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* Footer / Clear Action */}
              {notifications.length > 0 && (
                <div className="p-2 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between px-3">
                  <span className="text-[10.5px] text-slate-400 font-medium">
                    {notifications.length} notification{notifications.length > 1 ? "s" : ""}
                  </span>
                  <button
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear all</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotifOpen(false);
            }}
            className="flex items-center gap-2 pl-1 pr-2 py-1 bg-white border border-slate-200/80 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
              {userInitial}
            </div>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                profileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown Menu */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-100 rounded-2xl shadow-lg z-50 animate-in fade-in slide-in-from-top-2 duration-150 overflow-hidden">
              {/* User Info Header */}
              <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0">
                  {userInitial}
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-extrabold text-[#0e1326] truncate leading-tight">
                    {userName}
                  </p>
                  <p className="text-[11.5px] text-[#94a3b8] font-medium truncate mt-0.5">
                    {userEmail}
                  </p>
                </div>
              </div>

              {/* Sign Out Action */}
              <div className="p-1.5">
                <button
                  onClick={async () => {
                    setProfileOpen(false);
                    if (onSignOut) {
                      onSignOut();
                    } else {
                      try {
                        await signOutUser();
                        window.location.href = "/signin";
                      } catch (err) {
                        console.error("Sign out error:", err);
                      }
                    }
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Command Search Palette Modal */}
      <CommandPalette
        isOpen={searchPaletteOpen}
        onClose={() => setSearchPaletteOpen(false)}
      />
    </header>
  );
}
