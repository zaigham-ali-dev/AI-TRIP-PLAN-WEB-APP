"use client";

import Lenis from "lenis";
import { useEffect } from "react";

import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/animation";

/**
 * Lenis-driven smooth scrolling kept in sync with the GSAP ticker and
 * ScrollTrigger, with a global helper so anchors can scroll gracefully.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      smoothWheel: true,
    });

    const onScroll = () => ScrollTrigger.update();
    lenis.on("scroll", onScroll);

    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const anchorHandler = (event: MouseEvent) => {
      const target = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>(
        'a[href^="#"]',
      );
      if (!target) return;

      const hash = target.getAttribute("href");
      if (!hash || hash === "#") return;

      const element = document.querySelector(hash);
      if (!element) return;

      event.preventDefault();
      lenis.scrollTo(element as HTMLElement, {
        offset: hash === "#top" ? 0 : -20,
        duration: 1.4,
      });
      window.history.replaceState(null, "", hash);
    };

    const lockHandler = (event: Event) => {
      const locked = (event as CustomEvent<boolean>).detail;
      if (locked) {
        lenis.stop();
        document.documentElement.classList.add("lenis-stopped");
      } else {
        lenis.start();
        document.documentElement.classList.remove("lenis-stopped");
      }
    };

    document.addEventListener("click", anchorHandler);
    window.addEventListener("zaigham:scroll-lock", lockHandler);

    return () => {
      document.removeEventListener("click", anchorHandler);
      window.removeEventListener("zaigham:scroll-lock", lockHandler);
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  return null;
}
