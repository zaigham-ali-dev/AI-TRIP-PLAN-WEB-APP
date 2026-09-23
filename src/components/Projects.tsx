"use client";

import { MoveRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useGsapContext } from "@/components/AppReady";
import ProjectCard from "@/components/ProjectCard";
import { SectionHeading } from "@/components/ui";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/animation";
import type { ProjectView, StatsView } from "@/lib/types";

export default function Projects({
  projects,
  stats,
}: {
  projects: ProjectView[];
  stats: StatsView;
}) {
  const scope = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [likes, setLikes] = useState<Record<number, number>>(() =>
    Object.fromEntries(projects.map((project) => [project.id, project.likes])),
  );
  const [liked, setLiked] = useState<Record<number, boolean>>({});
  const [totalLikes, setTotalLikes] = useState(stats.likes);

  const handleLike = (id: number) => {
    if (liked[id]) return;
    setLiked((prev) => ({ ...prev, [id]: true }));
    setLikes((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
    setTotalLikes((prev) => prev + 1);
  };

  useGsapContext(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;

    gsap.to("[data-work-progress]", {
      scaleX: 1,
      ease: "none",
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        end: "bottom bottom",
        scrub: true,
      },
    });
  }, []);

  useEffect(() => {
    const el = scope.current;
    const track = trackRef.current;
    const wrap = wrapRef.current;
    if (!el || !track || !wrap) return;
    if (prefersReducedMotion()) return;

    const media = gsap.utils.toArray<HTMLElement>("[data-card-media]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-card]");

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 120);

      const horizontal = gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      media.forEach((node) => {
        gsap.fromTo(
          node,
          { clipPath: "inset(16% 10% 16% 10% round 32px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 32px)",
            ease: "none",
            scrollTrigger: {
              trigger: node,
              containerAnimation: horizontal,
              start: "left 92%",
              end: "left 45%",
              scrub: true,
            },
          },
        );
      });

      cards.forEach((card, index) => {
        gsap.to(card, {
          y: index % 2 === 0 ? -26 : 26,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontal,
            start: "left right",
            end: "right left",
            scrub: true,
          },
        });
      });
    });

    mm.add("(max-width: 1023px)", () => {
      gsap.fromTo(
        cards,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.08,
          clearProps: "opacity,transform",
          scrollTrigger: { trigger: track, start: "top 95%", once: true },
        },
      );

      media.forEach((node) => {
        gsap.fromTo(
          node,
          { clipPath: "inset(18% 12% 18% 12% round 28px)" },
          {
            clipPath: "inset(0% 0% 0% 0% round 28px)",
            duration: 1.3,
            ease: "expo.out",
            scrollTrigger: { trigger: node, start: "top 88%" },
          },
        );
      });
    });

    const refresh = () => ScrollTrigger.refresh();
    const timer = window.setTimeout(refresh, 500);

    return () => {
      window.clearTimeout(timer);
      mm.revert();
    };
  }, [projects.length]);

  return (
    <section
      ref={scope}
      id="work"
      className="relative border-t border-white/8 py-20 sm:py-28 lg:py-32"
    >
      <div className="mx-auto w-full max-w-[1500px] px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            index="02"
            label="Portfolio"
            title="Selected Work"
            description="Selected builds across property, travel, AI, non-profit and creative platforms — each one pushed until the interface felt effortless."
          />

          <div className="flex flex-col items-start gap-4 lg:items-end">
            <span className="glass inline-flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-[10px] tracking-[0.18em] text-white/70 uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
              </span>
              Live from PostgreSQL
            </span>
            <p className="font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase">
              {totalLikes} appreciations · {stats.messages} enquiries stored ·{" "}
              {stats.projects} projects
            </p>
          </div>
        </div>

        <div className="mt-8 hidden items-center gap-3 lg:flex">
          <MoveRight size={16} className="text-accent" />
          <span className="eyebrow text-white/40">Scroll to travel horizontally</span>
          <span className="relative ml-auto h-px w-40 bg-white/12">
            <span
              data-work-progress
              className="absolute inset-0 origin-left scale-x-0 bg-accent"
            />
          </span>
        </div>
      </div>

      <div
        ref={wrapRef}
        className="relative mt-12 lg:mt-16 lg:flex lg:h-[100svh] lg:items-center lg:overflow-hidden"
      >
        <div
          ref={trackRef}
          className="flex flex-col gap-20 px-5 sm:px-8 lg:flex-row lg:items-center lg:gap-10 lg:px-0 lg:pl-[7vw] lg:pr-[18vw]"
        >
          {projects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              liked={Boolean(liked[project.id])}
              likes={likes[project.id] ?? project.likes}
              onLike={handleLike}
            />
          ))}

          <div className="hidden w-[26vw] shrink-0 flex-col justify-center gap-6 lg:flex">
            <p className="eyebrow text-white/35">End of selection</p>
            <p className="display text-[clamp(2rem,4vw,3.4rem)] text-white/85">
              Want the full case study?
            </p>
            <a
              href="#contact"
              data-cursor="label"
              data-cursor-label="TALK"
              className="link-underline w-fit font-mono text-[11px] tracking-[0.22em] text-accent uppercase"
            >
              Start a conversation
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
