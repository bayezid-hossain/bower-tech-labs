"use client";

import { useEffect } from "react";

/**
 * Smooth-scrolls to the target of every in-page "#id" link on every click. Browsers (and next/link) ignore a
 * click on the hash that is already in the URL, so repeat clicks on e.g. "Start a Project" would do nothing.
 * Runs in the capture phase, before next/link's own handler.
 */
export function HashLinkScroll() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as Element | null)?.closest?.("a[href^='#']");
      // The mobile menu handles its own links (it closes itself first).
      if (!(link instanceof HTMLAnchorElement) || link.closest("[role='dialog']")) return;
      const id = decodeURIComponent(link.getAttribute("href")?.slice(1) ?? "");
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      event.preventDefault();
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      history.replaceState(null, "", `#${id}`);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);
  return null;
}
