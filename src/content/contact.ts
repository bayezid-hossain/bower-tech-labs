import type { ContactField, TeamMemberInfo } from "@/types/content";
import { serviceLinks } from "./footer";

export const contactSection = {
  title: "Tell Us\nAbout Your Project",
  subtitle:
    "We're a small, senior design team — UI/UX, branding, and product design, no junior handoffs. Tell us what you're building.",
  bullets: [
    "Response time: 12 hours (business hours)",
    "We're happy to sign a NDA (if needed).",
    "We're open for White Label - B2B contract.",
  ],
};

export const team: TeamMemberInfo[] = [
  { name: "Shoron Hasan", role: "Founder & CEO" },
  { name: "Ssm Siam", role: "UI/UX Designer", photo: { src: "/images/team/ssm-siam.png", alt: "Ssm Siam" } },
];

export const contactForm = {
  submitLabel: "Request a Quote",
  altPrompt: "Not Interested to submit the form?",
  altCta: "Book a Direct call with Sales",
  successMessage: "Thanks! We'll get back to you within 12 hours.",
  fields: [
    { name: "fullName", label: "Full Name", placeholder: "Jane Smith", kind: "input", type: "text", required: true },
    { name: "company", label: "Company Name", placeholder: "Eg. Goggle", kind: "input", type: "text", optional: true },
    { name: "email", label: "Email Address", placeholder: "you@example.com", kind: "input", type: "email", required: true },
    { name: "whatsapp", label: "What’s App Number", placeholder: "+8801753292444", kind: "input", type: "tel", optional: true },
    {
      name: "service",
      label: "Service Required",
      placeholder: "Select a Service",
      kind: "select",
      required: true,
      options: serviceLinks.map((label) => ({ label, value: label })),
    },
    {
      name: "budget",
      label: "Project Budget",
      placeholder: "Select a Range",
      kind: "select",
      required: true,
      options: [
        { label: "Under $1,000", value: "<1000" },
        { label: "$1,000 – $3,000", value: "1000-3000" },
        { label: "$3,000 – $5,000", value: "3000-5000" },
        { label: "$5,000+", value: "5000+" },
      ],
    },
    { name: "details", label: "Project Details", placeholder: "Tell us more about your idea...", kind: "textarea", required: true, fullWidth: true },
  ] satisfies ContactField[],
};
