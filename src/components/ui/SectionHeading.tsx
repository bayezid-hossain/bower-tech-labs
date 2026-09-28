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
        <p className={cn("mt-[17px] text-[15.5px] leading-5 tracking-[-0.045em] text-body lg:mt-[22px] lg:text-[17px] lg:leading-6 lg:tracking-[-0.035em]", subtitleClassName)}>
          {typeof subtitle === "string" ? <LineBreaks text={subtitle} /> : subtitle}
        </p>
      )}
    </div>
  );
}
