"use client";

import { useRef } from "react";
import Image from "next/image";

import { useOnReady, useGsapContext } from "@/components/AppReady";
import { MagneticButton } from "@/components/ui";
import { PROFILE } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/animation";

const HEADLINE = [
  ["ZAIGHAM", "ALI"],
  ["FULL", "STACK"],
  ["DEVELOPER."],
];

export default function Hero() {
  const scope = useRef<HTMLElement>(null);

  useOnReady(() => {
    const el = scope.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      gsap.set(el.querySelectorAll("[data-hero-word]"), {
        yPercent: 0,
        opacity: 1,
        filter: "blur(0px)",
      });
      return;
    }

    gsap
      .timeline({ defaults: { ease: "expo.out" } })
      .from("[data-hero-word]", {
        yPercent: 115,
        opacity: 0,
        filter: "blur(14px)",
        duration: 1.35,
        stagger: 0.08,
      })
      .from(
        "[data-hero-eyebrow]",
        { y: 18, opacity: 0, duration: 0.9, stagger: 0.12 },
        0.35,
      )
      .from(
        "[data-hero-copy]",
        { y: 24, opacity: 0, duration: 1, stagger: 0.12 },
        0.75,
      )
      .from(
        "[data-hero-cta]",
        { y: 26, opacity: 0, duration: 0.9, stagger: 0.12 },
        0.95,
      )
      .from(
        "[data-hero-shape]",
        { scale: 0.85, opacity: 0, duration: 1.4, stagger: 0.14 },
        0.6,
      )
      .from("[data-hero-scroll]", { opacity: 0, duration: 0.8 }, 1.2);
  }, 120);

  useGsapContext(() => {
    const el = scope.current;
    if (!el) return;
    if (prefersReducedMotion()) return;

    gsap.to("[data-hero-headline]", {
      yPercent: -14,
      opacity: 0.25,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });

    gsap.to("[data-hero-shape]", {
      yPercent: -32,
      ease: "none",
      scrollTrigger: { trigger: el, start: "top top", end: "bottom top", scrub: true },
    });
  }, []);

  useGsapContext(() => {
    const el = scope.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;
    if (prefersReducedMotion()) return;

    const shapes = gsap.utils.toArray<HTMLElement>("[data-hero-shape]");
    const movers = shapes.map((shape, index) => ({
      x: gsap.quickTo(shape, "x", { duration: 1.2, ease: "power3.out" }),
      y: gsap.quickTo(shape, "y", { duration: 1.2, ease: "power3.out" }),
      depth: (index + 1) * 14,
    }));

    const onMove = (event: MouseEvent) => {
      const relX = event.clientX / window.innerWidth - 0.5;
      const relY = event.clientY / window.innerHeight - 0.5;
      movers.forEach((mover) => {
        mover.x(-relX * mover.depth);
        mover.y(-relY * mover.depth);
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={scope}
      id="hero"
      className="relative flex min-h-[100svh] flex-col justify-between px-5 pt-32 pb-10 sm:px-8 lg:px-12"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          data-hero-shape
          className="animate-float-slow absolute top-[18%] right-[8%] h-44 w-44 overflow-hidden rounded-[2rem] border border-white/20 bg-white/[0.04] shadow-2xl shadow-black/60 backdrop-blur-md lg:h-64 lg:w-64"
        >
          <Image
            src="/pic/my.png"
            alt="Zaigham Ali"
            fill
            sizes="(max-width: 1024px) 176px, 256px"
            className="object-cover object-center"
            priority
          />
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/15" />
        </div>
        <div
          data-hero-shape
          className="animate-float-slow absolute bottom-[22%] left-[6%] h-24 w-24 rounded-full border border-accent/25 bg-accent/[0.06] lg:h-32 lg:w-32"
        />
        <div
          data-hero-shape
          className="animate-spin-ring absolute top-[12%] left-[52%] h-64 w-64 rounded-full border border-dashed border-white/10 lg:h-96 lg:w-96"
        />
      </div>

      <div className="relative flex items-start justify-between gap-6">
        <div className="flex items-center gap-3" data-hero-eyebrow>
          <span className="eyebrow text-white/40">Portfolio</span>
          <span className="h-px w-8 bg-white/25" />
          <span className="eyebrow text-accent">2026</span>
        </div>
        <div className="text-right" data-hero-eyebrow>
          <p className="eyebrow text-white/40">Based in</p>
          <p className="mt-1 font-mono text-[11px] tracking-[0.18em] text-white/75 uppercase">
            Karachi, PK
          </p>
        </div>
      </div>

      <div className="relative mt-10 flex flex-1 flex-col justify-center">
        <h1
          data-hero-headline
          className="display text-[clamp(2.65rem,10.4vw,10.5rem)] text-white"
        >
          {HEADLINE.map((line, lineIndex) => (
            <span key={lineIndex} className="block overflow-hidden pb-[0.04em]">
              {line.map((word) => (
                <span
                  key={word}
                  className="mr-[0.22em] inline-block overflow-hidden align-top"
                >
                  <span data-hero-word className="inline-block will-change-transform">
                    {word.endsWith(".") ? (
                      <>
                        {word.slice(0, -1)}
                        <span className="text-accent">.</span>
                      </>
                    ) : (
                      word
                    )}
                  </span>
                </span>
              ))}
            </span>
          ))}
        </h1>

        <div className="mt-10 grid gap-10 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end">
          <p
            data-hero-copy
            className="max-w-[46ch] text-sm leading-relaxed text-fog sm:text-base"
          >
            <span className="text-white">Crafting digital experiences that move</span> —
            Creative Developer & Full Stack Web Developer building interactive digital experiences.
          </p>

          <div className="flex flex-wrap items-center gap-3" data-hero-cta>
            <MagneticButton href="#work" variant="primary" cursorLabel="VIEW">
              View Work
            </MagneticButton>
            <MagneticButton href="#contact" variant="ghost" cursorLabel="TALK">
              Let&apos;s Talk
            </MagneticButton>
          </div>
        </div>
      </div>

      <div
        data-hero-scroll
        className="relative mt-12 flex items-end justify-between gap-6"
      >
        <div className="flex items-center gap-3">
          <span className="relative flex h-9 w-5 items-start justify-center rounded-full border border-white/20 pt-1.5">
            <span className="animate-scroll-dot h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          <span className="eyebrow text-white/45">Scroll to explore</span>
        </div>
        <p className="hidden max-w-[30ch] text-right font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase sm:block">
          Next.js · React · GSAP · Laravel
          <br />
          {PROFILE.overview.split(",")[0]}
        </p>
      </div>
    </section>
  );
}
