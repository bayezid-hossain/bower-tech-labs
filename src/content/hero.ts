import type { ImageAsset } from "@/types/content";

export const hero = {
  status: "Available for Work",
  title: "Product Design That\nShips in Days, Not Months.",
  description:
    "SaaS dashboards, marketing sites, and digital products — designed, built,\nand ready to test while agencies are still scheduling their third discovery call.",
  primaryCta: { label: "Request a Quote", href: "#contact-form" },
  galleryLabel: "Featured work gallery",
  gallery: [
    { src: "/images/hero/gallery-1.jpg", alt: "SaaS analytics dashboard design" },
    { src: "/images/hero/gallery-2.jpg", alt: "Mobile banking app screens" },
    { src: "/images/hero/gallery-3.jpg", alt: "Brand identity stationery" },
    { src: "/images/hero/gallery-4.jpg", alt: "Marketing website design" },
  ] satisfies ImageAsset[],
};
