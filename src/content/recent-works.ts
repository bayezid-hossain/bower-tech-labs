import type { ImageAsset } from "@/types/content";

export const recentWorksSection = {
  title: "Our Recent Works",
  subtitle: "End-to-end digital craftsmanship — from brand strategy to\npixel-perfect shipped products.",
  gallery: [
    { src: "/images/recent-works/work-1.jpg", alt: "AI productivity app landing page" },
    { src: "/images/recent-works/work-2.jpg", alt: "Crypto wallet mobile app" },
    { src: "/images/recent-works/work-3.jpg", alt: "Real estate website" },
    { src: "/images/recent-works/work-4.jpg", alt: "Fitness tracking dashboard" },
  ] satisfies ImageAsset[],
};
