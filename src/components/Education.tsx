"use client";

import { useRef } from "react";

import { useGsapContext } from "@/components/AppReady";
import { gsap, prefersReducedMotion } from "@/lib/animation";
import type { EducationView } from "@/lib/types";

export default function Education({ items }: { items: EducationView[] }) {
  const scope = useRef<HTMLDivElement>(null);

  useGsapContext(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;

    gsap.fromTo(
      el.querySelectorAll("[data-edu-row]"),
      { y: 25, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: el, start: "top 95%", once: true },
      },
    );
  }, []);

  return (
    <div ref={scope} className="mt-14">
      <div className="flex items-center gap-4">
        <span className="eyebrow text-white/40">Education</span>
        <span className="h-px flex-1 bg-white/10" />
        <span className="eyebrow text-accent">Timeline</span>
      </div>

      <ol className="mt-8">
        {items.map((item) => (
          <li
            key={item.id}
            data-edu-row
            className="group grid grid-cols-[4.5rem_1fr] gap-4 border-t border-white/8 py-5 last:border-b sm:grid-cols-[7rem_1fr] sm:gap-6"
          >
            <span className="font-mono text-[10px] tracking-[0.2em] text-accent/85 uppercase transition-colors duration-500 group-hover:text-accent">
              {item.year}
            </span>
            <div>
              <p className="text-sm leading-snug text-white transition-transform duration-500 group-hover:translate-x-1 sm:text-base">
                {item.qualification}
              </p>
              <p className="mt-1.5 text-xs text-fog">
                {item.institute} — {item.location}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
