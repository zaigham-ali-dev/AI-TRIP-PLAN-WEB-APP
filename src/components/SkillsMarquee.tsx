"use client";

import { useRef } from "react";

import { useGsapContext } from "@/components/AppReady";
import { MARQUEE_ITEMS } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/animation";

const ROWS = [
  MARQUEE_ITEMS.slice(0, 8),
  MARQUEE_ITEMS.slice(8),
];

function Row({ items }: { items: string[] }) {
  const loop = [...items, ...items, ...items, ...items];
  return (
    <div data-marquee-track className="flex w-max shrink-0 items-center gap-10 pr-10">
      {loop.map((item, index) => (
        <span key={`${item}-${index}`} className="flex items-center gap-10">
          <span className="display text-[clamp(1.5rem,4.2vw,3.4rem)] whitespace-nowrap text-white/85">
            {item}
          </span>
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70" />
        </span>
      ))}
    </div>
  );
}

export default function SkillsMarquee() {
  const scope = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const el = scope.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    const tracks = gsap.utils.toArray<HTMLElement>("[data-marquee-row]");

    const tweens = tracks.map((track) => {
      const inner = track.querySelector<HTMLElement>("[data-marquee-track]");
      if (!inner) return null;
      const reverse = track.dataset.direction === "reverse";
      gsap.set(inner, { xPercent: reverse ? -25 : 0 });
      return gsap.to(inner, {
        xPercent: reverse ? 0 : -25,
        duration: 26,
        ease: "none",
        repeat: -1,
      });
    });

    const onEnter = () => tweens.forEach((tween) => tween?.timeScale(0.22));
    const onLeave = () => tweens.forEach((tween) => tween?.timeScale(1));

    const wrapper = el.querySelector("[data-marquee-wrap]");
    wrapper?.addEventListener("mouseenter", onEnter);
    wrapper?.addEventListener("mouseleave", onLeave);

    return () => {
      wrapper?.removeEventListener("mouseenter", onEnter);
      wrapper?.removeEventListener("mouseleave", onLeave);
      tweens.forEach((tween) => tween?.kill());
    };
  }, []);

  return (
    <section
      ref={scope}
      aria-label="Skills and tools"
      className="relative border-y border-white/8 bg-white/[0.015] py-14 sm:py-20"
    >
      <div
        data-marquee-wrap
        className="mask-fade-x flex flex-col gap-6 overflow-hidden sm:gap-8"
      >
        <div data-marquee-row data-direction="forward" className="flex">
          <Row items={ROWS[0]} />
        </div>
        <div data-marquee-row data-direction="reverse" className="flex">
          <Row items={ROWS[1]} />
        </div>
      </div>
      <p className="eyebrow mt-10 px-5 text-center text-white/30 sm:px-8">
        Hover to slow — the toolkit behind every build
      </p>
    </section>
  );
}
