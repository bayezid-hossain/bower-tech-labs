import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

const variants = {
  nav: { src: "/brand/logo-lockup.png", width: 201, height: 32, className: "h-6 w-auto lg:h-8" },
  footer: { src: "/brand/logo-lockup-lg.png", width: 231, height: 40, className: "h-10 w-auto" },
} as const;

type LogoLockupProps = { variant?: keyof typeof variants; className?: string };

export function LogoLockup({ variant = "nav", className }: LogoLockupProps) {
  const v = variants[variant];
  return (
    <Link href="/" aria-label="Bower Tech Labs home" className={cn("inline-flex shrink-0", className)}>
      <Image
        src={v.src}
        alt="Bower Tech Labs"
        width={v.width}
        height={v.height}
        preload={variant === "nav"}
        className={v.className}
      />
    </Link>
  );
}
