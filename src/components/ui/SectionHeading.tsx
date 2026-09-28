import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { LineBreaks } from "./LineBreaks";

type SectionHeadingProps = {
  title: string;
  subtitle?: ReactNode;
  titleId?: string;
  titleBreakOn?: "lg" | "always";
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
  titleClassName?: string;
  subtitleClassName?: string;
};

export function SectionHeading({
  title,
  subtitle,
  titleId,
  titleBreakOn = "lg",
  align = "left",
  as: Tag = "h2",
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <Tag
        id={titleId}
        className={cn("text-[32px] font-semibold leading-[1.15] tracking-[-0.04em] text-ink lg:text-[48px]", titleClassName)}
      >
        <LineBreaks text={title} breakOn={titleBreakOn} />
      </Tag>
      {subtitle && (
        <p className={cn("mt-3 text-[15px] leading-6 text-body lg:mt-5 lg:text-base", subtitleClassName)}>
          {typeof subtitle === "string" ? <LineBreaks text={subtitle} /> : subtitle}
        </p>
      )}
    </div>
  );
}
