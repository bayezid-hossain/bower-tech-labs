import Image from "next/image";
import { cn } from "@/lib/cn";

type AvatarProps = { src: string; alt: string; size: number; className?: string };

export function Avatar({ src, alt, size, className }: AvatarProps) {
  return (
    <Image
      src={src}
      alt={alt}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
      style={{ width: size, height: size }}
    />
  );
}
