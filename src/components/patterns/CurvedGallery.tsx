import Image from "next/image";
import { cn } from "@/lib/cn";
import type { ImageAsset } from "@/types/content";

type CurvedGalleryProps = { images: ImageAsset[]; priority?: boolean; className?: string };

export function CurvedGallery({ images, priority, className }: CurvedGalleryProps) {
  return (
    <div className={cn("relative h-[276px] w-full overflow-hidden bg-gutter lg:h-[612px]", className)}>
      <div className="absolute inset-0 flex justify-center gap-[7px] lg:gap-4">
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
      </div>
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 top-0 h-[9px] w-full fill-page lg:h-[67px]"
      >
        <path d="M0 0H1440Q720 200 0 0Z" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 100"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-[8px] w-full fill-page lg:h-[65px]"
      >
        <path d="M0 100H1440Q720 -100 0 100Z" />
      </svg>
    </div>
  );
}
