/**
 * Single source of truth for portfolio content.
 */

export type ProjectSeed = {
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  liveUrl: string | null;
  year: string;
  image: string;
  featured: boolean;
};

export const PROJECT_SEED: ProjectSeed[] = [
  {
    slug: "vistara-estate",
    number: "01",
    title: "VISTARA ESTATE",
    subtitle: "Luxury Real Estate Experience",
    description:
      "A cinematic property showcase built around full-bleed architecture photography, editorial typography and a frictionless enquiry flow. Motion drives attention to the listings without ever getting in the way.",
    stack: ["Next.js", "Tailwind CSS", "Framer Motion"],
    liveUrl: "https://vistara-estate.netlify.app/",
    year: "2025",
    image: "/work/vistara.png",
    featured: true,
  },
  {
    slug: "travel-app",
    number: "02",
    title: "TRAVEL APP",
    subtitle: "Interactive Travel & Booking Experience",
    description:
      "A search-first booking interface with layered glass panels, destination discovery cards and a booking sheet that stays readable on any screen size.",
    stack: ["React", "Next.js", "Tailwind CSS", "REST API"],
    liveUrl: "https://travel-app-eight-pearl.vercel.app/",
    year: "2025",
    image: "/work/triply.jpg",
    featured: false,
  },
  {
    slug: "ai-trip-planner",
    number: "03",
    title: "AI TRIP PLANNER",
    subtitle: "AI-Powered Trip Planning Web App",
    description:
      "Conversational itinerary generation: describe the trip, get a structured day-by-day plan with maps, budgets and exportable stops in seconds.",
    stack: ["Next.js", "AI Integration", "Tailwind CSS", "TypeScript"],
    liveUrl: "https://ai-trip-plan-web-app.vercel.app/",
    year: "2025",
    image: "/work/ai-trip.jpg",
    featured: false,
  },
  {
    slug: "afrika-bitat",
    number: "04",
    title: "AFRIKA BITAT",
    subtitle: "Modern Web Platform",
    description:
      "A production platform for a modern architecture practice — content architecture, project index, and a performance budget kept under a Lighthouse-proud payload.",
    stack: ["Next.js", "Tailwind CSS", "Headless Content"],
    liveUrl: "https://afrikabitat.com",
    year: "2025",
    image: "/work/afrika.jpg",
    featured: false,
  },
  {
    slug: "cause-house",
    number: "05",
    title: "CAUSE HOUSE",
    subtitle: "Non-Profit / Web Experience",
    description:
      "An impact storytelling experience for a non-profit: donation flows, transparency dashboards and warm documentary imagery treated with restraint.",
    stack: ["Next.js", "Tailwind CSS", "React"],
    liveUrl: "https://cause-house.netlify.app",
    year: "2024",
    image: "/work/cause.webp",
    featured: false,
  },
  {
    slug: "bakery-website",
    number: "06",
    title: "BAKERY WEBSITE",
    subtitle: "Custom Creative Web Design",
    description:
      "A hand-crafted, warm-toned artisan bakery site built with pure HTML5 and CSS3 — grid, motion and detail work with zero frameworks.",
    stack: ["HTML5", "CSS3", "Responsive Design"],
    liveUrl: null,
    year: "2024",
    image: "/work/bakery.jpg",
    featured: false,
  },
];

export type ServiceSeed = {
  number: string;
  title: string;
  description: string;
  icon: "layout" | "layers" | "sparkles" | "brain";
  tags: string[];
};

export const SERVICE_SEED: ServiceSeed[] = [
  {
    number: "01",
    title: "FRONTEND DEVELOPMENT",
    description:
      "Building ultra-fast, responsive web interfaces using Next.js, React, Tailwind CSS, and HTML5/CSS3.",
    icon: "layout",
    tags: ["Next.js", "React", "Tailwind CSS", "HTML5/CSS3"],
  },
  {
    number: "02",
    title: "FULL STACK DEVELOPMENT",
    description:
      "Architecting scalable web solutions using PHP, Laravel, Node.js, and Firebase integration.",
    icon: "layers",
    tags: ["PHP", "Laravel", "Node.js", "Firebase"],
  },
  {
    number: "03",
    title: "CREATIVE DEVELOPMENT & MOTION",
    description:
      "Crafting interactive experiences with animations using GSAP, Framer Motion, and AI development tools.",
    icon: "sparkles",
    tags: ["GSAP", "Framer Motion", "Micro-interactions"],
  },
  {
    number: "04",
    title: "AI-POWERED WEB SOLUTIONS",
    description:
      "Leveraging cutting-edge AI tools (Cursor AI, Antigravity AI, Kiro AI) to accelerate and refine modern web workflows.",
    icon: "brain",
    tags: ["Cursor AI", "Antigravity AI", "Kiro AI"],
  },
];

export type ExperienceSeed = {
  company: string;
  role: string;
  duration: string;
  period: string;
  summary: string;
  highlights: string[];
};

export const EXPERIENCE_SEED: ExperienceSeed[] = [
  {
    company: "Elevatech Solution",
    role: "Frontend Web Developer Intern",
    duration: "6 Months",
    period: "Frontend",
    summary:
      "Shipped production-grade frontend interfaces in a team workflow — component systems, responsive layouts and pixel-accurate handoff from design.",
    highlights: [
      "Built reusable React / Next.js components",
      "Translated designs into responsive layouts",
      "Improved page performance and accessibility",
    ],
  },
  {
    company: "KB Management Consultant",
    role: "Medical Claiming Process",
    duration: "1 Year",
    period: "Operations",
    summary:
      "Owned the medical claiming workflow end to end, coordinating documents, insurers and internal stakeholders under tight compliance deadlines.",
    highlights: [
      "Managed claim lifecycle and document accuracy",
      "Coordinated with insurers and providers",
      "Built structured reporting habits that inform product detail today",
    ],
  },
  {
    company: "KB Management Consultant",
    role: "Medical Billing",
    duration: "1 Year",
    period: "Operations",
    summary:
      "Handled medical billing cycles with a strong emphasis on precision — coding accuracy, reconciliation and clear client communication.",
    highlights: [
      "Processed and reconciled billing records",
      "Reduced rejections through validation checks",
      "Delivered clear written client updates",
    ],
  },
];

export type EducationSeed = {
  qualification: string;
  institute: string;
  location: string;
  year: string;
};

export const EDUCATION_SEED: EducationSeed[] = [
  {
    qualification: "Bachelor in Computer Science",
    institute: "Virtual University of Pakistan",
    location: "Karachi, Pakistan",
    year: "Ongoing",
  },
  {
    qualification: "Full Stack Website Development — Laravel Diploma",
    institute: "National University of Technology (NUTECH)",
    location: "Islamabad, Pakistan",
    year: "2024",
  },
  {
    qualification: "Intermediate in Computer Science (ICS)",
    institute: "Ziauddin College",
    location: "Karachi, Pakistan",
    year: "2022",
  },
  {
    qualification: "SSC Computer Science",
    institute: "North American Grammar School",
    location: "Karachi, Pakistan",
    year: "2020",
  },
];

export const SOFT_SKILLS = [
  {
    title: "Leadership & Management Skills",
    detail:
      "Guided teams through delivery, ran reviews and kept projects moving across overlapping timelines.",
  },
  {
    title: "Creativity & Critical Thinking",
    detail:
      "Approaches interfaces as systems: visual rhythm, hierarchy and motion all serve comprehension.",
  },
  {
    title: "Negotiation & Problem Solving",
    detail:
      "Years of client-facing operations work turned ambiguity into clear, agreed-upon scope.",
  },
];

export const MARQUEE_ITEMS = [
  "NEXT.JS",
  "REACT",
  "TYPESCRIPT",
  "JAVASCRIPT",
  "TAILWIND CSS",
  "LARAVEL",
  "PHP",
  "FIREBASE",
  "BOOTSTRAP",
  "HTML5",
  "CSS3",
  "CURSOR AI",
  "ANTIGRAVITY AI",
  "KIRO AI",
  "GSAP",
  "FRAMER MOTION",
];

export type ProcessStep = {
  number: string;
  title: string;
  detail: string;
  meta: string;
};

export const PROCESS_STEPS: ProcessStep[] = [
  {
    number: "01",
    title: "DISCOVER & ANALYZE",
    detail:
      "Understanding the business, the audience and the one job the page has to do before a single pixel is placed.",
    meta: "Research · Goals · Content map",
  },
  {
    number: "02",
    title: "PLAN & ARCHITECT",
    detail:
      "Information architecture, data models and component inventory — the structural spine that keeps the build fast.",
    meta: "Sitemap · Schemas · Stack choice",
  },
  {
    number: "03",
    title: "UI/UX DESIGN",
    detail:
      "Type scale, grid, motion language and states. Designed in-system so handoff is never a translation exercise.",
    meta: "Type · Grid · Motion language",
  },
  {
    number: "04",
    title: "FULL STACK BUILD",
    detail:
      "Next.js, React and Tailwind on the surface; Laravel, Node.js and Firebase behind it. Typed, componentised, reviewed.",
    meta: "Next.js · Laravel · Node",
  },
  {
    number: "05",
    title: "AI & MOTION POLISH",
    detail:
      "GSAP and Framer Motion choreography, plus AI-assisted review passes to tighten copy, code and details.",
    meta: "GSAP · Framer Motion · Cursor AI",
  },
  {
    number: "06",
    title: "LAUNCH & DEPLOY",
    detail:
      "Performance budget checked, analytics live, deploy to Vercel or Netlify, then iterate on real behaviour.",
    meta: "Vercel · Netlify · Analytics",
  },
];

export const PROFILE = {
  name: "Zaigham Ali",
  role: "Full Stack Web Developer & Creative Developer",
  email: "alizaighm2797@gmail.com",
  phone: "03144713908",
  phoneHref: "tel:+923144713908",
  location: "Gulistan-e-Johar Block 14, Karachi, Pakistan",
  github: "https://github.com/Zaigham-Ali-cyber",
  githubLabel: "github.com/Zaigham-Ali-cyber",
  overview:
    "Motivated Web Developer with a strong foundation in full stack development, looking to excel in a challenging Full Stack Web Developer role.",
  overviewLong:
    "Motivated Web Developer with a strong foundation in full stack development, passionate about creating high-impact digital experiences.",
};

export const NAV_LINKS = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Experience & Services", href: "#capabilities" },
  { label: "Contact", href: "#contact" },
];
