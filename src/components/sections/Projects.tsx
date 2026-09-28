import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ProjectStack } from "@/components/patterns/ProjectStack";
import { projects, projectsSection } from "@/content/projects";

export function Projects() {
  return (
    <section id="projects" aria-labelledby="projects-title" className="pt-20 lg:pt-[159px]">
      <Container>
        <SectionHeading
          titleId="projects-title"
          align="center"
          title={projectsSection.title}
          subtitle={projectsSection.subtitle}
          subtitleClassName="mt-[10px] lg:mt-[22px]"
        />
        <ProjectStack projects={projects} className="mt-[39px] lg:mt-[47px]" />
      </Container>
    </section>
  );
}
