import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

const variants = {
  primary: "bg-navy-gradient text-white shadow-button",
  flat: "bg-navy text-white",
  dark: "bg-deep-gradient text-white shadow-button",
  light: "bg-surface text-whatsapp-text shadow-soft",
  outline: "border border-line bg-surface text-ink",
} as const;

const sizes = {
  sm: "h-11 px-5 text-[15px]",
  md: "h-[52px] px-8 text-[17px]",
  lg: "h-14 px-10 text-[17px]",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
};
type LinkButtonProps = BaseProps & { href: string } & Omit<ComponentPropsWithoutRef<"a">, keyof BaseProps | "href">;
type NativeButtonProps = BaseProps & { href?: undefined } & Omit<ComponentPropsWithoutRef<"button">, keyof BaseProps>;
export type ButtonProps = LinkButtonProps | NativeButtonProps;

export function buttonClasses(variant: ButtonVariant = "primary", size: ButtonSize = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium tracking-[-0.04em]",
    "transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy",
    variants[variant],
    sizes[size],
    className,
  );
}

export function Button(props: ButtonProps) {
  const { variant, size, icon, className, children, ...rest } = props;
  const classes = buttonClasses(variant, size, className);
  const content = (
    <>
      {icon}
      {children}
    </>
  );

  if (typeof props.href === "string") {
    const { href, ...anchorProps } = rest as Omit<LinkButtonProps, keyof BaseProps>;
    if (/^(https?:|mailto:|tel:)/.test(href)) {
      const external = href.startsWith("http");
      return (
        <a
          href={href}
          className={classes}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          {...anchorProps}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={classes} {...anchorProps}>
        {content}
      </Link>
    );
  }

  const buttonProps = rest as Omit<NativeButtonProps, keyof BaseProps>;
  return (
    <button className={classes} {...buttonProps} type={buttonProps.type ?? "button"}>
      {content}
    </button>
  );
}
