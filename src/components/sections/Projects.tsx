import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectCard } from "@/components/patterns/ProjectCard";
import { projects, projectsSection } from "@/content/projects";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="pt-20 lg:pt-[159px]">
      <Container>
        <Reveal>
          <SectionHeading titleId="projects-title" align="center" title={projectsSection.title} subtitle={projectsSection.subtitle} />
        </Reveal>
        <ol className="mt-8 flex flex-col gap-6 lg:mt-[47px]">
          {projects.map((project, i) => (
            <li key={project.number}>
              <Reveal>
                <ProjectCard project={project} index={i} />
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
