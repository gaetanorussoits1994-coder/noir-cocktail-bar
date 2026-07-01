"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({
  children,
}: SmoothScrollProviderProps) {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    if (prefersReducedMotion.matches) return;

    const lenis = new Lenis({
      anchors: {
        offset: -80,
      },
      autoRaf: true,
      duration: 1.1,
      easing: (time) => Math.min(1, 1.001 - Math.pow(2, -10 * time)),
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
    });

    return () => lenis.destroy();
  }, []);

  return children;
}
