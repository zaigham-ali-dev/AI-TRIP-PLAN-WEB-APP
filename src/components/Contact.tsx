"use client";

import emailjs from "@emailjs/browser";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Check, Copy, Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useGsapContext } from "@/components/AppReady";
import { GitHubIcon, MagneticButton, Reveal } from "@/components/ui";
import { PROFILE } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/animation";
import type { StatsView } from "@/lib/types";

/* ──────────────────────────────────────────────────────────────────────
 *  EmailJS Configuration
 * ────────────────────────────────────────────────────────────────────── */
const EMAILJS_SERVICE_ID  = "service_i1iae8e";
const EMAILJS_TEMPLATE_ID = "template_o6mnnwi";
const EMAILJS_PUBLIC_KEY   = "h4zOerpI96An0G2zz";

const MAX_CHARS = 1000;

const LINES = ["Have an idea?", "Let's make it", "Real."];

const PROJECT_TYPES = [
  "Landing Page",
  "Full Stack App",
  "AI Product",
  "Creative / Motion Site",
  "Something else",
];

type Status = "idle" | "sending" | "sent" | "error";

export default function Contact({ stats }: { stats: StatsView }) {
  const scope = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [feedback, setFeedback] = useState("");
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    projectType: PROJECT_TYPES[1],
    message: "",
  });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 90, damping: 20 });
  const springY = useSpring(pointerY, { stiffness: 90, damping: 20 });
  const lineA = { x: useTransform(springX, [-1, 1], [-16, 16]), y: useTransform(springY, [-1, 1], [-10, 10]) };
  const lineB = { x: useTransform(springX, [-1, 1], [12, -12]), y: useTransform(springY, [-1, 1], [8, -8]) };
  const lineC = { x: useTransform(springX, [-1, 1], [-8, 8]), y: useTransform(springY, [-1, 1], [-14, 14]) };
  const lineMotion = [lineA, lineB, lineC];

  useGsapContext(() => {
    const el = scope.current;
    if (!el || prefersReducedMotion()) return;

    gsap.from(el.querySelectorAll("[data-contact-line] > span"), {
      yPercent: 120,
      duration: 1.25,
      ease: "expo.out",
      stagger: 0.12,
      scrollTrigger: { trigger: el, start: "top 72%" },
    });

    gsap.fromTo(
      el.querySelectorAll("[data-contact-detail]"),
      { y: 24, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.9,
        ease: "power3.out",
        stagger: 0.08,
        clearProps: "opacity,transform",
        scrollTrigger: { trigger: el.querySelector("[data-contact-grid]"), start: "top 95%", once: true },
      },
    );
  }, []);

  const onMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    pointerY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const onMouseLeave = () => {
    pointerX.set(0);
    pointerY.set(0);
  };

  const copyPhone = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE.phone);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("sending");
    setFeedback("");

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (name.length < 2) {
      setStatus("error");
      setFeedback("Tell me your name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setStatus("error");
      setFeedback("A valid email helps me reply.");
      return;
    }
    if (message.length < 10) {
      setStatus("error");
      setFeedback("A few more words, please.");
      return;
    }

    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: name,
        from_email: email,
        project_type: form.projectType,
        message: message,
      });

      setStatus("sent");
      setFeedback("Message sent! I'll get back to you within 24 hours.");
      setForm({ name: "", email: "", projectType: PROJECT_TYPES[1], message: "" });
    } catch {
      setStatus("error");
      setFeedback(`Something went wrong — email me directly at ${PROFILE.email}`);
    }
  };

  const inputBase =
    "w-full rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors duration-400 focus:border-accent/60 focus:bg-white/[0.05]";

  return (
    <section
      ref={scope}
      id="contact"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="relative border-t border-white/8 px-5 pt-20 pb-16 sm:px-8 sm:pt-28 lg:px-12 lg:pt-32"
    >
      <div className="mx-auto w-full max-w-[1500px]">
        <div className="flex items-center gap-4">
          <span className="eyebrow text-white/40">06</span>
          <span className="h-px w-10 bg-white/25" />
          <span className="eyebrow text-accent">Contact</span>
        </div>

        <div className="mt-10 grid gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,30rem)] lg:gap-20">
          <div>
            <h2 className="display text-[clamp(2.4rem,8.4vw,7rem)] text-white">
              {LINES.map((line, index) => (
                <motion.span
                  key={line}
                  style={lineMotion[index]}
                  className="block"
                >
                  <span data-contact-line className="block overflow-hidden pb-[0.04em]">
                    <span className="inline-block will-change-transform">
                      {line === "Real." ? (
                        <>
                          Real<span className="text-accent">.</span>
                        </>
                      ) : (
                        line
                      )}
                    </span>
                  </span>
                </motion.span>
              ))}
            </h2>

            <div className="mt-10 flex flex-wrap items-center gap-8">
              <div className="group relative">
                <span className="animate-spin-ring absolute -inset-6 rounded-full border border-dashed border-white/12" />
                <span className="absolute -inset-2 rounded-full bg-[radial-gradient(circle_at_center,rgba(216,255,62,0.16),transparent_70%)] opacity-0 blur-md transition-opacity duration-700 group-hover:opacity-100" />
                <MagneticButton
                  href="#contact"
                  onClick={() => document.getElementById("name")?.focus()}
                  variant="primary"
                  cursorLabel="WRITE"
                  className="relative z-10"
                >
                  Let&apos;s talk
                  <Send size={14} />
                </MagneticButton>
              </div>

              <p className="max-w-[30ch] text-sm leading-relaxed text-fog">
                Currently open to full-time roles and select freelance collaborations.
                {stats.messages > 0
                  ? ` ${stats.messages} enquiry${stats.messages === 1 ? "" : "s"} in the inbox so far.`
                  : ""}
              </p>
            </div>

            <div
              data-contact-grid
              className="mt-14 grid gap-4 sm:grid-cols-2"
            >
              <div data-contact-detail className="glass rounded-2xl p-5">
                <Mail size={16} className="text-accent" />
                <p className="eyebrow mt-4">Email</p>
                <a
                  href={`mailto:${PROFILE.email}`}
                  className="link-underline mt-2 block text-sm break-all text-white"
                >
                  {PROFILE.email}
                </a>
              </div>

              <div data-contact-detail className="glass rounded-2xl p-5">
                <Phone size={16} className="text-accent" />
                <p className="eyebrow mt-4">Phone</p>
                <div className="mt-2 flex items-center gap-3">
                  <a href={PROFILE.phoneHref} className="text-sm text-white">
                    {PROFILE.phone}
                  </a>
                  <button
                    type="button"
                    onClick={copyPhone}
                    data-cursor="grow"
                    aria-label="Copy phone number"
                    className="text-white/45 transition-colors hover:text-accent"
                  >
                    {copied ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                </div>
              </div>

              <div data-contact-detail className="glass rounded-2xl p-5">
                <MapPin size={16} className="text-accent" />
                <p className="eyebrow mt-4">Studio</p>
                <p className="mt-2 text-sm text-white/85">{PROFILE.location}</p>
              </div>

              <div data-contact-detail className="glass rounded-2xl p-5">
                <GitHubIcon className="h-4 w-4 text-accent" />
                <p className="eyebrow mt-4">GitHub</p>
                <a
                  href={PROFILE.github}
                  target="_blank"
                  rel="noreferrer noopener"
                  data-cursor="label"
                  data-cursor-label="VISIT"
                  className="link-underline mt-2 block text-sm break-all text-white"
                >
                  {PROFILE.githubLabel}
                </a>
              </div>
            </div>
          </div>

          <Reveal className="lg:pt-4">
            <form onSubmit={onSubmit} className="glass rounded-[1.75rem] p-6 sm:p-8">
              <p className="eyebrow text-accent">Project brief</p>
              <h3 className="display mt-4 text-[clamp(1.4rem,2.6vw,2rem)] text-white">
                Tell me about it
              </h3>

              <div className="mt-7 space-y-4">
                <div>
                  <label className="eyebrow" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    required
                    value={form.name}
                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                    placeholder="Your name"
                    className={`mt-2 ${inputBase}`}
                  />
                </div>

                <div>
                  <label className="eyebrow" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                    placeholder="you@company.com"
                    className={`mt-2 ${inputBase}`}
                  />
                </div>

                <div>
                  <label className="eyebrow" htmlFor="projectType">
                    Project type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={form.projectType}
                    onChange={(event) =>
                      setForm((prev) => ({ ...prev, projectType: event.target.value }))
                    }
                    className={`mt-2 ${inputBase} appearance-none`}
                  >
                    {PROJECT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-charcoal text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="eyebrow" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={(event) => {
                      if (event.target.value.length <= MAX_CHARS) {
                        setForm((prev) => ({ ...prev, message: event.target.value }));
                      }
                    }}
                    placeholder="Scope, timeline, links — anything that helps."
                    className={`mt-2 resize-none ${inputBase}`}
                  />
                  <p className={`mt-2 text-right font-mono text-[10px] tracking-[0.16em] uppercase ${
                    form.message.length > MAX_CHARS * 0.9 ? "text-red-300" : "text-white/35"
                  }`}>
                    {form.message.length} / {MAX_CHARS}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <MagneticButton
                  type="submit"
                  submit
                  variant="primary"
                  cursorLabel="SEND"
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending…" : "Send brief"}
                </MagneticButton>
                <p
                  className={`max-w-[24ch] font-mono text-[10px] leading-relaxed tracking-[0.14em] uppercase ${
                    status === "sent"
                      ? "text-accent"
                      : status === "error"
                        ? "text-red-300"
                        : "text-white/35"
                  }`}
                >
                  {feedback || "Sent securely via EmailJS"}
                </p>
              </div>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
