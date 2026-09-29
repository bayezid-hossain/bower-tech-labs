import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type MarqueeProps = {
  children: ReactNode;
  className?: string;
  trackClassName?: string;
  innerClassName?: string;
  duration?: number;
  fade?: boolean;
  /** Travel direction of the content. */
  direction?: "left" | "right";
};

/** Infinite horizontal scroll, optionally faded at the edges. Content is duplicated once; pauses on hover. */
export function Marquee({
  children,
  className,
  trackClassName = "gap-6 pr-6 lg:gap-12 lg:pr-12",
  innerClassName,
  duration = 40,
  fade = true,
  direction = "left",
}: MarqueeProps) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden",
        fade && "[mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex w-max animate-marquee group-hover:[animation-play-state:paused]",
          direction === "right" && "[animation-direction:reverse]",
          innerClassName,
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className={cn("flex shrink-0 items-center", trackClassName)}>{children}</div>
        <div aria-hidden="true" className={cn("flex shrink-0 items-center", trackClassName)}>
          {children}
        </div>
      </div>
    </div>
  );
}
