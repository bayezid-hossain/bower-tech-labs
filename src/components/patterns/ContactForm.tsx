"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { cn } from "@/lib/cn";
import { emptyContactValues, validateContact, type ContactErrors, type ContactValues } from "@/lib/validation/contact";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/form/Field";
import { Input } from "@/components/ui/form/Input";
import { Select } from "@/components/ui/form/Select";
import { Textarea } from "@/components/ui/form/Textarea";
import type { ContactField, ContactFieldName } from "@/types/content";

type ContactFormProps = {
  fields: ContactField[];
  submitLabel: string;
  altPrompt: string;
  altCta: string;
  altHref: string;
  successMessage: string;
  className?: string;
};

type ControlEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

export function ContactForm({ fields, submitLabel, altPrompt, altCta, altHref, successMessage, className }: ContactFormProps) {
  const [values, setValues] = useState<ContactValues>(emptyContactValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (name: ContactFieldName) => (event: ControlEvent) => {
    setValues((prev) => ({ ...prev, [name]: event.target.value }));
    setSubmitted(false);
    if (errors[name])
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateContact(values);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) {
      setSubmitted(true);
      setValues(emptyContactValues);
    }
  };

  return (
    <Card className={cn("p-5 lg:p-8", className)}>
      <form noValidate onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-x-8 lg:gap-y-8">
          {fields.map((field) => {
            const id = `contact-${field.name}`;
            const error = errors[field.name];
            const common = {
              id,
              name: field.name,
              value: values[field.name],
              onChange: handleChange(field.name),
              required: field.required,
              "aria-invalid": error ? true : undefined,
              "aria-describedby": error ? `${id}-error` : undefined,
            };
            return (
              <Field
                key={field.name}
                id={id}
                label={field.label}
                required={field.required}
                optional={field.optional}
                error={error}
                className={cn(field.fullWidth && "lg:col-span-2")}
              >
                {field.kind === "select" ? (
                  <Select {...common} placeholder={field.placeholder} options={field.options ?? []} />
                ) : field.kind === "textarea" ? (
                  <Textarea {...common} placeholder={field.placeholder} />
                ) : (
                  <Input {...common} type={field.type ?? "text"} placeholder={field.placeholder} />
                )}
              </Field>
            );
          })}
        </div>
        <Button type="submit" size="md" className="mt-10 w-full lg:pt-1">
          {submitLabel}
        </Button>
        {submitted && (
          <p role="status" className="mt-4 text-center text-[15px] text-navy">
            {successMessage}
          </p>
        )}
      </form>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 lg:flex-row">
        <p className="text-[15px] text-link lg:tracking-[-0.035em]">{altPrompt}</p>
        <Button href={altHref} variant="outline" className="h-[42px] px-5 text-base font-normal lg:tracking-[-0.055em]">
          {altCta}
        </Button>
      </div>
    </Card>
  );
}
