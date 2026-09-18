"use client";

import { useEffect, useRef, useState } from "react";

import { markReady, useScrollRefresh } from "@/components/AppReady";
import { gsap, prefersReducedMotion } from "@/lib/animation";

const PHASES = ["BOOTING STUDIO", "LOADING MOTION", "ALMOST THERE"];

export default function Preloader() {
  const scope = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  useScrollRefresh();

  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    if (prefersReducedMotion()) {
      window.scrollTo(0, 0);
      markReady();
      window.setTimeout(() => setHidden(true), 0);
      return;
    }

    window.scrollTo(0, 0);
    window.dispatchEvent(new CustomEvent("zaigham:scroll-lock", { detail: true }));

    const counter = { value: 0 };
    const timeline = gsap.timeline({
      onComplete: () => {
        window.dispatchEvent(
          new CustomEvent("zaigham:scroll-lock", { detail: false }),
        );
        setHidden(true);
      },
    });

    timeline
      .to(counter, {
        value: 100,
        duration: 1.5,
        ease: "power2.inOut",
        onUpdate: () => setProgress(Math.round(counter.value)),
      })
      .to("[data-pre-line]", { scaleX: 1, duration: 1.5, ease: "power2.inOut" }, 0)
      .to("[data-pre-meta]", { opacity: 0, duration: 0.4 }, 1.05)
      .to(
        "[data-pre-brand]",
        { yPercent: -140, opacity: 0, duration: 0.7, ease: "expo.inOut" },
        1.1,
      )
      .call(markReady, undefined, 1.25)
      .to(
        "[data-pre-panel]",
        { yPercent: -100, duration: 1, ease: "expo.inOut", stagger: 0.08 },
        1.3,
      );

    return () => {
      timeline.kill();
      window.dispatchEvent(new CustomEvent("zaigham:scroll-lock", { detail: false }));
    };
  }, []);

  if (hidden) return null;

  const phase = PHASES[Math.min(PHASES.length - 1, Math.floor(progress / 40))];

  return (
    <div ref={scope} className="pointer-events-none fixed inset-0 z-[100]" aria-hidden>
      <div className="absolute inset-0 flex">
        {[0, 1, 2, 3, 4].map((panel) => (
          <div key={panel} data-pre-panel className="h-full flex-1 bg-ink" />
        ))}
      </div>

      <div className="relative flex h-full flex-col justify-between p-6 sm:p-10">
        <div data-pre-meta className="flex items-center justify-between">
          <span className="eyebrow">ZAIGHAM ALI</span>
          <span className="eyebrow text-white/35">PORTFOLIO / 2026</span>
        </div>

        <div className="flex items-end justify-between gap-8">
          <div data-pre-brand className="overflow-hidden">
            <p className="display text-[clamp(2.5rem,9vw,7rem)] text-white">
              CRAFT
              <span className="text-accent">.</span>
            </p>
            <p className="eyebrow mt-3">{phase}</p>
          </div>
          <div className="text-right">
            <p className="display text-[clamp(2.5rem,9vw,6rem)] text-white/90 tabular-nums">
              {String(progress).padStart(3, "0")}
            </p>
          </div>
        </div>

        <div data-pre-meta className="mt-10">
          <div className="h-px w-full bg-white/12">
            <div
              data-pre-line
              className="h-px w-full origin-left scale-x-0 bg-accent"
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className="eyebrow text-white/30">Karachi, Pakistan</span>
            <span className="eyebrow text-white/30">Full Stack · Creative Dev</span>
          </div>
        </div>
      </div>
    </div>
  );
}
