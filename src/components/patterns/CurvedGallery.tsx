import Image from "next/image";
import { Marquee } from "@/components/motion/Marquee";
import { cn } from "@/lib/cn";
import type { ImageAsset } from "@/types/content";

type CurvedGalleryProps = {
  images: ImageAsset[];
  priority?: boolean;
  className?: string;
};

export function CurvedGallery({
  images,
  priority,
  className,
}: CurvedGalleryProps) {
  return (
    <div className={cn("relative h-[276px] w-full lg:h-[612px]", className)}>
      <div className="absolute inset-0 overflow-hidden bg-gutter">
        <Marquee
          fade={false}
          duration={60}
          className="absolute inset-0"
          innerClassName="h-full -ml-[123px] lg:-ml-[393px]"
          trackClassName="h-full items-stretch gap-[7px] pr-[7px] lg:gap-4 lg:pr-4"
        >
          {images.map((image, i) => (
            <div
              key={i}
              className="relative h-full w-[306px] shrink-0 border-x-[3px] border-white bg-placeholder lg:w-[544px] lg:border-x-4"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(min-width: 1024px) 536px, 300px"
                preload={priority && i < 2}
                className="object-cover"
              />
            </div>
          ))}
        </Marquee>
      </div>
      {/* Curve overlays sit outside the clipped box and overhang it by 1px, so fractional
          device-pixel ratios can't leave a sliver of gutter showing along the edges. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -top-px h-[10px] w-full fill-page lg:h-[68px]"
      >
        <path d="M0 0H1440Q720 200 0 0Z" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-px h-[9px] w-full fill-page lg:h-[66px]"
      >
        <path d="M0 100H1440Q720 -100 0 100Z" />
      </svg>
    </div>
  );
}
