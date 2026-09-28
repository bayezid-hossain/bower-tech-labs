import type { ContactFieldName } from "@/types/content";

export type ContactValues = Record<ContactFieldName, string>;
export type ContactErrors = Partial<Record<ContactFieldName, string>>;

export const emptyContactValues: ContactValues = {
  fullName: "",
  company: "",
  email: "",
  whatsapp: "",
  service: "",
  budget: "",
  details: "",
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};
  if (!values.fullName.trim()) errors.fullName = "Please enter your full name.";
  if (!values.email.trim()) errors.email = "Please enter your email address.";
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = "Please enter a valid email address.";
  if (!values.service) errors.service = "Please select a service.";
  if (!values.budget) errors.budget = "Please select a budget range.";
  if (!values.details.trim()) errors.details = "Please tell us about your project.";
  return errors;
}
