import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type ContainerProps = HTMLAttributes<HTMLElement> & { as?: ElementType };

/** 1200px content column (120px gutters at 1440), 20px gutters on mobile. */
export function Container({ as: Tag = "div", className, ...props }: ContainerProps) {
  return <Tag className={cn("mx-auto w-full max-w-[1240px] px-5", className)} {...props} />;
}
