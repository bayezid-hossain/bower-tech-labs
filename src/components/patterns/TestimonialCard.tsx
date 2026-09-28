import { cn } from "@/lib/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Card } from "@/components/ui/Card";
import type { Testimonial } from "@/types/content";

export function TestimonialCard({ testimonial, className }: { testimonial: Testimonial; className?: string }) {
  return (
    <Card as="figure" className={cn("flex flex-col p-5 lg:p-6", className)}>
      <figcaption className="flex items-center gap-4 lg:flex-col lg:items-start">
        <Avatar src={testimonial.avatar.src} alt={testimonial.avatar.alt} size={56} />
        <div>
          <p className="text-[17px] font-semibold leading-6 tracking-[-0.02em] text-name">{testimonial.name}</p>
          <p className="mt-0.5 text-xs leading-4 text-caption lg:mt-1">{testimonial.role}</p>
        </div>
      </figcaption>
      <blockquote className="mt-8 text-base leading-6 text-label lg:mt-10 lg:text-lg lg:leading-7">{testimonial.quote}</blockquote>
    </Card>
  );
}
