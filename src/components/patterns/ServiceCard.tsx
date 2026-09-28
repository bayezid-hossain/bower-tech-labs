import Image from "next/image";
import { cn } from "@/lib/cn";
import { Card } from "@/components/ui/Card";
import type { Service } from "@/types/content";

export function ServiceCard({ service, className }: { service: Service; className?: string }) {
  return (
    <Card as="article" className={cn("px-4 pt-4 transition-transform duration-150 hover:-translate-y-0.5", className)}>
      <div className="relative aspect-[558/364] overflow-hidden rounded-2xl bg-placeholder">
        <Image src={service.image.src} alt={service.image.alt} fill sizes="(min-width: 1024px) 558px, 100vw" className="object-cover" />
      </div>
      <div className="px-4 pt-5 pb-6 lg:px-5 lg:pt-6 lg:pb-10">
        <h3 className="text-xl font-semibold leading-7 tracking-[-0.04em] text-ink lg:text-[26px] lg:leading-8">{service.title}</h3>
        <p className="mt-1 text-[15px] font-light leading-6 text-body lg:mt-2 lg:text-lg">{service.subtitle}</p>
      </div>
    </Card>
  );
}
