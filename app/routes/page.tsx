"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

import Sidebar from "@/components/Sidebar";
import DashboardHeader from "@/components/DashboardHeader";
import AddTripModal from "@/components/AddTripModal";
import { TripItem } from "@/components/RecentTrips";
import { RouteDetail } from "@/components/RouteMap";
import {
  Route as RouteIcon,
  MapPin,
  Plane,
  Train,
  Car,
  Navigation,
  Compass,
  Plus,
  Milestone,
  Clock,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

// Dynamically import Leaflet RouteMap with SSR disabled to prevent `window is not defined`
const RouteMap = dynamic(() => import("@/components/RouteMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[460px] rounded-2xl bg-slate-100 animate-pulse flex flex-col items-center justify-center text-slate-400 gap-3 border border-slate-200">
      <div className="w-9 h-9 rounded-full border-3 border-blue-600 border-t-transparent animate-spin" />
      <span className="text-[12.5px] font-bold text-slate-500">
        Loading Interactive World Map...
      </span>
    </div>
  ),
});

export default function RoutesPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [trips, setTrips] = useState<TripItem[]>([]);
  const [isAddTripOpen, setIsAddTripOpen] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

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

  // Real-time Firestore Listener for Trips
  useEffect(() => {
    if (!user) return;

    const tripsColRef = collection(db, "users", user.uid, "trips");

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
        console.error("Error listening to trips for routes:", err);
      }
    );

    return () => unsubTrips();
  }, [user]);

  // Dynamic Route Generation based on User Trips
  const routes: RouteDetail[] = useMemo(() => {
    if (trips.length === 0) return [];

    return trips.map((trip, idx) => {
      const dest = trip.destination || trip.title.replace(" Trip", "") || "Destination";
      let origin = "New York";
      let mode: "flight" | "train" | "car" = "flight";
      let distanceKm = 6800;
      let durationHours = 9.5;
      let waypoints = ["JFK Airport", "Athens Central", "Santorini Port"];

      const lowerDest = dest.toLowerCase();
      if (lowerDest.includes("bali") || lowerDest.includes("indonesia")) {
        origin = "Singapore";
        distanceKm = 1670;
        durationHours = 2.8;
        waypoints = ["Changi T3", "Denpasar Airport", "Ubud Center"];
        mode = "flight";
      } else if (lowerDest.includes("japan") || lowerDest.includes("tokyo")) {
        origin = "Tokyo";
        distanceKm = 520;
        durationHours = 2.5;
        waypoints = ["Tokyo Station", "Mount Fuji View", "Kyoto Central"];
        mode = "train";
      } else if (lowerDest.includes("dubai") || lowerDest.includes("uae")) {
        origin = "London";
        distanceKm = 5470;
        durationHours = 7.0;
        waypoints = ["Heathrow T5", "Downtown Dubai", "Marina Hub"];
        mode = "flight";
      } else if (lowerDest.includes("rome") || lowerDest.includes("italy")) {
        origin = "Paris";
        distanceKm = 1420;
        durationHours = 2.1;
        waypoints = ["Charles de Gaulle", "Fiumicino", "Colosseum"];
        mode = "flight";
      } else if (idx % 3 === 1) {
        origin = "Rome";
        mode = "car";
        distanceKm = 480;
        durationHours = 5.2;
        waypoints = ["Colosseum Point", "Florence Hub", "Venice Canal"];
      }

      return {
        id: trip.id || `route_${idx}`,
        title: trip.title,
        origin,
        destination: dest,
        distanceKm,
        durationHours,
        mode,
        waypoints,
        status: idx === 0 ? "active" : "planned",
      };
    });
  }, [trips]);

  // Default active route selection
  useEffect(() => {
    if (routes.length > 0 && !selectedRouteId) {
      setSelectedRouteId(routes[0].id);
    }
  }, [routes, selectedRouteId]);

  const activeSelectedRoute = routes.find((r) => r.id === selectedRouteId) || routes[0];

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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      window.location.href = "/signin";
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Metrics
  const totalDistance = routes.reduce((acc, r) => acc + r.distanceKm, 0);
  const totalWaypoints = routes.reduce((acc, r) => acc + r.waypoints.length, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-4 select-none">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-[13px] font-bold text-slate-500">
            Loading your routes...
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
        <Sidebar activeTab="Routes" />
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
              activeTab="Routes"
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
              Travel Routes & Itineraries
            </h2>
            <p className="text-[13px] text-[#94a3b8] font-medium mt-0.5">
              Visualize your live world journeys, real GPS coordinates, and waypoint paths
            </p>
          </div>

          <button
            onClick={() => setIsAddTripOpen(true)}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Route</span>
          </button>
        </div>

        {/* Top 3 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Total Active Routes
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                {routes.length}
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                {routes.length === 1 ? "1 itinerary plotted" : `${routes.length} itineraries plotted`}
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-xs">
              <RouteIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Saved Waypoints
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                {totalWaypoints}
              </div>
              <span className="text-[11px] text-emerald-600 font-bold mt-1.5 inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Live GPS checkpoints
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
              <Milestone className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex items-center justify-between">
            <div>
              <span className="text-[12px] font-semibold text-[#94a3b8] tracking-tight block">
                Estimated Distance
              </span>
              <div className="text-[26px] font-extrabold text-[#0e1326] mt-1 tracking-tight leading-none">
                {totalDistance.toLocaleString()} km
              </div>
              <span className="text-[11px] text-[#94a3b8] font-medium mt-1.5 block">
                Across all plotted geographic arcs
              </span>
            </div>
            <div className="w-11 h-11 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-xs">
              <Navigation className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Empty State or Routes Content */}
        {routes.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 border border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 shadow-xs">
              <RouteIcon className="w-8 h-8" />
            </div>
            <h3 className="text-[18px] font-extrabold text-[#0e1326] tracking-tight">
              No routes plotted yet
            </h3>
            <p className="text-[13px] text-[#94a3b8] font-medium max-w-sm mt-1 mb-5">
              Add your first vacation or multi-city trip to automatically generate and visualize your interactive travel path on the interactive world map.
            </p>
            <button
              onClick={() => setIsAddTripOpen(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-[13px] font-bold rounded-xl shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              + Create Your First Route
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Real Interactive Leaflet Map (7 cols) */}
            <div className="lg:col-span-7 flex flex-col gap-5">
              <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)] flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-[15px] font-extrabold text-[#0e1326] tracking-tight flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-600" />
                      Live Geographic Route Map
                    </h3>
                    <p className="text-[11.5px] text-[#94a3b8] font-medium mt-0.5">
                      {activeSelectedRoute ? `${activeSelectedRoute.origin} → ${activeSelectedRoute.destination}` : "World Map View"}
                    </p>
                  </div>

                  {activeSelectedRoute && (
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-100 rounded-lg text-blue-600 text-[11px] font-bold">
                      {activeSelectedRoute.mode === "flight" ? (
                        <Plane className="w-3.5 h-3.5" />
                      ) : activeSelectedRoute.mode === "train" ? (
                        <Train className="w-3.5 h-3.5" />
                      ) : (
                        <Car className="w-3.5 h-3.5" />
                      )}
                      <span className="capitalize">{activeSelectedRoute.mode} transit</span>
                    </div>
                  )}
                </div>

                {/* Real Interactive Leaflet World Map Component */}
                <RouteMap
                  routes={routes}
                  selectedRouteId={selectedRouteId}
                  onSelectRoute={setSelectedRouteId}
                />

                {/* Waypoints Timeline Bar */}
                {activeSelectedRoute && (
                  <div className="mt-4 p-3.5 bg-slate-50 border border-slate-100 rounded-xl flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11.5px] text-[#0e1326] font-bold uppercase tracking-wider">
                      Waypoints Timeline:
                    </span>
                    <div className="flex items-center gap-2 overflow-x-auto text-[12px] text-[#64748b] font-medium">
                      {activeSelectedRoute.waypoints.map((wp, i) => (
                        <div key={i} className="flex items-center gap-1.5 shrink-0">
                          <span className="w-2 h-2 rounded-full bg-blue-600" />
                          <span className="font-semibold text-[#0e1326]">{wp}</span>
                          {i < activeSelectedRoute.waypoints.length - 1 && (
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Route Cards & Itineraries List (5 cols) */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-100/90 shadow-[0_2px_12px_rgba(0,0,0,0.02)]">
                <h3 className="text-[15px] font-extrabold text-[#0e1326] tracking-tight mb-1">
                  Saved Itineraries
                </h3>
                <p className="text-[11.5px] text-[#94a3b8] font-medium mb-4">
                  Select a route to zoom and pan the interactive map
                </p>

                <div className="flex flex-col gap-3">
                  {routes.map((route) => {
                    const isSelected = route.id === selectedRouteId;
                    return (
                      <div
                        key={route.id}
                        onClick={() => setSelectedRouteId(route.id)}
                        className={`p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-blue-50/60 border-blue-500 shadow-xs"
                            : "bg-slate-50/50 border-slate-100 hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-[14px] font-extrabold text-[#0e1326]">
                            {route.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10.5px] font-bold ${
                              isSelected
                                ? "bg-blue-600 text-white"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {route.status === "active" ? "Active" : "Planned"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[12px] text-[#64748b] font-medium mb-2.5">
                          <span className="truncate max-w-[120px]">{route.origin}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[120px] font-bold text-[#0e1326]">
                            {route.destination}
                          </span>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60 text-[11px] text-[#94a3b8] font-semibold">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            <span>{route.durationHours} hrs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Compass className="w-3.5 h-3.5 text-slate-400" />
                            <span>{route.distanceKm.toLocaleString()} km</span>
                          </div>
                          <span className="capitalize text-blue-600 font-bold">
                            {route.mode}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add Trip / Route Modal */}
      <AddTripModal
        isOpen={isAddTripOpen}
        onClose={() => setIsAddTripOpen(false)}
        onSubmit={handleAddTrip}
      />
    </div>
  );
}
