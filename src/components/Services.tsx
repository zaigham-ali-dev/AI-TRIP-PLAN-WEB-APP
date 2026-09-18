"use client";

import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";

import { useGsapContext } from "@/components/AppReady";
import { SectionHeading, ServiceIcon } from "@/components/ui";
import { SERVICE_TECH_MAP, getTechIconForTag } from "@/components/TechLogos";
import { gsap, prefersReducedMotion } from "@/lib/animation";
import type { ServiceView } from "@/lib/types";

export default function Services({ services }: { services: ServiceView[] }) {
  const scope = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;

    gsap.fromTo(
      el.querySelectorAll("[data-service-card]"),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: el.querySelector("[data-service-grid]"), start: "top 92%", once: true },
      },
    );
  }, []);

  useEffect(() => {
    const el = scope.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (prefersReducedMotion()) return;

    const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-service-card]"));
    const cleanups: Array<() => void> = [];

    cards.forEach((card) => {
      const number = card.querySelector<HTMLElement>("[data-service-number]");
      const icon = card.querySelector<HTMLElement>("[data-service-icon]");
      const arrow = card.querySelector<HTMLElement>("[data-service-arrow]");

      const numberY = number
        ? gsap.quickTo(number, "y", { duration: 0.7, ease: "power3.out" })
        : null;
      const numberColor = number
        ? (value: string) => {
          gsap.to(number, { color: value, duration: 0.5, overwrite: "auto" });
        }
        : null;

      const onEnter = () => {
        numberY?.(-16);
        numberColor?.("#d8ff3e");
        gsap.to(card, { backgroundColor: "rgba(255,255,255,0.04)", duration: 0.6 });
        if (icon) gsap.to(icon, { rotate: 8, scale: 1.12, duration: 0.7, ease: "power3.out" });
        if (arrow) gsap.to(arrow, { x: 6, y: -6, opacity: 1, duration: 0.5 });
      };

      const onLeave = () => {
        numberY?.(0);
        numberColor?.("rgba(255,255,255,0.85)");
        gsap.to(card, { backgroundColor: "rgba(255,255,255,0)", duration: 0.6 });
        if (icon) gsap.to(icon, { rotate: 0, scale: 1, duration: 0.7, ease: "power3.out" });
        if (arrow) gsap.to(arrow, { x: 0, y: 0, opacity: 0.35, duration: 0.5 });
      };

      card.addEventListener("mouseenter", onEnter);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mouseenter", onEnter);
        card.removeEventListener("mouseleave", onLeave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, [services.length]);

  return (
    <section
      ref={scope}
      id="capabilities"
      className="relative border-t border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="03"
            label="Services"
            title="What I Build"
            description="Four disciplines, one pipeline — from interface systems to the server that feeds them, with motion wired in as a first-class layer."
          />
        </div>

        <div
          data-service-grid
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:mt-20"
        >
          {services.map((service) => {
            const techLogos = SERVICE_TECH_MAP[service.number] ?? [];

            return (
              <article
                key={service.id}
                data-service-card
                data-cursor="grow"
                className="group relative flex flex-col justify-between gap-5 rounded-2xl border border-white/10 bg-smoke/40 p-5 transition-all duration-500 hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] sm:p-6"
              >
                {/* Header row: Step number & Icon */}
                <div className="flex items-start justify-between gap-4">
                  <span
                    data-service-number
                    className="display text-[clamp(1.8rem,4vw,2.8rem)] text-white/85"
                  >
                    {service.number}
                  </span>
                  <span
                    data-service-icon
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/12 bg-white/[0.03] text-accent transition-transform duration-500"
                  >
                    <ServiceIcon name={service.icon} className="h-5 w-5" />
                  </span>
                </div>

                {/* Title & Description */}
                <div className="space-y-2">
                  <h3 className="display max-w-[18ch] text-[clamp(1.1rem,2.4vw,1.6rem)] text-white">
                    {service.title}
                  </h3>
                  <p className="max-w-[46ch] text-xs leading-relaxed text-fog">
                    {service.description}
                  </p>
                </div>

                {/* Tech Logos Visual Showcase Grid (React, Next.js, Tailwind, etc.) */}
                {techLogos.length > 0 && (
                  <div className="space-y-1.5">
                    <p className="font-mono text-[9px] tracking-[0.2em] text-white/40 uppercase">
                      Core Technologies & Languages
                    </p>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {techLogos.map((tech) => {
                        const Icon = tech.icon;
                        return (
                          <div
                            key={tech.name}
                            className="group/tech relative flex flex-col items-center justify-center gap-1.5 overflow-hidden rounded-xl border border-white/8 bg-black/40 p-2.5 text-center backdrop-blur-sm transition-all duration-400 hover:-translate-y-1 hover:border-white/25 hover:bg-white/[0.04]"
                          >
                            <div
                              className="pointer-events-none absolute inset-0 opacity-0 blur-xl transition-opacity duration-500 group-hover/tech:opacity-30"
                              style={{ backgroundColor: tech.glowColor }}
                            />
                            <div className="relative flex h-7 w-7 items-center justify-center transition-transform duration-300 group-hover/tech:scale-110">
                              <Icon className="h-6 w-6" />
                            </div>
                            <span className="relative font-mono text-[10px] font-medium tracking-wide text-white/80 transition-colors duration-300 group-hover/tech:text-white">
                              {tech.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Footer Tag Pills with Mini Logos */}
                <div className="flex flex-wrap items-center gap-1.5 border-t border-white/6 pt-3">
                  {service.tags.map((tag) => {
                    const TagIcon = getTechIconForTag(tag);
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.02] px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase transition-colors hover:border-white/25 hover:text-white"
                      >
                        {TagIcon && <TagIcon className="h-3 w-3 shrink-0" />}
                        {tag}
                      </span>
                    );
                  })}
                  <ArrowUpRight
                    data-service-arrow
                    size={16}
                    className="ml-auto text-accent opacity-35"
                  />
                </div>

                <span className="pointer-events-none absolute inset-x-0 bottom-0 h-px scale-x-0 bg-linear-to-r from-accent/70 via-accent/30 to-transparent transition-transform duration-700 group-hover:scale-x-100" />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
