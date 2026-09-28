import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/cn";

type CardProps = HTMLAttributes<HTMLElement> & { as?: ElementType };

export function Card({ as: Tag = "div", className, ...props }: CardProps) {
  return <Tag className={cn("rounded-3xl bg-surface", className)} {...props} />;
}
