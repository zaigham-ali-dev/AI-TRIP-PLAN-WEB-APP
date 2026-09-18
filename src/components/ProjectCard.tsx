"use client";

import { Heart, MoveUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import { gsap, prefersReducedMotion } from "@/lib/animation";
import type { ProjectView } from "@/lib/types";

type Props = {
  project: ProjectView;
  index: number;
  liked: boolean;
  onLike: (id: number) => void;
  likes: number;
};

export default function ProjectCard({ project, index, liked, onLike, likes }: Props) {
  const cardRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (prefersReducedMotion()) return;

    const image = card.querySelector<HTMLElement>("[data-card-img]");
    const info = card.querySelector<HTMLElement>("[data-card-info]");
    const infoItems = info ? info.querySelectorAll("[data-info-item]") : [];
    const title = card.querySelector<HTMLElement>("[data-card-title]");
    const number = card.querySelector<HTMLElement>("[data-card-number]");
    const panels = card.querySelectorAll<HTMLElement>("[data-float-panel]");
    const glow = card.querySelector<HTMLElement>("[data-card-glow]");
    // The outer card carries scroll-driven parallax, so the hover "lift"
    // lives on the inner visual shell to avoid fighting the ScrollTrigger tween.
    const visual = card.querySelector<HTMLElement>("[data-card-visual]");

    const tl = gsap.timeline({ paused: true, defaults: { ease: "power3.out" } });

    if (image) tl.to(image, { scale: project.featured ? 1.08 : 1.06, duration: 1.1 }, 0);
    if (glow) tl.to(glow, { opacity: 0.85, duration: 0.8 }, 0);
    if (visual) tl.to(visual, { y: -14, duration: 0.9 }, 0);
    if (title) tl.to(title, { x: 12, duration: 0.8 }, 0.05);
    if (number) tl.to(number, { y: -14, color: "#d8ff3e", duration: 0.8 }, 0.05);
    if (info) tl.to(info, { y: 0, opacity: 1, duration: 0.8 }, 0.1);
    if (infoItems.length) {
      tl.fromTo(infoItems, { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, stagger: 0.07 }, 0.15);
    }
    if (panels.length) {
      tl.fromTo(
        panels,
        { opacity: 0, y: 26, scale: 0.94, rotate: 0 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: (i) => (i === 0 ? 3.2 : -4),
          duration: 0.9,
          stagger: 0.09,
        },
        0.05,
      );
    }

    if (info) gsap.set(info, { y: 24, opacity: 0 });

    const onEnter = () => tl.play();
    const onLeave = () => tl.reverse();

    card.addEventListener("mouseenter", onEnter);
    card.addEventListener("mouseleave", onLeave);

    return () => {
      card.removeEventListener("mouseenter", onEnter);
      card.removeEventListener("mouseleave", onLeave);
      tl.kill();
    };
  }, [project.featured]);

  const interactive = Boolean(project.liveUrl);

  return (
    <article
      ref={cardRef}
      data-card
      data-cursor="label"
      data-cursor-label={interactive ? "VISIT" : "PREVIEW"}
      className="group relative w-[86vw] shrink-0 sm:w-[74vw] lg:w-[min(50vw,660px)]"
    >
      <div
        data-card-glow
        className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(125,108,255,0.20),transparent_70%)] opacity-0 blur-2xl"
      />

      <div
        data-card-visual
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-smoke/70 will-change-transform sm:rounded-[2.25rem]"
      >
        <div
          data-card-media
          className="relative aspect-4/3 overflow-hidden lg:aspect-16/10"
        >
          <Image
            data-card-img
            src={project.image}
            alt={`${project.title} — ${project.subtitle}`}
            fill
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 74vw, 760px"
            priority={index < 2}
            className="object-cover will-change-transform"
          />
          <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/25 to-transparent opacity-90" />
          <div className="noise absolute inset-0 opacity-[0.07] mix-blend-soft-light" />

          {/* Floating UI layers — featured projects get a full layered interface */}
          {project.featured ? (
            <>
              <div
                data-float-panel
                className="glass absolute top-6 -right-2 hidden w-[36%] rotate-3 overflow-hidden rounded-2xl p-1.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] sm:block lg:-right-6"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="260px"
                    className="object-cover object-top"
                  />
                </div>
                <p className="px-2 py-1.5 font-mono text-[9px] tracking-[0.18em] text-white/60 uppercase">
                  Hero / Listing grid
                </p>
              </div>

              <div
                data-float-panel
                className="glass absolute bottom-24 -left-2 hidden w-[28%] -rotate-3 overflow-hidden rounded-2xl p-1.5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)] sm:block lg:-left-6"
              >
                <div className="relative aspect-3/4 overflow-hidden rounded-xl">
                  <Image
                    src={project.image}
                    alt=""
                    fill
                    sizes="200px"
                    className="object-cover object-bottom"
                  />
                </div>
                <p className="px-2 py-1.5 font-mono text-[9px] tracking-[0.18em] text-white/60 uppercase">
                  Detail view
                </p>
              </div>

              <span className="glass absolute top-6 left-6 inline-flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[9px] tracking-[0.2em] text-accent uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                Featured case study
              </span>
            </>
          ) : null}

          <div
            data-card-info
            className="glass absolute right-4 bottom-4 left-4 rounded-2xl p-4 sm:right-6 sm:bottom-6 sm:left-6 sm:p-5"
          >
            <p data-info-item className="eyebrow text-accent">
              Case Notes
            </p>
            <p
              data-info-item
              className="mt-2 max-w-[46ch] text-xs leading-relaxed text-white/80 sm:text-sm"
            >
              {project.description}
            </p>
            <div data-info-item className="mt-4 flex flex-wrap items-center gap-2">
              {project.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-white/12 px-2.5 py-1 font-mono text-[9px] tracking-[0.16em] text-white/70 uppercase"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <span
            data-card-number
            className="absolute top-4 left-4 font-mono text-xs tracking-[0.24em] text-white/70 sm:top-6 sm:left-6"
          >
            {project.number}
          </span>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 px-1">
        <div>
          <h3
            data-card-title
            className="display text-[clamp(1.6rem,3.4vw,2.9rem)] text-white"
          >
            {project.title}
          </h3>
          <p className="mt-2 font-mono text-[10px] tracking-[0.2em] text-fog uppercase">
            {project.subtitle} · {project.year}
          </p>
        </div>

        <div className="flex items-center gap-5">
          <button
            type="button"
            onClick={() => onLike(project.id)}
            data-cursor="grow"
            aria-pressed={liked}
            aria-label={`Appreciate ${project.title}`}
            className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 font-mono text-[10px] tracking-[0.18em] uppercase transition-all duration-500 ${
              liked
                ? "border-accent/60 bg-accent/15 text-accent"
                : "border-white/12 text-white/60 hover:border-white/35 hover:text-white"
            }`}
          >
            <Heart size={12} className={liked ? "fill-accent" : ""} />
            {likes}
          </button>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="label"
              data-cursor-label="VISIT"
              className="link-underline inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-white uppercase"
            >
              Live site
              <MoveUpRight size={14} />
            </a>
          ) : (
            <span className="font-mono text-[10px] tracking-[0.2em] text-white/30 uppercase">
              Request walkthrough
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
