"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, DollarSign, CalendarDays, Sparkles, AlertCircle } from "lucide-react";
import {
  searchDestinations,
  searchDestinationsAsync,
  isValidDestination,
  Destination,
  formatDestinationDisplay,
} from "@/lib/destinations";
import { validateTravelDestination } from "@/lib/geocoding";

export default function Hero() {
  const router = useRouter();
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("1500");
  const [days, setDays] = useState("5");
  const [travelStyle, setTravelStyle] = useState("Balanced Explorer");
  const [groupSize, setGroupSize] = useState("Solo Traveler");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Autocomplete & Strict Validation State
  const [suggestions, setSuggestions] = useState<Destination[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);
  const [validationError, setValidationError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchDebounceRef = useRef<NodeJS.Timeout | null>(null);

  const popularDestinations = ["Karachi", "Tokyo", "Paris", "Bali", "Dubai", "New York"];

  // Live Validation Checks
  const isDestValid = destination.trim().length >= 1 && isValidDestination(destination.trim());
  const isBudgetValid = Boolean(budget) && Number(budget) >= 50;
  const isDaysValid = Number(days) >= 1 && Number(days) <= 14;
  const isFormValid = isDestValid && isBudgetValid && isDaysValid;

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDestination(val);
    setValidationError(null);
    setHighlightedIndex(-1);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (val.trim().length >= 2) {
      // 1. Instant 0ms client-side matching from 1st character
      const instantMatches = searchDestinations(val);
      setSuggestions(instantMatches);
      setShowDropdown(true);

      // 2. Debounced real-place lookup in the background. This does not use AI.
      searchDebounceRef.current = setTimeout(async () => {
        const geoResults = await searchDestinationsAsync(val);
        if (geoResults && geoResults.length > 0) {
          setSuggestions(geoResults);
        }
      }, 350);
    } else {
      setSuggestions([]);
      setShowDropdown(false);
    }
  };

  const handleDestinationKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (showDropdown && suggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
        return;
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
        return;
      }
      if (e.key === "Enter") {
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          e.preventDefault();
          e.stopPropagation();
          handleSelectDestination(suggestions[highlightedIndex]);
          return;
        }
      }
      if (e.key === "Escape") {
        e.preventDefault();
        setShowDropdown(false);
        setHighlightedIndex(-1);
        return;
      }
    }
  };

  const handleSelectDestination = (dest: Destination) => {
    const formatted = formatDestinationDisplay(dest);
    setDestination(formatted);
    setSuggestions([]);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    setValidationError(null);
  };

  const handlePlanTrip = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmed = destination.trim();
    if (!trimmed) {
      setValidationError("Please enter a destination to start planning.");
      return;
    }

    if (!isValidDestination(trimmed)) {
      setValidationError("Please enter at least two characters for a city or country.");
      return;
    }

    if (!isBudgetValid) {
      setValidationError("Please enter a valid budget of at least $50.");
      return;
    }

    if (!isDaysValid) {
      setValidationError("Trip duration must be between 1 and 14 days.");
      return;
    }

    setIsSubmitting(true);

    const verifiedDestination = await validateTravelDestination(trimmed);
    if (!verifiedDestination) {
      setValidationError("Please enter a real city or country and select it from the destination suggestions.");
      setIsSubmitting(false);
      return;
    }

    const confirmedDestination = formatDestinationDisplay({
      id: verifiedDestination.id,
      name: verifiedDestination.name,
      country: verifiedDestination.country,
      region: verifiedDestination.placeType || "Destination",
    });

    // Save to localStorage for unauthenticated users
    const pendingTrip = {
      destination: confirmedDestination,
      budget: budget || "1500",
      days,
      travelStyle,
      groupSize,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("pending_trip", JSON.stringify(pendingTrip));

    // Redirect to public preview with URL params
    const params = new URLSearchParams({
      destination: pendingTrip.destination,
      budget: pendingTrip.budget,
      days: pendingTrip.days,
      style: pendingTrip.travelStyle,
      group: pendingTrip.groupSize,
    });
    router.push(`/plan-preview?${params.toString()}`);
  };

  return (
    <section className="relative w-full min-h-[96vh] flex flex-col justify-between bg-[#f8fafd]">

      {/* Background Subtle Gradient for Left Side */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f6f9fc] via-[#f8fafd] to-[#ffffff] pointer-events-none" />

      {/* Right-Side Panoramic Landscape Image */}
      <div className="absolute top-0 right-0 bottom-0 w-full lg:w-[72%] xl:w-[68%] z-0 select-none pointer-events-none overflow-hidden hidden lg:block">
        <Image
          src="/images/hero-view.jpg"
          alt="Scenic mountain lake travel view"
          fill
          priority
          className="object-cover object-[16%_center] lg:object-[14%_center]"
        />
        <div className="absolute inset-y-0 left-0 w-44 sm:w-64 lg:w-96 bg-gradient-to-r from-[#f8fafd] via-[#f8fafd]/85 to-transparent z-10" />
        <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-[#f8fafd]/50 via-[#f8fafd]/20 to-transparent z-10" />
        <div className="absolute bottom-0 inset-x-0 h-28 bg-gradient-to-t from-[#f8fafd]/60 to-transparent z-10" />
      </div>

      {/* Decorative Paper Airplane & Curved Dashed Trajectory */}
      <div className="absolute inset-0 z-10 pointer-events-none hidden lg:block overflow-hidden">
        <svg
          className="w-full h-full"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M 600,430 C 720,260 850,180 1040,135"
            stroke="white"
            strokeWidth="2.5"
            strokeDasharray="7 7"
            strokeOpacity="0.85"
          />
        </svg>

        <div className="absolute top-[14%] right-[22%] rotate-[-4deg] drop-shadow-md animate-bounce-subtle">
          <svg className="w-12 h-12 text-white fill-white" viewBox="0 0 24 24">
            <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-6.054-2.685z" />
          </svg>
        </div>
      </div>

      {/* Hero Main Content */}
      <div className="relative z-20 w-full px-4 sm:px-6 lg:px-8 xl:px-12 pt-24 pb-10 lg:pt-28 lg:pb-8 flex-1 flex flex-col justify-center">
        <div className="max-w-[1550px] w-full mx-auto">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">

            {/* Left Column: Text & Booking Bar */}
            <div className="w-full lg:w-[50%] xl:w-[46%] flex flex-col items-start pl-2 lg:pl-4">

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold tracking-tight leading-[1.08] text-[#0e1326]">
                Plan smarter. <br />
                <span className="text-[#2563eb]">Travel better.</span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-[15px] sm:text-[16px] text-[#4b5563] leading-relaxed max-w-lg font-normal">
                Your all-in-one platform for budget planning, expense tracking, route optimization and real-time travel insights.
              </p>

              {/* ─── Destination Booking Bar (Enhanced 5 Inputs) ─── */}
              <form
                onSubmit={handlePlanTrip}
                className="w-full max-w-[560px] mt-6 relative"
              >
                <div
                  ref={dropdownRef}
                  className={`bg-white rounded-3xl border ${validationError || (destination.length > 2 && !isDestValid)
                    ? "border-red-400 ring-4 ring-red-500/10"
                    : "border-slate-200/90 hover:shadow-[0_14px_44px_rgba(37,99,235,0.09)] focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/10"
                    } shadow-[0_10px_40px_rgba(0,0,0,0.06)] p-3 transition-all relative z-30 space-y-2.5`}
                >
                  {/* Row 1: Destination Autocomplete */}
                  <div className="relative">
                    <div
                      className={`flex items-center gap-2.5 bg-[#f8fafd] rounded-2xl px-3.5 py-3 border ${destination.length > 2 && !isDestValid
                        ? "border-red-300 bg-red-50/40"
                        : "border-transparent focus-within:border-blue-200 focus-within:bg-white"
                        } transition-colors`}
                    >
                      <MapPin className="w-[18px] h-[18px] text-blue-500 shrink-0" />
                      <input
                        id="hero-destination"
                        type="text"
                        value={destination}
                        onChange={handleDestinationChange}
                        onKeyDown={handleDestinationKeyDown}
                        onFocus={async () => {
                          if (destination.trim().length >= 2) {
                            setSuggestions(searchDestinations(destination.trim()));
                            setShowDropdown(true);
                            const results = await searchDestinationsAsync(destination.trim());
                            if (results && results.length > 0) setSuggestions(results);
                          }
                        }}
                        placeholder="Where to? (e.g. Tokyo, Paris, Bali)"
                        autoComplete="off"
                        className="w-full bg-transparent text-slate-800 placeholder-slate-400 text-sm font-medium outline-none"
                      />
                    </div>

                    {/* Autocomplete Dropdown List */}
                    {showDropdown && suggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-100 shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                        <div className="px-3.5 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Matching Destinations
                        </div>
                        {suggestions.map((dest, idx) => {
                          const isHighlighted = idx === highlightedIndex;
                          return (
                            <button
                              key={dest.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectDestination(dest);
                              }}
                              onClick={() => handleSelectDestination(dest)}
                              onMouseEnter={() => setHighlightedIndex(idx)}
                              className={`w-full px-4 py-2.5 text-left flex items-center justify-between transition-colors group cursor-pointer ${
                                isHighlighted ? "bg-blue-50/90 text-blue-700" : "hover:bg-blue-50/70"
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <MapPin className={`w-4 h-4 transition-colors ${
                                  isHighlighted ? "text-blue-600" : "text-slate-400 group-hover:text-blue-600"
                                }`} />
                                <span className={`text-sm font-semibold ${
                                  isHighlighted ? "text-blue-700" : "text-slate-800 group-hover:text-blue-700"
                                }`}>
                                  {dest.name}
                                </span>
                                <span className="text-xs text-slate-400 font-medium">
                                  {dest.country}
                                </span>
                              </div>
                              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full transition-colors ${
                                isHighlighted ? "bg-blue-100 text-blue-700" : "text-slate-400 bg-slate-100 group-hover:bg-blue-100 group-hover:text-blue-700"
                              }`}>
                                {dest.region}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Row 2: Budget & Duration */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Budget */}
                    <div
                      className={`flex items-center gap-2 bg-[#f8fafd] rounded-2xl px-3.5 py-2.5 border ${budget !== "" && !isBudgetValid
                        ? "border-red-300 bg-red-50/40"
                        : "border-transparent focus-within:border-blue-200 focus-within:bg-white"
                        } transition-colors`}
                    >
                      <DollarSign className="w-[18px] h-[18px] text-emerald-500 shrink-0" />
                      <div className="w-full">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Budget ($)
                        </label>
                        <input
                          id="hero-budget"
                          type="number"
                          min="50"
                          value={budget}
                          onChange={(e) => {
                            setBudget(e.target.value);
                            setValidationError(null);
                          }}
                          placeholder="e.g. 1500"
                          className="w-full bg-transparent text-slate-900 text-sm font-semibold outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>

                    {/* Duration */}
                    <div
                      className={`flex items-center gap-2 bg-[#f8fafd] rounded-2xl px-3.5 py-2.5 border ${!isDaysValid
                        ? "border-red-300 bg-red-50/40"
                        : "border-transparent focus-within:border-blue-200 focus-within:bg-white"
                        } transition-colors`}
                    >
                      <CalendarDays className="w-[18px] h-[18px] text-violet-500 shrink-0" />
                      <div className="w-full">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Duration
                        </label>
                        <select
                          id="hero-duration"
                          value={days}
                          onChange={(e) => {
                            setDays(e.target.value);
                            setValidationError(null);
                          }}
                          className="w-full bg-transparent text-slate-900 text-sm font-semibold outline-none cursor-pointer appearance-none"
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14].map((d) => (
                            <option key={d} value={d}>
                              {d} {d === 1 ? "day" : "days"}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Row 3: Travel Style & Group Size */}
                  <div className="grid grid-cols-2 gap-2">
                    {/* Travel Style */}
                    <div className="flex items-center gap-2 bg-[#f8fafd] rounded-2xl px-3.5 py-2.5 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-colors">
                      <Sparkles className="w-[18px] h-[18px] text-amber-500 shrink-0" />
                      <div className="w-full">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Travel Style
                        </label>
                        <select
                          id="hero-travel-style"
                          value={travelStyle}
                          onChange={(e) => setTravelStyle(e.target.value)}
                          className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-semibold outline-none cursor-pointer appearance-none"
                        >
                          <option value="Backpacker / Budget">Backpacker / Budget</option>
                          <option value="Balanced Explorer">Balanced Explorer</option>
                          <option value="Luxury / Relaxed">Luxury / Relaxed</option>
                        </select>
                      </div>
                    </div>

                    {/* Group Size */}
                    <div className="flex items-center gap-2 bg-[#f8fafd] rounded-2xl px-3.5 py-2.5 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-colors">
                      <span className="text-sm shrink-0">👥</span>
                      <div className="w-full">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Group Size
                        </label>
                        <select
                          id="hero-group-size"
                          value={groupSize}
                          onChange={(e) => setGroupSize(e.target.value)}
                          className="w-full bg-transparent text-slate-900 text-xs sm:text-sm font-semibold outline-none cursor-pointer appearance-none"
                        >
                          <option value="Solo Traveler">Solo Traveler</option>
                          <option value="Couple">Couple</option>
                          <option value="Family with Kids">Family with Kids</option>
                          <option value="Friends Group">Friends Group</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* CTA Button with Disabled State */}
                  <button
                    id="hero-plan-trip-btn"
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full mt-2 font-bold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${isFormValid && !isSubmitting
                      ? "bg-gradient-to-r from-[#2563eb] to-[#4f46e5] hover:from-[#1d4ed8] hover:to-[#4338ca] active:scale-[0.98] text-white shadow-lg shadow-blue-500/25"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
                      }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Planning…
                      </span>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        Plan Trip ✨
                      </>
                    )}
                  </button>
                </div>

                {/* Live Helper Validation Message */}
                {(!isDestValid && destination.length > 2) && (
                  <div className="mt-2.5 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Please select a valid destination from the autocomplete dropdown list.</span>
                  </div>
                )}
                {(isDestValid && !isBudgetValid && budget !== "") && (
                  <div className="mt-2.5 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>Total budget must be a positive number of at least $50.</span>
                  </div>
                )}
                {validationError && (
                  <div className="mt-2.5 px-3 py-2 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}
              </form>

              {/* Popular Destinations */}
              <div className="mt-5 flex flex-wrap items-center gap-2 sm:gap-2.5">
                <span className="text-xs font-bold text-slate-900 mr-1">
                  Popular destinations:
                </span>
                {popularDestinations.map((dest) => (
                  <button
                    key={dest}
                    onClick={() => {
                      setDestination(dest);
                      setValidationError(null);
                    }}
                    className="bg-[#f0f3f8] hover:bg-slate-200 text-slate-700 text-xs font-medium px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {dest}
                  </button>
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>

    </section>
  );
}
