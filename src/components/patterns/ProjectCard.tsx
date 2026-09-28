import Image from "next/image";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";
import type { Project } from "@/types/content";

type ProjectCardProps = {
  project: Project;
  index: number;
  /** This card is on top of the stack (its tab gets the solid navy style). */
  active?: boolean;
  onSelect?: () => void;
  className?: string;
};

export function ProjectCard({ project, index, active = true, onSelect, className }: ProjectCardProps) {
  const featured = project.variant === "featured";
  return (
    <article className={cn("flex flex-col", className)}>
      <div className="pointer-events-none flex justify-end" style={{ paddingRight: index * 80 }}>
        <button
          type="button"
          onClick={onSelect}
          aria-label={`Show project ${project.number}`}
          aria-current={active ? "true" : undefined}
          className={cn(
            "pointer-events-auto flex size-14 items-center justify-center rounded-tr-[4px] text-2xl transition-[color,background-color,transform] duration-200 active:scale-[0.98] [clip-path:polygon(8px_0,100%_0,100%_100%,0_100%,0_8px)]",
            "focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-white",
            active ? "bg-navy-gradient text-white" : "bg-placeholder text-navy hover:bg-navy hover:text-white",
          )}
        >
          {project.number}
        </button>
      </div>
      <div className={cn("pointer-events-auto flex flex-col gap-4 rounded-3xl bg-surface p-5 lg:flex-row lg:gap-6 lg:p-6", index === 0 && "rounded-tr-none")}>
        <div className={cn("flex flex-col lg:w-[578px] lg:shrink-0 lg:justify-between", featured && "lg:p-6")}>
          <p className="text-[13.5px] leading-5 tracking-[-0.05em] text-muted lg:text-[17px] lg:leading-5 lg:tracking-[-0.04em]">{project.eyebrow}</p>
          <div className="mt-3 lg:mt-0">
            <h3
              className={cn(
                "text-2xl leading-7 tracking-[-0.025em] text-ink lg:text-[36px] lg:font-medium lg:leading-10 lg:tracking-[-0.02em]",
                featured ? "lg:max-w-[400px]" : "lg:max-w-[520px]",
              )}
            >
              {project.title}
            </h3>
            <p className="mt-[13px] max-w-[440px] text-[15.5px] leading-6 tracking-[-0.045em] text-body lg:mt-4 lg:text-[15px] lg:tracking-[-0.03em]">{project.description}</p>
            <Button
              href={project.cta.href}
              variant={featured ? "primary" : "dark"}
              size="sm"
              className="mt-10 hidden px-6 lg:inline-flex lg:px-[25px] lg:tracking-[-0.025em]"
            >
              {project.cta.label}
            </Button>
          </div>
        </div>
        <div className="relative aspect-[296/270] overflow-hidden rounded-2xl bg-placeholder lg:aspect-auto lg:h-[504px] lg:w-[550px] lg:shrink-0">
          <Image src={project.image.src} alt={project.image.alt} fill sizes="(min-width: 1024px) 550px, 100vw" className="object-cover" />
        </div>
        <Button href={project.cta.href} variant="dark" size="sm" className="mt-2 h-10 w-full tracking-[-0.02em] lg:hidden">
          {project.cta.label}
        </Button>
      </div>
    </article>
  );
}
