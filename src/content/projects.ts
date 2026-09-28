import type { Project } from "@/types/content";

const title = "Meticulous Digital Visual Craftsmanship for Global Brands.";
const description =
  "Bower Tech Labs crafts premium UI/UX and web designs that turn visions into  high-performing digital experiences—brand strategy, development, and beyond.";
const cta = { label: "See Project Details", href: "#contact" };

export const projectsSection = {
  title: "Our Projects",
  subtitle:
    "Built by two award-winning creative developers, our vault gives you access to the techniques,\ncomponents, code, and tools behind our projects. Build, tweak, and make them your own.",
};

export const projects: Project[] = [
  { number: "01", eyebrow: "About Bower Tech", title, description, cta, variant: "default", image: { src: "/images/projects/project-1.jpg", alt: "Fintech web app case study" } },
  { number: "02", eyebrow: "About Bower Tech", title, description, cta, variant: "default", image: { src: "/images/projects/project-2.jpg", alt: "E-commerce mobile app case study" } },
  { number: "03", eyebrow: "About Bower Tech", title, description, cta, variant: "default", image: { src: "/images/projects/project-3.jpg", alt: "Healthcare dashboard case study" } },
  { number: "04", eyebrow: "2025", title, description, cta, variant: "featured", image: { src: "/images/projects/project-4.jpg", alt: "Travel booking website case study" } },
];
