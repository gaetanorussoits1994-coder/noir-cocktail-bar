"use client";

import type { ReactNode } from "react";

import { MotionReveal } from "./motion-reveal";

export type SlideUpProps = {
  children: ReactNode;
  delay?: number;
};

export function SlideUp({ children, delay }: SlideUpProps) {
  return (
    <MotionReveal delay={delay} hidden={{ opacity: 0, y: 28 }}>
      {children}
    </MotionReveal>
  );
}
