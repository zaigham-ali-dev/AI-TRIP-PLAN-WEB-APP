"use client";

import { useEffect } from "react";

import { gsap, ScrollTrigger } from "@/lib/animation";

/**
 * A tiny global "preloader finished" store so sections can choreograph
 * their entrance after the intro curtain lifts.
 */
export const READY_EVENT = "zaigham:ready";

export function isReady(): boolean {
  if (typeof document === "undefined") return false;
  return document.documentElement.dataset.ready === "1";
}

export function markReady() {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.ready = "1";
  window.dispatchEvent(new Event(READY_EVENT));
}

export function AppReadyProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/** Runs a callback once the preloader curtain is gone (or immediately after). */
export function useOnReady(callback: () => void, delay = 0) {
  useEffect(() => {
    let timeout: number | undefined;

    const fire = () => {
      timeout = window.setTimeout(callback, delay);
    };

    if (isReady()) {
      fire();
    } else {
      window.addEventListener(READY_EVENT, fire, { once: true });
    }

    return () => {
      if (timeout) window.clearTimeout(timeout);
      window.removeEventListener(READY_EVENT, fire);
    };
  }, [callback, delay]);
}

/** Keeps ScrollTrigger measurements honest while fonts and media settle. */
export function useScrollRefresh() {
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    const timers = [180, 700, 1600].map((ms) => window.setTimeout(refresh, ms));
    window.addEventListener("load", refresh);
    window.addEventListener(READY_EVENT, refresh);
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      window.removeEventListener("load", refresh);
      window.removeEventListener(READY_EVENT, refresh);
    };
  }, []);
}

/** Slim wrapper that resets a GSAP context on unmount. */
export function useGsapContext(
  setup: (context: gsap.Context) => void,
  deps: React.DependencyList = [],
) {
  useEffect(() => {
    const context = gsap.context((self) => setup(self));
    return () => context.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
