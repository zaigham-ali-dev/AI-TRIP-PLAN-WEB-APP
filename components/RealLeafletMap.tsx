"use client";

import React, { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapMarker {
  id?: string | number;
  name: string;
  category?: "Morning" | "Afternoon" | "Evening" | "Food" | "Hotel" | string;
  lat?: number;
  lng?: number;
  description?: string;
  cost?: string;
}

interface RealLeafletMapProps {
  spots: MapMarker[];
  centerCoords: [number, number];
}

// Custom category colors and emojis
const CATEGORY_STYLES: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  Morning: { bg: "#f59e0b", border: "#b45309", text: "#fff", icon: "🌅" },
  Afternoon: { bg: "#0284c7", border: "#0369a1", text: "#fff", icon: "☀️" },
  Evening: { bg: "#7c3aed", border: "#6d28d9", text: "#fff", icon: "🌙" },
  Food: { bg: "#10b981", border: "#047857", text: "#fff", icon: "🍴" },
  Hotel: { bg: "#4f46e5", border: "#3730a3", text: "#fff", icon: "🏨" },
};

function createCustomPin(index: number, category: string) {
  const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Morning;

  return L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div style="
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        background: ${style.bg};
        border: 2.5px solid #ffffff;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 4px 12px rgba(0,0,0,0.35);
        cursor: pointer;
      ">
        <span style="
          transform: rotate(45deg);
          font-weight: 800;
          font-size: 11px;
          color: #ffffff;
          font-family: sans-serif;
        ">${index + 1}</span>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -34],
  });
}

// Helper component to auto-fit map view to markers
function MapBoundsUpdater({ coords }: { coords: [number, number][] }) {
  const map = useMap();

  useEffect(() => {
    if (coords.length > 0) {
      if (coords.length === 1) {
        map.setView(coords[0], 13);
      } else {
        const bounds = L.latLngBounds(coords.map((c) => L.latLng(c[0], c[1])));
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [coords, map]);

  return null;
}

export default function RealLeafletMap({ spots, centerCoords }: RealLeafletMapProps) {
  // Extract valid coordinates
  const validSpots = useMemo(() => {
    return spots.filter(
      (s) => typeof s.lat === "number" && typeof s.lng === "number" && !isNaN(s.lat) && !isNaN(s.lng) && (s.lat !== 0 || s.lng !== 0)
    );
  }, [spots]);

  const polylineCoords: [number, number][] = useMemo(() => {
    return validSpots.map((s) => [s.lat!, s.lng!]);
  }, [validSpots]);

  const effectiveCenter: [number, number] = validSpots.length > 0 ? [validSpots[0].lat!, validSpots[0].lng!] : centerCoords;

  return (
    <div className="w-full h-full min-h-[380px] rounded-3xl overflow-hidden relative border border-slate-200/90 shadow-lg z-0">
      <MapContainer
        center={effectiveCenter}
        zoom={13}
        scrollWheelZoom={false}
        className="w-full h-full z-0"
        style={{ width: "100%", height: "100%", minHeight: "380px", borderRadius: "1.5rem" }}
      >
        {/* OpenStreetMap Tile Layer */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Dynamic Route Polyline Path */}
        {polylineCoords.length > 1 && (
          <Polyline
            positions={polylineCoords}
            pathOptions={{
              color: "#2563eb",
              weight: 4,
              opacity: 0.85,
              dashArray: "8, 8",
            }}
          />
        )}

        {/* Sequential Markers */}
        {validSpots.map((spot, idx) => {
          const category = spot.category || "Morning";
          const style = CATEGORY_STYLES[category] || CATEGORY_STYLES.Morning;

          return (
            <Marker
              key={spot.id || idx}
              position={[spot.lat!, spot.lng!]}
              icon={createCustomPin(idx, category)}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-1 space-y-1.5 font-sans min-w-[180px]">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full text-white" style={{ background: style.bg }}>
                      {style.icon} {category}
                    </span>
                    {spot.cost && (
                      <span className="text-xs font-black text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {spot.cost}
                      </span>
                    )}
                  </div>
                  <h4 className="text-xs font-black text-slate-900 leading-tight">
                    {spot.name}
                  </h4>
                  {spot.description && (
                    <p className="text-[11px] text-slate-600 leading-snug">
                      {spot.description}
                    </p>
                  )}
                  <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                    📍 {spot.lat?.toFixed(4)}, {spot.lng?.toFixed(4)}
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* Auto fit bounds to waypoints */}
        <MapBoundsUpdater coords={polylineCoords} />
      </MapContainer>
    </div>
  );
}
