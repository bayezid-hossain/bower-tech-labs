import Image from "next/image";
import { cn } from "@/lib/cn";

type PlayReelProps = { alt: string; className?: string };

/** Tick-ring dial with ghost "Play"/"Reel" and the reel card — pixel-exact asset from the design. */
export function PlayReel({ alt, className }: PlayReelProps) {
  return (
    <div className={cn("mx-auto w-full max-w-[612px]", className)}>
      <Image src="/brand/play-reel.png" alt={alt} width={612} height={452} className="h-auto w-full" />
    </div>
  );
}
