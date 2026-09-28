import Image from "next/image";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

type WhatsAppButtonProps = { href: string; label: string; size?: "sm" | "lg"; className?: string };

/** White pill with WhatsApp icon. lg = hero (243×56), sm = footer (200×44). */
export function WhatsAppButton({ href, label, size = "lg", className }: WhatsAppButtonProps) {
  const icon = size === "lg" ? 24 : 20;
  return (
    <Button
      href={href}
      variant="light"
      size={size}
      className={cn(size === "lg" ? "px-5" : "px-5 text-[14px]", className)}
      icon={<Image src="/brand/whatsapp.png" alt="" width={icon} height={icon} />}
    >
      {label}
    </Button>
  );
}
