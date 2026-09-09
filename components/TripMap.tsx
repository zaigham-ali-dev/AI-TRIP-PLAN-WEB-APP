"use client";

import React from "react";
import InteractiveRouteMap, { MapWaypoint } from "./InteractiveRouteMap";

export type MapMarker = MapWaypoint;

interface TripMapProps {
  destination: string;
  spots?: MapMarker[];
  className?: string;
}

export default function TripMap({ destination, spots, className }: TripMapProps) {
  return (
    <InteractiveRouteMap
      destination={destination}
      spots={spots}
      className={className}
    />
  );
}
