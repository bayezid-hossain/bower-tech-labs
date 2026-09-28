import { describe, expect, it } from "vitest";
import { emptyContactValues, validateContact, type ContactValues } from "./contact";

const valid: ContactValues = {
  fullName: "Jane Smith",
  company: "",
  email: "jane@example.com",
  whatsapp: "",
  service: "UI/UX Design",
  budget: "1000-3000",
  details: "A dashboard redesign.",
};

describe("validateContact", () => {
  it("returns no errors for a valid submission without optional fields", () => {
    expect(validateContact(valid)).toEqual({});
  });

  it("flags every required field when empty", () => {
    expect(Object.keys(validateContact(emptyContactValues)).sort()).toEqual(
      ["budget", "details", "email", "fullName", "service"].sort(),
    );
  });

  it("treats whitespace-only text as empty", () => {
    const errors = validateContact({ ...valid, fullName: "   ", details: "\n " });
    expect(errors.fullName).toBeDefined();
    expect(errors.details).toBeDefined();
  });

  it("rejects malformed email", () => {
    expect(validateContact({ ...valid, email: "jane@" }).email).toBe("Please enter a valid email address.");
  });

  it("never requires company or whatsapp", () => {
    const errors = validateContact({ ...valid, company: "", whatsapp: "" });
    expect(errors.company).toBeUndefined();
    expect(errors.whatsapp).toBeUndefined();
  });

  it("accepts an email with surrounding whitespace", () => {
    expect(validateContact({ ...valid, email: "  jane@example.com  " }).email).toBeUndefined();
  });
});
