import type { ProcessStep } from "@/types/content";

export const processSection = {
  title: "How We Work",
  subtitle: "No agency theater, no 6-week onboarding.\nFour steps from brief to launch.",
};

export const processSteps: ProcessStep[] = [
  {
    step: "STEP 01",
    title: "Send Us the Idea",
    description:
      "Tell us what you're building — new site, product, dashboard, rebrand, whatever stage it's at. Two lines or two paragraphs, doesn't matter. We just need the shape of it.",
  },
  {
    step: "STEP 02",
    title: "We Ask the Right Questions",
    description:
      "We come back with sharp, specific questions — not a 40-item intake form, so we understand your goals, users, and timeline well enough to scope it right the first time.",
  },
  {
    step: "STEP 03",
    title: "You Get a Real Quote",
    description:
      'Fixed price, fixed timeline, fixed deliverables. No "it depends," no hidden hours, no surprise invoices later. You\'ll know exactly what you\'re paying for before you say yes.',
  },
  {
    step: "STEP 04",
    title: "We Build, You Watch",
    description:
      "We Build, You Watch: Kickoff call or straight into asynchronous work—your choice. You get weekly progress updates, full Figma access, and a refined feedback loop to ensure we hit the mark fast. You're never left wondering what's happening.",
  },
];
