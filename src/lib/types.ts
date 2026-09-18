export type ProjectView = {
  id: number;
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
  likes: number;
};

export type ServiceView = {
  id: number;
  number: string;
  title: string;
  description: string;
  icon: string;
  tags: string[];
};

export type ExperienceView = {
  id: number;
  company: string;
  role: string;
  duration: string;
  period: string;
  summary: string;
  highlights: string[];
};

export type EducationView = {
  id: number;
  qualification: string;
  institute: string;
  location: string;
  year: string;
};

export type StatsView = {
  projects: number;
  likes: number;
  messages: number;
  views: number;
  source: "database" | "fallback";
};
