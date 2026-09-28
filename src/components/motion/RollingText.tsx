import { cn } from "@/lib/cn";

type RollingTextProps = { text: string; className?: string };

/**
 * Letter-roll hover (trexalab.com style): each letter slides up one line to reveal an identical copy,
 * 15ms apart, 250ms ease-out. Requires a `group` ancestor (Button provides it).
 */
export function RollingText({ text, className }: RollingTextProps) {
  return (
    <span className={cn("relative inline-flex overflow-hidden leading-[1.2]", className)}>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => {
        const glyph = ch === " " ? "\u00a0" : ch;
        return (
          <span
            key={i}
            aria-hidden="true"
            className="relative inline-block transition-transform duration-250 ease-out group-hover:-translate-y-full"
            style={{ transitionDelay: `${i * 15}ms` }}
          >
            {glyph}
            <span className="absolute top-full left-0">{glyph}</span>
          </span>
        );
      })}
    </span>
  );
}
