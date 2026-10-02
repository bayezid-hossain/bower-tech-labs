export type Link = { label: string; href: string };

export type ImageAsset = { src: string; alt: string; width?: number; height?: number };

export type Service = { title: string; subtitle: string; image: ImageAsset };

export type Project = {
  number: string;
  eyebrow: string;
  title: string;
  description: string;
  cta: Link;
  image: ImageAsset;
  variant: "default" | "featured";
};

export type ProcessStep = { step: string; title: string; description: string };

export type Testimonial = { name: string; role: string; quote: string; avatar: ImageAsset };

export type PricingPlan = {
  title: string;
  tag: string;
  packageName: string;
  price: string;
  features: string[];
};

export type TeamMemberInfo = { name: string; role: string; photo?: ImageAsset };

export type FooterColumn = { title: string; links: Link[] };

export type SelectOption = { label: string; value: string };

export type ContactFieldName =
  | "fullName"
  | "company"
  | "email"
  | "whatsapp"
  | "service"
  | "budget"
  | "details";

export type ContactField = {
  name: ContactFieldName;
  label: string;
  placeholder: string;
  kind: "input" | "select" | "textarea";
  type?: "text" | "email" | "tel";
  required?: boolean;
  optional?: boolean;
  options?: SelectOption[];
  fullWidth?: boolean;
};

export type FaqItem = { question: string; answer: string };

export type PricingOverlay = { text: string; bookLabel: string; bookHref: string; whatsappLabel: string; whatsappHref: string };
