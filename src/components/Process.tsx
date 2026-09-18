"use client";

import { useRef, useState } from "react";

import { useGsapContext } from "@/components/AppReady";
import { PROCESS_STEPS } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/animation";

export default function Process() {
  const scope = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useGsapContext(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;

    const steps = gsap.utils.toArray<HTMLElement>("[data-process-step]");

    gsap.fromTo(
      steps,
      { y: 30 },
      {
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "transform",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      },
    );

    gsap.fromTo(
      "[data-process-line]",
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: el.querySelector("ol"),
          start: "top 72%",
          end: "bottom 68%",
          scrub: true,
        },
      },
    );

    steps.forEach((step, index) => {
      gsap.to(step, {
        scrollTrigger: {
          trigger: step,
          start: "top 62%",
          end: "bottom 42%",
          onEnter: () => {
            activeRef.current = index;
            setActive(index);
          },
          onEnterBack: () => {
            activeRef.current = index;
            setActive(index);
          },
        },
      });
    });
  }, []);

  return (
    <section
      ref={scope}
      id="process"
      className="relative border-t border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-4">
              <span className="eyebrow text-white/40">05</span>
              <span className="h-px w-10 bg-white/25" />
              <span className="eyebrow text-accent">Process</span>
            </div>
            <h2 className="display mt-8 max-w-[16ch] text-[clamp(2.2rem,6.4vw,5.6rem)] text-white">
              How the work happens
            </h2>
          </div>
          <p className="font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
            Step {String(active + 1).padStart(2, "0")} / {PROCESS_STEPS.length} —{" "}
            {PROCESS_STEPS[active]?.title}
          </p>
        </div>

        <div className="relative mt-16 lg:mt-24">
          <span className="absolute top-0 bottom-0 left-[10px] w-px bg-white/10 lg:left-1/2" />
          <span
            data-process-line
            className="absolute top-0 bottom-0 left-[10px] w-px origin-top scale-y-0 bg-linear-to-b from-accent to-accent/0 lg:left-1/2"
          />

          <ol className="space-y-4">
            {PROCESS_STEPS.map((step, index) => {
              const isActive = active === index;
              const isPast = index < active;
              return (
                <li
                  key={step.number}
                  data-process-step
                  onMouseEnter={() => setActive(index)}
                  className={`relative grid gap-4 pl-10 transition-opacity duration-700 sm:grid-cols-[6rem_1fr] sm:pl-12 lg:grid-cols-[1fr_6rem_1fr] lg:gap-10 lg:pl-0 ${
                    isActive ? "opacity-100" : isPast ? "opacity-45" : "opacity-65"
                  }`}
                >
                  <span
                    className={`absolute top-[2.4rem] left-0 h-2.5 w-2.5 rounded-full border transition-all duration-500 lg:left-1/2 lg:-translate-x-1/2 ${
                      isActive
                        ? "scale-125 border-accent bg-accent"
                        : "border-white/25 bg-ink"
                    }`}
                  />

                  <div className="lg:order-1 lg:pb-12 lg:text-right">
                    <span
                      className={`display block text-[clamp(1.6rem,3.6vw,2.8rem)] transition-colors duration-500 ${
                        isActive ? "text-accent" : "text-white/60"
                      }`}
                    >
                      {step.number}
                    </span>
                  </div>

                  <div className="hidden lg:order-2 lg:block" />

                  <div className="lg:order-3 lg:pb-12">
                    <h3
                      className={`display text-[clamp(1.35rem,3vw,2.3rem)] transition-colors duration-500 ${
                        isActive ? "text-white" : "text-white/70"
                      }`}
                    >
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-fog">
                      {step.detail}
                    </p>
                    <p className="mt-3 font-mono text-[10px] tracking-[0.2em] text-white/40 uppercase">
                      {step.meta}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
