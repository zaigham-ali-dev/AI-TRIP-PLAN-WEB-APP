"use client";

import React from "react";

type LogoProps = {
  className?: string;
  size?: number;
};

/* ------------------------------------------------------------------ */
/* Vector Brand SVGs                                                  */
/* ------------------------------------------------------------------ */

export function ReactLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="-11.5 -10.23174 23 20.46348"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="currentColor"
    >
      <circle cx="0" cy="0" r="2.05" fill="#00d8ff" />
      <g stroke="#00d8ff" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  );
}

export function NextjsLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 180 180"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <circle cx="90" cy="90" r="88" fill="black" stroke="white" strokeWidth="6" />
      <path
        d="M149.508 157.52L69.142 54H54V125.97H66.0869V69.3496L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
        fill="url(#next_grad)"
      />
      <path d="M115 54H127V126H115V54Z" fill="url(#next_grad2)" />
      <defs>
        <linearGradient
          id="next_grad"
          x1="109"
          y1="116.5"
          x2="144.5"
          y2="160.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
        <linearGradient
          id="next_grad2"
          x1="121"
          y1="54"
          x2="120.799"
          y2="106.875"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function TailwindLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <path
        d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.335 6.182 14.974 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.335 13.382 8.974 12 6.001 12z"
        fill="#38bdf8"
      />
    </svg>
  );
}

export function JavaLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="6 4 20 24"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <path
        d="M13.8 24.5c2.4.2 6.1-.2 6.2-2.1-.2-.2-1.2-.4-1.6-.4-.8.1-4.7.6-6.8-.1-.4-.1-.7.1-.6.5.4 1 1.7 1.9 2.8 2.1z"
        fill="#5382A1"
      />
      <path
        d="M13.4 21.6c2.1.2 4.8-.1 6.7-1.3-.2-.2-1.1-.3-1.5-.3-.7.1-4.2.4-6.3-.2-.4-.1-.6.2-.5.5.3.8 1 1.1 1.6 1.3z"
        fill="#5382A1"
      />
      <path
        d="M17.4 17.5c1.6-.9 3.1-.7 4.9.4.6.4.7.9.3 1.5-1.1 1.7-4.8 2.6-7.8 2.6-4.4 0-6.9-1.6-4.6-3 1.9-1.2 4.2-1.4 6.4-1.8.3 0 .6.2.8.3z"
        fill="#5382A1"
      />
      <path
        d="M20.2 14.8c1.3.8 2.1 1.9 1.4 3.3-.6 1.1-2.2 1.8-3.4 2.3 2.1-.6 4-1.6 4.7-2.9 1-1.8-.3-3.2-2.7-2.7z"
        fill="#EA2D2E"
      />
      <path
        d="M15.4 10.3c.7 1.3.5 2.5-.7 3.5-.8.7-1.7 1.2-2.4 2-1 1.1-.5 2.1.7 2.3 1.4.2 2.9-.3 4.2-.7-.5-.6-1.1-.9-1.8-1.2-.9-.4-1.6-.9-1.4-2 .2-1 1.5-1.9 1.9-2.9.5-1.2 0-2.3-.5-3.3.4.7.3 1.6 0 2.3z"
        fill="#EA2D2E"
      />
      <path
        d="M18.8 6.1c-.8.8-1.6 1.7-1.9 2.8-.4 1.4.1 2.7 1.2 3.7.8.7 1.6 1.4 2 2.4.6 1.4 0 2.8-1.3 3.7.7-.7 1.5-1.5 1.5-2.6 0-1.4-.8-2.4-1.7-3.3-.9-.9-1.5-2-1.1-3.3.3-.9 1-1.6 1.5-2.4-.1-.4-.2-.7-.2-1z"
        fill="#EA2D2E"
      />
      <path
        d="M9.8 26.6c4.6 1.1 11.2.7 15-.8.4-.1.7.2.5.5-2 1.7-6.8 2.4-10.7 2.2-3.1-.2-5.7-1-5.4-1.6.2-.2.3-.3.6-.3z"
        fill="#5382A1"
      />
    </svg>
  );
}

export function HtmlCssLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      {/* HTML5 & CSS3 badge */}
      <path d="M4 4l2.5 24 9.5 3 9.5-3 2.5-24H4z" fill="#E44D26" />
      <path d="M16 6.5v22l7.5-2.2 2-19.8H16z" fill="#F16529" />
      <path
        d="M8.5 10h15l-.4 3.5h-11l.3 3.5h10.3l-.9 9.5-5.8 1.8-5.8-1.8-.4-4.5h3.4l.2 2.2 2.6.8 2.6-.8.4-4H8.9L8.5 10z"
        fill="white"
      />
    </svg>
  );
}

export function TypeScriptLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <rect width="32" height="32" rx="6" fill="#3178C6" />
      <path
        d="M18.8 20.2c.7 1.1 1.9 1.8 3.4 1.8 1.4 0 2.3-.6 2.3-1.6 0-1-.8-1.4-2.5-2.1-2.5-1-3.6-2-3.6-3.8 0-2.3 1.8-3.9 4.6-3.9 2 0 3.3.6 4.3 1.9l-1.8 1.5c-.6-.8-1.4-1.2-2.5-1.2-1.2 0-1.9.6-1.9 1.4 0 .9.7 1.3 2.4 1.9 2.7 1.1 3.8 2.1 3.8 4 0 2.5-1.9 4.1-5 4.1-2.5 0-4.1-.8-5.2-2.3l1.7-1.7zm-9.3-7.7h9.2v2.4h-3.3v9.3h-2.6v-9.3H9.5v-2.4z"
        fill="white"
      />
    </svg>
  );
}

export function PhpLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 36"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <ellipse cx="32" cy="18" rx="30" ry="16" fill="#777BB4" />
      <path
        d="M17 11h6.5c3.2 0 5 1.5 4.3 4.8-.8 3.5-3.3 5.2-6.5 5.2H17.8L16 26h-3.5L17 11zm3.8 7.3h2.3c1.7 0 2.8-.7 3.2-2.3.4-1.6-.3-2.3-2-2.3h-2.3l-1.2 4.6zM28.5 11h3.5l-1.2 4.6h3.4c3.2 0 5 1.5 4.3 4.8-.8 3.5-3.3 5.2-6.5 5.2h-6.2L28.5 11zm5.3 12.3h2.3c1.7 0 2.8-.7 3.2-2.3.4-1.6-.3-2.3-2-2.3h-2.3l-1.2 4.6zM46 11h6.5c3.2 0 5 1.5 4.3 4.8-.8 3.5-3.3 5.2-6.5 5.2h-3.5L45 26h-3.5L46 11zm3.8 7.3h2.3c1.7 0 2.8-.7 3.2-2.3.4-1.6-.3-2.3-2-2.3h-2.3l-1.2 4.6z"
        fill="white"
      />
    </svg>
  );
}

export function LaravelLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <path
        d="M28.4 8.7L18.8 3.2c-.7-.4-1.6-.4-2.3 0L7.3 8.7c-.8.4-1.3 1.3-1.3 2.2v10.2c0 .9.5 1.8 1.3 2.2l9.2 5.5c.7.4 1.6.4 2.3 0l9.6-5.5c.8-.4 1.3-1.3 1.3-2.2V10.9c0-.9-.5-1.8-1.3-2.2z"
        fill="#FF2D20"
      />
      <path
        d="M17.6 5.5l7.9 4.5-5.3 3.1-7.8-4.5 5.2-3.1zm-8.8 5.6l7.8 4.5v6.2l-7.8-4.5V11.1zm9.6 14.4v-6.2l7.8-4.5v6.2l-7.8 4.5z"
        fill="white"
      />
    </svg>
  );
}

export function NodejsLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <path
        d="M16 2.5l11.7 6.8v13.4L16 29.5 4.3 22.7V9.3L16 2.5z"
        fill="#339933"
      />
      <path
        d="M16 6.8l8.2 4.7v9.5L16 25.7l-8.2-4.7v-9.5L16 6.8z"
        fill="#539E43"
      />
      <path
        d="M16 11.2l4.8 2.8v5.5L16 22.3l-4.8-2.8V14L16 11.2z"
        fill="white"
      />
    </svg>
  );
}

export function FirebaseLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <path
        d="M6.2 24.5l1.6-10.4c.1-.8.9-1.2 1.6-.7l4.3 3.8-7.5 7.3z"
        fill="#FFA000"
      />
      <path
        d="M19.1 5.8c-.6-.7-1.7-.5-2 .4L13.7 17.2l5.4-11.4z"
        fill="#F57C00"
      />
      <path
        d="M25.8 24.5l-6.7-18.7c-.3-.9-1.4-1.1-2-.4L6.2 24.5l9.3 5.2c.8.4 1.7.4 2.5 0l7.8-5.2z"
        fill="#FFCA28"
      />
      <path
        d="M18 29.7l7.8-5.2-4.2-11.5L6.2 24.5l9.3 5.2c.8.4 1.7.4 2.5 0z"
        fill="#FFA000"
      />
    </svg>
  );
}

export function GsapLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <rect width="32" height="32" rx="8" fill="#0ae448" fillOpacity="0.15" stroke="#0ae448" strokeWidth="1.5" />
      <path
        d="M8 16.5c0-4.5 3.5-8 8-8s8 3.5 8 8c0 3.2-1.8 6-4.5 7.2l-1.5-2.6c1.8-.8 3-2.5 3-4.6 0-2.8-2.2-5-5-5s-5 2.2-5 5c0 1.9 1 3.5 2.6 4.3v-2.8h2.8v5.5H13c-3-1-5-3.8-5-7z"
        fill="#0ae448"
      />
    </svg>
  );
}

export function FramerMotionLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" fill="url(#framer_grad)" />
      <defs>
        <linearGradient id="framer_grad" x1="4" y1="0" x2="20" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF0080" />
          <stop offset="0.5" stopColor="#7928CA" />
          <stop offset="1" stopColor="#0070F3" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function ThreejsLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <path
        d="M16 3L3 25.5h26L16 3zm0 5.4l8.8 15.3H7.2L16 8.4z"
        fill="white"
      />
      <path
        d="M16 11.5L9.5 22.8h13L16 11.5z"
        fill="#d8ff3e"
      />
    </svg>
  );
}

export function CursorAiLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <rect width="32" height="32" rx="8" fill="#1e1e24" stroke="rgba(255,255,255,0.15)" strokeWidth="1" />
      <path
        d="M10 8l12 8-6 1.5-3.5 6.5L10 8z"
        fill="url(#cursor_grad)"
      />
      <defs>
        <linearGradient id="cursor_grad" x1="10" y1="8" x2="22" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#a855f7" />
          <stop offset="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function AntigravityAiLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <circle cx="16" cy="16" r="14" fill="#0d1117" stroke="rgba(216,255,62,0.4)" strokeWidth="1.5" />
      <path
        d="M16 7l2.8 6.2 6.2 2.8-6.2 2.8L16 25l-2.8-6.2-6.2-2.8 6.2-2.8L16 7z"
        fill="url(#anti_grad)"
      />
      <defs>
        <linearGradient id="anti_grad" x1="7" y1="7" x2="25" y2="25" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d8ff3e" />
          <stop offset="1" stopColor="#00f2fe" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function PythonLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <path
        d="M15.8 4c-5.2 0-4.9 2.3-4.9 2.3l.1 2.3h4.9v.7H9.2s-3.3-.4-3.3 4.9c0 5.3 2.9 5.1 2.9 5.1h1.7v-2.4c0-2.8 2.4-2.8 2.4-2.8h4.8s2.3 0 2.3-2.3V7.9S20.6 4 15.8 4zm-1.4 1.5c.5 0 .9.4.9.9s-.4.9-.9.9-.9-.4-.9-.9.4-.9.9-.9z"
        fill="#3776AB"
      />
      <path
        d="M16.2 28c5.2 0 4.9-2.3 4.9-2.3l-.1-2.3h-4.9v-.7h6.7s3.3.4 3.3-4.9c0-5.3-2.9-5.1-2.9-5.1h-1.7v2.4c0 2.8-2.4 2.8-2.4 2.8h-4.8s-2.3 0-2.3 2.3v3.8s-.6 3.9 4.2 3.9zm1.4-1.5c-.5 0-.9-.4-.9-.9s.4-.9.9-.9.9.4.9.9-.4.9-.9.9z"
        fill="#FFD438"
      />
    </svg>
  );
}

export function JavaScriptLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <rect width="32" height="32" rx="4" fill="#F7DF1E" />
      <path
        d="M21.2 24.4c.8 1.2 1.8 2.1 3.6 2.1 1.5 0 2.5-.8 2.5-1.8 0-1.3-.7-1.7-2.5-2.5l-.9-.4c-2.5-1.1-4.1-2.4-4.1-5.2 0-2.6 2-4.6 5.1-4.6 2.2 0 3.8.8 4.9 2.8L27 16.7c-.6-1.1-1.3-1.5-2.3-1.5-1 0-1.7.7-1.7 1.5 0 1 .7 1.5 2.2 2.1l.9.4c2.9 1.3 4.6 2.5 4.6 5.4 0 3.1-2.4 4.8-5.6 4.8-3.1 0-5.2-1.5-6.2-3.5l2.3-1.5zM9.1 24.7c.6 1 1.1 1.8 2.4 1.8 1.2 0 2-.5 2-2.4v-12h2.8v12.1c0 3.9-2.3 5.7-5.6 5.7-3 0-4.7-1.6-5.6-3.4l2-1.8z"
        fill="#323330"
      />
    </svg>
  );
}

export function KiroAiLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <rect width="32" height="32" rx="8" fill="#0d1117" stroke="rgba(255,150,50,0.4)" strokeWidth="1.5" />
      <path
        d="M10 8v16M10 16l6-6M10 16l6 6"
        stroke="url(#kiro_grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22" cy="12" r="2" fill="#ff9632" />
      <circle cx="22" cy="20" r="1.5" fill="#ff9632" opacity="0.6" />
      <defs>
        <linearGradient id="kiro_grad" x1="10" y1="8" x2="16" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ff9632" />
          <stop offset="1" stopColor="#ff5e00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function OpenAiLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <circle cx="16" cy="16" r="14" fill="#0d1117" stroke="rgba(16,163,127,0.4)" strokeWidth="1.5" />
      <path
        d="M16 6c-3.5 0-6.4 1.9-7.8 4.8-.3.6-.1 1.2.3 1.6l5 4.5c.4.3.9.3 1.3 0l5-4.5c.4-.4.6-1 .3-1.6C18.8 7.9 17.5 6 16 6z"
        fill="#10a37f"
      />
      <path
        d="M8.5 13c-.8 1.5-1 3.2-.5 4.8.5 1.8 1.8 3.3 3.5 4.2.5.3 1.1.1 1.4-.3l3-5.5c.2-.4.1-.9-.2-1.2L11 11.5c-.4-.3-1-.4-1.5-.1-.4.3-.7.9-1 1.6z"
        fill="#10a37f"
        opacity="0.8"
      />
      <path
        d="M23.5 13c.8 1.5 1 3.2.5 4.8-.5 1.8-1.8 3.3-3.5 4.2-.5.3-1.1.1-1.4-.3l-3-5.5c-.2-.4-.1-.9.2-1.2L21 11.5c.4-.3 1-.4 1.5-.1.4.3.7.9 1 1.6z"
        fill="#10a37f"
        opacity="0.6"
      />
    </svg>
  );
}

export function MySqlLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <ellipse cx="16" cy="10" rx="11" ry="5" fill="#00758F" opacity="0.9" />
      <path d="M5 10v12c0 2.8 4.9 5 11 5s11-2.2 11-5V10" stroke="#00758F" strokeWidth="2" fill="none" />
      <path d="M5 16c0 2.8 4.9 5 11 5s11-2.2 11-5" stroke="#00758F" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path
        d="M10 18v4.5M13 17.5v5M16 17v5.5M19 17.5v5M22 18v4.5"
        stroke="#F29111"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MicroInteractionsLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <rect width="32" height="32" rx="8" fill="#0d1117" stroke="rgba(168,85,247,0.3)" strokeWidth="1.5" />
      <circle cx="16" cy="16" r="4" fill="url(#micro_grad)" />
      <circle cx="16" cy="16" r="7" stroke="#a855f7" strokeWidth="1" opacity="0.5" strokeDasharray="3 3" />
      <circle cx="16" cy="16" r="10" stroke="#a855f7" strokeWidth="0.8" opacity="0.3" strokeDasharray="2 4" />
      <circle cx="24" cy="10" r="1.5" fill="#c084fc" opacity="0.7" />
      <circle cx="8" cy="22" r="1" fill="#c084fc" opacity="0.5" />
      <defs>
        <radialGradient id="micro_grad" cx="16" cy="16" r="4" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c084fc" />
          <stop offset="1" stopColor="#7c3aed" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function CssAnimationsLogo({ className = "w-6 h-6", size }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      style={size ? { width: size, height: size } : undefined}
      fill="none"
    >
      <rect width="32" height="32" rx="8" fill="#264de4" />
      <path
        d="M8 8l1.5 16 6.5 2.5 6.5-2.5 1.5-16H8z"
        fill="#2965f1"
      />
      <path
        d="M16 10v14l4.5-1.8 1-10.2H14l.2 2h5.3l-.3 3.5-3.2 1.2-3.2-1.2-.2-2.5h2l.1 1.2 1.3.5 1.3-.5.2-2H12l-.3-4.2H16z"
        fill="white"
      />
      <path d="M24 6l-2 2 2 2" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M27 6l-2 2 2 2" stroke="#ffd700" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Seamless 4-Quadrant Photo-Identical Collage Component              */
/* ------------------------------------------------------------------ */

export function TechCollage({ serviceNumber }: { serviceNumber: string }) {
  const items = SERVICE_TECH_MAP[serviceNumber] ?? [];
  if (!items.length) return null;

  return (
    <div className="relative my-3.5 w-full overflow-hidden rounded-2xl border border-white/10 bg-black/90 shadow-xl transition-all duration-500 hover:border-white/20">
      <div className="grid grid-cols-2 grid-rows-2 aspect-16/10 sm:aspect-16/9 w-full">
        {items.slice(0, 4).map((tech, index) => {
          const Icon = tech.icon;
          const borderClasses =
            index === 0
              ? "border-r border-b border-white/10"
              : index === 1
                ? "border-b border-white/10"
                : index === 2
                  ? "border-r border-white/10"
                  : "";

          return (
            <div
              key={tech.name}
              style={{ background: tech.bgGradient }}
              className={`group/quad relative flex flex-col items-center justify-center p-3 sm:p-4 text-center transition-all duration-500 overflow-hidden ${borderClasses}`}
            >
              {/* Dynamic glowing backlight */}
              <div
                className="pointer-events-none absolute inset-0 opacity-45 blur-2xl transition-opacity duration-500 group-hover/quad:opacity-85"
                style={{ backgroundColor: tech.glowColor }}
              />

              {/* Large Centered Vector Logo */}
              <div className="relative mb-2 flex items-center justify-center transition-transform duration-500 group-hover/quad:scale-110">
                <Icon className="h-10 w-10 sm:h-12 sm:w-12 drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]" />
              </div>

              {/* Styled Text Label */}
              <div className="relative z-10 transition-transform duration-300 group-hover/quad:translate-y-[-1px]">
                {tech.customLabel ?? (
                  <span className={`text-xs sm:text-sm font-bold ${tech.textColor}`}>
                    {tech.name}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export type TechItem = {
  name: string;
  badge?: string;
  glowColor: string;
  bgGradient: string;
  textColor: string;
  customLabel?: React.ReactNode;
  icon: React.ComponentType<LogoProps>;
};

export const SERVICE_TECH_MAP: Record<string, TechItem[]> = {
  "01": [
    {
      name: "React",
      glowColor: "rgba(0, 216, 255, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(0, 150, 255, 0.22), #030a14 75%)",
      textColor: "text-white font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-white">React</span>,
      icon: (props) => <ReactLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(0,216,255,0.7)]" {...props} />,
    },
    {
      name: "Next.js",
      glowColor: "rgba(255, 255, 255, 0.3)",
      bgGradient: "radial-gradient(circle at 65% 35%, rgba(255, 255, 255, 0.16), #050507 75%)",
      textColor: "text-white font-sans font-bold uppercase tracking-wider",
      customLabel: <span className="font-sans text-sm font-bold tracking-wider text-white uppercase">NEXT<span className="text-white/60">.JS</span></span>,
      icon: (props) => <NextjsLogo className="h-9 w-9 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" {...props} />,
    },
    {
      name: "Tailwind CSS",
      glowColor: "rgba(56, 189, 248, 0.4)",
      bgGradient: "radial-gradient(circle at 40% 40%, rgba(6, 182, 212, 0.22), #020b10 75%)",
      textColor: "text-white font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-white">Tailwind CSS</span>,
      icon: (props) => <TailwindLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(56,189,248,0.7)]" {...props} />,
    },
    {
      name: "HTML/CSS3",
      glowColor: "rgba(241, 101, 41, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(241, 101, 41, 0.22), #0e0502 75%)",
      textColor: "text-white font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-white">HTML/CSS3</span>,
      icon: (props) => <HtmlCssLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(241,101,41,0.7)]" {...props} />,
    },
    {
      name: "JavaScript",
      glowColor: "rgba(247, 223, 30, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(247, 223, 30, 0.22), #0e0d02 75%)",
      textColor: "text-[#f7df1e] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#f7df1e]">JavaScript</span>,
      icon: (props) => <JavaScriptLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(247,223,30,0.7)]" {...props} />,
    },
    {
      name: "TypeScript",
      glowColor: "rgba(49, 120, 198, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(49, 120, 198, 0.22), #020a14 75%)",
      textColor: "text-[#5da0ed] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#5da0ed]">TypeScript</span>,
      icon: (props) => <TypeScriptLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(49,120,198,0.7)]" {...props} />,
    },
  ],
  "02": [
    {
      name: "PHP",
      glowColor: "rgba(119, 123, 180, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(119, 123, 180, 0.22), #060610 75%)",
      textColor: "text-[#a5a9e8] font-sans font-bold uppercase",
      customLabel: <span className="font-sans text-sm font-bold tracking-wider text-[#b3b7f5]">PHP</span>,
      icon: (props) => <PhpLogo className="h-9 w-9 drop-shadow-[0_0_10px_rgba(119,123,180,0.6)]" {...props} />,
    },
    {
      name: "Laravel",
      glowColor: "rgba(255, 45, 32, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(255, 45, 32, 0.22), #0f0302 75%)",
      textColor: "text-[#ff382b] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#ff4b3e]">Laravel</span>,
      icon: (props) => <LaravelLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(255,45,32,0.7)]" {...props} />,
    },
    {
      name: "Node.js",
      glowColor: "rgba(51, 153, 51, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(83, 158, 67, 0.22), #030c05 75%)",
      textColor: "text-[#6cc24a] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#6cc24a]">Node.js</span>,
      icon: (props) => <NodejsLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(83,158,67,0.7)]" {...props} />,
    },
    {
      name: "Firebase",
      glowColor: "rgba(255, 160, 0, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(255, 160, 0, 0.22), #0e0801 75%)",
      textColor: "text-[#ffcb2b] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#ffca28]">Firebase</span>,
      icon: (props) => <FirebaseLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(255,160,0,0.7)]" {...props} />,
    },
    {
      name: "MySQL / Database",
      glowColor: "rgba(0, 117, 143, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(0, 117, 143, 0.22), #020a0e 75%)",
      textColor: "text-[#00a4c7] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#00a4c7]">MySQL</span>,
      icon: (props) => <MySqlLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(0,117,143,0.7)]" {...props} />,
    },
  ],
  "03": [
    {
      name: "GSAP",
      glowColor: "rgba(10, 228, 72, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(10, 228, 72, 0.22), #020d04 75%)",
      textColor: "text-[#0ae448] font-sans font-bold tracking-wider",
      customLabel: <span className="font-sans text-sm font-bold tracking-wider text-[#0ae448]">GSAP</span>,
      icon: (props) => <GsapLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(10,228,72,0.7)]" {...props} />,
    },
    {
      name: "Framer Motion",
      glowColor: "rgba(255, 0, 128, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(121, 40, 202, 0.22), #0e030c 75%)",
      textColor: "text-white font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-white">Framer</span>,
      icon: (props) => <FramerMotionLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(255,0,128,0.7)]" {...props} />,
    },
    {
      name: "Three.js",
      glowColor: "rgba(216, 255, 62, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(216, 255, 62, 0.18), #070903 75%)",
      textColor: "text-[#d8ff3e] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-white">Three.js</span>,
      icon: (props) => <ThreejsLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(216,255,62,0.6)]" {...props} />,
    },
    {
      name: "Micro-interactions",
      glowColor: "rgba(168, 85, 247, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(168, 85, 247, 0.22), #0c0514 75%)",
      textColor: "text-[#c084fc] font-sans font-bold",
      customLabel: <span className="font-sans text-[11px] font-bold text-[#c084fc]">Micro-interactions</span>,
      icon: (props) => <MicroInteractionsLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]" {...props} />,
    },
    {
      name: "CSS Animations",
      glowColor: "rgba(38, 77, 228, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(38, 77, 228, 0.22), #020510 75%)",
      textColor: "text-[#6d8df5] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#6d8df5]">CSS Animations</span>,
      icon: (props) => <CssAnimationsLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(38,77,228,0.7)]" {...props} />,
    },
  ],
  "04": [
    {
      name: "Cursor AI",
      glowColor: "rgba(168, 85, 247, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(168, 85, 247, 0.22), #0c0514 75%)",
      textColor: "text-white font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-white">Cursor AI</span>,
      icon: (props) => <CursorAiLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(168,85,247,0.7)]" {...props} />,
    },
    {
      name: "Antigravity AI",
      glowColor: "rgba(216, 255, 62, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(0, 242, 254, 0.22), #030b0e 75%)",
      textColor: "text-[#d8ff3e] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#d8ff3e]">Antigravity</span>,
      icon: (props) => <AntigravityAiLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(216,255,62,0.7)]" {...props} />,
    },
    {
      name: "Kiro AI",
      glowColor: "rgba(255, 150, 50, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(255, 150, 50, 0.22), #0e0803 75%)",
      textColor: "text-[#ff9632] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#ff9632]">Kiro AI</span>,
      icon: (props) => <KiroAiLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(255,150,50,0.7)]" {...props} />,
    },
    {
      name: "Python",
      glowColor: "rgba(55, 118, 171, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(55, 118, 171, 0.22), #03080e 75%)",
      textColor: "text-[#ffd438] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#ffd438]">Python</span>,
      icon: (props) => <PythonLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(55,118,171,0.7)]" {...props} />,
    },
    {
      name: "OpenAI API / LLMs",
      glowColor: "rgba(16, 163, 127, 0.4)",
      bgGradient: "radial-gradient(circle at 50% 35%, rgba(16, 163, 127, 0.22), #020e0a 75%)",
      textColor: "text-[#10a37f] font-sans font-bold",
      customLabel: <span className="font-sans text-sm font-bold text-[#10a37f]">OpenAI / LLMs</span>,
      icon: (props) => <OpenAiLogo className="h-9 w-9 drop-shadow-[0_0_12px_rgba(16,163,127,0.7)]" {...props} />,
    },
  ],
};

export function getTechIconForTag(tag: string): React.ComponentType<LogoProps> | null {
  const lower = tag.toLowerCase();
  if (lower.includes("react")) return ReactLogo;
  if (lower.includes("next")) return NextjsLogo;
  if (lower.includes("tailwind")) return TailwindLogo;
  if (lower.includes("html") || lower === "css3") return HtmlCssLogo;
  if (lower.includes("javascript") || lower === "js") return JavaScriptLogo;
  if (lower.includes("typescript") || lower === "ts") return TypeScriptLogo;
  if (lower.includes("php")) return PhpLogo;
  if (lower.includes("laravel")) return LaravelLogo;
  if (lower.includes("node")) return NodejsLogo;
  if (lower.includes("firebase")) return FirebaseLogo;
  if (lower.includes("mysql") || lower.includes("database")) return MySqlLogo;
  if (lower.includes("gsap")) return GsapLogo;
  if (lower.includes("framer")) return FramerMotionLogo;
  if (lower.includes("three")) return ThreejsLogo;
  if (lower.includes("micro-interaction") || lower.includes("micro interaction")) return MicroInteractionsLogo;
  if (lower.includes("css animation")) return CssAnimationsLogo;
  if (lower.includes("cursor")) return CursorAiLogo;
  if (lower.includes("antigravity")) return AntigravityAiLogo;
  if (lower.includes("kiro")) return KiroAiLogo;
  if (lower.includes("openai") || lower.includes("llm")) return OpenAiLogo;
  if (lower.includes("python")) return PythonLogo;
  if (lower.includes("java")) return JavaLogo;
  return null;
}
