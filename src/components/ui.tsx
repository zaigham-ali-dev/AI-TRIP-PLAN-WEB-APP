"use client";

import { motion, useInView, type Variants } from "framer-motion";
import {
  BrainCircuit,
  Layers,
  LayoutTemplate,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { gsap, EASE } from "@/lib/animation";
import { useGsapContext } from "@/components/AppReady";

/* ------------------------------------------------------------------ */
/* Reveal                                                             */
/* ------------------------------------------------------------------ */

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(12px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

export function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  as?: "div" | "li" | "span" | "p";
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </MotionTag>
  );
}

/* ------------------------------------------------------------------ */
/* Magnetic button                                                    */
/* ------------------------------------------------------------------ */

type MagneticProps = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "ghost" | "outline";
  className?: string;
  cursorLabel?: string;
  external?: boolean;
  strength?: number;
  ariaLabel?: string;
  submit?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
};

export function MagneticButton({
  children,
  href,
  onClick,
  variant = "primary",
  className = "",
  cursorLabel,
  external = false,
  strength = 0.32,
  ariaLabel,
  submit = false,
  disabled = false,
  type,
}: MagneticProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.7, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.7, ease: "power3.out" });
    const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
    const ixTo = inner
      ? gsap.quickTo(inner, "x", { duration: 0.9, ease: "power3.out" })
      : null;
    const iyTo = inner
      ? gsap.quickTo(inner, "y", { duration: 0.9, ease: "power3.out" })
      : null;

    const onMove = (event: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = event.clientX - (rect.left + rect.width / 2);
      const relY = event.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
      ixTo?.(relX * strength * 0.45);
      iyTo?.(relY * strength * 0.45);
    };

    const onLeave = () => {
      xTo(0);
      yTo(0);
      ixTo?.(0);
      iyTo?.(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  const base =
    "group relative inline-flex items-center justify-center gap-3 rounded-full px-7 py-4 font-mono text-[11px] tracking-[0.22em] uppercase transition-colors duration-500 will-change-transform";
  const styles: Record<string, string> = {
    primary: "bg-accent text-ink hover:bg-white",
    ghost: "glass text-white hover:border-accent/60 hover:text-accent",
    outline: "border border-white/20 text-white hover:border-white hover:bg-white/5",
  };
  const classes = `${base} ${styles[variant]} ${className}`;

  const content = (
    <span data-magnetic-inner className="pointer-events-none relative z-10 flex items-center gap-3">
      {children}
    </span>
  );

  if (href) {
    const isInternal = href.startsWith("#");
    const attributes = {
      className: classes,
      "data-magnetic": "true",
      "data-cursor": "grow",
      "data-cursor-label": cursorLabel,
      "aria-label": ariaLabel,
      onClick,
    } as const;

    if (isInternal) {
      return (
        <a
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          {...attributes}
          onClick={(event) => {
            event.preventDefault();
            // The global SmoothScroll anchor handler performs the eased scroll.
            onClick?.();
          }}
        >
          {content}
        </a>
      );
    }

    if (external) {
      return (
        <Link
          ref={ref as React.RefObject<HTMLAnchorElement>}
          href={href}
          target="_blank"
          rel="noreferrer noopener"
          {...attributes}
        >
          {content}
        </Link>
      );
    }

    return (
      <Link
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        {...attributes}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      type={type ?? (submit ? "submit" : "button")}
      onClick={onClick}
      disabled={disabled}
      {...{
        className: `${classes} disabled:cursor-not-allowed disabled:opacity-70`,
        "data-magnetic": "true",
        "data-cursor": "grow",
        "data-cursor-label": cursorLabel,
        "aria-label": ariaLabel,
      }}
    >
      {content}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Section heading with GSAP word reveal                              */
/* ------------------------------------------------------------------ */

export function SectionHeading({
  index,
  label,
  title,
  description,
  align = "left",
}: {
  index: string;
  label: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}) {
  const scope = useRef<HTMLDivElement>(null);
  const words = title.split(" ");

  useGsapContext(() => {
    const el = scope.current;
    if (!el) return;

    gsap.fromTo(
      el.querySelectorAll("[data-word]"),
      { yPercent: 118, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.055,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
      },
    );

    gsap.fromTo(
      el.querySelectorAll("[data-fade]"),
      { y: 20, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: EASE,
        stagger: 0.12,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      },
    );
  }, []);

  return (
    <div
      ref={scope}
      className={`flex flex-col gap-6 ${align === "center" ? "items-center text-center" : ""}`}
    >
      <div
        data-fade
        className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}
      >
        <span className="eyebrow text-white/40">{index}</span>
        <span className="h-px w-10 bg-white/25" />
        <span className="eyebrow text-accent">{label}</span>
      </div>

      <h2 className="display max-w-[20ch] text-[clamp(2.4rem,7vw,6.5rem)] text-white">
        {words.map((word, i) => (
          <span key={`${word}-${i}`} className="mr-[0.28em] inline-block overflow-hidden pb-[0.06em]">
            <span data-word className="inline-block will-change-transform">
              {word}
            </span>
          </span>
        ))}
      </h2>

      {description ? (
        <p
          data-fade
          className={`max-w-[52ch] text-sm leading-relaxed text-fog sm:text-base ${
            align === "center" ? "mx-auto" : ""
          }`}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Misc atoms                                                         */
/* ------------------------------------------------------------------ */


const ICONS: Record<string, LucideIcon> = {
  layout: LayoutTemplate,
  layers: Layers,
  sparkles: Sparkles,
  brain: BrainCircuit,
};

export function ServiceIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Sparkles;
  return <Icon className={className} strokeWidth={1.4} />;
}

export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="currentColor">
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.7.5.1.68-.22.68-.48v-1.7c-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.1-1.5-1.1-1.5-.9-.63.07-.62.07-.62 1 .07 1.53 1.05 1.53 1.05.88 1.55 2.3 1.1 2.87.85.09-.66.35-1.1.63-1.36-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.3 9.3 0 0 1 5 0c1.9-1.33 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.35 4.8-4.58 5.06.36.32.68.94.68 1.9v2.82c0 .27.18.59.69.48A10.06 10.06 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

export function CountUp({
  value,
  suffix = "",
  duration = 1.6,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const counter = { value: 0 };
    const tween = gsap.to(counter, {
      value,
      duration,
      ease: "power2.out",
      onUpdate: () => setDisplay(Math.round(counter.value)),
    });
    return () => {
      tween.kill();
    };
  }, [inView, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
