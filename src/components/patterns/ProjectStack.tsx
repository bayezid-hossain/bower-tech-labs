"use client";

import { useMotionValueEvent, useScroll } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { activeStackIndex, stackOffsets, stackScrollTarget } from "@/lib/project-stack";
import { ProjectCard } from "@/components/patterns/ProjectCard";
import type { Project } from "@/types/content";

type ProjectStackProps = { projects: Project[]; className?: string };

/** Sticky stacking project list; tabs bring any card back to the top of the stack. */
export function ProjectStack({ projects, className }: ProjectStackProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  const geometry = useCallback(() => {
    const list = listRef.current;
    if (!list || list.children.length === 0) return null;
    const items = Array.from(list.children) as HTMLElement[];
    const top = parseFloat(getComputedStyle(items[0]).top);
    return {
      listTop: list.getBoundingClientRect().top + window.scrollY,
      offsets: stackOffsets(
        items.map((el) => el.offsetHeight),
        parseFloat(getComputedStyle(list).rowGap) || 0,
      ),
      // "auto" when stacking is off (short viewports) -> scroll to the card's top.
      stickyTop: Number.isFinite(top) ? top : 0,
    };
  }, []);

  const update = useCallback(() => {
    const g = geometry();
    if (!g) return;
    const next = activeStackIndex(window.scrollY, g.listTop, g.offsets, g.stickyTop);
    setActive((current) => (current === next ? current : next));
  }, [geometry]);

  // Page scroll via Motion's useScroll (no raw scroll listeners); state changes only when the top card does.
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", update);

  useEffect(() => {
    const frame = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const select = useCallback(
    (index: number) => {
      const g = geometry();
      if (!g) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: stackScrollTarget(g.listTop, g.offsets, index, g.stickyTop), behavior: reduce ? "auto" : "smooth" });
    },
    [geometry],
  );

  return (
    <ol ref={listRef} className={cn("flex flex-col gap-6", className)}>
      {projects.map((project, i) => (
        // The li/wrapper boxes span the transparent tab strip too; only the tab and card body take pointer events,
        // so tabs of cards stacked beneath stay clickable.
        <li key={project.number} className="project-stack-item pointer-events-none">
          <ProjectCard project={project} index={i} active={i === active} onSelect={() => select(i)} />
        </li>
      ))}
    </ol>
  );
}
