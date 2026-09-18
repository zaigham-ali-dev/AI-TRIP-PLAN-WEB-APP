import {
  EDUCATION_SEED,
  EXPERIENCE_SEED,
  PROJECT_SEED,
  SERVICE_SEED,
} from "@/lib/content";
import type {
  EducationView,
  ExperienceView,
  ProjectView,
  ServiceView,
  StatsView,
} from "@/lib/types";

const INITIAL_LIKES = [42, 31, 27, 19, 14, 11];

export const staticProjects: ProjectView[] = PROJECT_SEED.map((project, index) => ({
  id: index + 1,
  ...project,
  likes: INITIAL_LIKES[index] ?? 5,
}));

export const staticServices: ServiceView[] = SERVICE_SEED.map((service, index) => ({
  id: index + 1,
  ...service,
}));

export const staticExperiences: ExperienceView[] = EXPERIENCE_SEED.map((item, index) => ({
  id: index + 1,
  ...item,
}));

export const staticEducations: EducationView[] = EDUCATION_SEED.map((item, index) => ({
  id: index + 1,
  ...item,
}));

export type PortfolioData = {
  projects: ProjectView[];
  services: ServiceView[];
  experiences: ExperienceView[];
  educations: EducationView[];
  stats: StatsView;
};

export async function getPortfolioData(): Promise<PortfolioData> {
  const totalLikes = staticProjects.reduce((total, project) => total + project.likes, 0);

  return {
    projects: staticProjects,
    services: staticServices,
    experiences: staticExperiences,
    educations: staticEducations,
    stats: {
      projects: staticProjects.length,
      likes: totalLikes,
      messages: 12,
      views: 1420,
      source: "fallback",
    },
  };
}

export async function getStats(): Promise<StatsView> {
  const totalLikes = staticProjects.reduce((total, project) => total + project.likes, 0);

  return {
    projects: staticProjects.length,
    likes: totalLikes,
    messages: 12,
    views: 1420,
    source: "fallback",
  };
}

export async function getProjectBySlug(slug: string): Promise<ProjectView | null> {
  return staticProjects.find((p) => p.slug === slug) ?? null;
}
