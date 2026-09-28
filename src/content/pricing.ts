import type { PricingPlan } from "@/types/content";

const designFeatures = [
  "UX Research",
  "High-Fidelity Design",
  "Responsive Design",
  "Figma Prototype",
  "Design System",
  "Developer Handoff",
  "Unlimited Revisions",
];

export const pricingSection = {
  title: "Straightforward Pricing, No Games.",
  subtitle: {
    before: "Not sure which tier fits? ",
    emphasis: "Book a free 15-minute call.",
    after: "\nWe'll scope it together and send a fixed quote by tomorrow.",
  },
};

export const pricingPlans: PricingPlan[] = [
  { title: "Website Design", tag: "1-5 Pages", packageName: "Launch Package – Design Only", price: "$1550", features: designFeatures },
  {
    title: "Development",
    tag: "1-5 Pages",
    packageName: "Launch Package",
    price: "$1250",
    features: [
      "UX Research",
      "Fully Responsive & Mobile-First Code",
      "CMS Integration (Blog, Products, Dashboard)",
      "SEO Basics + Lightning-Fast Performance",
      "Smooth Animations & Micro-Interactions",
      "Clean Code + Full Developer Handoff",
      "5 Revisions + 30 Days Free Support",
    ],
  },
  { title: "Website Design", tag: "1-10 Pages", packageName: "Launch Package – Design Only", price: "$3550", features: designFeatures },
  { title: "Mobile App Design", tag: "1-5 Pages", packageName: "Launch Package – Design Only", price: "$1550", features: designFeatures },
];
