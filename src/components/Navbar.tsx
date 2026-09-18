"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useState } from "react";

import { NAV_LINKS, PROFILE } from "@/lib/content";

const SECTION_IDS = ["hero", "work", "about", "capabilities", "contact"];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("hero");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => Boolean(el),
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.2, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    window.dispatchEvent(
      new CustomEvent("zaigham:scroll-lock", { detail: open }),
    );
    return () => {
      window.dispatchEvent(new CustomEvent("zaigham:scroll-lock", { detail: false }));
    };
  }, [open]);

  const isActive = (href: string) => `#${active}` === href;

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-[70] flex justify-center px-3 pt-3 sm:px-6 sm:pt-5">
        <nav
          className={`flex w-full max-w-[1500px] items-center justify-between rounded-full border transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${scrolled
              ? "glass border-white/10 py-2.5 pl-5 pr-2.5 shadow-[0_18px_50px_-30px_rgba(0,0,0,0.9)] sm:pl-6"
              : "border-transparent py-4 pl-4 pr-2 sm:pl-5"
            }`}
        >
          <a
            href="#hero"
            data-cursor="grow"
            className="group flex items-center gap-3"
            aria-label="Zaigham Ali — back to top"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            <span className="display text-[13px] tracking-[0.12em] text-white sm:text-sm">
              ZAIGHAM ALI
            </span>
            <span className="hidden font-mono text-[10px] tracking-[0.2em] text-white/35 uppercase lg:inline">
              / Creative Dev
            </span>
          </a>

          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-cursor="grow"
                className={`relative rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.16em] uppercase transition-colors duration-500 ${isActive(link.href)
                    ? "text-white"
                    : "text-white/55 hover:text-white"
                  }`}
              >
                {isActive(link.href) ? (
                  <motion.span
                    layoutId="nav-active-pill"
                    className="absolute inset-0 rounded-full border border-accent/40 bg-accent/10"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <span className="relative z-10">{link.label}</span>
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`mailto:${PROFILE.email}`}
              data-cursor="grow"
              className="hidden items-center gap-2 rounded-full bg-white px-5 py-2.5 font-mono text-[10px] tracking-[0.18em] text-ink uppercase transition-colors duration-500 hover:bg-accent lg:inline-flex"
            >
              Available for work
              <ArrowUpRight size={13} />
            </a>

            <button
              type="button"
              onClick={() => setOpen((prev) => !prev)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              data-cursor="grow"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/12 bg-white/[0.04] md:hidden"
            >
              <span className="flex h-3 w-4 flex-col justify-between">
                <motion.span
                  animate={open ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block h-px w-full bg-white"
                />
                <motion.span
                  animate={open ? { opacity: 0, scaleX: 0.2 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  className="block h-px w-full bg-white"
                />
                <motion.span
                  animate={open ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block h-px w-full bg-white"
                />
              </span>
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[65] md:hidden"
          >
            <div className="absolute inset-0 bg-ink/95 backdrop-blur-2xl" />
            <div className="relative flex h-full flex-col justify-between px-6 pt-28 pb-10">
              <div className="flex flex-col gap-2">
                {NAV_LINKS.map((link, index) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 20, opacity: 0 }}
                    transition={{
                      duration: 0.7,
                      delay: 0.06 * index,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="display flex items-baseline gap-4 border-b border-white/8 py-4 text-[clamp(1.9rem,9vw,3rem)] text-white"
                  >
                    <span className="font-mono text-[10px] tracking-[0.2em] text-accent">
                      0{index + 1}
                    </span>
                    {link.label}
                  </motion.a>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="space-y-3"
              >
                <p className="eyebrow">Direct line</p>
                <a href={`mailto:${PROFILE.email}`} className="block text-sm text-white/80">
                  {PROFILE.email}
                </a>
                <a href={PROFILE.phoneHref} className="block text-sm text-white/80">
                  {PROFILE.phone}
                </a>
                <p className="text-xs text-fog">{PROFILE.location}</p>
              </motion.div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
