"use client";

import React, { useMemo } from "react";
import dynamic from "next/dynamic";
import { Loader2, Navigation } from "lucide-react";
import "leaflet/dist/leaflet.css";

export interface MapWaypoint {
  id?: string | number;
  name: string;
  category?: "Morning" | "Afternoon" | "Evening" | "Food" | "Hotel" | string;
  lat?: number;
  lng?: number;
  description?: string;
  cost?: string;
}

export interface InteractiveRouteMapProps {
  destination?: string;
  waypoints?: MapWaypoint[];
  spots?: MapWaypoint[];
  className?: string;
}

// Client-side dynamic import with SSR disabled to prevent window undefined issues
const RealLeafletMap = dynamic(() => import("./RealLeafletMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[380px] bg-slate-900/5 backdrop-blur-sm rounded-3xl flex flex-col items-center justify-center gap-3 border border-slate-200/80">
      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      <span className="text-xs font-bold text-slate-500 tracking-wide">
        Loading Interactive Leaflet Map…
      </span>
    </div>
  ),
});

export default function InteractiveRouteMap({
  destination = "Selected Destination",
  waypoints,
  spots,
  className = "",
}: InteractiveRouteMapProps) {
  const activeWaypoints = waypoints || spots || [];

  // Determine initial center from the first waypoint or average GPS
  const centerCoords: [number, number] = useMemo(() => {
    const validSpots = activeWaypoints.filter(
      (s) =>
        typeof s.lat === "number" &&
        typeof s.lng === "number" &&
        !isNaN(s.lat) &&
        !isNaN(s.lng) &&
        (s.lat !== 0 || s.lng !== 0)
    );

    if (validSpots.length > 0) {
      // Calculate average GPS center
      const sumLat = validSpots.reduce((acc, curr) => acc + curr.lat!, 0);
      const sumLng = validSpots.reduce((acc, curr) => acc + curr.lng!, 0);
      return [sumLat / validSpots.length, sumLng / validSpots.length];
    }

    return [33.6844, 73.0479]; // Default coordinates (e.g. Islamabad/center)
  }, [activeWaypoints]);

  return (
    <div
      className={`w-full h-full min-h-[380px] bg-white rounded-3xl overflow-hidden relative border border-slate-200/90 shadow-lg flex flex-col ${className}`}
    >
      {/* Real Map Header Bar */}
      <div className="bg-slate-900 px-5 py-3.5 border-b border-slate-800 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-extrabold text-white tracking-tight flex items-center gap-1.5">
            <Navigation className="w-3.5 h-3.5 text-sky-400" />
            Live Leaflet Route • {destination}
          </span>
        </div>
        <span className="text-[11px] font-bold text-slate-300 bg-slate-800 border border-slate-700 px-2.5 py-1 rounded-lg">
          {activeWaypoints.length} Live Waypoints
        </span>
      </div>

      {/* Real Interactive Leaflet Map Container */}
      <div className="flex-1 w-full relative min-h-[380px]">
        <RealLeafletMap
          spots={activeWaypoints}
          centerCoords={centerCoords}
        />
      </div>
    </div>
  );
}
