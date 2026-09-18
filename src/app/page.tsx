import About from "@/components/About";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Navbar from "@/components/Navbar";
import Preloader from "@/components/Preloader";
import Process from "@/components/Process";
import Projects from "@/components/Projects";
import Services from "@/components/Services";
import SkillsMarquee from "@/components/SkillsMarquee";
import { getPortfolioData } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const { projects, services, experiences, educations, stats } = await getPortfolioData();

  return (
    <>
      <Preloader />
      <Navbar />

      <main className="relative">
        <Hero />
        <Intro />
        <SkillsMarquee />
        <Projects projects={projects} stats={stats} />
        <Services services={services} />
        <Experience items={experiences} />
        <About educations={educations} stats={stats} />
        <Process />
        <Contact stats={stats} />
      </main>

      <Footer stats={stats} />
    </>
  );
}
