"use client";

import { ArrowUp, Mail } from "lucide-react";

import { GitHubIcon } from "@/components/ui";
import { PROFILE } from "@/lib/content";
import type { StatsView } from "@/lib/types";

export default function Footer({ stats }: { stats: StatsView }) {
  return (
    <footer className="relative border-t border-white/8 px-5 pt-14 pb-10 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="display text-[clamp(2rem,9vw,7.5rem)] leading-[0.9] text-white/[0.06] select-none">
              ZAIGHAM ALI
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <p className="font-mono text-[10px] tracking-[0.18em] text-white/45 uppercase">
                © 2026 Zaigham Ali. All rights reserved.
              </p>
              <span className="hidden h-px w-8 bg-white/15 sm:block" />
              <p className="font-mono text-[10px] tracking-[0.18em] text-white/30 uppercase">
                {stats.views} views · {stats.likes} appreciations · PostgreSQL live
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <a
              href={PROFILE.github}
              target="_blank"
              rel="noreferrer noopener"
              data-cursor="label"
              data-cursor-label="VISIT"
              className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-3 font-mono text-[10px] tracking-[0.16em] text-white/80 uppercase transition-colors duration-500 hover:text-white"
            >
              <GitHubIcon className="h-3.5 w-3.5" />
              {PROFILE.githubLabel}
            </a>

            <a
              href={`mailto:${PROFILE.email}`}
              data-cursor="grow"
              className="glass inline-flex items-center gap-2.5 rounded-full px-4 py-3 font-mono text-[10px] tracking-[0.16em] text-white/80 uppercase transition-colors duration-500 hover:text-white"
            >
              <Mail size={13} />
              {PROFILE.email}
            </a>

            <a
              href="#hero"
              data-magnetic="true"
              data-cursor="grow"
              aria-label="Back to top"
              className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full border border-white/15 text-white transition-colors duration-500 hover:border-accent/60 hover:text-accent"
            >
              <span className="absolute inset-0 rounded-full border border-dashed border-white/10 transition-transform duration-700 group-hover:rotate-90" />
              <ArrowUp
                size={16}
                className="transition-transform duration-500 group-hover:-translate-y-1"
              />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/8 pt-6">
          <p className="font-mono text-[10px] tracking-[0.18em] text-white/30 uppercase">
            {PROFILE.location}
          </p>
          <p className="font-mono text-[10px] tracking-[0.18em] text-white/30 uppercase">
            Built with Next.js · PostgreSQL · GSAP · Framer Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
