import type { Testimonial } from "@/types/content";

const quote =
  "Bower Tech Labs crafts premium UI/UX and web designs that turn visions into high-performing digital experiences—brand strategy, development, and beyond.";

export const testimonialsSection = {
  title: "What we do\nexpectionally",
  subtitle: "End-to-end digital craftsmanship — from brand strategy to\npixel-perfect shipped products.",
};

export const testimonials: Testimonial[] = [
  { name: "Keefe Dashiell", role: "Founder, After Life Initiative", quote, avatar: { src: "/images/testimonials/avatar-1.png", alt: "Keefe Dashiell" } },
  { name: "Keefe Dashiell", role: "Founder, After Life Initiative", quote, avatar: { src: "/images/testimonials/avatar-2.png", alt: "Keefe Dashiell" } },
  { name: "Keefe Dashiell", role: "Founder, After Life Initiative", quote, avatar: { src: "/images/testimonials/avatar-3.jpg", alt: "Keefe Dashiell" } },
];
