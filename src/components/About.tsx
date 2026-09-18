"use client";

import { Quote } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import { useGsapContext } from "@/components/AppReady";
import Education from "@/components/Education";
import { CountUp } from "@/components/ui";
import { PROFILE, SOFT_SKILLS } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/animation";
import type { EducationView, StatsView } from "@/lib/types";

const HEADING = ["Building Digital", "Experiences With", "Code + Creativity."];

export default function About({
  educations,
  stats,
}: {
  educations: EducationView[];
  stats: StatsView;
}) {
  const scope = useRef<HTMLElement>(null);

  useGsapContext(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;

    gsap.from(el.querySelectorAll("[data-about-line] > span"), {
      yPercent: 118,
      duration: 1.2,
      ease: "expo.out",
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: "top 74%" },
    });

    gsap.fromTo(
      el.querySelector("[data-about-portrait]"),
      { clipPath: "inset(12% 12% 12% 12% round 28px)", scale: 1.12 },
      {
        clipPath: "inset(0% 0% 0% 0% round 28px)",
        scale: 1,
        duration: 1.5,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-about-portrait]", start: "top 88%" },
      },
    );

    gsap.to("[data-about-portrait-img]", {
      yPercent: -10,
      ease: "none",
      scrollTrigger: {
        trigger: "[data-about-portrait]",
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    });

    gsap.fromTo(
      el.querySelectorAll("[data-soft-skill]"),
      { x: -20, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.1,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: "[data-soft-skills]", start: "top 92%", once: true },
      },
    );

    gsap.fromTo(
      el.querySelectorAll("[data-about-stat]"),
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: "[data-about-stats]", start: "top 95%", once: true },
      },
    );
  }, []);

  const statItems = [
    { label: "Projects shipped", value: stats.projects },
    { label: "Appreciations", value: stats.likes },
    { label: "Messages received", value: stats.messages },
    { label: "Portfolio views", value: stats.views },
  ];

  return (
    <section
      ref={scope}
      id="about"
      className="relative border-t border-white/8 px-5 py-20 sm:px-8 sm:py-28 lg:px-12 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="flex items-center gap-4">
          <span className="eyebrow text-white/40">04</span>
          <span className="h-px w-10 bg-white/25" />
          <span className="eyebrow text-accent">About</span>
        </div>

        <h2 className="display mt-10 text-[clamp(2.2rem,7vw,6.2rem)] text-white">
          {HEADING.map((line) => (
            <span key={line} data-about-line className="block overflow-hidden pb-[0.05em]">
              <span className="inline-block will-change-transform">{line}</span>
            </span>
          ))}
        </h2>

        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20">
          <div className="space-y-10">
            <div
              data-about-portrait
              className="relative aspect-4/5 overflow-hidden rounded-[1.75rem] border border-white/10 bg-smoke"
            >
              <Image
                data-about-portrait-img
                src="/pic/my.png"
                alt="Zaigham Ali"
                fill
                sizes="(max-width: 1024px) 90vw, 420px"
                className="scale-110 object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-ink/85 via-transparent to-transparent" />
              <div className="glass absolute bottom-4 left-4 right-4 rounded-2xl p-4">
                <p className="eyebrow text-accent">Karachi, Pakistan</p>
                <p className="mt-2 text-sm text-white/85">
                  {PROFILE.name} — {PROFILE.role}
                </p>
              </div>
            </div>

            <div data-soft-skills className="space-y-6">
              <p className="eyebrow">Soft Skills & Expertise</p>
              <ul className="space-y-5">
                {SOFT_SKILLS.map((skill) => (
                  <li
                    key={skill.title}
                    data-soft-skill
                    className="border-t border-white/8 pt-5"
                  >
                    <p className="text-sm text-white">{skill.title}</p>
                    <p className="mt-2 text-xs leading-relaxed text-fog">{skill.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="space-y-8">
            <div className="glass rounded-[1.75rem] p-6 sm:p-8">
              <Quote size={18} className="text-accent" />
              <p className="mt-5 text-lg leading-[1.5] text-white/90 sm:text-xl">
                Full Stack Developer based in Karachi, Pakistan. Holds a Full Stack Website
                Development Laravel Diploma from National University of Technology (NUTECH)
                Islamabad (2024).
              </p>
              <p className="mt-5 text-sm leading-relaxed text-fog">
                {PROFILE.overview}
              </p>
            </div>

            <div
              data-about-stats
              className="grid grid-cols-2 gap-px overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.02] sm:grid-cols-4"
            >
              {statItems.map((item) => (
                <div
                  key={item.label}
                  data-about-stat
                  className="border border-white/6 p-4 sm:p-5"
                >
                  <p className="display text-2xl text-white sm:text-3xl">
                    <CountUp value={item.value} />
                  </p>
                  <p className="mt-2 font-mono text-[9px] leading-relaxed tracking-[0.16em] text-fog uppercase">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <Education items={educations} />
          </div>
        </div>
      </div>
    </section>
  );
}
