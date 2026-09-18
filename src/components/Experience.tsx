"use client";

import { useRef, useState } from "react";

import { useGsapContext } from "@/components/AppReady";
import { gsap, prefersReducedMotion } from "@/lib/animation";
import type { ExperienceView } from "@/lib/types";

export default function Experience({ items }: { items: ExperienceView[] }) {
  const scope = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState(0);

  useGsapContext(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;

    gsap.fromTo(
      el.querySelectorAll("[data-exp-row]"),
      { y: 35, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      },
    );

    gsap.fromTo(
      "[data-exp-line]",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        transformOrigin: "top",
        scrollTrigger: { trigger: el, start: "top 80%", end: "bottom 60%", scrub: true },
      },
    );
  }, []);

  return (
    <section id="experience" className="relative px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12 lg:pb-32">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <div className="flex items-center gap-4">
              <span className="eyebrow text-white/40">03.5</span>
              <span className="h-px w-10 bg-white/25" />
              <span className="eyebrow text-accent">Experience</span>
            </div>
            <h2 className="display mt-6 text-[clamp(2rem,4.6vw,3.4rem)] text-white">
              Career History
            </h2>
            <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-fog">
              Two years of operations precision followed by hands-on frontend
              engineering — a combination that shows up as calm, well-documented work.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 font-mono text-[10px] tracking-[0.18em] text-white/50 uppercase">
              <span className="rounded-full border border-white/12 px-3 py-1.5">
                6 months frontend
              </span>
              <span className="rounded-full border border-white/12 px-3 py-1.5">
                2 years operations
              </span>
            </div>
          </div>

          <div ref={scope} className="relative pl-6 sm:pl-10">
            <span className="absolute top-2 bottom-2 left-0 w-px bg-white/10">
              <span data-exp-line className="absolute inset-0 origin-top bg-accent/70" />
            </span>

            <div className="flex flex-col">
              {items.map((item, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={item.id}
                    data-exp-row
                    onMouseEnter={() => setOpenIndex(index)}
                    className="group border-t border-white/8 py-7 last:border-b"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(index)}
                      aria-expanded={isOpen}
                      data-cursor="grow"
                      className="flex w-full items-start justify-between gap-6 text-left"
                    >
                      <div className="flex items-start gap-5">
                        <span
                          className={`mt-1.5 h-2 w-2 shrink-0 rounded-full transition-all duration-500 ${
                            isOpen ? "scale-125 bg-accent" : "bg-white/25"
                          }`}
                        />
                        <div>
                          <h3
                            className={`display text-[clamp(1.3rem,2.6vw,2rem)] transition-colors duration-500 ${
                              isOpen ? "text-white" : "text-white/70"
                            }`}
                          >
                            {item.company}
                          </h3>
                          <p className="mt-2 text-sm text-fog">{item.role}</p>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="font-mono text-[10px] tracking-[0.2em] text-white/60 uppercase">
                          {item.duration}
                        </p>
                        <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-accent/80 uppercase">
                          {item.period}
                        </p>
                      </div>
                    </button>

                    <div
                      className="grid transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        gridTemplateRows: isOpen ? "1fr" : "0fr",
                        opacity: isOpen ? 1 : 0.35,
                      }}
                    >
                      <div className="overflow-hidden">
                        <div className="pt-6 pl-7">
                          <p className="max-w-[54ch] text-sm leading-relaxed text-white/75">
                            {item.summary}
                          </p>
                          <ul className="mt-5 grid gap-2">
                            {item.highlights.map((highlight) => (
                              <li
                                key={highlight}
                                className="flex items-start gap-3 text-xs text-fog"
                              >
                                <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent/80" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
