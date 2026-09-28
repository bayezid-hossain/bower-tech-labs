import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FadeIn } from "@/components/motion/FadeIn";
import { ProjectCard } from "@/components/patterns/ProjectCard";
import { projects, projectsSection } from "@/content/projects";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="pt-20 lg:pt-[159px]">
      <Container>
        <FadeIn>
          <SectionHeading titleId="projects-title" align="center" title={projectsSection.title} subtitle={projectsSection.subtitle} subtitleClassName="mt-[10px] lg:mt-[22px]" />
        </FadeIn>
        <ol className="mt-[39px] flex flex-col gap-6 lg:mt-[47px]">
          {projects.map((project, i) => (
            <li key={project.number}>
              <FadeIn>
                <ProjectCard project={project} index={i} />
              </FadeIn>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
