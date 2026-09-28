"use client";

import { ListIcon, XIcon } from "@phosphor-icons/react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type MouseEvent } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { LogoLockup } from "@/components/patterns/LogoLockup";
import { WhatsAppButton } from "@/components/patterns/WhatsAppButton";
import { mobileMenu, navigation } from "@/content/navigation";
import { site } from "@/content/site";

const iconButtonClasses =
  "inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-ink transition-transform duration-150 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy";

const list: Variants = { hidden: {}, shown: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } } };
const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  shown: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.8 } },
};

const noopSubscribe = () => () => {};

/** Hamburger + full-screen menu for viewports below lg. */
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  // true only on the client, after hydration (the portal target doesn't exist on the server).
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => {
    // Unlock scroll right away so an anchor jump from inside the menu can scroll the page.
    document.documentElement.style.overflow = "";
    setOpen(false);
    toggleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    document.documentElement.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      cancelAnimationFrame(frame);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key !== "Tab" || !dialogRef.current) return;
    // Keep focus inside the dialog.
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>("a[href], button:not([disabled])");
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  };

  const onNavigate = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    close();
    document.getElementById(href.slice(1))?.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", href);
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        aria-label={mobileMenu.openLabel}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(true)}
        className={`${iconButtonClasses} lg:hidden`}
      >
        <ListIcon size={20} weight="bold" aria-hidden="true" />
      </button>
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <motion.div
                ref={dialogRef}
                id="mobile-menu"
                role="dialog"
                aria-modal="true"
                aria-label={mobileMenu.dialogLabel}
                onKeyDown={onKeyDown}
                initial={reduce ? false : { opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.5 } }}
                exit={reduce ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: -12, transition: { duration: 0.2 } }}
                className="fixed inset-0 z-50 flex flex-col overflow-y-auto bg-page px-5 pt-6 pb-8 lg:hidden"
              >
                <div className="flex items-center justify-between">
                  <LogoLockup />
                  <button ref={closeRef} type="button" aria-label={mobileMenu.closeLabel} onClick={close} className={iconButtonClasses}>
                    <XIcon size={20} weight="bold" aria-hidden="true" />
                  </button>
                </div>
                <motion.ul variants={list} initial={reduce ? false : "hidden"} animate="shown" className="mt-10 flex flex-col gap-1">
                  {navigation.map((link) => (
                    <motion.li key={link.href} variants={item}>
                      <a
                        href={link.href}
                        onClick={(event) => onNavigate(event, link.href)}
                        className="block py-2 text-[22px] font-medium leading-7 tracking-[-0.03em] text-ink transition-colors hover:text-navy"
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </motion.ul>
                <motion.div
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { type: "spring", bounce: 0, duration: 0.8, delay: 0.45 } }}
                  className="mt-auto flex flex-col gap-3 pt-10"
                >
                  <Button href={site.primaryCta.href} size="md" className="h-12 w-full text-[15px]" onClick={close}>
                    {site.primaryCta.label}
                  </Button>
                  <WhatsAppButton href={site.whatsappUrl} label={site.whatsappLabel} className="h-12 w-full text-[15px]" />
                  <a href={`mailto:${site.email}`} className="mt-2 text-center text-[15px] tracking-[-0.03em] text-body hover:text-ink">
                    {site.email}
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
