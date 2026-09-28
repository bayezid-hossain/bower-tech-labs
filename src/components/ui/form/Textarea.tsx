import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import { fieldControlClasses } from "./Input";

export function Textarea({ className, ...props }: ComponentPropsWithoutRef<"textarea">) {
  return <textarea className={cn(fieldControlClasses, "h-[110px] resize-none pt-2 lg:h-[101px] lg:pt-3", className)} {...props} />;
}
