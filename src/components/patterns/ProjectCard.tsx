import Image from "next/image";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/types/content";

type ProjectCardProps = { project: Project; index: number; className?: string };

export function ProjectCard({ project, index, className }: ProjectCardProps) {
  const featured = project.variant === "featured";
  return (
    <article className={cn("flex flex-col", className)}>
      <div className="flex justify-end" style={{ paddingRight: index * 80 }}>
        <span className="flex size-14 items-center justify-center rounded-tr-[4px] bg-navy-gradient text-2xl text-white [clip-path:polygon(8px_0,100%_0,100%_100%,0_100%,0_8px)]">
          {project.number}
        </span>
      </div>
      <div className={cn("flex flex-col gap-6 rounded-3xl bg-surface p-5 lg:flex-row lg:p-6", index === 0 && "rounded-tr-none")}>
        <div className={cn("flex flex-col lg:w-[578px] lg:shrink-0 lg:justify-between", featured && "lg:p-6")}>
          <p className="text-sm leading-6 text-muted lg:text-base">{project.eyebrow}</p>
          <div className="mt-3 lg:mt-0">
            <h3
              className={cn(
                "text-2xl leading-7 tracking-[-0.03em] text-ink lg:text-[34px] lg:leading-10",
                featured ? "lg:max-w-[400px]" : "lg:max-w-[520px]",
              )}
            >
              {project.title}
            </h3>
            <p className="mt-3 max-w-[440px] text-[15px] leading-6 text-body lg:mt-4">{project.description}</p>
            <Button
              href={project.cta.href}
              variant={featured ? "primary" : "dark"}
              size="sm"
              className="mt-10 hidden px-6 lg:inline-flex"
            >
              {project.cta.label}
            </Button>
          </div>
        </div>
        <div className="relative aspect-[296/270] overflow-hidden rounded-2xl bg-placeholder lg:aspect-auto lg:h-[503px] lg:w-[550px] lg:shrink-0">
          <Image src={project.image.src} alt={project.image.alt} fill sizes="(min-width: 1024px) 550px, 100vw" className="object-cover" />
        </div>
        <Button href={project.cta.href} variant="dark" size="sm" className="w-full lg:hidden">
          {project.cta.label}
        </Button>
      </div>
    </article>
  );
}
