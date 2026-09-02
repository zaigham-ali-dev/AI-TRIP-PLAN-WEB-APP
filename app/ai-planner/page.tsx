"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { createNotification } from "@/lib/notifications";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import {
  Sparkles,
  MapPin,
  Calendar,
  Zap,
  Globe,
  Coffee,
  Compass,
  Palmtree,
  PartyPopper,
  Landmark,
  Mountain,
  ArrowRight,
  Check,
  Loader2,
  ChevronDown,
  ChevronUp,
  Clock,
  Save,
} from "lucide-react";

// ------- Mock Itinerary Data Types -------

interface ItineraryActivity {
  time: string;
  title: string;
  description: string;
  emoji: string;
}

interface ItineraryDay {
  day: number;
  title: string;
  activities: ItineraryActivity[];
}

interface GeneratedItinerary {
  destination: string;
  days: number;
  style: string;
  budget: string;
  itinerary: ItineraryDay[];
}

// ------- Mock Itinerary Templates -------

function generateMockItinerary(
  destination: string,
  days: number,
  style: string,
  budget: string
): GeneratedItinerary {
  const dest = destination || "Bali, Indonesia";

  const ACTIVITY_POOL: Record<string, ItineraryActivity[][]> = {
    "Chill & Relax": [
      [
        { time: "08:00", title: "Sunrise Yoga Session", description: `Begin your morning with a peaceful yoga class overlooking ${dest}'s stunning scenery.`, emoji: "🧘" },
        { time: "12:00", title: "Spa & Wellness Retreat", description: "Indulge in a traditional wellness experience with aromatherapy massage.", emoji: "💆" },
        { time: "18:00", title: "Sunset Beach Dinner", description: "Enjoy a candle-lit seafood dinner on the beach as the sun dips below the horizon.", emoji: "🍽️" },
      ],
      [
        { time: "09:00", title: "Pool & Brunch", description: "Lazy morning at the resort infinity pool with fresh tropical juices.", emoji: "🏊" },
        { time: "13:00", title: "Private Beach Walk", description: "Explore a secluded coastline with white sands and crystal-clear water.", emoji: "🏖️" },
        { time: "19:00", title: "Night Market Stroll", description: "Browse local artisan crafts and street food under glowing lanterns.", emoji: "🌙" },
      ],
      [
        { time: "08:30", title: "Meditation Garden", description: "Guided meditation in a tranquil botanical garden setting.", emoji: "🪷" },
        { time: "12:30", title: "Cooking Class", description: `Learn to prepare authentic ${dest} dishes with a local chef.`, emoji: "👨‍🍳" },
        { time: "17:00", title: "Rooftop Cocktails", description: "Unwind with handcrafted cocktails and panoramic city views.", emoji: "🍹" },
      ],
    ],
    Adventure: [
      [
        { time: "06:00", title: "Jungle Trekking", description: `Hike through ${dest}'s lush rainforest trails to a hidden waterfall.`, emoji: "🥾" },
        { time: "12:00", title: "White Water Rafting", description: "Navigate thrilling rapids with an experienced guide.", emoji: "🚣" },
        { time: "18:00", title: "Campfire & BBQ", description: "End the day with a bonfire feast under a starlit sky.", emoji: "🔥" },
      ],
      [
        { time: "07:00", title: "Sunrise Volcano Hike", description: "Trek to a volcanic summit to witness a breathtaking sunrise.", emoji: "🌋" },
        { time: "13:00", title: "Snorkeling & Diving", description: "Explore vibrant coral reefs and swim with tropical fish.", emoji: "🤿" },
        { time: "19:00", title: "Local Street Food Tour", description: "Sample authentic dishes from roadside stalls and markets.", emoji: "🍜" },
      ],
      [
        { time: "08:00", title: "Mountain Biking", description: `Ride through scenic trails with breathtaking views of ${dest}.`, emoji: "🚵" },
        { time: "14:00", title: "Zip Line & Canopy Walk", description: "Soar through the treetops on an adrenaline-pumping zip line.", emoji: "🪂" },
        { time: "18:30", title: "Cliff Sunset Viewing", description: "Watch the golden hour from a dramatic cliff-edge viewpoint.", emoji: "🌅" },
      ],
    ],
    "Culture & History": [
      [
        { time: "08:00", title: "Ancient Temple Visit", description: `Explore the iconic historical temples and shrines of ${dest}.`, emoji: "🏛️" },
        { time: "12:00", title: "Traditional Lunch", description: "Dine at a heritage restaurant serving centuries-old recipes.", emoji: "🍱" },
        { time: "16:00", title: "Museum & Art Gallery", description: "Discover local art, sculpture, and historical artifacts.", emoji: "🎨" },
      ],
      [
        { time: "09:00", title: "Guided Heritage Walk", description: "Walk through the old quarter with a local historian guide.", emoji: "🗺️" },
        { time: "13:00", title: "Artisan Workshop", description: "Watch master craftspeople create traditional textiles and pottery.", emoji: "🪡" },
        { time: "18:00", title: "Cultural Dance Show", description: "Attend a mesmerizing traditional dance and music performance.", emoji: "💃" },
      ],
      [
        { time: "07:30", title: "Morning Market Visit", description: "Immerse yourself in the local market alongside residents.", emoji: "🛒" },
        { time: "12:00", title: "Cooking Heritage Recipes", description: "Learn traditional recipes passed down through generations.", emoji: "📜" },
        { time: "17:00", title: "Sunset Ceremony", description: "Witness a sacred evening ritual at a historic landmark.", emoji: "🕯️" },
      ],
    ],
    Party: [
      [
        { time: "10:00", title: "Beach Club Brunch", description: `Start late at ${dest}'s best beach club with DJs and cocktails.`, emoji: "🎶" },
        { time: "15:00", title: "Pool Party", description: "Join the famous afternoon pool party at the hottest venue.", emoji: "🎉" },
        { time: "22:00", title: "Rooftop Nightclub", description: "Dance the night away with world-class DJs and city views.", emoji: "🪩" },
      ],
      [
        { time: "11:00", title: "Yacht Day Trip", description: "Sail on a luxury catamaran with open bar and snorkeling stops.", emoji: "⛵" },
        { time: "17:00", title: "Sunset Happy Hour", description: "Premium happy hour at a cliffside cocktail bar.", emoji: "🍸" },
        { time: "23:00", title: "Underground Bar Crawl", description: "Explore hidden speakeasies and late-night live music venues.", emoji: "🎵" },
      ],
      [
        { time: "12:00", title: "Street Festival", description: `Join ${dest}'s famous street festival with live bands and food.`, emoji: "🎊" },
        { time: "16:00", title: "Wine & Cheese Tasting", description: "Curated tasting session at a boutique vineyard or cellar.", emoji: "🍷" },
        { time: "21:00", title: "VIP Club Night", description: "Table service at the city's most exclusive nightclub.", emoji: "✨" },
      ],
    ],
  };

  const pool = ACTIVITY_POOL[style] || ACTIVITY_POOL["Chill & Relax"];
  const itinerary: ItineraryDay[] = [];

  for (let d = 1; d <= Math.min(days, 7); d++) {
    const dayActivities = pool[(d - 1) % pool.length];
    itinerary.push({
      day: d,
      title: d === 1 ? "Arrival & First Impressions" : d === days ? "Final Day & Departure" : `Day ${d} — Explore & Experience`,
      activities: dayActivities,
    });
  }

  return {
    destination: dest,
    days,
    style,
    budget,
    itinerary,
  };
}

// ------- Styles & Budget Configs -------

const TRAVEL_STYLES = [
  { key: "Chill & Relax", icon: Palmtree, label: "Chill & Relax" },
  { key: "Adventure", icon: Mountain, label: "Adventure" },
  { key: "Culture & History", icon: Landmark, label: "Culture & History" },
  { key: "Party", icon: PartyPopper, label: "Party" },
];

const BUDGET_LEVELS = [
  { key: "Backpacker", label: "Backpacker", desc: "Budget-conscious" },
  { key: "Moderate", label: "Moderate", desc: "Comfort & value" },
  { key: "Luxury", label: "Luxury", desc: "Premium everything" },
];

export default function AiPlannerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Form state
  const [destination, setDestination] = useState("");
  const [days, setDays] = useState("5");
  const [travelStyle, setTravelStyle] = useState("Chill & Relax");
  const [budgetLevel, setBudgetLevel] = useState("Moderate");

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<GeneratedItinerary | null>(null);
  const [expandedDays, setExpandedDays] = useState<Record<number, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Generate Mock Itinerary
  const handleGenerate = async () => {
    if (!destination.trim()) return;

    setIsGenerating(true);
    setResult(null);
    setIsSaved(false);

    // Simulate AI thinking with a 2.5 second delay
    await new Promise((resolve) => setTimeout(resolve, 2500));

    const numDays = parseInt(days) || 3;
    const itinerary = generateMockItinerary(
      destination.trim(),
      numDays,
      travelStyle,
      budgetLevel
    );

    setResult(itinerary);
    setIsGenerating(false);

    // Auto-expand all days
    const expanded: Record<number, boolean> = {};
    itinerary.itinerary.forEach((d) => {
      expanded[d.day] = true;
    });
    setExpandedDays(expanded);
  };

  // Save to Trips (Firestore)
  const handleSaveToTrips = async () => {
    if (!user || !result) return;
    setIsSaving(true);

    try {
      const numDays = parseInt(days) || 3;
      await addDoc(collection(db, "users", user.uid, "trips"), {
        title: `AI Trip: ${result.destination}`,
        destination: result.destination,
        budget: budgetLevel === "Luxury" ? 3000 : budgetLevel === "Moderate" ? 1500 : 500,
        totalSpent: 0,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(
          Date.now() + numDays * 24 * 60 * 60 * 1000
        ).toISOString().split("T")[0],
        durationDays: numDays,
        progress: 0,
        image: "/images/greece-thumb.jpg",
        createdAt: serverTimestamp(),
      });
      // Automated notification trigger
      await createNotification(user.uid, {
        title: "AI Trip Saved",
        message: `Itinerary for "${result.destination}" saved with a budget of $${budgetLevel === "Luxury" ? 3000 : budgetLevel === "Moderate" ? 1500 : 500}.`,
        type: "trip_created",
      });
      setIsSaved(true);
    } catch (err) {
      console.error("Failed to save trip:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleDay = (day: number) => {
    setExpandedDays((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">
            Loading AI Planner...
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
        <Sidebar activeTab="AI Planner" />
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
              activeTab="AI Planner"
              onCloseMobile={() => setMobileMenuOpen(false)}
            />
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

        {/* Page Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-[22px] font-extrabold text-[#0e1326] tracking-tight flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-600" />
              AI Travel Planner
            </h2>
            <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
              Let AI craft your perfect day-by-day itinerary in seconds
            </p>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100/80 rounded-xl text-blue-700 text-[12px] font-bold shadow-xs">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Powered by Triply AI</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input / Prompter Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] sticky top-8">
              <div className="flex items-center gap-2.5 mb-5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-blue-600/25">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-[16px] font-extrabold text-[#0e1326] tracking-tight">
                    Plan Your Trip
                  </h3>
                  <p className="text-[11.5px] text-[#94a3b8] font-medium">
                    Tell us where, how long, and your vibe
                  </p>
                </div>
              </div>

              {/* Destination Input */}
              <div className="mb-4">
                <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-1.5 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  Destination
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bali, Indonesia"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  disabled={isGenerating}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-[14px] font-bold text-[#0e1326] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
                />

                {/* Quick Destinations */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {["Bali, Indonesia", "Tokyo, Japan", "Dubai, UAE", "Paris, France", "Bangkok, Thailand"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDestination(d)}
                      disabled={isGenerating}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        destination === d
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                      } disabled:opacity-50`}
                    >
                      {d.split(",")[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Input */}
              <div className="mb-4">
                <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-1.5 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Trip Duration (Days)
                </label>
                <input
                  type="number"
                  min="1"
                  max="14"
                  value={days}
                  onChange={(e) => setDays(e.target.value)}
                  disabled={isGenerating}
                  className="w-full h-12 px-4 bg-slate-50 border border-slate-200/90 rounded-2xl text-[14px] font-bold text-[#0e1326] placeholder-slate-400 focus:bg-white focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all disabled:opacity-60"
                  placeholder="e.g. 5"
                />
                <div className="flex items-center gap-1.5 mt-2">
                  {["3", "5", "7", "10"].map((d) => (
                    <button
                      key={d}
                      onClick={() => setDays(d)}
                      disabled={isGenerating}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                        days === d
                          ? "bg-blue-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200/70"
                      } disabled:opacity-50`}
                    >
                      {d} days
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Style Chips */}
              <div className="mb-4">
                <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-2 flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-slate-400" />
                  Travel Style
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TRAVEL_STYLES.map((s) => {
                    const Icon = s.icon;
                    const isActive = travelStyle === s.key;
                    return (
                      <button
                        key={s.key}
                        onClick={() => setTravelStyle(s.key)}
                        disabled={isGenerating}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-[12.5px] font-bold transition-all cursor-pointer ${
                          isActive
                            ? "bg-blue-50/60 border-blue-500 text-blue-600 shadow-xs"
                            : "bg-slate-50/50 border-slate-200/80 text-[#64748b] hover:bg-slate-50"
                        } disabled:opacity-50`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{s.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Budget Level Selector */}
              <div className="mb-5">
                <label className="text-[12px] font-bold text-[#0e1326] tracking-tight block mb-2 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-slate-400" />
                  Budget Level
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {BUDGET_LEVELS.map((b) => {
                    const isActive = budgetLevel === b.key;
                    return (
                      <button
                        key={b.key}
                        onClick={() => setBudgetLevel(b.key)}
                        disabled={isGenerating}
                        className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                          isActive
                            ? "bg-blue-50/60 border-blue-500 shadow-xs"
                            : "bg-slate-50/50 border-slate-200/80 hover:bg-slate-50"
                        } disabled:opacity-50`}
                      >
                        <span
                          className={`text-[12.5px] font-extrabold block ${
                            isActive ? "text-blue-600" : "text-[#0e1326]"
                          }`}
                        >
                          {b.label}
                        </span>
                        <span className="text-[10.5px] text-[#94a3b8] font-medium">
                          {b.desc}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !destination.trim()}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] text-white text-[14px] font-extrabold shadow-lg shadow-blue-600/25 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4.5 h-4.5 animate-spin" />
                    <span>AI is crafting your trip...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4.5 h-4.5" />
                    <span>Generate Itinerary ✨</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output / Itinerary Display (7 cols) */}
          <div className="lg:col-span-7">
            {/* Loading Skeleton */}
            {isGenerating && (
              <div className="bg-white rounded-3xl p-8 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center min-h-[420px]">
                <div className="relative mb-5">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/25">
                    <Sparkles className="w-7 h-7 animate-pulse" />
                  </div>
                  <div className="absolute -inset-2 rounded-3xl bg-blue-400/20 animate-ping" />
                </div>

                <h3 className="text-[18px] font-extrabold text-[#0e1326] tracking-tight">
                  AI is crafting your perfect trip...
                </h3>
                <p className="text-[13px] text-[#94a3b8] font-medium max-w-sm mt-1.5">
                  Analyzing {destination} for the best {travelStyle.toLowerCase()} experiences at a{" "}
                  {budgetLevel.toLowerCase()} budget level.
                </p>

                <div className="flex items-center gap-4 mt-8">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full bg-blue-600 animate-bounce"
                      style={{ animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isGenerating && !result && (
              <div className="bg-white rounded-3xl p-10 border border-slate-100/90 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col items-center justify-center text-center min-h-[420px]">
                <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-slate-100 to-blue-50 text-blue-500 flex items-center justify-center mb-4 shadow-xs">
                  <Globe className="w-8 h-8" />
                </div>
                <h3 className="text-[18px] font-extrabold text-[#0e1326] tracking-tight">
                  Your AI-powered itinerary awaits
                </h3>
                <p className="text-[13px] text-[#94a3b8] font-medium max-w-sm mt-1 mb-5">
                  Fill in your destination, duration, travel style, and budget
                  on the left — then hit <strong>Generate Itinerary ✨</strong>{" "}
                  to see the magic.
                </p>
                <div className="flex items-center gap-2 text-[12px] text-blue-600 font-bold">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  <span>Start by entering your destination</span>
                </div>
              </div>
            )}

            {/* Generated Itinerary Result */}
            {!isGenerating && result && (
              <div className="flex flex-col gap-4">
                {/* Result Header */}
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-600/20">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center shadow-xs">
                        <Sparkles className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-[18px] font-extrabold tracking-tight">
                          Your AI Itinerary
                        </h3>
                        <p className="text-[12px] text-blue-100 font-medium">
                          Custom-crafted for your trip
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-md rounded-lg text-[11.5px] font-bold">
                      <Check className="w-3.5 h-3.5" />
                      Generated
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                      <span className="text-[10.5px] text-blue-200 font-semibold block">
                        Destination
                      </span>
                      <span className="text-[13px] font-extrabold block mt-0.5 truncate">
                        {result.destination}
                      </span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                      <span className="text-[10.5px] text-blue-200 font-semibold block">
                        Duration
                      </span>
                      <span className="text-[13px] font-extrabold block mt-0.5">
                        {result.days} Days
                      </span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                      <span className="text-[10.5px] text-blue-200 font-semibold block">
                        Style
                      </span>
                      <span className="text-[13px] font-extrabold block mt-0.5 truncate">
                        {result.style}
                      </span>
                    </div>
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 text-center">
                      <span className="text-[10.5px] text-blue-200 font-semibold block">
                        Budget
                      </span>
                      <span className="text-[13px] font-extrabold block mt-0.5">
                        {result.budget}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Day-by-Day Timeline Accordions */}
                {result.itinerary.map((dayItem) => {
                  const isExpanded = expandedDays[dayItem.day] ?? false;
                  return (
                    <div
                      key={dayItem.day}
                      className="bg-white rounded-2xl border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden transition-all"
                    >
                      {/* Day Header (Clickable) */}
                      <button
                        onClick={() => toggleDay(dayItem.day)}
                        className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50/60 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-extrabold text-[14px] shadow-xs">
                            {dayItem.day}
                          </div>
                          <div>
                            <h4 className="text-[14px] font-extrabold text-[#0e1326] tracking-tight">
                              {dayItem.title}
                            </h4>
                            <span className="text-[11.5px] text-[#94a3b8] font-medium">
                              {dayItem.activities.length} activities planned
                            </span>
                          </div>
                        </div>
                        {isExpanded ? (
                          <ChevronUp className="w-4.5 h-4.5 text-slate-400" />
                        ) : (
                          <ChevronDown className="w-4.5 h-4.5 text-slate-400" />
                        )}
                      </button>

                      {/* Expanded Activities Timeline */}
                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                          <div className="relative pl-8">
                            {/* Vertical Timeline Line */}
                            <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200 rounded-full" />

                            <div className="flex flex-col gap-5 py-2">
                              {dayItem.activities.map((activity, idx) => (
                                <div key={idx} className="relative flex gap-4">
                                  {/* Timeline Dot */}
                                  <div className="absolute -left-8 top-1 w-6 h-6 rounded-full bg-white border-2 border-blue-500 flex items-center justify-center text-[12px] z-10 shadow-xs">
                                    {activity.emoji}
                                  </div>

                                  <div className="flex-1 bg-slate-50/60 border border-slate-100 rounded-xl p-4 hover:bg-blue-50/30 hover:border-blue-200/60 transition-all">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {activity.time}
                                      </span>
                                    </div>
                                    <h5 className="text-[13.5px] font-extrabold text-[#0e1326] tracking-tight">
                                      {activity.emoji} {activity.title}
                                    </h5>
                                    <p className="text-[12px] text-[#64748b] font-medium mt-1 leading-relaxed">
                                      {activity.description}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Save to Trips Action */}
                <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h4 className="text-[14px] font-extrabold text-[#0e1326] tracking-tight">
                      Love this itinerary?
                    </h4>
                    <p className="text-[12px] text-[#94a3b8] font-medium mt-0.5">
                      Save it as a trip to your dashboard and start tracking your budget.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      href="/trips"
                      className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-[13px] font-semibold hover:bg-slate-50 transition-colors"
                    >
                      View Trips
                    </Link>

                    <button
                      onClick={handleSaveToTrips}
                      disabled={isSaving || isSaved}
                      className={`inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold shadow-md transition-all cursor-pointer disabled:cursor-not-allowed ${
                        isSaved
                          ? "bg-emerald-600 text-white shadow-emerald-600/20"
                          : "bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-blue-600/20"
                      } disabled:opacity-80`}
                    >
                      {isSaved ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Saved to Trips!</span>
                        </>
                      ) : isSaving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save to My Trips</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
