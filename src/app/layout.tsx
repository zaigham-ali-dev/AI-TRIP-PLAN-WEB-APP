import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Space_Grotesk } from "next/font/google";
import Script from "next/script";

import Backdrop from "@/components/Backdrop";
import CustomCursor from "@/components/CustomCursor";
import { AppReadyProvider } from "@/components/AppReady";
import SmoothScroll from "@/components/SmoothScroll";
import ViewTracker from "@/components/ViewTracker";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const sans = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zaigham Ali — Full Stack Web Developer & Creative Developer",
  description:
    "Zaigham Ali is a Full Stack Web Developer and Creative Developer in Karachi, Pakistan, crafting interactive digital experiences with Next.js, React, Laravel and motion design.",
  keywords: [
    "Zaigham Ali",
    "Creative Developer",
    "Full Stack Web Developer",
    "Next.js Developer Karachi",
    "GSAP",
    "Framer Motion",
    "UI UX Designer",
  ],
  authors: [{ name: "Zaigham Ali" }],
  openGraph: {
    title: "Zaigham Ali — Crafting Digital Experiences That Move",
    description:
      "Full Stack Web Developer & Creative Developer building interactive digital experiences.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="relative bg-ink text-white/90 antialiased">
        <Script id="motion-guard" strategy="beforeInteractive">
          {`try{if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.reduced='1'}}catch(e){}`}
        </Script>
        <Backdrop />
        <CustomCursor />
        <AppReadyProvider>
          <SmoothScroll />
          <ViewTracker />
          <div className="relative z-10">{children}</div>
        </AppReadyProvider>
      </body>
    </html>
  );
}
