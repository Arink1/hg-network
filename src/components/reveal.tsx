"use client";

import { useEffect } from "react";

/**
 * Scroll reveal for anything marked with data-reveal. Marks <html data-js> on mount so the
 * CSS only hides elements once JavaScript is in charge of showing them again.
 */
export function RevealInit() {
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-js", "");

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    const observeAll = () => {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.in)").forEach((el) => io.observe(el));
    };
    observeAll();

    // Client-side navigation swaps the page without remounting this component.
    const mo = new MutationObserver(observeAll);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      root.removeAttribute("data-js");
    };
  }, []);

  return null;
}
