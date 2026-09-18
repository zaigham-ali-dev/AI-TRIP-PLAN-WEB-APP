"use client";

import { useRef } from "react";

import { useGsapContext } from "@/components/AppReady";
import { PROFILE } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/animation";

const STATEMENT = "I DESIGN & BUILD INTERFACES THAT FEEL ALIVE.".split(" ");

export default function Intro() {
  const scope = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const el = scope.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    gsap.fromTo(
      "[data-intro-word]",
      { opacity: 0.1, y: 26, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        ease: "none",
        stagger: 0.25,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          end: "bottom 65%",
          scrub: 0.8,
        },
      },
    );

    gsap.to("[data-intro-glow]", {
      scale: 1.35,
      opacity: 0.55,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
    });

    gsap.to("[data-intro-hairline]", {
      scaleX: 1,
      duration: 1.4,
      ease: "expo.out",
      scrollTrigger: { trigger: el, start: "top 70%" },
    });

    gsap.from("[data-intro-meta] > *", {
      y: 26,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      stagger: 0.1,
      scrollTrigger: { trigger: "[data-intro-meta]", start: "top 88%" },
    });
  }, []);

  return (
    <section
      ref={scope}
      id="intro"
      className="relative px-5 py-24 sm:px-8 sm:py-32 lg:px-12 lg:py-40"
    >
      <div
        data-intro-glow
        className="pointer-events-none absolute top-1/3 left-1/2 h-[40vh] w-[70vw] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(125,108,255,0.18),transparent_65%)] opacity-25 blur-[70px]"
      />

      <div className="relative mx-auto w-full max-w-[1500px]">
        <div className="flex items-center gap-4">
          <span className="eyebrow text-white/40">01</span>
          <span
            data-intro-hairline
            className="h-px w-full origin-left scale-x-0 bg-white/15"
          />
          <span className="eyebrow text-accent">Statement</span>
        </div>

        <h2 className="display mt-10 max-w-[24ch] text-[clamp(2.2rem,7.4vw,6.8rem)] text-white lg:mt-14">
          {STATEMENT.map((word, index) => (
            <span key={`${word}-${index}`} className="mr-[0.26em] inline-block">
              <span data-intro-word className="inline-block will-change-transform">
                {word === "ALIVE." ? (
                  <>
                    ALIVE<span className="text-accent">.</span>
                  </>
                ) : (
                  word
                )}
              </span>
            </span>
          ))}
        </h2>

        <div
          data-intro-meta
          className="mt-16 grid gap-10 border-t border-white/8 pt-10 lg:mt-24 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-20"
        >
          <div>
            <p className="eyebrow">Overview</p>
            <div className="mt-6 space-y-4">
              <p className="display text-4xl text-white">06</p>
              <p className="max-w-[24ch] text-xs leading-relaxed tracking-[0.14em] text-fog uppercase">
                Shipped client experiences across real estate, travel, AI and non-profit
                platforms.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <p className="text-lg leading-[1.5] text-white/85 sm:text-2xl">
              {PROFILE.overviewLong}
            </p>
            <p className="max-w-[62ch] text-sm leading-relaxed text-fog sm:text-base">
              {PROFILE.overview} Every build pairs a considered system — typography,
              spacing, motion — with a real full stack behind it: Next.js and React on
              the surface, Laravel, Node.js and Firebase underneath. The result is work
              that looks premium and behaves even better.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
