"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { auth, signOutUser } from "@/lib/firebase";
import DayPlanModal from "@/components/DayPlanModal";
import { onAuthStateChanged, User } from "firebase/auth";
import { getSavedPlanPreview, savePlanPreview } from "@/lib/planPreviewStorage";
import { getErrorMessage } from "@/lib/errorUtils";
import {
  fetchAIGeneratedTrip,
  formatGranularBudgetFromAI,
  DetailedDayPlan,
  GranularBudget,
  AITripResponse,
} from "@/lib/itineraryGenerator";
import { getDestinationImageUrls } from "@/lib/destinationImage";
import TripMap from "@/components/TripMap";
import {
  MapPin,
  DollarSign,
  CalendarDays,
  Sparkles,
  ArrowRight,
  ChevronDown,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Users,
  RefreshCw,
  LogOut,
} from "lucide-react";

function PlanPreviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const currentTripUrl = React.useMemo(() => {
    const query = searchParams.toString();
    return query ? `/plan-preview?${query}` : "/plan-preview";
  }, [searchParams]);
  const signInHref = `/signin?redirect_url=${encodeURIComponent(currentTripUrl)}`;
  const signUpHref = `/signup?redirect_url=${encodeURIComponent(currentTripUrl)}`;

  // State for destination, budget, days, travelStyle, groupSize
  const [destination, setDestination] = useState<string>("Tokyo, Japan");
  const [budget, setBudget] = useState<number>(2200);
  const [days, setDays] = useState<number>(5);
  const [travelStyle, setTravelStyle] = useState<string>("Balanced Explorer");
  const [groupSize, setGroupSize] = useState<string>("Solo Traveler");

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [itinerary, setItinerary] = useState<DetailedDayPlan[]>([]);
  const [budgetAllocation, setBudgetAllocation] = useState<GranularBudget | null>(null);
  const [aiResponse, setAiResponse] = useState<AITripResponse | null>(null);
  const [selectedDay, setSelectedDay] = useState<DetailedDayPlan | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);
  const [generationStep, setGenerationStep] = useState(0);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Dynamic HD Destination Cover Image State with Multi-Tier Fallback Safety
  const destinationImages = React.useMemo(() => getDestinationImageUrls(destination), [destination]);
  const currentHeroImageUrl = destinationImages.primary;
  const isFlagHero = destinationImages.kind === "flag";

  const generationMessages = [
    "Analyzing destination and local travel trends...",
    "Curating morning, afternoon & evening spots...",
    "Calculating optimal budget allocation...",
    "Finalizing your personalized itinerary..."
  ];

  // Syncing / Toast state
  const [syncingAction, setSyncingAction] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      if (!user) setIsProfileMenuOpen(false);
    });
    return () => unsubscribe();
  }, []);

  const userName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "Traveler";
  const userInitial = userName.charAt(0).toUpperCase();

  const handleSignOut = async () => {
    try {
      setIsProfileMenuOpen(false);
      await signOutUser();
      router.push("/signin");
    } catch (error) {
      console.error("Sign out error:", error);
      setToastMessage("Unable to sign out. Please try again.");
    }
  };

  /* ─── Dynamic AI Fetch Function ─── */
  const loadAITrip = async (finalDest: string, finalBudget: number, finalDays: number, finalStyle: string, finalGroup: string) => {
    setIsGenerating(true);
    setGenerationStep(0);
    setGenerationProgress(0);
    setGenerationError(null);
    setIsRevealed(false);
    setSelectedDay(null);

    try {
      const aiData = await fetchAIGeneratedTrip({
        destination: finalDest,
        totalBudget: finalBudget,
        days: finalDays,
        travelStyle: finalStyle,
        groupSize: finalGroup,
      });

      if (aiData && aiData.itinerary && aiData.itinerary.length > 0) {
        setAiResponse(aiData);
        setItinerary(aiData.itinerary);
        const computedBudget = formatGranularBudgetFromAI(aiData, finalBudget, finalDays);
        setBudgetAllocation(computedBudget);

        savePlanPreview({
          destination: finalDest,
          budget: finalBudget,
          days: finalDays,
          travelStyle: finalStyle,
          groupSize: finalGroup,
          itinerary: aiData.itinerary,
          aiResponse: aiData,
          budgetAllocation: computedBudget,
          savedAt: new Date().toISOString(),
        });
        setGenerationProgress(100);
        setIsGenerating(false);
        setIsRevealed(true);
      } else {
        throw new Error("Invalid itinerary payload returned by server");
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err, "Unable to generate AI itinerary. Please verify your COHERE_API_KEY.");
      if (errorMessage.includes("AI itinerary generation is temporarily busy")) {
        console.warn("AI itinerary generation is temporarily busy:", errorMessage);
      } else {
        console.error("Failed to load dynamic AI trip:", err);
      }
      setGenerationError(errorMessage);
      setIsGenerating(false);
      setIsRevealed(true);
    }
  };

  /* ─── Load state and invoke AI Generation ─── */
  useEffect(() => {
    let dest = searchParams.get("destination");
    let bg = searchParams.get("budget");
    let dy = searchParams.get("days");
    let st = searchParams.get("style");
    let gr = searchParams.get("group");

    // Authentication returns to /plan-preview without query parameters. Restore
    // the exact generated response instead of asking the AI to generate again.
    const storedPlan = getSavedPlanPreview();
    const savedPlan = storedPlan && (
      storedPlan.itinerary.length === storedPlan.days && (
        !dest || (
        storedPlan.destination === dest &&
        storedPlan.budget === (Number(bg) || storedPlan.budget) &&
        storedPlan.days === (Number(dy) || storedPlan.days) &&
        (!st || storedPlan.travelStyle === st) &&
        (!gr || storedPlan.groupSize === gr)
        )
      )
    ) ? storedPlan : null;
    if (savedPlan) {
      const restoreSavedPlan = window.setTimeout(() => {
        setDestination(savedPlan.destination);
        setBudget(savedPlan.budget);
        setDays(savedPlan.days);
        setTravelStyle(savedPlan.travelStyle);
        setGroupSize(savedPlan.groupSize);
        setItinerary(savedPlan.itinerary);
        setAiResponse(savedPlan.aiResponse);
        setBudgetAllocation(savedPlan.budgetAllocation);
        setSelectedDay(null);
        setGenerationError(null);
        setGenerationProgress(100);
        setIsGenerating(false);
        setIsRevealed(true);
      }, 0);
      return () => window.clearTimeout(restoreSavedPlan);
    }

    if (!dest || !bg || !dy) {
      if (typeof window !== "undefined") {
        const rawPending = localStorage.getItem("pending_trip");
        if (rawPending) {
          try {
            const parsed = JSON.parse(rawPending);
            if (parsed.destination) dest = parsed.destination;
            if (parsed.budget) bg = parsed.budget;
            if (parsed.days) dy = parsed.days;
            if (parsed.travelStyle || parsed.style) st = parsed.travelStyle || parsed.style;
            if (parsed.groupSize || parsed.group) gr = parsed.groupSize || parsed.group;
          } catch (e) {
            console.error("Failed to parse pending_trip from localStorage:", e);
          }
        }
      }
    }

    const finalDest = dest || "Tokyo, Japan";
    const finalBudget = Number(bg) || 2200;
    const finalDays = Number(dy) || 5;
    const finalStyle = st || "Balanced Explorer";
    const finalGroup = gr || "Solo Traveler";

    const applyTripParameters = window.setTimeout(() => {
      setDestination(finalDest);
      setBudget(finalBudget);
      setDays(finalDays);
      setTravelStyle(finalStyle);
      setGroupSize(finalGroup);
      void loadAITrip(finalDest, finalBudget, finalDays, finalStyle, finalGroup);
    }, 0);

    if (typeof window !== "undefined") {
      const pendingObj = {
        destination: finalDest,
        budget: finalBudget.toString(),
        days: finalDays.toString(),
        travelStyle: finalStyle,
        groupSize: finalGroup,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem("pending_trip", JSON.stringify(pendingObj));
    }

    return () => window.clearTimeout(applyTripParameters);
  }, [searchParams]);

  // AI Loading sequence effect
  useEffect(() => {
    if (!isGenerating) return;

    let progress = 0;
    const intervalTime = 50; // Update progress every 50ms
    const totalTime = 2800; // Reach 92% quickly, then wait for the real AI response.
    const increment = (92 / (totalTime / intervalTime));

    const progressInterval = setInterval(() => {
      progress += increment;
      if (progress >= 92) {
        progress = 92;
        clearInterval(progressInterval);
      }
      setGenerationProgress(Math.floor(progress));
      
      if (progress < 25) setGenerationStep(0);
      else if (progress < 50) setGenerationStep(1);
      else if (progress < 75) setGenerationStep(2);
      else setGenerationStep(3);
    }, intervalTime);

    return () => clearInterval(progressInterval);
  }, [isGenerating]);

  const persistPlanForAuthentication = () => {
    const pendingTrip = {
      destination: destination.trim(),
      budget: budget.toString(),
      days: days.toString(),
      travelStyle,
      groupSize,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem("pending_trip", JSON.stringify(pendingTrip));

    if (itinerary.length > 0) {
      savePlanPreview({
        destination,
        budget,
        days,
        travelStyle,
        groupSize,
        itinerary,
        aiResponse,
        budgetAllocation,
        savedAt: new Date().toISOString(),
      });
    }
  };

  const handleDownloadPdf = async () => {
    if (!currentUser) {
      persistPlanForAuthentication();
      setToastMessage("Please sign in to download your trip plan...");
      setTimeout(() => {
        router.push(signInHref);
      }, 300);
      return;
    }

    if (itinerary.length === 0) {
      setToastMessage("Your itinerary is still being prepared. Please try again in a moment.");
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }

    try {
      setSyncingAction("Download pdf");
      setToastMessage("Preparing your trip PDF...");

      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 16;
      const contentWidth = pageWidth - margin * 2;
      const currencySymbol = budgetAllocation?.currencySymbol || aiResponse?.currencySymbol || "$";
      let cursorY = 20;

      const addPageHeader = () => {
        pdf.setFillColor(37, 99, 235);
        pdf.rect(0, 0, pageWidth, 11, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(10);
        pdf.text("TRIPLY - AI TRAVEL PLAN", margin, 7.2);
        pdf.setTextColor(15, 23, 42);
        cursorY = 20;
      };

      const ensureSpace = (height: number) => {
        if (cursorY + height <= pageHeight - 16) return;
        pdf.addPage();
        addPageHeader();
      };

      const addText = (text: string, size = 10, color: [number, number, number] = [51, 65, 85], spacing = 4) => {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(size);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text, contentWidth) as string[];
        const height = lines.length * (size * 0.42) + spacing;
        ensureSpace(height);
        pdf.text(lines, margin, cursorY);
        cursorY += height;
      };

      const addSectionTitle = (title: string) => {
        ensureSpace(12);
        pdf.setDrawColor(191, 219, 254);
        pdf.setFillColor(239, 246, 255);
        pdf.roundedRect(margin, cursorY - 5, contentWidth, 9, 2, 2, "FD");
        pdf.setFont("helvetica", "bold");
        pdf.setFontSize(12);
        pdf.setTextColor(29, 78, 216);
        pdf.text(title, margin + 3, cursorY + 1);
        cursorY += 11;
      };

      const addDetail = (label: string, value: string) => {
        addText(`${label}: ${value}`, 9.5, [51, 65, 85], 3);
      };

      addPageHeader();
      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(22);
      pdf.setTextColor(15, 23, 42);
      pdf.text(`${days}-Day Trip to ${destination}`, margin, cursorY);
      cursorY += 9;
      addText(`Personalized AI itinerary prepared for ${userName}`, 10, [100, 116, 139], 7);

      addSectionTitle("Trip overview");
      addDetail("Destination", destination);
      addDetail("Travel style", travelStyle);
      addDetail("Travel group", groupSize);
      addDetail("Duration", `${days} ${days === 1 ? "day" : "days"}`);
      addDetail("Total budget", `${currencySymbol}${budget.toLocaleString()}`);
      addDetail("Daily budget", `${currencySymbol}${perDay.toLocaleString()} per day`);

      itinerary.forEach((dayPlan) => {
        addSectionTitle(`Day ${dayPlan.day}: ${dayPlan.title}`);
        if (dayPlan.summary) addText(dayPlan.summary, 9.5, [71, 85, 105], 5);
        addDetail("Estimated day total", `${currencySymbol}${dayPlan.dailySpendingTotal}`);

        const addActivity = (label: string, time: string, place: DetailedDayPlan["morning"]) => {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(10);
          pdf.setTextColor(15, 23, 42);
          ensureSpace(6);
          pdf.text(`${label} (${time}) - ${place.spotName}`, margin, cursorY);
          cursorY += 4.5;
          addText(place.description, 9, [71, 85, 105], 2.5);
          const activityInfo = [
            place.duration ? `Duration: ${place.duration}` : "",
            place.rating ? `Rating: ${place.rating}` : "",
            `Estimated cost: ${currencySymbol}${place.costEstimate}`,
          ].filter(Boolean).join(" | ");
          addText(activityInfo, 8.5, [100, 116, 139], 2.5);
          if (place.tip) addText(`Tip: ${place.tip}`, 8.5, [29, 78, 216], 4);
        };

        const addMeal = (label: string, meal: DetailedDayPlan["breakfast"]) => {
          pdf.setFont("helvetica", "bold");
          pdf.setFontSize(9.5);
          pdf.setTextColor(6, 95, 70);
          ensureSpace(6);
          pdf.text(`${label}: ${meal.spotName}`, margin, cursorY);
          cursorY += 4.5;
          addText(meal.recommendation, 9, [71, 85, 105], 2.5);
          const mealInfo = [
            meal.rating ? `Rating: ${meal.rating}` : "",
            `Estimated cost: ${currencySymbol}${meal.estimatedCost}`,
          ].filter(Boolean).join(" | ");
          addText(mealInfo, 8.5, [100, 116, 139], 2.5);
          if (meal.tip) addText(`Tip: ${meal.tip}`, 8.5, [5, 150, 105], 4);
        };

        addActivity("Morning", "09:00-12:00", dayPlan.morning);
        addMeal("Breakfast", dayPlan.breakfast);
        addActivity("Afternoon", "12:30-16:30", dayPlan.afternoon);
        addMeal("Lunch", dayPlan.lunch);
        addActivity("Evening", "17:00 onwards", dayPlan.evening);
        addMeal("Dinner", dayPlan.dinner);
        addDetail("Getting around", `${dayPlan.transport.routeAdvice} (estimated ${currencySymbol}${dayPlan.transport.estimatedCost})`);
        cursorY += 2;
      });

      if (budgetAllocation) {
        addSectionTitle("Budget breakdown");
        addDetail("Accommodation", `${currencySymbol}${budgetAllocation.accommodationTotal.toLocaleString()} - ${budgetAllocation.hotelClass}`);
        budgetAllocation.items.forEach((item) => {
          addText(`${item.category}: ${currencySymbol}${item.amount.toLocaleString()} (${item.percentage}%) - ${item.sublabel}`, 9.5, [51, 65, 85], 3);
          item.details.forEach((detail) => addText(`- ${detail}`, 8.5, [100, 116, 139], 2));
        });
        addDetail("Total allocated", `${currencySymbol}${budgetAllocation.totalBudget.toLocaleString()}`);
      }

      const pageCount = pdf.getNumberOfPages();
      for (let page = 1; page <= pageCount; page += 1) {
        pdf.setPage(page);
        pdf.setDrawColor(226, 232, 240);
        pdf.line(margin, pageHeight - 11, pageWidth - margin, pageHeight - 11);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.setTextColor(100, 116, 139);
        pdf.text(`Generated by Triply on ${new Date().toLocaleDateString()}`, margin, pageHeight - 6);
        pdf.text(`Page ${page} of ${pageCount}`, pageWidth - margin, pageHeight - 6, { align: "right" });
      }

      const fileName = `${destination.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "trip"}-travel-plan.pdf`;
      pdf.save(fileName);

      setToastMessage("Your trip plan PDF has been downloaded.");
      setTimeout(() => setToastMessage(null), 2500);
    } catch (error) {
      console.error("Failed to download trip PDF:", error);
      setToastMessage("Unable to create your PDF. Please try again.");
      setTimeout(() => setToastMessage(null), 3000);
    } finally {
      setSyncingAction(null);
    }
  };

  const perDay = Math.round(budget / Math.max(1, days));

  if (isGenerating) {
    return (
      <div className="fixed inset-0 z-[9998] flex items-center justify-center bg-[#f8fafd] p-6">
        <div className="relative w-full max-w-md overflow-hidden rounded-[32px] border border-slate-100 bg-white px-8 py-10 text-center shadow-[0_20px_60px_rgba(15,23,42,0.08)] sm:px-10">
          <div className="absolute -right-24 -top-24 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
            <div
              className="absolute inset-0 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"
              style={{ animationDuration: "1.1s" }}
            />
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 shadow-lg shadow-blue-500/40">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
          </div>

          <h2 className="relative text-2xl font-extrabold tracking-tight text-[#0e1326]">
            Designing Your Trip
          </h2>
          <p className="relative mt-1.5 text-sm font-semibold text-slate-500">
            {destination}
          </p>

          <div className="relative mt-6 mb-8 flex h-6 items-center justify-center">
            <p className="text-sm font-bold text-slate-500">
              {generationMessages[generationStep]}
            </p>
          </div>

          <div className="relative w-full space-y-2.5">
            <div className="flex items-center justify-between text-[13px] font-extrabold tracking-tight">
              <span className="text-blue-600">{generationProgress}%</span>
              <span className="text-slate-400">100%</span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-slate-100 p-0.5">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-75 ease-linear"
                style={{ width: `${generationProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#f8fafd]">

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {syncingAction ? (
            <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          )}
          <span className="text-sm font-medium tracking-tight">{toastMessage}</span>
        </div>
      )}

      {/* ─── Navigation Bar with Action Sticky Bar ─── */}
      <header className="w-full bg-[#f8fafd] border-b border-slate-200/80 sticky top-0 z-50">
        <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[#0e1326] tracking-tight leading-tight">
              Good morning, {userName} <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              Here&apos;s your travel overview
            </p>
          </div>

          <Link
            href="/"
            aria-label="Go to Triply landing page"
            className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-2.5 rounded-xl px-3 py-2 transition-colors hover:bg-slate-100 md:inline-flex"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-500/20">
              <MapPin className="h-4 w-4 fill-white/20" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-[#0e1326]">Triply</span>
          </Link>

          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsProfileMenuOpen((isOpen) => !isOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1.5 bg-white border border-slate-200/80 rounded-full hover:bg-slate-50 transition-colors cursor-pointer"
                aria-label="Open profile menu"
                aria-expanded={isProfileMenuOpen}
              >
                <span className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-sm">
                  {userInitial}
                </span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isProfileMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white border border-slate-100 rounded-2xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3.5 border-b border-slate-100 flex items-center gap-3">
                    <span className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {userInitial}
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold text-[#0e1326] truncate">{userName}</p>
                      <p className="text-xs text-slate-400 font-medium truncate mt-0.5">{currentUser.email}</p>
                    </div>
                  </div>
                  <div className="p-1.5">
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                href={signInHref}
                onClick={persistPlanForAuthentication}
                className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                href={signUpHref}
                onClick={persistPlanForAuthentication}
                className="bg-[#0e1326] hover:bg-black text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* ─── Hero Summary Banner with Dynamic HD Destination Cover ─── */}
      <section
        className={`relative flex w-full items-center overflow-hidden bg-cover bg-center bg-no-repeat py-10 text-white transition-all duration-700 sm:py-12 ${
          isFlagHero ? "min-h-[360px] sm:min-h-[420px] lg:min-h-[480px]" : "min-h-[320px] sm:min-h-[360px]"
        } ${isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        style={{
          backgroundImage: `url("${currentHeroImageUrl}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={`absolute inset-0 z-[1] ${isFlagHero ? "bg-gradient-to-t from-black/55 via-black/25 to-black/10" : "bg-gradient-to-t from-black/60 via-black/30 to-transparent"}`} />
        <div className={`absolute inset-0 z-[1] ${isFlagHero ? "bg-black/10" : "bg-black/15"}`} />

        {/* Hero Header Content */}
        <div className="relative z-10 mx-auto w-full max-w-[1300px] px-6 sm:px-10">
          <div className="inline-flex items-center gap-1.5 bg-blue-600/60 border border-blue-400/40 backdrop-blur-md px-3 py-1 rounded-full text-blue-100 text-[11px] font-black uppercase tracking-wider mb-2.5 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
            AI Trip Planning Engine • Live Itinerary
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] leading-snug">
            {days} Days in <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-50 to-blue-100">{destination}</span>
          </h1>

          <p className="mt-1.5 text-xs sm:text-sm text-slate-100 font-medium max-w-xl drop-shadow-md">
            Custom AI itinerary, localized dining recommendations, daily activities, and optimized budget breakdown.
          </p>

          {/* Compact Glassmorphic Badges */}
          <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-2.5 text-xs font-bold text-white">
            <span className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-md text-slate-100">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              {destination}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-md text-emerald-300">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ${budget.toLocaleString()} Budget
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-md text-purple-200">
              <CalendarDays className="w-3.5 h-3.5 text-purple-400 shrink-0" />
              {days} {days === 1 ? "Day" : "Days"}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-md text-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              {travelStyle}
            </span>
            <span className="flex items-center gap-1.5 bg-slate-900/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 shadow-md text-indigo-200">
              <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              {groupSize}
            </span>
            {budgetAllocation && (
              <span className="inline-flex items-center gap-1 bg-emerald-500/30 border border-emerald-400/40 backdrop-blur-md px-3.5 py-1.5 rounded-xl font-extrabold text-emerald-300 shadow-md">
                ≈ ${perDay}/day
              </span>
            )}
          </div>
        </div>
      </section>

      {/* ─── AI Error Notification Banner ─── */}
      {generationError && (
        <div className="max-w-[1300px] mx-auto px-6 sm:px-10 pt-8">
          <div className="bg-red-50 border border-red-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-red-800 shadow-sm">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-2xl bg-red-100 border border-red-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-red-900">AI Generation Notice</h3>
                <p className="text-xs text-red-700 font-medium mt-0.5">{generationError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => loadAITrip(destination, budget, days, travelStyle, groupSize)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 active:scale-[0.98] text-white text-xs font-extrabold px-5 py-3 rounded-2xl transition-all cursor-pointer shrink-0 shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry AI Generation</span>
            </button>
          </div>
        </div>
      )}

      {/* ─── Main Content 2-Column Grid ─── */}
      <main className="max-w-[1300px] mx-auto px-6 sm:px-10 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* ─── Left Column: Vertical Connecting Timeline ─── */}
          <div
            className={`lg:col-span-2 transition-all duration-700 delay-200 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            {/* Interactive GPS Waypoint Map */}
            <div className="mb-8 h-[360px]">
              <TripMap
                destination={destination}
                spots={itinerary.flatMap((plan, idx) => [
                  {
                    id: `m-${idx}`,
                    name: plan.morning.spotName,
                    category: "Morning" as const,
                    lat: plan.morning.lat,
                    lng: plan.morning.lng,
                    description: plan.morning.description,
                    cost: `$${plan.morning.costEstimate}`,
                  },
                  {
                    id: `a-${idx}`,
                    name: plan.afternoon.spotName,
                    category: "Afternoon" as const,
                    lat: plan.afternoon.lat,
                    lng: plan.afternoon.lng,
                    description: plan.afternoon.description,
                    cost: `$${plan.afternoon.costEstimate}`,
                  },
                  {
                    id: `d-${idx}`,
                    name: plan.dinner.spotName,
                    category: "Food" as const,
                    lat: plan.dinner.lat,
                    lng: plan.dinner.lng,
                    description: plan.dinner.recommendation,
                    cost: `$${plan.dinner.estimatedCost}`,
                  },
                ])}
              />
            </div>

            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <span>Day-by-Day Itinerary</span>
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Select a day card to see its complete plan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 my-4">
              {itinerary.map((dayPlan) => {
                return (
                  <div key={dayPlan.day}>
                    <div className="h-full overflow-hidden rounded-[28px] border border-slate-200/80 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] transition-all hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(15,23,42,0.15)]">
                      <button
                        type="button"
                        onClick={() => setSelectedDay(dayPlan)}
                        aria-haspopup="dialog"
                        className="group flex h-full w-full cursor-pointer flex-col text-left"
                      >
                        <div className="relative h-48 w-full overflow-hidden sm:h-52">
                          <Image
                            src={`/pic/${((dayPlan.day - 1) % 6) + 1}.jpg`}
                            alt={`Day ${dayPlan.day} travel inspiration`}
                            fill
                            sizes="(max-width: 640px) 100vw, 50vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/5 to-transparent" />
                          <span className="absolute left-4 top-4 rounded-full bg-white/95 px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-blue-700 shadow-sm">
                            Day {dayPlan.day}
                          </span>
                          <span className="absolute bottom-4 right-4 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-extrabold text-white backdrop-blur-sm">
                            ${dayPlan.dailySpendingTotal} est.
                          </span>
                        </div>

                        <div className="relative -mt-5 flex min-h-[220px] w-full flex-1 flex-col rounded-t-[28px] bg-white px-5 pb-5 pt-6 sm:px-6">
                          <h3 className="text-lg font-black leading-snug text-slate-900 transition-colors group-hover:text-blue-600 sm:text-xl">
                            {dayPlan.title}
                          </h3>
                          <p className="mt-2 line-clamp-2 text-sm font-medium leading-relaxed text-slate-500">
                            {dayPlan.summary || `${dayPlan.morning.spotName}, ${dayPlan.afternoon.spotName}, and ${dayPlan.evening.spotName}.`}
                          </p>
                          <div className="mt-auto grid grid-cols-2 gap-x-4 gap-y-3 pt-5 text-xs">
                            <span className="border-b border-slate-100 pb-2 font-semibold text-slate-600"><span className="mr-1.5 text-blue-600">●</span>Morning</span>
                            <span className="border-b border-slate-100 pb-2 font-semibold text-slate-600"><span className="mr-1.5 text-indigo-600">●</span>Afternoon</span>
                            <span className="font-semibold text-slate-600"><span className="mr-1.5 text-violet-600">●</span>Evening</span>
                            <span className="font-semibold text-slate-600"><span className="mr-1.5 text-emerald-600">●</span>Meals included</span>
                          </div>
                        </div>

                        <div className="flex w-full items-center justify-between gap-3 border-t border-slate-100 px-5 py-4 sm:px-6">
                          <span className="text-xs font-bold text-slate-500">Open daily itinerary</span>
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-2 text-xs font-extrabold text-white shadow-lg shadow-blue-500/20 transition-colors group-hover:bg-blue-700">
                            View plan
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </span>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── Right Column: Interactive Budget Dashboard Sticky Card ─── */}
          <div
            className={`transition-all duration-700 delay-400 ${
              isRevealed ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <div className="sticky top-24 space-y-6">
              {/* Granular Financial Allocation & Budget Status Badge */}
              {budgetAllocation && (() => {
                const perDay = Math.round(budget / Math.max(1, days));
                let statusObj = {
                  label: "Realistic Budget",
                  color: "bg-emerald-50 text-emerald-800 border-emerald-200/80",
                  icon: CheckCircle2,
                };

                if (travelStyle.toLowerCase().includes("budget") || perDay < 90) {
                  statusObj = {
                    label: "Tight Budget",
                    color: "bg-amber-50 text-amber-800 border-amber-200/80",
                    icon: AlertTriangle,
                  };
                } else if (travelStyle.toLowerCase().includes("luxury") || perDay > 350) {
                  statusObj = {
                    label: "Deluxe Budget",
                    color: "bg-purple-50 text-purple-800 border-purple-200/80",
                    icon: Sparkles,
                  };
                }
                const StatusIcon = statusObj.icon;

                return (
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-6 space-y-5">
                    {/* Card Header & Budget Status Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                          Budget Dashboard
                        </h2>
                        <span className="text-xs font-bold text-blue-600 block mt-0.5">
                          {budgetAllocation.tierName}
                        </span>
                      </div>

                      {/* Quick Budget Status Badge */}
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-extrabold shadow-2xs ${statusObj.color}`}>
                        <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>{statusObj.label}</span>
                      </div>
                    </div>

                    {/* Segmented Multi-color Allocation Progress Bar */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                        <span>Allocation Split</span>
                        <span>100%</span>
                      </div>
                      <div className="flex h-3.5 rounded-full overflow-hidden bg-slate-100 p-0.5 border border-slate-100">
                        {budgetAllocation.items.map((item, idx) => (
                          <div
                            key={idx}
                            style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                            className="first:rounded-l-full last:rounded-r-full transition-all"
                            title={`${item.category}: $${item.amount}`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Category Item List */}
                    <div className="space-y-3">
                      {budgetAllocation.items.map((item, idx) => (
                        <div key={idx} className="p-3.5 rounded-2xl bg-slate-50/90 border border-slate-200/60 space-y-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-xs font-extrabold text-slate-900">
                                {item.category}
                              </span>
                            </div>
                            <span className="text-sm font-black text-slate-900">
                              ${item.amount.toLocaleString()}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 font-medium block">
                            {item.sublabel} ({item.percentage}%)
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Total Summary */}
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">Total Allocated</span>
                      <span className="text-xl font-black text-slate-900">
                        ${budgetAllocation.totalBudget.toLocaleString()}
                      </span>
                    </div>
                  </div>
                );
              })()}

              {/* Action Buttons Sticky Container */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm p-5 space-y-3">
                <button
                  id="plan-preview-proceed-btn"
                  type="button"
                  disabled={Boolean(syncingAction)}
                  onClick={handleDownloadPdf}
                  className="w-full flex items-center justify-center gap-2 bg-[#0e1326] hover:bg-black text-white font-bold py-3 px-5 rounded-2xl transition-all cursor-pointer text-xs"
                >
                  {syncingAction === "Download pdf" ? (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <>
                      <span>Download pdf</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Sign-up CTA Nudge */}
              {!currentUser && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-100/60">
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wide">
                      Unlock Full Features
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    Sign up to save this detailed plan, get real-time price alerts, and manage expenses.
                  </p>
                  <Link
                    href={signUpHref}
                    onClick={persistPlanForAuthentication}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Create free account
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {selectedDay && (
        <DayPlanModal
          dayPlan={selectedDay}
          destination={destination}
          onClose={() => setSelectedDay(null)}
        />
      )}
    </div>
  );
}

/* ─── Page wrapper with Suspense boundary ─── */
export default function PlanPreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f8fafd] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            <span className="text-sm font-medium text-slate-500">Restoring your trip plan…</span>
          </div>
        </div>
      }
    >
      <PlanPreviewContent />
    </Suspense>
  );
}
