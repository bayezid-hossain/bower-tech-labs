import { cn } from "@/lib/cn";

type BulletListProps = { items: string[]; className?: string; itemClassName?: string };

/** Dot bullets: dot 10px from the left edge, text 24px from the left edge. */
export function BulletList({ items, className, itemClassName }: BulletListProps) {
  return (
    <ul className={cn("flex flex-col", className)}>
      {items.map((item, i) => (
        <li
          key={i}
          className={cn(
            "flex items-baseline gap-2.5 pl-2.5",
            "before:size-1 before:shrink-0 before:-translate-y-[0.3em] before:rounded-full before:bg-current before:content-['']",
            itemClassName,
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}
