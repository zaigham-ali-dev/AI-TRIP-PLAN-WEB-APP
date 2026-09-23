"use client";

import React, { useEffect, useMemo, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface RouteDetail {
  id: string;
  title: string;
  origin: string;
  destination: string;
  distanceKm: number;
  durationHours: number;
  mode: "flight" | "train" | "car";
  waypoints: string[];
  status: "active" | "planned" | "completed";
}

interface RouteMapProps {
  routes: RouteDetail[];
  selectedRouteId: string | null;
  onSelectRoute?: (id: string) => void;
}

// Known coordinates dictionary for popular destinations
const KNOWN_COORDS: Record<string, [number, number]> = {
  // Asia
  bali: [-8.4095, 115.1889],
  indonesia: [-8.4095, 115.1889],
  singapore: [1.3521, 103.8198],
  tokyo: [35.6762, 139.6503],
  japan: [35.6762, 139.6503],
  kyoto: [35.0116, 135.7681],
  osaka: [34.6937, 135.5023],
  bangkok: [13.7563, 100.5018],
  thailand: [13.7563, 100.5018],
  dubai: [25.2048, 55.2708],
  uae: [25.2048, 55.2708],

  // Europe
  greece: [37.9838, 23.7275],
  santorini: [36.3932, 25.4615],
  athens: [37.9838, 23.7275],
  rome: [41.9028, 12.4964],
  italy: [41.9028, 12.4964],
  florence: [43.7696, 11.2558],
  venice: [45.4408, 12.3155],
  paris: [48.8566, 2.3522],
  france: [48.8566, 2.3522],
  london: [51.5074, -0.1278],
  uk: [51.5074, -0.1278],
  zurich: [47.3769, 8.5417],
  switzerland: [46.8182, 8.2275],
  barcelona: [41.3879, 2.1699],
  spain: [40.4637, -3.7492],

  // Americas
  "new york": [40.7128, -74.006],
  nyc: [40.7128, -74.006],
  "los angeles": [34.0522, -118.2437],
  california: [36.7783, -119.4179],
  miami: [25.7617, -80.1918],
  cancun: [21.1619, -86.8515],
  mexico: [23.6345, -102.5528],
  toronto: [43.6532, -79.3832],
  canada: [56.1304, -106.3468],

  // Others
  sydney: [-33.8688, 151.2093],
  australia: [-25.2744, 133.7751],
  cairo: [30.0444, 31.2357],
  egypt: [26.8206, 30.8025],
  capetown: [-33.9249, 18.4241],
  "south africa": [-30.5595, 22.9375],
};

// Fallback coordinate generator for arbitrary city/destination names
function getCoordinatesForPlace(placeName: string, isOrigin = false): [number, number] {
  const normalized = placeName.toLowerCase().trim();

  for (const [key, coords] of Object.entries(KNOWN_COORDS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  // Generate deterministic coordinates if location is unknown
  let hash = 0;
  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i);
    hash |= 0;
  }

  if (isOrigin) {
    return [40.7128 + ((hash % 100) / 100) * 5, -74.006 + (((hash >> 2) % 100) / 100) * 5];
  }
  return [35.6762 + ((hash % 100) / 100) * 15, 139.6503 + (((hash >> 2) % 100) / 100) * 15];
}

// Create custom modern div icons
function createCustomPin(color: "blue" | "emerald" | "amber", label: string) {
  const bgClass =
    color === "blue"
      ? "bg-blue-600 border-blue-400 text-white"
      : color === "emerald"
      ? "bg-emerald-600 border-emerald-400 text-white"
      : "bg-amber-500 border-amber-300 text-white";

  const glowColor =
    color === "blue"
      ? "rgba(37,99,235,0.4)"
      : color === "emerald"
      ? "rgba(16,185,129,0.4)"
      : "rgba(245,158,11,0.4)";

  const html = `
    <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%);">
      <div style="
        box-shadow: 0 0 14px ${glowColor};
        width: 32px;
        height: 32px;
        border-radius: 12px;
        border: 2px solid white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 11px;
      " class="${bgClass}">
        ${label}
      </div>
      <div style="
        width: 0; 
        height: 0; 
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-top: 6px solid ${color === "blue" ? "#2563eb" : color === "emerald" ? "#10b981" : "#f59e0b"};
        margin-top: -1px;
      "></div>
      <div style="
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: ${color === "blue" ? "#2563eb" : color === "emerald" ? "#10b981" : "#f59e0b"};
        opacity: 0.3;
        margin-top: 1px;
      "></div>
    </div>
  `;

  return L.divIcon({
    className: "custom-leaflet-marker",
    html,
    iconSize: [32, 40],
    iconAnchor: [16, 40],
    popupAnchor: [0, -36],
  });
}

export default function RouteMap({
  routes,
  selectedRouteId,
  onSelectRoute,
}: RouteMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  const activeRoute = useMemo(() => {
    return routes.find((r) => r.id === selectedRouteId) || routes[0];
  }, [routes, selectedRouteId]);

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Center on world / default location
    const map = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 2,
      maxZoom: 18,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // Add standard OpenStreetMap Tile Layer (Clean and free of watermarks)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    const layerGroup = L.layerGroup().addTo(map);
    layerGroupRef.current = layerGroup;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update Markers, Polylines and FitBounds when routes or selectedRoute changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    if (!routes || routes.length === 0) return;

    const bounds = L.latLngBounds([]);

    routes.forEach((route) => {
      const isSelected = activeRoute && route.id === activeRoute.id;
      const originCoords = getCoordinatesForPlace(route.origin, true);
      const destCoords = getCoordinatesForPlace(route.destination, false);

      bounds.extend(originCoords);
      bounds.extend(destCoords);

      // Create Route Polyline connecting Origin and Destination
      const polyline = L.polyline([originCoords, destCoords], {
        color: isSelected ? "#2563eb" : "#94a3b8",
        weight: isSelected ? 3.5 : 2,
        opacity: isSelected ? 0.9 : 0.4,
        dashArray: isSelected ? "6, 8" : "4, 6",
      });

      polyline.on("click", () => {
        onSelectRoute?.(route.id);
      });

      polyline.addTo(layerGroup);

      // Origin Marker
      const originMarker = L.marker(originCoords, {
        icon: createCustomPin("blue", "A"),
      });

      originMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <p style="font-size: 11px; color: #64748b; margin: 0; font-weight: 600; text-transform: uppercase;">Origin Point</p>
          <h4 style="font-size: 14px; font-weight: 800; color: #0e1326; margin: 2px 0 6px 0;">${route.origin}</h4>
          <p style="font-size: 12px; color: #3b82f6; margin: 0; font-weight: 700;">${route.title}</p>
        </div>
      `);

      originMarker.on("click", () => {
        onSelectRoute?.(route.id);
      });

      originMarker.addTo(layerGroup);

      // Destination Marker
      const destMarker = L.marker(destCoords, {
        icon: createCustomPin(isSelected ? "emerald" : "amber", "B"),
      });

      destMarker.bindPopup(`
        <div style="font-family: inherit; padding: 4px;">
          <p style="font-size: 11px; color: #64748b; margin: 0; font-weight: 600; text-transform: uppercase;">Destination</p>
          <h4 style="font-size: 14px; font-weight: 800; color: #0e1326; margin: 2px 0 6px 0;">${route.destination}</h4>
          <p style="font-size: 12px; color: #10b981; margin: 0 0 4px 0; font-weight: 700;">${route.title}</p>
          <div style="font-size: 11px; color: #64748b; border-top: 1px solid #f1f5f9; padding-top: 4px; display: flex; justify-content: space-between; gap: 8px;">
            <span>${route.distanceKm.toLocaleString()} km</span>
            <span>${route.durationHours} hrs</span>
          </div>
        </div>
      `);

      destMarker.on("click", () => {
        onSelectRoute?.(route.id);
      });

      destMarker.addTo(layerGroup);
    });

    // Zoom and Pan to fit the active selected route (or all bounds)
    if (activeRoute) {
      const activeOrigin = getCoordinatesForPlace(activeRoute.origin, true);
      const activeDest = getCoordinatesForPlace(activeRoute.destination, false);
      const activeBounds = L.latLngBounds([activeOrigin, activeDest]);

      map.fitBounds(activeBounds, {
        padding: [60, 60],
        maxZoom: 7,
        animate: true,
      });
    } else if (bounds.isValid()) {
      map.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 5,
        animate: true,
      });
    }
  }, [routes, activeRoute, onSelectRoute]);

  return (
    <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border border-slate-100/90 shadow-sm bg-slate-50">
      {/* Real Interactive Leaflet Map Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Info Pill on Top Left */}
      <div className="absolute top-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-2 pointer-events-auto">
        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="text-[11.5px] font-bold text-[#0e1326]">
          {activeRoute ? activeRoute.title : "World Map View"}
        </span>
        <span className="text-[10px] text-[#94a3b8] font-mono">
          ({routes.length} {routes.length === 1 ? "route" : "routes"})
        </span>
      </div>

      {/* Floating Legend on Bottom Left */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm flex items-center gap-3 text-[11px] font-semibold text-[#64748b] pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
          <span>Origin (A)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
          <span>Destination (B)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-blue-600" />
          <span>Flight / Transit</span>
        </div>
      </div>
    </div>
  );
}
