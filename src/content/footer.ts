import type { FooterColumn } from "@/types/content";

export const serviceLinks = [
  "UI/UX Design",
  "Logo & Branding",
  "Webflow Development",
  "Framer Development",
  "WordPress Development",
  "Web/App/Dashboard Redesign",
  "Other Services",
];

export const footer = {
  description:
    "Bower Tech Labs crafts premium UI/UX and web designs that turn visions into high-performing digital experiences—brand strategy, development, and beyond.",
  emailLabel: "Email us:",
  copyright: "© 2026, Bower Tech Labs Agency | All Rights Reserved.",
  wordmarkAlt: "Bower Tech Labs",
};

export const footerColumns: FooterColumn[] = [
  { title: "Services", links: serviceLinks.map((label) => ({ label, href: "#services" })) },
  {
    title: "Quick Links",
    links: [
      { label: "Services", href: "#services" },
      { label: "About Us", href: "#about" },
      { label: "Process", href: "#process" },
      { label: "Testimonials", href: "#testimonials" },
      { label: "Pricing", href: "#pricing" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
  {
    title: "Socials",
    links: ["Dribbble", "Behance", "Instagram", "LinkedIn", "Facebook", "X (Twitter)"].map((label) => ({ label, href: "#" })),
  },
];
