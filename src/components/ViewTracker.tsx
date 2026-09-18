"use client";

import { useEffect } from "react";

/** Registers one visit per browser session in sessionStorage. */
export default function ViewTracker() {
  useEffect(() => {
    const seen = window.sessionStorage.getItem("zaigham:visit");
    if (seen) return;
    window.sessionStorage.setItem("zaigham:visit", "1");
  }, []);

  return null;
}
