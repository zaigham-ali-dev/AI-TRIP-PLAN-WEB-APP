"use client";

import { useEffect, useRef, useState } from "react";

import { gsap } from "@/lib/animation";

type CursorState = {
  variant: "dot" | "grow" | "label";
  label: string;
};

const DEFAULT_STATE: CursorState = { variant: "dot", label: "" };

/**
 * Desktop-only custom cursor. Elements opt in with
 * `data-cursor="label"` and `data-cursor-label="VISIT"`.
 */
export default function CustomCursor() {
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<CursorState>(DEFAULT_STATE);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    document.documentElement.dataset.cursor = "active";

    const ring = ringRef.current;
    const dot = dotRef.current;
    if (!ring || !dot) return;

    gsap.set([ring, dot], { xPercent: -50, yPercent: -50, opacity: 0 });

    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power2.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power2.out" });

    let visible = false;

    const onMove = (event: MouseEvent) => {
      ringX(event.clientX);
      ringY(event.clientY);
      dotX(event.clientX);
      dotY(event.clientY);

      if (!visible) {
        visible = true;
        gsap.to([ring, dot], { opacity: 1, duration: 0.35 });
      }

      const target = event.target as HTMLElement | null;
      const holder = target?.closest<HTMLElement>("[data-cursor]");
      const interactive = target?.closest<HTMLElement>(
        "a, button, [data-magnetic], input, textarea, select",
      );

      if (holder) {
        const next: CursorState = {
          variant: holder.dataset.cursor === "grow" ? "grow" : "label",
          label: holder.dataset.cursorLabel ?? "",
        };
        setState((prev) =>
          prev.variant === next.variant && prev.label === next.label ? prev : next,
        );
        return;
      }

      const next: CursorState = interactive
        ? { variant: "grow", label: "" }
        : DEFAULT_STATE;
      setState((prev) =>
        prev.variant === next.variant && prev.label === next.label ? prev : next,
      );
    };

    const onDown = () => gsap.to(ring, { scale: 0.78, duration: 0.2 });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.3 });
    const onLeave = () => {
      visible = false;
      gsap.to([ring, dot], { opacity: 0, duration: 0.25 });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      delete document.documentElement.dataset.cursor;
    };
  }, []);

  useEffect(() => {
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!ring || !label) return;

    const expanded = state.variant === "label";
    const grown = state.variant !== "dot";

    gsap.to(ring, {
      width: expanded ? 92 : grown ? 56 : 34,
      height: expanded ? 92 : grown ? 56 : 34,
      borderColor: expanded ? "rgba(216,255,62,0.85)" : "rgba(255,255,255,0.45)",
      backgroundColor: expanded ? "rgba(216,255,62,0.10)" : "rgba(255,255,255,0)",
      duration: 0.45,
      ease: "power3.out",
    });

    gsap.to(label, {
      opacity: expanded ? 1 : 0,
      duration: 0.3,
      ease: "power2.out",
    });

    gsap.to(dotRef.current, {
      opacity: grown && !expanded ? 0.9 : expanded ? 0 : 1,
      scale: grown && !expanded ? 1.3 : 1,
      duration: 0.3,
    });
  }, [state]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <div
        ref={ringRef}
        className="absolute top-0 left-0 flex h-[34px] w-[34px] items-center justify-center rounded-full border border-white/45 backdrop-blur-[2px]"
      >
        <span
          ref={labelRef}
          className="font-mono text-[9px] tracking-[0.2em] whitespace-nowrap text-accent uppercase opacity-0"
        >
          {state.label}
        </span>
      </div>
      <div
        ref={dotRef}
        className="absolute top-0 left-0 h-[5px] w-[5px] rounded-full bg-white"
      />
    </div>
  );
}
