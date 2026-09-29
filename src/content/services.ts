import type { Service } from "@/types/content";

export const servicesSection = {
  title: "What We Do, Full Stop",
  subtitle:
    "Strategy, design, and build — one team, one invoice, zero handoffs.\nFrom wireframe to live URL, you talk to the same people who actually do the work.",
  cta: { label: "Start a Project", href: "#contact-form" },
};

export const services: Service[] = [
  {
    title: "UI/UX Design",
    subtitle: "Website, Mobile App, Dashboard",
    image: { src: "/images/services/ui-ux-design.jpg", alt: "UI/UX design work" },
  },
  {
    title: "Logo & Branding",
    subtitle: "Website, Mobile App, Dashboard",
    image: { src: "/images/services/logo-branding.jpg", alt: "Logo and branding work" },
  },
  {
    title: "Web Development",
    subtitle: "Webflow, Framer, + more",
    image: { src: "/images/services/web-development.jpg", alt: "Web development work" },
  },
  {
    title: "UI/UX Redesign",
    subtitle: "Website, Mobile App, Dashboard",
    image: { src: "/images/services/ui-ux-redesign.jpg", alt: "UI/UX redesign work" },
  },
];
