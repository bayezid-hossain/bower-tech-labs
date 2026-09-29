import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { AnimatedText } from "@/components/motion/AnimatedText";
import { FadeIn } from "@/components/motion/FadeIn";

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
  as = "h2",
  className,
  titleClassName,
  subtitleClassName,
}: SectionHeadingProps) {
  const subtitleClasses = cn(
    "mt-[17px] text-[15.5px] leading-5 tracking-[-0.045em] text-body lg:mt-[22px] lg:text-[17px] lg:leading-6 lg:tracking-[-0.035em]",
    subtitleClassName,
  );
  return (
    <div className={cn(align === "center" && "text-center", className)}>
      <AnimatedText
        as={as}
        id={titleId}
        text={title}
        effect="roll"
        breakOn={titleBreakOn}
        className={cn("text-[32px] font-semibold leading-[1.15] tracking-[-0.04em] text-ink lg:text-[48px]", titleClassName)}
      />
      {typeof subtitle === "string" ? (
        <AnimatedText as="p" text={subtitle} delay={0.3} className={subtitleClasses} />
      ) : subtitle ? (
        <FadeIn as="p" y={10} delay={0.3} className={subtitleClasses}>
          {subtitle}
        </FadeIn>
      ) : null}
    </div>
  );
}
