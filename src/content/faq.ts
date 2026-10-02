import type { FaqItem } from "@/types/content";

export const faqSection = {
  title: "Frequently Asked Questions",
  subtitle:
    "However, we recommend contacting us if you have any questions, so we can\nprovide an explanation tailored to your goal.",
};

// Answer 1 is from the design (company name corrected); answers 2–9 are drafts based on the site's own copy —
// edit freely.
export const faqs: FaqItem[] = [
  {
    question: "Do you work with US/EU startups?",
    answer:
      "Yes! At Bower Tech Labs, we've successfully collaborated with startups across the US and EU, aligning our design sprints with your time zones for seamless communication and rapid iterations. Let's turn your innovative ideas into standout digital products—book a free discovery call to get started.",
  },
  {
    question: "Can we start small or get a trial?",
    answer:
      "Yes. Many clients start with a single page, a design audit or a short sprint to see how we work. If it's a fit, we scope the full project with a fixed quote.",
  },
  {
    question: "How do I get started with Bower Tech Labs?",
    answer:
      "Send us your idea through the contact form or WhatsApp. We reply within 12 business hours with a few sharp questions, then send a fixed price, timeline and list of deliverables.",
  },
  {
    question: "Can you help us redesign our app, website, or enterprise/B2B software?",
    answer:
      "Yes. We redesign websites, mobile apps and dashboards—from UX audits and research to a refreshed design system and developer-ready Figma files—without breaking what already works.",
  },
  {
    question: "What makes Bower Tech Labs different from other design agencies?",
    answer:
      "A small, senior team with no junior handoffs: you talk to the people doing the work. Fixed prices, fixed timelines, weekly progress updates and full Figma access.",
  },
  {
    question: "How much does it cost to hire Bower Tech Labs for a design project?",
    answer:
      "Packages start at $1250 for development and $1550 for website or mobile app design (see Pricing above). Every project gets a fixed quote before you commit—no hidden hours, no surprise invoices.",
  },
  {
    question: "Can you handle end-to-end product delivery?",
    answer:
      "Yes. Strategy, UX research, UI design, design system, prototype and development—one team and one invoice, from wireframe to live URL.",
  },
  {
    question: "What core services does Bower Tech Labs provide as a UI/UX agency?",
    answer:
      "UI/UX design for websites, mobile apps and dashboards, logo and branding, UI/UX redesigns, and web development in Webflow, Framer and WordPress.",
  },
  {
    question: "Do you also handle development?",
    answer:
      "Yes. We build fully responsive, SEO-ready sites in Webflow, Framer, WordPress or code, with CMS setup, smooth animations and a clean developer handoff—plus 30 days of free support.",
  },
];
