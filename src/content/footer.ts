import type { FooterColumn } from "@/types/content";

export const serviceLinks = [
  "UI/UX Design",
  "Logo & Branding",
  "Web flow Development",
  "Framer Development",
  "WordPress Development",
  "Web/App/Dashboard Redesign",
  "Other Services",
];

export const footer = {
  description:
    "Trexa Lab crafts premium UI/UX and web designs that turn visions into high-performing digital experiences—brand strategy, development, and beyond.",
  emailLabel: "Email us :",
  copyright: "© 2026, Bower Tech Labs Agency | All Rights Reserved.",
  wordmarkAlt: "Bower Tech Labs",
};

export const footerColumns: FooterColumn[] = [
  { title: "Socials", links: serviceLinks.map((label) => ({ label, href: "#services" })) },
  {
    title: "Quick Links",
    links: [
      { label: "Services", href: "#services" },
      { label: "About us", href: "#about" },
      { label: "Process", href: "#process" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact us", href: "#contact" },
    ],
  },
  {
    title: "Socials",
    links: ["Dribble", "Behance", "Instagram", "LinkedIn", "Facebook", "X (twitter)"].map((label) => ({ label, href: "#" })),
  },
];
