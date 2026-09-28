import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";
import type { SelectOption } from "@/types/content";
import { fieldControlClasses } from "./Input";

type SelectProps = Omit<ComponentPropsWithoutRef<"select">, "children"> & {
  placeholder: string;
  options: SelectOption[];
  value: string;
};

export function Select({ placeholder, options, value, className, ...props }: SelectProps) {
  return (
    <select
      value={value}
      className={cn(fieldControlClasses, "cursor-pointer appearance-none", !value && "text-hint", className)}
      {...props}
    >
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value} className="text-ink">
          {option.label}
        </option>
      ))}
    </select>
  );
}
